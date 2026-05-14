
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { storage, isErr } from '@/adapters';
import type { AuthUser } from '@/adapters';
import { User, AuthState, SignUpData, SignInData } from '@/types/auth';
import { logger } from '@/utils/logger';

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

const MAX_RETRIES = 3;

function adapterUserToUser(u: AuthUser): User {
  return {
    id: u.id,
    email: u.email,
    fullName: u.fullName,
    avatarUrl: u.avatarUrl,
    createdAt: u.createdAt,
  };
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  logger.auth('AuthProvider: Current state', {
    isLoading,
    hasUser: !!user,
    hasSession: !!session,
    authError,
    retryCount,
  });

  const loadUserProfile = useCallback(async (userId: string, userEmail: string): Promise<User> => {
    try {
      logger.auth('Loading user profile for:', userId);

      const profileResult = await storage.data.queryOne<{
        id: string;
        email: string | null;
        full_name: string | null;
        avatar_url: string | null;
        created_at: string;
      }>('profiles', {
        filters: [{ column: 'id', operator: 'eq', value: userId }],
      });

      if (isErr(profileResult)) {
        logger.error('Profile fetch error', profileResult.error);
      } else if (profileResult.value) {
        const profile = profileResult.value;
        return {
          id: profile.id,
          email: profile.email || userEmail,
          fullName: profile.full_name || undefined,
          avatarUrl: profile.avatar_url || undefined,
          createdAt: profile.created_at,
        };
      }

      return { id: userId, email: userEmail, createdAt: new Date().toISOString() };
    } catch (error) {
      console.error('Error loading user profile:', error);
      return { id: userId, email: userEmail, createdAt: new Date().toISOString() };
    }
  }, []);

  const handleAuthStateChange = useCallback(
    (event: string, adapterSession: any) => {
      console.log('Auth state change:', event, { hasSession: !!adapterSession });

      setSession(adapterSession as Session | null);
      setAuthError(null);

      if (adapterSession?.user) {
        const u = adapterSession.user;
        const minimalUser: User = {
          id: u.id,
          email: u.email || '',
          createdAt: new Date().toISOString(),
        };
        setUser(minimalUser);

        setTimeout(() => {
          loadUserProfile(u.id, u.email || '')
            .then((profile) => setUser(profile))
            .catch((err) => console.warn('Deferred profile load error:', err));
        }, 0);
      } else {
        setUser(null);
      }

      setIsLoading(false);
    },
    [loadUserProfile],
  );

  const initializeAuth = useCallback(async () => {
    console.log('Initializing auth system...');

    try {
      setIsLoading(true);
      setAuthError(null);

      // Set up listener FIRST
      const unsubscribe = storage.auth.onAuthStateChange(handleAuthStateChange);

      // Check existing session
      const sessionResult = await storage.auth.getSession();
      if (isErr(sessionResult)) throw new Error(sessionResult.error.message);

      console.log('Initial session check completed', { hasSession: !!sessionResult.value });
      handleAuthStateChange('INITIAL_SESSION', sessionResult.value);

      return unsubscribe;
    } catch (error: any) {
      console.error('Auth initialization error:', error);

      if (error?.message?.includes('LockManager')) {
        console.warn('LockManager error detected, using fallback approach');
        setAuthError('认证系统暂时不可用，正在尝试恢复...');
      } else {
        setAuthError(`认证错误: ${error?.message || '未知错误'}`);
      }

      setSession(null);
      setUser(null);
      setIsLoading(false);

      const unsubscribe = storage.auth.onAuthStateChange(handleAuthStateChange);
      return unsubscribe;
    }
  }, [handleAuthStateChange]);

  const retryAuth = useCallback(async () => {
    if (retryCount >= MAX_RETRIES) {
      setAuthError('认证系统多次尝试失败，请刷新页面重试');
      return;
    }

    console.log(`Retrying auth (attempt ${retryCount + 1}/${MAX_RETRIES})`);
    setRetryCount((prev) => prev + 1);
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      await initializeAuth();
      setRetryCount(0);
    } catch (error) {
      console.error('Retry failed:', error);
    }
  }, [retryCount, initializeAuth]);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupAuth = async () => {
      unsubscribe = await initializeAuth();
    };

    setupAuth();

    if (authError && retryCount < MAX_RETRIES) {
      const retryTimer = setTimeout(() => {
        retryAuth();
      }, 3000);

      return () => {
        clearTimeout(retryTimer);
        unsubscribe?.();
      };
    }

    return () => unsubscribe?.();
  }, [initializeAuth, authError, retryCount, retryAuth]);

  const signUp = async (data: SignUpData) => {
    try {
      console.log('Attempting sign up for:', data.email);
      const redirectUrl = `${window.location.origin}/`;

      const result = await storage.auth.signUp({
        email: data.email,
        password: data.password,
        fullName: data.fullName,
        redirectUrl,
      });

      if (isErr(result)) {
        console.error('Sign up error:', result.error);
        return { error: result.error };
      }
      console.log('Sign up successful');
      return { error: null };
    } catch (error) {
      console.error('Sign up exception:', error);
      return { error };
    }
  };

  const signIn = async (data: SignInData) => {
    try {
      console.log('Attempting sign in for:', data.email);
      const result = await storage.auth.signIn({
        email: data.email,
        password: data.password,
      });

      if (isErr(result)) {
        console.error('Sign in error:', result.error);
        return { error: result.error };
      }
      console.log('Sign in successful');
      return { error: null };
    } catch (error) {
      console.error('Sign in exception:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('Attempting sign out');
      await storage.auth.signOut();
      console.log('Sign out successful');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const updateProfile = async (data: Partial<{ fullName: string; avatarUrl: string }>) => {
    if (!user) return { error: new Error('No user logged in') };

    try {
      console.log('Updating profile for user:', user.id);
      const result = await storage.data.update(
        'profiles',
        {
          full_name: data.fullName,
          avatar_url: data.avatarUrl,
          updated_at: new Date().toISOString(),
        },
        [{ column: 'id', operator: 'eq', value: user.id }],
      );

      if (isErr(result)) {
        console.error('Profile update error:', result.error);
        return { error: result.error };
      }
      console.log('Profile updated successfully');
      return { error: null };
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
    authError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
