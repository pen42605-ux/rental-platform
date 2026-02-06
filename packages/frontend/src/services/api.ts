/**
 * API 服務層
 */

import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import {
  Property,
  PropertySearchParams,
  PropertySearchResult,
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  ApiResponse,
} from '@/types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 請求攔截器
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 回應攔截器
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response?.status === 401) {
          // 未授權，清除 token 並重新導向登入頁
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // ============= 認證相關 =============
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return this.client.post('/auth/login', credentials);
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return this.client.post('/auth/register', data);
  }

  async logout(): Promise<ApiResponse> {
    return this.client.post('/auth/logout');
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.client.get('/auth/me');
  }

  // ============= 物件相關 =============
  async searchProperties(
    params: PropertySearchParams
  ): Promise<ApiResponse<PropertySearchResult>> {
    return this.client.get('/properties/search', { params });
  }

  async getProperty(id: string): Promise<ApiResponse<Property>> {
    return this.client.get(`/properties/${id}`);
  }

  async createProperty(data: Partial<Property>): Promise<ApiResponse<Property>> {
    return this.client.post('/properties', data);
  }

  async updateProperty(
    id: string,
    data: Partial<Property>
  ): Promise<ApiResponse<Property>> {
    return this.client.put(`/properties/${id}`, data);
  }

  async deleteProperty(id: string): Promise<ApiResponse> {
    return this.client.delete(`/properties/${id}`);
  }

  // ============= 收藏相關 =============
  async getFavorites(): Promise<ApiResponse<Property[]>> {
    return this.client.get('/favorites');
  }

  async addFavorite(propertyId: string): Promise<ApiResponse> {
    return this.client.post(`/favorites/${propertyId}`);
  }

  async removeFavorite(propertyId: string): Promise<ApiResponse> {
    return this.client.delete(`/favorites/${propertyId}`);
  }

  // ============= 圖片上傳 =============
  async uploadImage(file: File): Promise<ApiResponse<{ url: string }>> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.client.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  async uploadImages(files: File[]): Promise<ApiResponse<{ urls: string[] }>> {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    return this.client.post('/upload/multiple', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
}

export const api = new ApiService();
export default api;
