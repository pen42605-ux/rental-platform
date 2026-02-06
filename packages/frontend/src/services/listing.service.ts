/**
 * 房源 Service - 封裝所有房源相關的 API 呼叫
 */
import { api } from '@/lib/api';
import type {
  Listing,
  ApiResponse,
  PaginatedResponse,
  SearchParams,
} from '@/types';

export const listingService = {
  /** 取得房源列表 */
  getListings: async (params?: SearchParams) => {
    const response = await api.get<ApiResponse<PaginatedResponse<Listing>>>(
      '/api/listings',
      { params }
    );
    return response.data;
  },

  /** 取得單一房源詳情 */
  getListingById: async (id: string) => {
    const response = await api.get<ApiResponse<Listing>>(
      `/api/listings/${id}`
    );
    return response.data;
  },

  /** 建立新房源 */
  createListing: async (data: Partial<Listing>) => {
    const response = await api.post<ApiResponse<Listing>>(
      '/api/listings',
      data
    );
    return response.data;
  },

  /** 更新房源 */
  updateListing: async (id: string, data: Partial<Listing>) => {
    const response = await api.put<ApiResponse<Listing>>(
      `/api/listings/${id}`,
      data
    );
    return response.data;
  },

  /** 刪除房源 */
  deleteListing: async (id: string) => {
    const response = await api.delete<ApiResponse<void>>(
      `/api/listings/${id}`
    );
    return response.data;
  },

  /** 發布房源 */
  publishListing: async (id: string) => {
    const response = await api.post<ApiResponse<Listing>>(
      `/api/listings/${id}/publish`
    );
    return response.data;
  },

  /** 下架房源 */
  unpublishListing: async (id: string) => {
    const response = await api.post<ApiResponse<Listing>>(
      `/api/listings/${id}/unpublish`
    );
    return response.data;
  },

  /** 取得我的房源 */
  getMyListings: async (params?: Record<string, unknown>) => {
    const response = await api.get<ApiResponse<PaginatedResponse<Listing>>>(
      '/api/listings/my',
      { params }
    );
    return response.data;
  },

  /** 取得相似房源 */
  getSimilarListings: async (id: string, limit = 6) => {
    const response = await api.get<ApiResponse<Listing[]>>(
      `/api/listings/${id}/similar`,
      { params: { limit } }
    );
    return response.data;
  },

  /** 增加瀏覽次數 */
  incrementViewCount: async (id: string) => {
    await api.post(`/api/listings/${id}/view`);
  },
};
