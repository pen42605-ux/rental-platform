/**
 * 房源服務層 - 封裝房源相關的 API 呼叫邏輯
 */
import { api } from '@/lib/api';
import type { Listing, SearchFilters, PaginatedResponse, ApiResponse } from '@/types';

export const listingService = {
  /** 搜尋房源列表 */
  async search(filters: SearchFilters): Promise<PaginatedResponse<Listing>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Listing>>>(
      '/api/listings',
      { params: filters }
    );
    return response.data.data;
  },

  /** 取得單一房源詳情 */
  async getById(id: string): Promise<Listing> {
    const response = await api.get<ApiResponse<Listing>>(`/api/listings/${id}`);
    return response.data.data;
  },

  /** 建立新房源 */
  async create(data: Partial<Listing>): Promise<Listing> {
    const response = await api.post<ApiResponse<Listing>>('/api/listings', data);
    return response.data.data;
  },

  /** 更新房源 */
  async update(id: string, data: Partial<Listing>): Promise<Listing> {
    const response = await api.put<ApiResponse<Listing>>(`/api/listings/${id}`, data);
    return response.data.data;
  },

  /** 刪除房源 */
  async delete(id: string): Promise<void> {
    await api.delete(`/api/listings/${id}`);
  },

  /** 發布房源 */
  async publish(id: string): Promise<Listing> {
    const response = await api.post<ApiResponse<Listing>>(`/api/listings/${id}/publish`);
    return response.data.data;
  },

  /** 下架房源 */
  async unpublish(id: string): Promise<Listing> {
    const response = await api.post<ApiResponse<Listing>>(`/api/listings/${id}/unpublish`);
    return response.data.data;
  },

  /** 取得使用者自己的房源 */
  async getMyListings(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Listing>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Listing>>>(
      '/api/listings/my',
      { params }
    );
    return response.data.data;
  },

  /** 收藏房源 */
  async favorite(id: string): Promise<void> {
    await api.post(`/api/listings/${id}/favorite`);
  },

  /** 取消收藏房源 */
  async unfavorite(id: string): Promise<void> {
    await api.delete(`/api/listings/${id}/favorite`);
  },

  /** 取得收藏列表 */
  async getFavorites(params?: { page?: number; limit?: number }): Promise<PaginatedResponse<Listing>> {
    const response = await api.get<ApiResponse<PaginatedResponse<Listing>>>(
      '/api/listings/favorites',
      { params }
    );
    return response.data.data;
  },

  /** 檢舉房源 */
  async report(id: string, reason: string): Promise<void> {
    await api.post(`/api/listings/${id}/report`, { reason });
  },
};
