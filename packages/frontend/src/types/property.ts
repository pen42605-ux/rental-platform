/**
 * 房地產平台型別定義
 */

export enum PropertyType {
  WHOLE_FLOOR = 'WHOLE_FLOOR', // 整層住家
  STUDIO = 'STUDIO',           // 獨立套房
  SUITE = 'SUITE',             // 分租套房
  ROOM = 'ROOM',               // 雅房
  PARKING = 'PARKING',         // 車位
  OFFICE = 'OFFICE',           // 辦公室
  SHOP = 'SHOP',               // 店面
}

export enum PropertyStatus {
  AVAILABLE = 'AVAILABLE',     // 可出租
  RENTED = 'RENTED',           // 已出租
  PENDING = 'PENDING',         // 審核中
  OFFLINE = 'OFFLINE',         // 下架
}

export enum RentalTerm {
  SHORT_TERM = 'SHORT_TERM',   // 短租 (< 6個月)
  LONG_TERM = 'LONG_TERM',     // 長租 (≥ 6個月)
  MONTHLY = 'MONTHLY',         // 月租
}

export interface PropertyLocation {
  city: string;                // 縣市
  district: string;            // 行政區
  address: string;             // 地址
  lat: number;                 // 緯度
  lng: number;                 // 經度
  nearbyStations?: string[];   // 附近捷運站
  nearbyLandmarks?: string[];  // 附近地標
}

export interface PropertyFeatures {
  bedrooms: number;            // 房間數
  bathrooms: number;           // 衛浴數
  area: number;                // 坪數
  floor: number;               // 樓層
  totalFloors: number;         // 總樓層
  parking?: boolean;           // 停車位
  elevator?: boolean;          // 電梯
  balcony?: boolean;           // 陽台
}

export interface PropertyAmenities {
  wifi?: boolean;
  ac?: boolean;
  washer?: boolean;
  fridge?: boolean;
  tv?: boolean;
  waterHeater?: boolean;
  bed?: boolean;
  desk?: boolean;
  wardrobe?: boolean;
  kitchen?: boolean;
  security?: boolean;
  petAllowed?: boolean;
  cookingAllowed?: boolean;
}

export interface PropertyPrice {
  monthlyRent: number;         // 月租金
  deposit: number;             // 押金
  managementFee?: number;      // 管理費
  parkingFee?: number;         // 停車費
  currency: string;            // 幣別
}

export interface PropertyImage {
  id: string;
  url: string;
  caption?: string;
  order: number;
  isMain: boolean;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  rentalTerm: RentalTerm;
  location: PropertyLocation;
  features: PropertyFeatures;
  amenities: PropertyAmenities;
  price: PropertyPrice;
  images: PropertyImage[];
  ownerId: string;
  ownerName: string;
  ownerPhone?: string;
  ownerEmail?: string;
  viewCount: number;
  favoriteCount: number;
  createdAt: string;
  updatedAt: string;
  availableFrom?: string;
}

export interface PropertySearchParams {
  city?: string;
  district?: string;
  propertyType?: PropertyType[];
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number[];
  amenities?: string[];
  keyword?: string;
  sortBy?: 'createdAt' | 'price' | 'area' | 'viewCount';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PropertySearchResult {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}
