/**
 * 認證 Service - 封裝認證相關的 API 呼叫
 */
import { api } from '@/lib/api';
import type { ApiResponse, User } from '@/types';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export const authService = {
  /** 登入 */
  login: async (email: string, password: string) => {
    const response = await api.post<ApiResponse<LoginResponse>>(
      '/api/auth/login',
      { email, password }
    );
    return response.data;
  },

  /** 註冊 */
  register: async (data: {
    email: string;
    password: string;
    name: string;
    role?: string;
  }) => {
    const response = await api.post<ApiResponse<LoginResponse>>(
      '/api/auth/register',
      data
    );
    return response.data;
  },

  /** 登出 */
  logout: async (refreshToken: string) => {
    const response = await api.post<ApiResponse<void>>('/api/auth/logout', {
      refreshToken,
    });
    return response.data;
  },

  /** 取得目前使用者資訊 */
  getCurrentUser: async () => {
    const response = await api.get<ApiResponse<User>>('/api/auth/me');
    return response.data;
  },

  /** 更新個人資料 */
  updateProfile: async (data: Partial<User>) => {
    const response = await api.put<ApiResponse<User>>(
      '/api/auth/profile',
      data
    );
    return response.data;
  },

  /** 變更密碼 */
  changePassword: async (
    currentPassword: string,
    newPassword: string
  ) => {
    const response = await api.post<ApiResponse<void>>(
      '/api/auth/change-password',
      { currentPassword, newPassword }
    );
    return response.data;
  },

  /** 忘記密碼 */
  forgotPassword: async (email: string) => {
    const response = await api.post<ApiResponse<void>>(
      '/api/auth/forgot-password',
      { email }
    );
    return response.data;
  },

  /** 重設密碼 */
  resetPassword: async (token: string, newPassword: string) => {
    const response = await api.post<ApiResponse<void>>(
      '/api/auth/reset-password',
      { token, newPassword }
    );
    return response.data;
  },
};
