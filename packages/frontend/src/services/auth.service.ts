/**
 * 身份驗證相關 API 服務
 */
import { api } from '@/lib/api';
import { User } from '@/types';

export const authService = {
  /**
   * 登入
   */
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const response = await api.post<{ token: string; user: User }>(
      '/api/auth/login',
      { email, password }
    );
    return response.data;
  },

  /**
   * 註冊
   */
  async register(
    email: string,
    password: string,
    name: string,
    role: string
  ): Promise<{ token: string; user: User }> {
    const response = await api.post<{ token: string; user: User }>(
      '/api/auth/register',
      { email, password, name, role }
    );
    return response.data;
  },

  /**
   * 獲取當前用戶資訊
   */
  async getCurrentUser(): Promise<User> {
    const response = await api.get<User>('/api/auth/me');
    return response.data;
  },

  /**
   * 登出
   */
  async logout(): Promise<void> {
    await api.post('/api/auth/logout');
    localStorage.removeItem('token');
  },

  /**
   * 更新用戶資訊
   */
  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put<User>('/api/auth/profile', data);
    return response.data;
  },

  /**
   * 修改密碼
   */
  async changePassword(
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    await api.post('/api/auth/change-password', {
      oldPassword,
      newPassword,
    });
  },
};
