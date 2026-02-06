/**
 * 使用者相關類型定義
 */

/** 使用者角色 */
export type UserRole = 'USER' | 'LANDLORD' | 'AGENT' | 'ADMIN';

/** 使用者資訊 */
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  avatarUrl: string | null;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

/** 認證 Token */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

/** 登入請求 */
export interface LoginRequest {
  email: string;
  password: string;
}

/** 註冊請求 */
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
}

/** 使用者偏好設定 */
export interface UserPreferences {
  notifications: {
    email: boolean;
    push: boolean;
    newListings: boolean;
    priceChanges: boolean;
  };
  savedSearches: SavedSearch[];
}

/** 儲存的搜尋條件 */
export interface SavedSearch {
  id: string;
  name: string;
  filters: Record<string, any>;
  createdAt: string;
}
