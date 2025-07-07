
export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  session: any | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName?: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface AuthContextType extends AuthState {
  signUp: (data: SignUpData) => Promise<{ error: any }>;
  signIn: (data: SignInData) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<{ fullName: string; avatarUrl: string }>) => Promise<{ error: any }>;
  retryAuth: () => void;
  authError: string | null;
}
