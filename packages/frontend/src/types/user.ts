/**
 * 使用者型別定義
 */

export enum UserRole {
  TENANT = 'TENANT',           // 租客
  LANDLORD = 'LANDLORD',       // 房東
  AGENT = 'AGENT',             // 仲介
  ADMIN = 'ADMIN',             // 管理員
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',           // 啟用
  INACTIVE = 'INACTIVE',       // 停用
  PENDING = 'PENDING',         // 待驗證
  SUSPENDED = 'SUSPENDED',     // 暫停
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  verified: boolean;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  favoriteLocations?: string[];
  searchHistory?: string[];
  savedSearches?: any[];
}

export interface UserStats {
  listingsCount: number;       // 物件數
  viewCount: number;            // 瀏覽數
  favoriteCount: number;        // 收藏數
  inquiryCount: number;         // 詢問數
}

export interface User extends UserProfile {
  preferences?: UserPreferences;
  stats?: UserStats;
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

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken?: string;
}
