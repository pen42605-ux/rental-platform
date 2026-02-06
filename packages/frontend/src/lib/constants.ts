/**
 * 常數定義 (Constants)
 */

export const CITIES = [
  { id: 'taipei', name: '台北市', code: 'TPE' },
  { id: 'new-taipei', name: '新北市', code: 'NWT' },
  { id: 'taoyuan', name: '桃園市', code: 'TYN' },
  { id: 'taichung', name: '台中市', code: 'TXG' },
  { id: 'tainan', name: '台南市', code: 'TNN' },
  { id: 'kaohsiung', name: '高雄市', code: 'KHH' },
  { id: 'keelung', name: '基隆市', code: 'KEE' },
  { id: 'hsinchu-city', name: '新竹市', code: 'HSZ' },
  { id: 'chiayi-city', name: '嘉義市', code: 'CYI' },
] as const;

export const DISTRICTS = {
  taipei: [
    '中正區', '大同區', '中山區', '松山區', '大安區', 
    '萬華區', '信義區', '士林區', '北投區', '內湖區', 
    '南港區', '文山區'
  ],
  'new-taipei': [
    '板橋區', '三重區', '中和區', '永和區', '新莊區',
    '新店區', '樹林區', '鶯歌區', '三峽區', '淡水區',
    '汐止區', '瑞芳區', '土城區', '蘆洲區', '五股區',
    '泰山區', '林口區', '深坑區', '石碇區', '坪林區',
    '三芝區', '石門區', '八里區', '平溪區', '雙溪區',
    '貢寮區', '金山區', '萬里區', '烏來區'
  ],
  taoyuan: [
    '桃園區', '中壢區', '平鎮區', '八德區', '楊梅區',
    '蘆竹區', '大溪區', '龍潭區', '龜山區', '大園區',
    '觀音區', '新屋區', '復興區'
  ],
  taichung: [
    '中區', '東區', '南區', '西區', '北區',
    '西屯區', '南屯區', '北屯區', '豐原區', '東勢區',
    '大甲區', '清水區', '沙鹿區', '梧棲區', '后里區',
    '神岡區', '潭子區', '大雅區', '新社區', '石岡區',
    '外埔區', '大安區', '烏日區', '大肚區', '龍井區',
    '霧峰區', '太平區', '大里區', '和平區'
  ],
  tainan: [
    '中西區', '東區', '南區', '北區', '安平區',
    '安南區', '永康區', '歸仁區', '新化區', '左鎮區',
    '玉井區', '楠西區', '南化區', '仁德區', '關廟區',
    '龍崎區', '官田區', '麻豆區', '佳里區', '西港區',
    '七股區', '將軍區', '學甲區', '北門區', '新營區',
    '後壁區', '白河區', '東山區', '六甲區', '下營區',
    '柳營區', '鹽水區', '善化區', '大內區', '山上區',
    '新市區', '安定區'
  ],
  kaohsiung: [
    '楠梓區', '左營區', '鼓山區', '三民區', '鹽埕區',
    '前金區', '新興區', '苓雅區', '前鎮區', '旗津區',
    '小港區', '鳳山區', '大寮區', '鳥松區', '林園區',
    '仁武區', '大樹區', '大社區', '岡山區', '路竹區',
    '橋頭區', '梓官區', '彌陀區', '永安區', '燕巢區',
    '田寮區', '阿蓮區', '茄萣區', '湖內區', '旗山區',
    '美濃區', '內門區', '杉林區', '甲仙區', '六龜區',
    '茂林區', '桃源區', '那瑪夏區'
  ],
} as const;

export const PROPERTY_TYPES = [
  { value: 'apartment', label: '公寓', icon: '🏢' },
  { value: 'house', label: '透天厝', icon: '🏠' },
  { value: 'studio', label: '套房', icon: '🏘️' },
  { value: 'share', label: '雅房', icon: '🛏️' },
  { value: 'office', label: '辦公室', icon: '🏢' },
  { value: 'store', label: '店面', icon: '🏪' },
] as const;

export const RENTAL_TYPES = [
  { value: 'entire', label: '整層住家' },
  { value: 'room', label: '獨立套房' },
  { value: 'shared', label: '分租雅房' },
] as const;

export const FACILITIES = [
  { id: 'airConditioner', label: '冷氣', icon: '❄️' },
  { id: 'washingMachine', label: '洗衣機', icon: '🌀' },
  { id: 'refrigerator', label: '冰箱', icon: '🧊' },
  { id: 'waterHeater', label: '熱水器', icon: '🚿' },
  { id: 'tv', label: '電視', icon: '📺' },
  { id: 'internet', label: '網路', icon: '📡' },
  { id: 'bed', label: '床', icon: '🛏️' },
  { id: 'wardrobe', label: '衣櫃', icon: '👔' },
  { id: 'sofa', label: '沙發', icon: '🛋️' },
  { id: 'diningTable', label: '餐桌', icon: '🍽️' },
] as const;

export const BEDROOM_OPTIONS = [
  { value: 0, label: '不限' },
  { value: 1, label: '1房' },
  { value: 2, label: '2房' },
  { value: 3, label: '3房' },
  { value: 4, label: '4房以上' },
] as const;

export const SORT_OPTIONS = [
  { value: 'latest', label: '最新刊登' },
  { value: 'price-asc', label: '租金由低到高' },
  { value: 'price-desc', label: '租金由高到低' },
  { value: 'area-asc', label: '坪數由小到大' },
  { value: 'area-desc', label: '坪數由大到小' },
  { value: 'popular', label: '最多人氣' },
] as const;

export const PRICE_RANGES = [
  { min: 0, max: 5000, label: '5千以下' },
  { min: 5000, max: 10000, label: '5千-1萬' },
  { min: 10000, max: 15000, label: '1萬-1.5萬' },
  { min: 15000, max: 20000, label: '1.5萬-2萬' },
  { min: 20000, max: 30000, label: '2萬-3萬' },
  { min: 30000, max: 50000, label: '3萬-5萬' },
  { min: 50000, max: Infinity, label: '5萬以上' },
] as const;

export const AREA_RANGES = [
  { min: 0, max: 10, label: '10坪以下' },
  { min: 10, max: 20, label: '10-20坪' },
  { min: 20, max: 30, label: '20-30坪' },
  { min: 30, max: 40, label: '30-40坪' },
  { min: 40, max: 50, label: '40-50坪' },
  { min: 50, max: Infinity, label: '50坪以上' },
] as const;

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    me: '/auth/me',
  },
  listings: {
    list: '/listings',
    detail: (id: string) => `/listings/${id}`,
    create: '/listings',
    update: (id: string) => `/listings/${id}`,
    delete: (id: string) => `/listings/${id}`,
  },
  favorites: {
    list: '/favorites',
    add: (id: string) => `/favorites/${id}`,
    remove: (id: string) => `/favorites/${id}`,
  },
  search: {
    search: '/search',
    suggestions: '/search/suggestions',
  },
} as const;

export const IMAGE_CONFIG = {
  maxSize: 5 * 1024 * 1024, // 5MB
  maxFiles: 10,
  acceptedFormats: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
} as const;

export const PAGINATION = {
  defaultPageSize: 20,
  pageSizeOptions: [10, 20, 30, 50],
} as const;
