/**
 * 身份驗證相關的自訂 Hook
 */
import { useState, useEffect } from 'react';
import { User } from '@/types';
import { api } from '@/lib/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        setUser(null);
        return;
      }

      const response = await api.get<User>('/api/auth/me');
      setUser(response.data);
    } catch (err: any) {
      setError(err.message);
      setUser(null);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post<{ token: string; user: User }>(
        '/api/auth/login',
        { email, password }
      );

      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      
      return response.data;
    } catch (err: any) {
      setError(err.message || '登入失敗');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    role: string
  ) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post<{ token: string; user: User }>(
        '/api/auth/register',
        { email, password, name, role }
      );

      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      
      return response.data;
    } catch (err: any) {
      setError(err.message || '註冊失敗');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    logout,
    register,
    isAuthenticated: !!user,
    isLandlord: user?.role === 'LANDLORD',
    isTenant: user?.role === 'TENANT',
    isAdmin: user?.role === 'ADMIN',
  };
}
