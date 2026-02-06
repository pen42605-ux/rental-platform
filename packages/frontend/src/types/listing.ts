/**
 * 房源相關類型定義
 */

// 房源類型
export type PropertyType =
  | 'WHOLE_FLOOR'    // 整層住家
  | 'STUDIO'         // 獨立套房
  | 'SUITE'          // 分租套房
  | 'ROOM'           // 雅房
  | 'PARKING'        // 車位
  | 'SHOP'           // 店面
  | 'OFFICE'         // 辦公室
  | 'FACTORY'        // 廠房
  | 'LAND';          // 土地

// 房源交易類型
export type TransactionType = 'RENT' | 'BUY' | 'NEW_CONSTRUCTION';

// 房源狀態
export type ListingStatus = 'DRAFT' | 'PENDING' | 'PUBLISHED' | 'CLOSED' | 'REJECTED';

// 房源介面
export interface Listing {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  transactionType: TransactionType;
  status: ListingStatus;
  price: number;
  deposit?: number;
  area: number;            // 坪數
  floor?: number;          // 樓層
  totalFloors?: number;    // 總樓層
  bedrooms: number;        // 房
  bathrooms: number;       // 衛
  livingRooms: number;     // 廳
  address: string;
  city: string;
  district: string;
  latitude: number;
  longitude: number;
  images: string[];
  amenities: string[];
  nearbyFacilities: NearbyFacility[];
  contactName: string;
  contactPhone: string;
  contactEmail?: string;
  publisherId: string;
  publisher?: UserSummary;
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
  updatedAt: string;
}

// 簡化的用戶資訊
export interface UserSummary {
  id: string;
  name: string;
  avatar?: string;
  role: 'USER' | 'AGENT' | 'LANDLORD' | 'ADMIN';
}

// 附近設施
export interface NearbyFacility {
  name: string;
  type: 'MRT' | 'BUS' | 'SCHOOL' | 'MARKET' | 'PARK' | 'HOSPITAL';
  distance: number; // 公尺
}

// 房源搜尋參數
export interface ListingSearchParams {
  q?: string;
  propertyType?: PropertyType;
  transactionType?: TransactionType;
  city?: string;
  district?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  bathrooms?: number;
  amenities?: string[];
  sortBy?: 'createdAt' | 'price' | 'area' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  lat?: number;
  lng?: number;
  radius?: number; // 公里
}

// 分頁結果
export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

// 房源卡片 Props
export interface ListingCardProps {
  listing: Listing;
  index?: number;
  showFavorite?: boolean;
  compact?: boolean;
}

// 篩選器狀態
export interface FilterState {
  propertyType: PropertyType | '';
  transactionType: TransactionType | '';
  city: string;
  district: string;
  minPrice: number | '';
  maxPrice: number | '';
  minArea: number | '';
  maxArea: number | '';
  bedrooms: number | '';
  bathrooms: number | '';
  amenities: string[];
  sort: string;
}
