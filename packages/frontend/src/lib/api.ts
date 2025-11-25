/**
 * API 客戶端
 */
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器 - 自動附加 token
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 響應攔截器 - 統一錯誤處理
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ error?: { message: string } }>) => {
    if (error.response?.status === 401) {
      // Token 過期，嘗試刷新
      // TODO: 實作 refresh token 邏輯
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      }
    }
    return Promise.reject(error);
  }
);

// ==================== 類型定義 ====================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  propertyType: 'WHOLE_FLOOR' | 'STUDIO' | 'SUITE' | 'ROOM' | 'PARKING';
  beds: number;
  baths: number;
  area: number | null;
  address: string | null;
  city: string | null;
  district: string | null;
  latitude: number | null;
  longitude: number | null;
  amenities: string[];
  status: 'DRAFT' | 'PUBLISHED' | 'REMOVED';
  viewCount: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  images: ListingImage[];
  user?: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

export interface ListingImage {
  id: string;
  url: string;
  filename: string;
  isCover: boolean;
  sortOrder: number;
}

export interface SearchParams {
  q?: string;
  min_price?: number;
  max_price?: number;
  type?: string;
  beds?: number;
  lat?: number;
  lng?: number;
  radius_km?: number;
  sort?: string;
  page?: number;
  limit?: number;
  city?: string;
  district?: string;
  amenities?: string;
}

export interface PresignResponse {
  uploadUrl: string;
  key: string;
  url: string;
  bucket: string;
  expiresIn: number;
}

// ==================== API 函數 ====================

// 房源相關
export const listingsApi = {
  getList: (params?: SearchParams) =>
    api.get<ApiResponse<PaginatedResponse<Listing>>>('/api/listings', { params }),

  getById: (id: string) =>
    api.get<ApiResponse<Listing>>(`/api/listings/${id}`),

  create: (data: Partial<Listing> & { images?: any[] }) =>
    api.post<ApiResponse<Listing>>('/api/listings', data),

  update: (id: string, data: Partial<Listing>) =>
    api.put<ApiResponse<Listing>>(`/api/listings/${id}`, data),

  delete: (id: string) =>
    api.delete<ApiResponse<void>>(`/api/listings/${id}`),

  publish: (id: string) =>
    api.post<ApiResponse<Listing>>(`/api/listings/${id}/publish`),

  unpublish: (id: string) =>
    api.post<ApiResponse<Listing>>(`/api/listings/${id}/unpublish`),

  getMyListings: (params?: any) =>
    api.get<ApiResponse<PaginatedResponse<Listing>>>('/api/listings/my', { params }),
};

// 搜尋相關
export const searchApi = {
  search: (params: SearchParams) =>
    api.get<ApiResponse<any>>('/api/search', { params }),

  suggest: (q: string) =>
    api.get<ApiResponse<any>>('/api/search/suggest', { params: { q } }),
};

// 上傳相關
export const uploadApi = {
  getPresignedUrl: (file: { filename: string; mimeType: string; size: number }) =>
    api.post<ApiResponse<PresignResponse>>('/api/uploads/presign', file),

  getPresignedUrls: (files: Array<{ filename: string; mimeType: string; size: number }>) =>
    api.post<ApiResponse<PresignResponse[]>>('/api/uploads/presign-batch', { files }),

  uploadToS3: async (uploadUrl: string, file: File) => {
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
  },
};

// 認證相關
export const authApi = {
  login: (data: { email: string; password: string }) =>
    api.post<ApiResponse<{ user: any; tokens: any }>>('/api/auth/login', data),

  register: (data: { email: string; password: string; name: string }) =>
    api.post<ApiResponse<{ user: any; tokens: any }>>('/api/auth/register', data),

  logout: (refreshToken: string) =>
    api.post<ApiResponse<void>>('/api/auth/logout', { refreshToken }),

  me: () =>
    api.get<ApiResponse<any>>('/api/auth/me'),
};

export default api;


