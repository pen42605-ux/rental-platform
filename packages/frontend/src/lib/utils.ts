/**
 * 工具函數
 */
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// 合併 className (shadcn/ui compatible)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 格式化價格
export function formatPrice(price: number, currency = 'TWD'): string {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

// 格式化面積
export function formatArea(area: number | null): string {
  if (!area) return '-';
  return `${area} 坪`;
}

// 房型對照表
export const PROPERTY_TYPE_MAP: Record<string, string> = {
  WHOLE_FLOOR: '整層住家',
  STUDIO: '獨立套房',
  SUITE: '分租套房',
  ROOM: '雅房',
  PARKING: '車位',
};

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

// 格式化日期
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
}

// 相對時間
export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '今天';
  if (diffDays === 1) return '昨天';
  if (diffDays < 7) return `${diffDays} 天前`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} 週前`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} 個月前`;
  return `${Math.floor(diffDays / 365)} 年前`;
}






