/**
 * 前端產品配置（與後端同步）
 * 用於前端顯示和選擇方案
 */

export const RESIDENTIAL_LISTING_PLANS = {
  NORMAL: {
    id: 'RESIDENTIAL_NORMAL',
    name: '普通廣告',
    price: 40000,
    duration: 30,
  },
  VIP: {
    id: 'RESIDENTIAL_VIP',
    name: '超級VIP廣告',
    price: 78900,
    originalPrice: 100000,
    duration: 30,
    clickIncrease: 250,
  },
  GOLD: {
    id: 'RESIDENTIAL_GOLD',
    name: '黃金曝光廣告',
    price: 128900,
    originalPrice: 250000,
    duration: 30,
    clickIncrease: 450,
  },
};

export const RESIDENTIAL_PACKAGES = {
  BEGINNER: {
    id: 'RESIDENTIAL_PACKAGE_BEGINNER',
    name: '新手套餐',
    price: 54000,
    originalPrice: 90000,
    quantity: 3,
    duration: 30,
    unitPrice: 18000,
  },
  NORMAL: {
    id: 'RESIDENTIAL_PACKAGE_NORMAL',
    name: '普通套餐',
    price: 108000,
    originalPrice: 180000,
    quantity: 6,
    duration: 30,
    unitPrice: 18000,
  },
  SUPER: {
    id: 'RESIDENTIAL_PACKAGE_SUPER',
    name: '超級套餐',
    price: 208000,
    originalPrice: 360000,
    quantity: 12,
    duration: 30,
    unitPrice: 17333,
  },
  GOLD: {
    id: 'RESIDENTIAL_PACKAGE_GOLD',
    name: '黃金套餐',
    price: 398000,
    originalPrice: 750000,
    quantity: 25,
    duration: 30,
    unitPrice: 15920,
  },
};

export const COMMERCIAL_PACKAGES = {
  BEGINNER: {
    id: 'COMMERCIAL_PACKAGE_BEGINNER',
    name: '新手套餐',
    price: 120000,
    originalPrice: 180000,
    quantity: 3,
    duration: 90,
    unitPrice: 40000,
  },
  NORMAL: {
    id: 'COMMERCIAL_PACKAGE_NORMAL',
    name: '普通套餐',
    price: 220000,
    originalPrice: 360000,
    quantity: 6,
    duration: 90,
    unitPrice: 36667,
  },
  SUPER: {
    id: 'COMMERCIAL_PACKAGE_SUPER',
    name: '超級套餐',
    price: 358000,
    originalPrice: 720000,
    quantity: 12,
    duration: 90,
    unitPrice: 29833,
  },
};

export const SALE_PLANS = {
  NORMAL: {
    id: 'SALE_NORMAL',
    name: '普通廣告',
    price: 60000,
    duration: 90,
  },
  VIP: {
    id: 'SALE_VIP',
    name: 'VIP廣告',
    price: 150000,
    duration: 90,
    clickIncrease: 80,
  },
};

export const SALE_PACKAGES = {
  BEGINNER: {
    id: 'SALE_PACKAGE_BEGINNER',
    name: '新手套餐',
    price: 120000,
    quantity: 3,
    duration: 60,
    unitPrice: 40000,
  },
  NORMAL: {
    id: 'SALE_PACKAGE_NORMAL',
    name: '普通套餐',
    price: 220000,
    originalPrice: 240000,
    quantity: 6,
    duration: 60,
    unitPrice: 36667,
  },
  SUPER: {
    id: 'SALE_PACKAGE_SUPER',
    name: '超級套餐',
    price: 520000,
    originalPrice: 640000,
    quantity: 16,
    duration: 60,
    unitPrice: 32500,
  },
  GOLD: {
    id: 'SALE_PACKAGE_GOLD',
    name: '黃金套餐',
    price: 980000,
    originalPrice: 1440000,
    quantity: 35,
    duration: 60,
    unitPrice: 28000,
  },
};

export const ADDON_COMPUTER = {
  AUTO_UPDATE: {
    id: 'ADDON_COMPUTER_AUTO_UPDATE',
    name: '定時更新',
    price: 15000,
    duration: 15,
    clickIncrease: 25,
    description: '系統每天自動幫你更新，省時省力。',
  },
  URGENT_TAG: {
    id: 'ADDON_COMPUTER_URGENT_TAG',
    name: '加急標籤',
    price: 15000,
    duration: 30,
    clickIncrease: 85,
    description: '專屬急租列表，獲得更多瀏覽量。',
  },
  FEATURED: {
    id: 'ADDON_COMPUTER_FEATURED',
    name: '精選推薦',
    price: 150000,
    duration: 30,
    clickIncrease: 280,
    description: '物件列表及推薦區雙重曝光，捕獲網友的第一眼球。',
  },
};

// 產品配置類型
export interface ProductConfig {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  duration?: number;
  quantity?: number;
  unitPrice?: number;
  clickIncrease?: number;
  description?: string;
  features?: string[];
}

export const ADDON_MOBILE = {
  TOP: {
    id: 'ADDON_MOBILE_TOP',
    name: '行動版置頂',
    price: 40000,
    duration: 30,
    clickIncrease: 150,
    description: '物件固定排在一般物件前，並帶醒目"頂"標籤。',
  },
  FEATURED: {
    id: 'ADDON_MOBILE_FEATURED',
    name: '行動版精選推薦',
    price: 150000,
    duration: 30,
    clickIncrease: 280,
    description: '物件固定排在列表頁頂部6個廣告，並帶醒目"頂"標籤。',
  },
};

const ALL_PRODUCTS: ProductConfig[] = [
  ...Object.values(RESIDENTIAL_LISTING_PLANS),
  ...Object.values(RESIDENTIAL_PACKAGES),
  ...Object.values(COMMERCIAL_PACKAGES),
  ...Object.values(SALE_PLANS),
  ...Object.values(SALE_PACKAGES),
  ...Object.values(ADDON_COMPUTER),
  ...Object.values(ADDON_MOBILE),
];

export function getProductConfig(productId: string): ProductConfig | undefined {
  return ALL_PRODUCTS.find((p) => p.id === productId);
}

export function getProductPrice(productId: string): number {
  return getProductConfig(productId)?.price ?? 0;
}

