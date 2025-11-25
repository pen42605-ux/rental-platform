/**
 * Listing 類型定義
 */
import { PropertyType, ListingStatus } from '@prisma/client';

// ==================== 建立請求 ====================

export interface CreateListingInput {
  title: string;
  description?: string;
  price: number;
  currency?: string;
  propertyType: PropertyType;
  beds?: number;
  baths?: number;
  area?: number;
  address?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  amenities?: string[];
  status?: ListingStatus;
  images?: ImageInput[];
}

export interface ImageInput {
  key: string;
  url: string;
  bucket: string;
  filename: string;
  mimeType: string;
  size: number;
  width?: number;
  height?: number;
  isCover?: boolean;
  sortOrder?: number;
}

// ==================== 更新請求 ====================

export interface UpdateListingInput {
  title?: string;
  description?: string;
  price?: number;
  currency?: string;
  propertyType?: PropertyType;
  beds?: number;
  baths?: number;
  area?: number;
  address?: string;
  city?: string;
  district?: string;
  latitude?: number;
  longitude?: number;
  amenities?: string[];
  status?: ListingStatus;
  addImages?: ImageInput[];
  removeImageIds?: string[];
}

// ==================== 查詢參數 ====================

export interface ListingQueryParams {
  page?: number;
  limit?: number;
  status?: ListingStatus;
  propertyType?: PropertyType;
  userId?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'createdAt' | 'price' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
}

// ==================== 響應類型 ====================

export interface ListingResponse {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  propertyType: PropertyType;
  beds: number;
  baths: number;
  area: number | null;
  address: string | null;
  city: string | null;
  district: string | null;
  latitude: number | null;
  longitude: number | null;
  amenities: string[];
  status: ListingStatus;
  viewCount: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  images: ImageResponse[];
  user?: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

export interface ImageResponse {
  id: string;
  url: string;
  filename: string;
  isCover: boolean;
  sortOrder: number;
}

export interface PaginatedListings {
  items: ListingResponse[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}
