/**
 * 共用類型定義
 */

// API 回應格式
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// API 錯誤
export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
  statusCode: number;
}

// 分頁參數
export interface PaginationParams {
  page?: number;
  limit?: number;
}

// 排序參數
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 地理位置
export interface GeoLocation {
  latitude: number;
  longitude: number;
}

// 地圖邊界
export interface MapBounds {
  northEast: GeoLocation;
  southWest: GeoLocation;
}

// 地圖視圖狀態
export interface MapViewState {
  center: GeoLocation;
  zoom: number;
  bounds?: MapBounds;
}

// 通知
export interface Notification {
  id: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

// 麵包屑
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// SEO Metadata
export interface PageMeta {
  title: string;
  description: string;
  keywords?: string[];
  ogImage?: string;
}
