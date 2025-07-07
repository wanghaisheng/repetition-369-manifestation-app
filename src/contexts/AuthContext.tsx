
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { User, AuthState, SignUpData, SignInData } from '@/types/auth';

interface AuthContextType extends AuthState {
  signUp: (data: SignUpData) => Promise<{ error: any }>;
  signIn: (data: SignInData) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<{ fullName: string; avatarUrl: string }>) => Promise<{ error: any }>;
  retryAuth: () => void;
  authError: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

const AUTH_TIMEOUT = 10000; // 10 seconds
const MAX_RETRIES = 3;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  console.log('AuthProvider: Current state', { 
    isLoading, 
    hasUser: !!user, 
    hasSession: !!session, 
    authError,
    retryCount 
  });

  const handleAuthError = useCallback((error: any, context: string) => {
    console.error(`Auth error in ${context}:`, error);
    
    // Handle specific LockManager errors
    if (error?.message?.includes('LockManager')) {
      console.warn('LockManager error detected, using fallback approach');
      setAuthError('认证系统暂时不可用，正在尝试恢复...');
      return;
    }
    
    setAuthError(`认证错误: ${error?.message || '未知错误'}`);
  }, []);

  const loadUserProfile = useCallback(async (userId: string, userEmail: string) => {
    try {
      console.log('Loading user profile for:', userId);
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();
      
      if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
        console.error('Profile fetch error:', error);
        throw error;
      }
      
      if (profile) {
        console.log('Profile loaded successfully');
        return {
          id: profile.id,
          email: profile.email || userEmail,
          fullName: profile.full_name || undefined,
          avatarUrl: profile.avatar_url || undefined,
          createdAt: profile.created_at
        };
      } else {
        console.log('No profile found, creating basic user object');
        return {
          id: userId,
          email: userEmail,
          createdAt: new Date().toISOString()
        };
      }
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Return basic user object as fallback
      return {
        id: userId,
        email: userEmail,
        createdAt: new Date().toISOString()
      };
    }
  }, []);

  const handleAuthStateChange = useCallback(async (event: string, session: Session | null) => {
    console.log('Auth state change:', event, { hasSession: !!session });
    
    try {
      setSession(session);
      setAuthError(null);
      
      if (session?.user) {
        const userProfile = await loadUserProfile(session.user.id, session.user.email || '');
        setUser(userProfile);
        console.log('User authenticated successfully');
      } else {
        setUser(null);
        console.log('User signed out');
      }
    } catch (error) {
      handleAuthError(error, 'auth state change');
    } finally {
      setIsLoading(false);
    }
  }, [loadUserProfile, handleAuthError]);

  const initializeAuth = useCallback(async () => {
    console.log('Initializing auth system...');
    
    try {
      setIsLoading(true);
      setAuthError(null);
      
      // Set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
      
      // Check for existing session with timeout
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Session check timeout')), AUTH_TIMEOUT)
      );
      
      const { data: { session }, error } = await Promise.race([
        sessionPromise,
        timeoutPromise
      ]) as any;
      
      if (error) {
        throw error;
      }
      
      console.log('Initial session check completed', { hasSession: !!session });
      
      if (session) {
        await handleAuthStateChange('INITIAL_SESSION', session);
      } else {
        setIsLoading(false);
      }
      
      return subscription;
    } catch (error) {
      console.error('Auth initialization error:', error);
      handleAuthError(error, 'initialization');
      
      // Fallback: assume no auth and continue
      setSession(null);
      setUser(null);
      setIsLoading(false);
      
      // Still set up the listener for future auth events
      const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);
      return subscription;
    }
  }, [handleAuthStateChange, handleAuthError]);

  const retryAuth = useCallback(async () => {
    if (retryCount >= MAX_RETRIES) {
      setAuthError('认证系统多次尝试失败，请刷新页面重试');
      return;
    }
    
    console.log(`Retrying auth (attempt ${retryCount + 1}/${MAX_RETRIES})`);
    setRetryCount(prev => prev + 1);
    setIsLoading(true);
    
    // Wait a bit before retrying
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    try {
      const subscription = await initializeAuth();
      setRetryCount(0); // Reset on success
      return subscription;
    } catch (error) {
      console.error('Retry failed:', error);
    }
  }, [retryCount, initializeAuth]);

  useEffect(() => {
    let subscription: any;
    
    const setupAuth = async () => {
      subscription = await initializeAuth();
    };
    
    setupAuth();
    
    // Auto-retry on auth errors after a delay
    if (authError && retryCount < MAX_RETRIES) {
      const retryTimer = setTimeout(() => {
        retryAuth();
      }, 3000);
      
      return () => {
        clearTimeout(retryTimer);
        subscription?.unsubscribe();
      };
    }
    
    return () => subscription?.unsubscribe();
  }, [initializeAuth, authError, retryCount, retryAuth]);

  const signUp = async (data: SignUpData) => {
    try {
      console.log('Attempting sign up for:', data.email);
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: data.fullName
          }
        }
      });
      
      if (error) {
        console.error('Sign up error:', error);
      } else {
        console.log('Sign up successful');
      }
      
      return { error };
    } catch (error) {
      console.error('Sign up exception:', error);
      return { error };
    }
  };

  const signIn = async (data: SignInData) => {
    try {
      console.log('Attempting sign in for:', data.email);
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password
      });
      
      if (error) {
        console.error('Sign in error:', error);
      } else {
        console.log('Sign in successful');
      }
      
      return { error };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting sign out');
      await supabase.auth.signOut();
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateProfile = async (data: Partial<{ fullName: string; avatarUrl: string }>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      console.log('Updating profile for user:', user.id);
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: data.fullName,
          avatar_url: data.avatarUrl,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) {
        console.error('Profile update error:', error);
      } else {
        console.log('Profile updated successfully');
      }

      return { error };
    } catch (error) {
      console.error('Profile update exception:', error);
      return { error };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signUp,
    signIn,
    signOut,
    updateProfile,
    retryAuth,
    authError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
