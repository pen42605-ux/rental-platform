/**
 * 統一類型匯出
 */
export * from './listing';
export * from './user';

/** 通用 API 回應格式 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}

/** 地圖座標 */
export interface LatLng {
  lat: number;
  lng: number;
}

/** 地圖範圍 */
export interface MapBounds {
  north: number;
  south: number;
  east: number;
  west: number;
}
