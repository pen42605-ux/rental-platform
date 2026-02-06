'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/lib/store';

/**
 * 認證 hook
 * 提供登入、登出、用戶狀態管理
 */
export function useAuth() {
  const {
    user,
    isAuthenticated,
    setAuth,
    logout,
    checkAuth,
  } = useAuthStore();

  // 初始化時檢查認證狀態
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isAuthenticated,
    setAuth,
    logout,
    checkAuth,
    isAdmin: user?.role === 'ADMIN',
  };
}
