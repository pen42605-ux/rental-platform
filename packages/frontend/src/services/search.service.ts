/**
 * 搜尋 Service - 封裝搜尋相關的 API 呼叫
 */
import { api } from '@/lib/api';
import type { ApiResponse, SearchParams } from '@/types';

export const searchService = {
  /** 全文搜尋房源 */
  search: async (params: SearchParams) => {
    const response = await api.get<ApiResponse<any>>('/api/search', {
      params,
    });
    return response.data;
  },

  /** 搜尋建議（自動完成） */
  suggest: async (query: string) => {
    const response = await api.get<ApiResponse<string[]>>(
      '/api/search/suggest',
      { params: { q: query } }
    );
    return response.data;
  },

  /** 根據地圖範圍搜尋 */
  searchByBounds: async (bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  }) => {
    const response = await api.get<ApiResponse<any>>('/api/search/bounds', {
      params: bounds,
    });
    return response.data;
  },

  /** 搜尋附近房源 */
  searchNearby: async (lat: number, lng: number, radiusKm = 3) => {
    const response = await api.get<ApiResponse<any>>('/api/search/nearby', {
      params: { lat, lng, radius_km: radiusKm },
    });
    return response.data;
  },
};
