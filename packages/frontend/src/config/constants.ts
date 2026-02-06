/**
 * 應用程式常數配置
 */

// API 設定
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

// 地圖設定
export const MAP_CONFIG = {
  DEFAULT_CENTER: { lat: 25.033, lng: 121.565 } as const, // 台北市中心
  DEFAULT_ZOOM: 13,
  MIN_ZOOM: 7,
  MAX_ZOOM: 18,
  TILE_URL: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  TILE_ATTRIBUTION:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

// 分頁設定
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  PAGE_SIZE_OPTIONS: [12, 24, 48],
};

// 房型對照表
export const PROPERTY_TYPE_MAP: Record<string, string> = {
  WHOLE_FLOOR: '整層住家',
  STUDIO: '獨立套房',
  SUITE: '分租套房',
  ROOM: '雅房',
  PARKING: '車位',
  SHOP: '店面',
  OFFICE: '辦公室',
  FACTORY: '廠房',
  LAND: '土地',
};

// 交易類型
export const TRANSACTION_TYPE_MAP: Record<string, string> = {
  RENT: '租屋',
  BUY: '買房',
  NEW_CONSTRUCTION: '新建案',
};

// 價格範圍選項 (租屋)
export const RENT_PRICE_RANGES = [
  { label: '不限', min: undefined, max: undefined },
  { label: '5,000 以下', min: 0, max: 5000 },
  { label: '5,000 ~ 10,000', min: 5000, max: 10000 },
  { label: '10,000 ~ 15,000', min: 10000, max: 15000 },
  { label: '15,000 ~ 20,000', min: 15000, max: 20000 },
  { label: '20,000 ~ 30,000', min: 20000, max: 30000 },
  { label: '30,000 ~ 50,000', min: 30000, max: 50000 },
  { label: '50,000 以上', min: 50000, max: undefined },
];

// 價格範圍選項 (買房)
export const BUY_PRICE_RANGES = [
  { label: '不限', min: undefined, max: undefined },
  { label: '500萬以下', min: 0, max: 5000000 },
  { label: '500萬 ~ 1000萬', min: 5000000, max: 10000000 },
  { label: '1000萬 ~ 2000萬', min: 10000000, max: 20000000 },
  { label: '2000萬 ~ 3000萬', min: 20000000, max: 30000000 },
  { label: '3000萬 ~ 5000萬', min: 30000000, max: 50000000 },
  { label: '5000萬以上', min: 50000000, max: undefined },
];

// 坪數範圍
export const AREA_RANGES = [
  { label: '不限', min: undefined, max: undefined },
  { label: '10坪以下', min: 0, max: 10 },
  { label: '10 ~ 20坪', min: 10, max: 20 },
  { label: '20 ~ 30坪', min: 20, max: 30 },
  { label: '30 ~ 50坪', min: 30, max: 50 },
  { label: '50坪以上', min: 50, max: undefined },
];

// 設施清單
export const AMENITIES_LIST = [
  { id: 'wifi', label: 'WiFi', icon: '📶' },
  { id: 'ac', label: '冷氣', icon: '❄️' },
  { id: 'washer', label: '洗衣機', icon: '🧺' },
  { id: 'fridge', label: '冰箱', icon: '🧊' },
  { id: 'tv', label: '電視', icon: '📺' },
  { id: 'water_heater', label: '熱水器', icon: '🚿' },
  { id: 'bed', label: '床', icon: '🛏️' },
  { id: 'desk', label: '書桌', icon: '🪑' },
  { id: 'wardrobe', label: '衣櫃', icon: '🚪' },
  { id: 'kitchen', label: '廚房', icon: '🍳' },
  { id: 'balcony', label: '陽台', icon: '🌿' },
  { id: 'parking', label: '停車位', icon: '🚗' },
  { id: 'elevator', label: '電梯', icon: '🛗' },
  { id: 'security', label: '保全', icon: '🔒' },
  { id: 'pet', label: '可養寵', icon: '🐾' },
  { id: 'cook', label: '可開伙', icon: '🔥' },
];

// 縣市清單
export const CITIES = [
  '台北市', '新北市', '桃園市', '台中市', '台南市', '高雄市',
  '基隆市', '新竹市', '新竹縣', '苗栗縣', '彰化縣', '南投縣',
  '雲林縣', '嘉義市', '嘉義縣', '屏東縣', '宜蘭縣', '花蓮縣',
  '台東縣', '澎湖縣', '金門縣', '連江縣',
];

// 排序選項
export const SORT_OPTIONS = [
  { value: 'newest', label: '最新發布' },
  { value: 'price_asc', label: '價格低到高' },
  { value: 'price_desc', label: '價格高到低' },
  { value: 'area_desc', label: '坪數大到小' },
  { value: 'popular', label: '最多人看' },
];
