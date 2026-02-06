/**
 * 用戶相關類型定義
 */

// 用戶角色
export type UserRole = 'USER' | 'AGENT' | 'LANDLORD' | 'ADMIN';

// 用戶資訊
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

// 登入請求
export interface LoginRequest {
  email: string;
  password: string;
}

// 註冊請求
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
  role: UserRole;
}

// 驗證回應
export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

// 用戶個人資料更新
export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
}

// 收藏
export interface Favorite {
  id: string;
  userId: string;
  listingId: string;
  createdAt: string;
}

// 瀏覽紀錄
export interface ViewHistory {
  id: string;
  userId: string;
  listingId: string;
  viewedAt: string;
}
