/**
 * 全局類型定義
 */

// 用戶類型
export enum UserRole {
  TENANT = 'TENANT',
  LANDLORD = 'LANDLORD',
  ADMIN = 'ADMIN',
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// 房源類型
export enum PropertyType {
  WHOLE_FLOOR = 'WHOLE_FLOOR',
  STUDIO = 'STUDIO',
  SUITE = 'SUITE',
  ROOM = 'ROOM',
  PARKING = 'PARKING',
}

export enum PropertyStatus {
  AVAILABLE = 'AVAILABLE',
  PENDING = 'PENDING',
  RENTED = 'RENTED',
  DRAFT = 'DRAFT',
}

export interface PropertyLocation {
  address: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
}

export interface PropertyDetails {
  type: PropertyType;
  status: PropertyStatus;
  price: number;
  deposit?: number;
  area?: number;
  floor?: string;
  rooms?: number;
  bathrooms?: number;
  furnished: boolean;
  amenities: string[];
}

export interface Property {
  id: string;
  title: string;
  description: string;
  location: PropertyLocation;
  details: PropertyDetails;
  images: string[];
  landlordId: string;
  landlord?: User;
  views: number;
  createdAt: string;
  updatedAt: string;
}

// 搜尋篩選
export interface SearchFilters {
  city?: string;
  district?: string;
  type?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  rooms?: number;
  amenities?: string[];
  furnished?: boolean;
}

// 分頁
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// API 響應
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// 訂單相關
export enum OrderStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  amount: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}
