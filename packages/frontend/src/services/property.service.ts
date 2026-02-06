/**
 * 房源相關 API 服務
 */
import { api } from '@/lib/api';
import { Property, SearchFilters, PaginatedResponse } from '@/types';

export const propertyService = {
  /**
   * 獲取房源列表
   */
  async getProperties(
    filters?: SearchFilters,
    page = 1,
    limit = 12
  ): Promise<PaginatedResponse<Property>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters?.city && { city: filters.city }),
      ...(filters?.district && { district: filters.district }),
      ...(filters?.type && { type: filters.type }),
      ...(filters?.minPrice && { minPrice: filters.minPrice.toString() }),
      ...(filters?.maxPrice && { maxPrice: filters.maxPrice.toString() }),
      ...(filters?.minArea && { minArea: filters.minArea.toString() }),
      ...(filters?.maxArea && { maxArea: filters.maxArea.toString() }),
    });

    const response = await api.get<PaginatedResponse<Property>>(
      `/api/listings?${params.toString()}`
    );
    return response.data;
  },

  /**
   * 獲取單個房源詳情
   */
  async getProperty(id: string): Promise<Property> {
    const response = await api.get<Property>(`/api/listings/${id}`);
    return response.data;
  },

  /**
   * 創建新房源
   */
  async createProperty(data: Partial<Property>): Promise<Property> {
    const response = await api.post<Property>('/api/listings', data);
    return response.data;
  },

  /**
   * 更新房源
   */
  async updateProperty(id: string, data: Partial<Property>): Promise<Property> {
    const response = await api.put<Property>(`/api/listings/${id}`, data);
    return response.data;
  },

  /**
   * 刪除房源
   */
  async deleteProperty(id: string): Promise<void> {
    await api.delete(`/api/listings/${id}`);
  },

  /**
   * 搜尋房源
   */
  async searchProperties(
    query: string,
    filters?: SearchFilters
  ): Promise<Property[]> {
    const params = new URLSearchParams({
      q: query,
      ...(filters?.city && { city: filters.city }),
      ...(filters?.type && { type: filters.type }),
    });

    const response = await api.get<Property[]>(
      `/api/search?${params.toString()}`
    );
    return response.data;
  },

  /**
   * 上傳房源圖片
   */
  async uploadImages(files: File[]): Promise<string[]> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('images', file);
    });

    const response = await api.post<{ urls: string[] }>(
      '/api/upload',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data.urls;
  },
};
