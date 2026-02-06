/**
 * API 客戶端
 */
import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// 獲取 API URL
// 優先使用 NEXT_PUBLIC_API_URL，否則使用「同源」(相對路徑)，方便在只有前端時本機開發
// 這樣 /api/* 會直接打到 Next.js 自己的 API routes，而不是一定要有後端 4000 埠
const API_BASE_URL =
typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_API_URL
  ? process.env.NEXT_PUBLIC_API_URL
  : 'http://localhost:4000';

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
    // 優先從 localStorage 讀取
    let token = localStorage.getItem('accessToken');
    // 如果沒有，嘗試從 Zustand store 讀取
    if (!token) {
      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          token = parsed?.state?.accessToken;
        }
      } catch (e) {
        // 忽略解析錯誤
      }
    }
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
      // Token 過期或無效，清除認證狀態
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('auth-storage');
        // 如果不是在登入頁面，重定向到登入頁
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
        }
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
  minPrice?: number;
  maxPrice?: number;
  type?: string;
  propertyType?: string;
  beds?: number;
  lat?: number;
  lng?: number;
  radius_km?: number;
  sort?: string;
  sortBy?: string;
  status?: string;
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
    // 如果是本地儲存（uploadUrl 以 /api/uploads/local/ 開頭）
    if (uploadUrl.startsWith('/api/uploads/local/') || uploadUrl.includes('/local/')) {
      const formData = new FormData();
      formData.append('file', file);
      // 使用 api 實例（會自動加上 baseURL 和認證）
      // uploadUrl 已經是相對路徑，api 實例會自動加上 baseURL
      await api.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } else {
      // S3 上傳（直接使用完整 URL，不需要認證）
      await axios.put(uploadUrl, file, {
        headers: {
          'Content-Type': file.type,
        },
      });
    }
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

// 支付相關類型
export interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  payments?: Payment[];
  createdAt: string;
  expiresAt: string | null;
}

export interface Payment {
  id: string;
  paymentNumber: string;
  paymentUrl?: string;
  bankCode?: string;
  accountNumber?: string;
  expireDate?: string;
  transactionId?: string;
  status: string;
  paymentMethod?: string;
}

export interface CreateOrderInput {
  items: Array<{
    productId: string;
    quantity: number;
    metadata?: Record<string, any>;
  }>;
  notes?: string;
}

export interface CreatePaymentInput {
  orderId: string;
  paymentMethod: 'CREDIT_CARD' | 'ATM' | 'CVS' | 'WEBATM' | 'LINE_PAY' | 'APPLE_PAY' | 'GOOGLE_PAY';
  paymentProvider?: 'MOCK' | 'ECPAY' | 'NEWEBPAY' | 'LINE_PAY';
}

// 支付相關
export const paymentApi = {
  // 創建訂單
  createOrder: (data: CreateOrderInput) =>
    api.post<ApiResponse<Order>>('/api/payment/orders', data),

  // 獲取訂單列表
  getOrders: (params?: { page?: number; limit?: number; status?: string }) =>
    api.get<ApiResponse<{ items: Order[]; pagination: any }>>('/api/payment/orders', { params }),

  // 獲取訂單詳情
  getOrder: (id: string) =>
    api.get<ApiResponse<Order>>(`/api/payment/orders/${id}`),

  // 創建付款
  createPayment: (data: CreatePaymentInput) =>
    api.post<ApiResponse<Payment>>('/api/payment/payments', data),

  // 查詢付款狀態
  getPaymentStatus: (transactionId: string) =>
    api.get<ApiResponse<{ status: string }>>(`/api/payment/payments/${transactionId}/status`),
};

export default api;


