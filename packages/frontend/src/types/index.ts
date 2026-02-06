/**
 * 全域型別定義 - 好房網（591-like 房產平台）
 */

// ==================== 房源相關 ====================

/** 房型枚舉 */
export type PropertyType =
  | 'WHOLE_FLOOR'   // 整層住家
  | 'STUDIO'        // 獨立套房
  | 'SUITE'         // 分租套房
  | 'ROOM'          // 雅房
  | 'PARKING'       // 車位
  | 'NEW_BUILD'     // 新建案
  | 'USED_HOUSE'    // 中古屋
  | 'LAND'          // 土地
  | 'SHOP'          // 店面
  | 'OFFICE'        // 辦公
  | 'FACTORY'       // 廠房
  | 'COMMUNITY';    // 社區

/** 房源狀態 */
export type ListingStatus = 'DRAFT' | 'PUBLISHED' | 'REMOVED' | 'SOLD' | 'RENTED';

/** 交易類型 */
export type TransactionType = 'RENT' | 'SALE';

/** 房源圖片 */
export interface ListingImage {
  id: string;
  url: string;
  filename: string;
  isCover: boolean;
  sortOrder: number;
}

/** 房源物件 */
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
  floor: number | null;
  totalFloors: number | null;
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
  user?: UserProfile;
}

// ==================== 使用者相關 ====================

/** 使用者角色 */
export type UserRole = 'USER' | 'LANDLORD' | 'AGENT' | 'ADMIN';

/** 使用者基本資訊 */
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl: string | null;
  phone: string | null;
}

/** 使用者公開資料 */
export interface UserProfile {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: UserRole;
  listingCount?: number;
}

// ==================== 搜尋篩選 ====================

/** 搜尋參數 */
export interface SearchParams {
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  propertyType?: PropertyType;
  transactionType?: TransactionType;
  beds?: number;
  baths?: number;
  minArea?: number;
  maxArea?: number;
  city?: string;
  district?: string;
  amenities?: string[];
  lat?: number;
  lng?: number;
  radiusKm?: number;
  sort?: SortOption;
  page?: number;
  limit?: number;
}

/** 排序選項 */
export type SortOption =
  | 'newest'
  | 'price_asc'
  | 'price_desc'
  | 'area_asc'
  | 'area_desc'
  | 'views';

// ==================== 通用 API 回應 ====================

/** API 回應格式 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

/** 分頁回應 */
export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationInfo;
}

/** 分頁資訊 */
export interface PaginationInfo {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

// ==================== 訂單與付款 ====================

/** 訂單狀態 */
export type OrderStatus = 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED' | 'EXPIRED';

/** 付款方式 */
export type PaymentMethod =
  | 'CREDIT_CARD'
  | 'ATM'
  | 'CVS'
  | 'WEBATM'
  | 'LINE_PAY'
  | 'APPLE_PAY'
  | 'GOOGLE_PAY';

/** 訂單 */
export interface Order {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  totalAmount: number;
  currency: string;
  items: OrderItem[];
  createdAt: string;
  expiresAt: string | null;
}

/** 訂單項目 */
export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

// ==================== 地圖 ====================

/** 地圖座標 */
export interface LatLng {
  lat: number;
  lng: number;
}

/** 地圖視窗邊界 */
export interface MapBounds {
  northEast: LatLng;
  southWest: LatLng;
}

// ==================== 通知 ====================

/** 通知類型 */
export type NotificationType = 'SYSTEM' | 'LISTING' | 'MESSAGE' | 'PAYMENT';

/** 通知 */
export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}
