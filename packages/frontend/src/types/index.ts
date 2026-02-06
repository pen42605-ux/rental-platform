/**
 * 統一匯出所有型別
 */

export * from './property';
export * from './user';

// API 回應型別
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// 表單狀態
export interface FormState {
  isSubmitting: boolean;
  errors: Record<string, string>;
  success: boolean;
}

// 地圖相關
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface MapMarker {
  id: string;
  position: {
    lat: number;
    lng: number;
  };
  title: string;
  price?: number;
  image?: string;
}
