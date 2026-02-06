/**
 * 用戶類型定義 (User Types)
 */

export type UserRole = 'user' | 'landlord' | 'admin';
export type AuthProvider = 'local' | 'facebook' | 'google';

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  verified: boolean;
  provider: AuthProvider;
  
  favorites: string[]; // listing IDs
  viewHistory: string[]; // listing IDs
  
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
