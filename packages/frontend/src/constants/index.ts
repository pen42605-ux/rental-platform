/**
 * 應用程式常量定義
 */

// ==================== 站台基本資訊 ====================

export const SITE_CONFIG = {
  name: '好房網',
  description: '台灣最優質的租屋、買房平台',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  ogImage: '/og-image.png',
  locale: 'zh-TW',
};

// ==================== 房型對照表 ====================

export const PROPERTY_TYPE_LABELS: Record<string, string> = {
  WHOLE_FLOOR: '整層住家',
  STUDIO: '獨立套房',
  SUITE: '分租套房',
  ROOM: '雅房',
  PARKING: '車位',
  NEW_BUILD: '新建案',
  USED_HOUSE: '中古屋',
  LAND: '土地',
  SHOP: '店面',
  OFFICE: '辦公',
  FACTORY: '廠房',
  COMMUNITY: '社區',
};

// ==================== 交易類型 ====================

export const TRANSACTION_TYPE_LABELS: Record<string, string> = {
  RENT: '出租',
  SALE: '出售',
};

// ==================== 房源狀態 ====================

export const LISTING_STATUS_LABELS: Record<string, string> = {
  DRAFT: '草稿',
  PUBLISHED: '已上架',
  REMOVED: '已下架',
  SOLD: '已售出',
  RENTED: '已出租',
};

// ==================== 價格範圍 ====================

export const RENT_PRICE_RANGES = [
  { label: '不限', min: null, max: null },
  { label: '5,000 以下', min: null, max: 5000 },
  { label: '5,000 - 10,000', min: 5000, max: 10000 },
  { label: '10,000 - 15,000', min: 10000, max: 15000 },
  { label: '15,000 - 20,000', min: 15000, max: 20000 },
  { label: '20,000 - 30,000', min: 20000, max: 30000 },
  { label: '30,000 - 50,000', min: 30000, max: 50000 },
  { label: '50,000 以上', min: 50000, max: null },
];

export const SALE_PRICE_RANGES = [
  { label: '不限', min: null, max: null },
  { label: '500 萬以下', min: null, max: 5000000 },
  { label: '500 - 1,000 萬', min: 5000000, max: 10000000 },
  { label: '1,000 - 2,000 萬', min: 10000000, max: 20000000 },
  { label: '2,000 - 3,000 萬', min: 20000000, max: 30000000 },
  { label: '3,000 - 5,000 萬', min: 30000000, max: 50000000 },
  { label: '5,000 萬以上', min: 50000000, max: null },
];

// ==================== 坪數範圍 ====================

export const AREA_RANGES = [
  { label: '不限', min: null, max: null },
  { label: '10 坪以下', min: null, max: 10 },
  { label: '10 - 20 坪', min: 10, max: 20 },
  { label: '20 - 30 坪', min: 20, max: 30 },
  { label: '30 - 50 坪', min: 30, max: 50 },
  { label: '50 坪以上', min: 50, max: null },
];

// ==================== 設施清單 ====================

export const AMENITIES = [
  { id: 'wifi', label: 'WiFi', icon: '📶', category: '基本' },
  { id: 'ac', label: '冷氣', icon: '❄️', category: '基本' },
  { id: 'washer', label: '洗衣機', icon: '🧺', category: '基本' },
  { id: 'fridge', label: '冰箱', icon: '🧊', category: '基本' },
  { id: 'tv', label: '電視', icon: '📺', category: '基本' },
  { id: 'water_heater', label: '熱水器', icon: '🚿', category: '基本' },
  { id: 'bed', label: '床', icon: '🛏️', category: '傢俱' },
  { id: 'desk', label: '書桌', icon: '🪑', category: '傢俱' },
  { id: 'wardrobe', label: '衣櫃', icon: '🚪', category: '傢俱' },
  { id: 'kitchen', label: '廚房', icon: '🍳', category: '設施' },
  { id: 'balcony', label: '陽台', icon: '🌿', category: '設施' },
  { id: 'parking', label: '停車位', icon: '🚗', category: '設施' },
  { id: 'elevator', label: '電梯', icon: '🛗', category: '建築' },
  { id: 'security', label: '保全', icon: '🔒', category: '建築' },
  { id: 'pet', label: '可養寵', icon: '🐾', category: '規則' },
  { id: 'cook', label: '可開伙', icon: '🔥', category: '規則' },
  { id: 'gym', label: '健身房', icon: '💪', category: '公設' },
  { id: 'pool', label: '游泳池', icon: '🏊', category: '公設' },
];

// ==================== 排序選項 ====================

export const SORT_OPTIONS = [
  { value: 'newest', label: '最新發布' },
  { value: 'price_asc', label: '價格低到高' },
  { value: 'price_desc', label: '價格高到低' },
  { value: 'area_asc', label: '坪數小到大' },
  { value: 'area_desc', label: '坪數大到小' },
  { value: 'views', label: '最多瀏覽' },
];

// ==================== 房源分類（首頁入口） ====================

export const PROPERTY_CATEGORIES = [
  { name: '新建案', key: '新建案', color: 'from-blue-500 to-blue-600' },
  { name: '中古屋', key: '中古屋', color: 'from-emerald-500 to-emerald-600' },
  { name: '租屋', key: '租屋', color: 'from-cyan-500 to-cyan-600' },
  { name: '土地', key: '土地', color: 'from-amber-500 to-amber-600' },
  { name: '店面', key: '店面', color: 'from-purple-500 to-purple-600' },
  { name: '辦公', key: '辦公', color: 'from-indigo-500 to-indigo-600' },
  { name: '廠房', key: '廠房', color: 'from-slate-500 to-slate-600' },
  { name: '社區', key: '社區', color: 'from-rose-500 to-rose-600' },
];

// ==================== 熱門搜尋關鍵字 ====================

export const HOT_SEARCHES = [
  '台北市', '新北市', '桃園市', '台中市', '高雄市',
  '信義區', '大安區', '板橋區', '中壢區', '西屯區',
  '捷運站', '近學校', '近商圈', '電梯大樓', '透天厝',
];

// ==================== 導覽連結 ====================

export const NAV_LINKS = [
  { label: '新建案', href: '/?type=新建案' },
  { label: '中古屋', href: '/?type=中古屋' },
  { label: '租屋', href: '/?type=租屋' },
  { label: '土地', href: '/?type=土地' },
  { label: '店面', href: '/?type=店面' },
  { label: '辦公', href: '/?type=辦公' },
  { label: '廠房', href: '/?type=廠房' },
  { label: '社區', href: '/?type=社區' },
  { label: '找房', href: '/' },
  { label: '室內設計', href: '/interior-design' },
  { label: '新聞', href: '/news' },
];

// ==================== 分頁設定 ====================

export const PAGINATION = {
  defaultPageSize: 12,
  pageSizeOptions: [12, 24, 48],
};

// ==================== 地圖設定 ====================

export const MAP_CONFIG = {
  defaultCenter: [25.033, 121.565] as [number, number], // 台北市
  defaultZoom: 13,
  minZoom: 7,
  maxZoom: 18,
  tileUrl: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  attribution: '&copy; OpenStreetMap contributors',
};

// ==================== 圖片上傳設定 ====================

export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFiles: 20,
  acceptedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  thumbnailWidth: 400,
  thumbnailHeight: 300,
};
