/**
 * 全域常數定義
 */

/** 房源類型對照表 */
export const PROPERTY_TYPE_MAP: Record<string, string> = {
  WHOLE_FLOOR: '整層住家',
  STUDIO: '獨立套房',
  SUITE: '分租套房',
  ROOM: '雅房',
  PARKING: '車位',
  STORE: '店面',
  OFFICE: '辦公室',
  FACTORY: '廠房',
  LAND: '土地',
};

/** 交易類型對照表 */
export const TRANSACTION_TYPE_MAP: Record<string, string> = {
  RENT: '出租',
  SALE: '出售',
  NEW_BUILD: '新建案',
};

/** 設施清單 */
export const AMENITIES_LIST = [
  { id: 'wifi', label: 'WiFi', icon: 'Wifi' },
  { id: 'ac', label: '冷氣', icon: 'Snowflake' },
  { id: 'washer', label: '洗衣機', icon: 'WashingMachine' },
  { id: 'fridge', label: '冰箱', icon: 'Refrigerator' },
  { id: 'tv', label: '電視', icon: 'Tv' },
  { id: 'water_heater', label: '熱水器', icon: 'Droplets' },
  { id: 'bed', label: '床', icon: 'Bed' },
  { id: 'desk', label: '書桌', icon: 'Armchair' },
  { id: 'wardrobe', label: '衣櫃', icon: 'DoorClosed' },
  { id: 'kitchen', label: '廚房', icon: 'ChefHat' },
  { id: 'balcony', label: '陽台', icon: 'Sun' },
  { id: 'parking', label: '停車位', icon: 'Car' },
  { id: 'elevator', label: '電梯', icon: 'ArrowUpDown' },
  { id: 'security', label: '保全', icon: 'Shield' },
  { id: 'pet', label: '可養寵', icon: 'PawPrint' },
  { id: 'cook', label: '可開伙', icon: 'Flame' },
] as const;

/** 台灣縣市清單 */
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
] as const;

/** 台北市行政區 */
export const TAIPEI_DISTRICTS = [
  '中正區', '大同區', '中山區', '松山區', '大安區',
  '萬華區', '信義區', '士林區', '北投區', '內湖區',
  '南港區', '文山區',
] as const;

/** 新北市行政區 */
export const NEW_TAIPEI_DISTRICTS = [
  '板橋區', '三重區', '中和區', '永和區', '新莊區',
  '新店區', '土城區', '蘆洲區', '汐止區', '樹林區',
  '鶯歌區', '三峽區', '淡水區', '林口區', '五股區',
  '泰山區', '八里區', '深坑區', '石碇區', '坪林區',
  '三芝區', '石門區', '瑞芳區', '平溪區', '雙溪區',
  '貢寮區', '金山區', '萬里區', '烏來區',
] as const;

/** 價格範圍選項 (租屋) */
export const RENT_PRICE_RANGES = [
  { label: '不限', min: null, max: null },
  { label: '5,000 以下', min: null, max: 5000 },
  { label: '5,000 - 10,000', min: 5000, max: 10000 },
  { label: '10,000 - 15,000', min: 10000, max: 15000 },
  { label: '15,000 - 20,000', min: 15000, max: 20000 },
  { label: '20,000 - 30,000', min: 20000, max: 30000 },
  { label: '30,000 - 50,000', min: 30000, max: 50000 },
  { label: '50,000 以上', min: 50000, max: null },
] as const;

/** 價格範圍選項 (買房) */
export const SALE_PRICE_RANGES = [
  { label: '不限', min: null, max: null },
  { label: '500 萬以下', min: null, max: 5000000 },
  { label: '500 - 1,000 萬', min: 5000000, max: 10000000 },
  { label: '1,000 - 1,500 萬', min: 10000000, max: 15000000 },
  { label: '1,500 - 2,000 萬', min: 15000000, max: 20000000 },
  { label: '2,000 - 3,000 萬', min: 20000000, max: 30000000 },
  { label: '3,000 - 5,000 萬', min: 30000000, max: 50000000 },
  { label: '5,000 萬以上', min: 50000000, max: null },
] as const;

/** 房間數選項 */
export const BEDROOM_OPTIONS = [
  { label: '不限', value: null },
  { label: '1 房', value: 1 },
  { label: '2 房', value: 2 },
  { label: '3 房', value: 3 },
  { label: '4 房', value: 4 },
  { label: '4 房以上', value: 5 },
] as const;

/** 坪數範圍 */
export const AREA_RANGES = [
  { label: '不限', min: null, max: null },
  { label: '10 坪以下', min: null, max: 10 },
  { label: '10 - 20 坪', min: 10, max: 20 },
  { label: '20 - 30 坪', min: 20, max: 30 },
  { label: '30 - 50 坪', min: 30, max: 50 },
  { label: '50 坪以上', min: 50, max: null },
] as const;

/** 排序選項 */
export const SORT_OPTIONS = [
  { label: '最新發布', value: 'newest' },
  { label: '價格低到高', value: 'price_asc' },
  { label: '價格高到低', value: 'price_desc' },
  { label: '坪數大到小', value: 'area_desc' },
  { label: '坪數小到大', value: 'area_asc' },
] as const;

/** 地圖預設中心 (台北 101) */
export const DEFAULT_MAP_CENTER = {
  lat: 25.033,
  lng: 121.565,
} as const;

/** 地圖預設縮放等級 */
export const DEFAULT_MAP_ZOOM = 13;

/** 每頁預設顯示筆數 */
export const DEFAULT_PAGE_SIZE = 12;

/** 最大上傳圖片數量 */
export const MAX_UPLOAD_IMAGES = 20;

/** 最大檔案大小 (10MB) */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/** 允許的圖片格式 */
export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;
