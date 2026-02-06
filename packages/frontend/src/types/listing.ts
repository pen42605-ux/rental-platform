/**
 * 房源相關類型定義
 */

/** 房源類型 */
export type PropertyType =
  | 'WHOLE_FLOOR'   // 整層住家
  | 'STUDIO'        // 獨立套房
  | 'SUITE'         // 分租套房
  | 'ROOM'          // 雅房
  | 'PARKING'       // 車位
  | 'STORE'         // 店面
  | 'OFFICE'        // 辦公室
  | 'FACTORY'       // 廠房
  | 'LAND';         // 土地

/** 交易類型 */
export type TransactionType =
  | 'RENT'          // 出租
  | 'SALE'          // 出售
  | 'NEW_BUILD';    // 新建案

/** 房源狀態 */
export type ListingStatus =
  | 'DRAFT'         // 草稿
  | 'PENDING'       // 審核中
  | 'PUBLISHED'     // 已上架
  | 'SOLD'          // 已售/已租
  | 'REMOVED';      // 已下架

/** 房源圖片 */
export interface ListingImage {
  id: string;
  url: string;
  filename: string;
  isCover: boolean;
  sortOrder: number;
  caption?: string;
}

/** 房源聯絡人資訊 */
export interface ListingContact {
  name: string;
  phone?: string;
  lineId?: string;
  email?: string;
  isAgent: boolean;
  agencyName?: string;
}

/** 房源詳細資訊 */
export interface Listing {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  propertyType: PropertyType;
  transactionType: TransactionType;
  beds: number;
  baths: number;
  area: number | null;
  floor?: number | null;
  totalFloors?: number | null;
  buildYear?: number | null;
  address: string | null;
  city: string | null;
  district: string | null;
  latitude: number | null;
  longitude: number | null;
  amenities: string[];
  features: string[];
  status: ListingStatus;
  viewCount: number;
  favoriteCount: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  images: ListingImage[];
  contact?: ListingContact;
  user?: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
}

/** 搜尋篩選參數 */
export interface SearchFilters {
  q?: string;
  transactionType?: TransactionType;
  propertyType?: PropertyType;
  city?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  beds?: number;
  baths?: number;
  amenities?: string[];
  floor?: number;
  hasParking?: boolean;
  hasElevator?: boolean;
  petFriendly?: boolean;
  sortBy?: 'newest' | 'price_asc' | 'price_desc' | 'area_asc' | 'area_desc';
  lat?: number;
  lng?: number;
  radiusKm?: number;
  page?: number;
  limit?: number;
}

/** 分頁資訊 */
export interface PaginationInfo {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

/** 分頁回應 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}
