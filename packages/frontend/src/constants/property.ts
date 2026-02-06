/**
 * 房地產平台常數定義
 */

import { PropertyType } from '@/types';

// 房型對照表
export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  [PropertyType.WHOLE_FLOOR]: '整層住家',
  [PropertyType.STUDIO]: '獨立套房',
  [PropertyType.SUITE]: '分租套房',
  [PropertyType.ROOM]: '雅房',
  [PropertyType.PARKING]: '車位',
  [PropertyType.OFFICE]: '辦公室',
  [PropertyType.SHOP]: '店面',
};

// 房型選項
export const PROPERTY_TYPE_OPTIONS = Object.entries(PROPERTY_TYPE_LABELS).map(
  ([value, label]) => ({ value, label })
);

// 房間數選項
export const BEDROOM_OPTIONS = [
  { value: 1, label: '1房' },
  { value: 2, label: '2房' },
  { value: 3, label: '3房' },
  { value: 4, label: '4房' },
  { value: 5, label: '5房以上' },
];

// 價格範圍選項
export const PRICE_RANGE_OPTIONS = [
  { value: [0, 10000], label: '10,000元以下' },
  { value: [10000, 15000], label: '10,000 - 15,000元' },
  { value: [15000, 20000], label: '15,000 - 20,000元' },
  { value: [20000, 30000], label: '20,000 - 30,000元' },
  { value: [30000, 50000], label: '30,000 - 50,000元' },
  { value: [50000, 999999], label: '50,000元以上' },
];

// 坪數範圍選項
export const AREA_RANGE_OPTIONS = [
  { value: [0, 10], label: '10坪以下' },
  { value: [10, 20], label: '10 - 20坪' },
  { value: [20, 30], label: '20 - 30坪' },
  { value: [30, 40], label: '30 - 40坪' },
  { value: [40, 50], label: '40 - 50坪' },
  { value: [50, 999], label: '50坪以上' },
];

// 設施清單
export const AMENITY_OPTIONS = [
  { id: 'wifi', label: 'WiFi', icon: '📶' },
  { id: 'ac', label: '冷氣', icon: '❄️' },
  { id: 'washer', label: '洗衣機', icon: '🧺' },
  { id: 'fridge', label: '冰箱', icon: '🧊' },
  { id: 'tv', label: '電視', icon: '📺' },
  { id: 'waterHeater', label: '熱水器', icon: '🚿' },
  { id: 'bed', label: '床', icon: '🛏️' },
  { id: 'desk', label: '書桌', icon: '🪑' },
  { id: 'wardrobe', label: '衣櫃', icon: '🚪' },
  { id: 'kitchen', label: '廚房', icon: '🍳' },
  { id: 'balcony', label: '陽台', icon: '🌿' },
  { id: 'parking', label: '停車位', icon: '🚗' },
  { id: 'elevator', label: '電梯', icon: '🛗' },
  { id: 'security', label: '保全', icon: '🔒' },
  { id: 'petAllowed', label: '可養寵', icon: '🐾' },
  { id: 'cookingAllowed', label: '可開伙', icon: '🔥' },
];

// 排序選項
export const SORT_OPTIONS = [
  { value: 'createdAt:desc', label: '最新刊登' },
  { value: 'price:asc', label: '價格由低到高' },
  { value: 'price:desc', label: '價格由高到低' },
  { value: 'area:asc', label: '坪數由小到大' },
  { value: 'area:desc', label: '坪數由大到小' },
  { value: 'viewCount:desc', label: '最多瀏覽' },
];

// 預設地圖中心（台北市政府）
export const DEFAULT_MAP_CENTER = {
  lat: 25.0330,
  lng: 121.5654,
};

// 預設地圖縮放等級
export const DEFAULT_MAP_ZOOM = 13;

// 每頁顯示數量
export const DEFAULT_PAGE_SIZE = 20;

// 圖片上傳限制
export const MAX_IMAGES = 20;
export const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
