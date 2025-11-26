/**
 * 搜尋模組類型定義
 */

// ==================== 搜尋參數 ====================

export interface SearchParams {
  q?: string;                    // 關鍵字
  min_price?: number;            // 最低價格
  max_price?: number;            // 最高價格
  type?: string;                 // 房源類型
  beds?: number;                 // 最少臥室數
  lat?: number;                  // 緯度
  lng?: number;                  // 經度
  radius_km?: number;            // 搜尋半徑（公里）
  sort?: SortOption;             // 排序方式
  page?: number;                 // 頁碼
  limit?: number;                // 每頁數量
  amenities?: string[];          // 設施篩選
  city?: string;                 // 縣市
  district?: string;             // 區域
}

export type SortOption = 'price_asc' | 'price_desc' | 'newest' | 'nearest' | 'relevance';

// ==================== 索引文檔 ====================

export interface ListingDocument {
  id: string;
  title: string;
  description: string | null;
  price: number;
  currency: string;
  propertyType: string;
  beds: number;
  baths: number;
  area: number | null;
  address: string | null;
  city: string | null;
  district: string | null;
  _geo: {
    lat: number;
    lng: number;
  } | null;
  amenities: string[];
  status: string;
  coverImage: string | null;
  viewCount: number;
  userId: string;
  userName: string;
  createdAt: number;  // timestamp
  updatedAt: number;  // timestamp
}

// ==================== 搜尋結果 ====================

export interface SearchResult {
  hits: ListingDocument[];
  query: string;
  processingTimeMs: number;
  limit: number;
  offset: number;
  estimatedTotalHits: number;
  facetDistribution?: {
    propertyType?: Record<string, number>;
    city?: Record<string, number>;
    amenities?: Record<string, number>;
  };
  geoDistance?: Record<string, number>;  // id -> distance in meters
}

export interface SearchResponse {
  items: ListingDocument[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
  meta: {
    query: string;
    processingTimeMs: number;
    facets?: SearchResult['facetDistribution'];
  };
}

// ==================== 同步事件 ====================

export type SyncEventType = 'create' | 'update' | 'delete';

export interface SyncEvent {
  type: SyncEventType;
  listingId: string;
  timestamp: Date;
}






