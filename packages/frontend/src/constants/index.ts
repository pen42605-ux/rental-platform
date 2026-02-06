/**
 * 全局常量
 */

// API 相關
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// 地圖相關
export const MAP_DEFAULT_CENTER: [number, number] = [25.033, 121.5654]; // 台北市
export const MAP_DEFAULT_ZOOM = 13;

// 分頁相關
export const DEFAULT_PAGE_SIZE = 12;
export const PAGE_SIZE_OPTIONS = [12, 24, 48];

// 房型選項
export const PROPERTY_TYPES = [
  { value: 'WHOLE_FLOOR', label: '整層住家' },
  { value: 'STUDIO', label: '獨立套房' },
  { value: 'SUITE', label: '分租套房' },
  { value: 'ROOM', label: '雅房' },
  { value: 'PARKING', label: '車位' },
];

// 價格範圍選項
export const PRICE_RANGES = [
  { label: '不限', min: undefined, max: undefined },
  { label: '5000 以下', min: 0, max: 5000 },
  { label: '5000 - 10000', min: 5000, max: 10000 },
  { label: '10000 - 15000', min: 10000, max: 15000 },
  { label: '15000 - 20000', min: 15000, max: 20000 },
  { label: '20000 - 30000', min: 20000, max: 30000 },
  { label: '30000 以上', min: 30000, max: undefined },
];

// 面積範圍選項
export const AREA_RANGES = [
  { label: '不限', min: undefined, max: undefined },
  { label: '10 坪以下', min: 0, max: 10 },
  { label: '10 - 20 坪', min: 10, max: 20 },
  { label: '20 - 30 坪', min: 20, max: 30 },
  { label: '30 - 40 坪', min: 30, max: 40 },
  { label: '40 坪以上', min: 40, max: undefined },
];

// 設施選項
export const AMENITIES = [
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

// 縣市列表
export const CITIES = [
  '台北市',
  '新北市',
  '桃園市',
  '台中市',
  '台南市',
  '高雄市',
  '基隆市',
  '新竹市',
  '新竹縣',
  '苗栗縣',
  '彰化縣',
  '南投縣',
  '雲林縣',
  '嘉義市',
  '嘉義縣',
  '屏東縣',
  '宜蘭縣',
  '花蓮縣',
  '台東縣',
  '澎湖縣',
  '金門縣',
  '連江縣',
];

// 圖片上傳相關
export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
export const MAX_IMAGES_COUNT = 10;
export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

// 社交登入相關
export const FACEBOOK_APP_ID = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '';

// SEO 相關
export const SITE_NAME = '591 租屋網';
export const SITE_DESCRIPTION = '全台最大租屋網站，提供最新、最完整的租屋資訊';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://example.com';
