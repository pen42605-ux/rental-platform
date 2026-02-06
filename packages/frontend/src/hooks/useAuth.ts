/**
 * 認證相關 Hooks
 */

import { useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterData } from '@/types';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // 檢查使用者登入狀態
    const checkAuth = async () => {
      try {
        // TODO: 實作 API 呼叫
        // const response = await api.getCurrentUser();
        // setUser(response.data);
        // setIsAuthenticated(true);
      } catch (err) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      // TODO: 實作 API 呼叫
      // const response = await api.login(credentials);
      // setUser(response.data.user);
      // setIsAuthenticated(true);
      // localStorage.setItem('token', response.data.token);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      // TODO: 實作 API 呼叫
      // const response = await api.register(data);
      // setUser(response.data.user);
      // setIsAuthenticated(true);
      // localStorage.setItem('token', response.data.token);
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      // TODO: 實作 API 呼叫
      // await api.logout();
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('token');
    } catch (err) {
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
  };
};
