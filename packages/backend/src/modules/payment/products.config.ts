/**
 * 產品/方案配置
 * 定義所有可購買的產品、套餐和加值服務
 */

export type ProductType = 'LISTING_AD' | 'PACKAGE' | 'ADDON';
export type ProductCategory = 'RESIDENTIAL' | 'COMMERCIAL' | 'SALE';
export type PaymentMethod = 'CREDIT_CARD' | 'ATM' | 'CVS' | 'WEBATM';

// 單筆刊登方案（住宅類）
export const RESIDENTIAL_LISTING_PLANS = {
  NORMAL: {
    id: 'RESIDENTIAL_NORMAL',
    name: '普通廣告',
    price: 40000, // 400元，以分為單位
    duration: 30, // 30天
    category: 'RESIDENTIAL' as ProductCategory,
    features: [],
  },
  VIP: {
    id: 'RESIDENTIAL_VIP',
    name: '超級VIP廣告',
    price: 78900, // 789元
    originalPrice: 100000, // 原價1000元
    duration: 30,
    category: 'RESIDENTIAL' as ProductCategory,
    features: [
      '首頁、列表頁 "為您精選" 區',
      '手機端優先排序，搶80%房客',
      '始終排在普通廣告前',
      '定時更新排序 5次/天',
      '[優選好屋]入選加權',
      '擁有醒目標識',
      '問答簡訊',
      '享APP精準推播',
      '72小時內無理由修改',
      '24小時內極速退點',
    ],
    clickIncrease: 250, // 提升250%點閱量
  },
  GOLD: {
    id: 'RESIDENTIAL_GOLD',
    name: '黃金曝光廣告',
    price: 128900, // 1,289元
    originalPrice: 250000, // 原價2,500元
    duration: 30,
    category: 'RESIDENTIAL' as ProductCategory,
    features: [
      '首頁、列表頁 "為您精選" 區',
      '手機端優先排序，搶80%房客',
      '始終排在普通廣告前',
      '始終排在列表最前',
      '電腦端優先排序，搶20%房客',
      '定時更新排序 8次/天',
      '[優選好屋]入選加權',
      '擁有醒目標識',
      '問答簡訊',
      '享APP精準推播',
      '72小時內無理由修改',
      '24小時內極速退點',
    ],
    clickIncrease: 450, // 提升450%點閱量
  },
};

// 住宅類套餐
export const RESIDENTIAL_PACKAGES = {
  BEGINNER: {
    id: 'RESIDENTIAL_PACKAGE_BEGINNER',
    name: '新手套餐',
    price: 54000, // 540元
    originalPrice: 90000, // 原價900元
    quantity: 3, // 3筆
    duration: 30, // 30天/筆
    unitPrice: 18000, // 180元/筆
    discount: 5.3, // 5.3折
    category: 'RESIDENTIAL' as ProductCategory,
    canReplace: true, // 可無限次更換物件
    validDays: 30, // 套餐有效期30天
  },
  NORMAL: {
    id: 'RESIDENTIAL_PACKAGE_NORMAL',
    name: '普通套餐',
    price: 108000, // 1,080元
    originalPrice: 180000, // 原價1,800元
    quantity: 6,
    duration: 30,
    unitPrice: 18000, // 180元/筆
    discount: 5.3,
    category: 'RESIDENTIAL' as ProductCategory,
    canReplace: true,
    validDays: 30,
  },
  SUPER: {
    id: 'RESIDENTIAL_PACKAGE_SUPER',
    name: '超級套餐',
    price: 208000, // 2,080元
    originalPrice: 360000, // 原價3,600元
    quantity: 12,
    duration: 30,
    unitPrice: 17333, // 約173元/筆
    discount: 5.3,
    category: 'RESIDENTIAL' as ProductCategory,
    canReplace: true,
    validDays: 30,
  },
  GOLD: {
    id: 'RESIDENTIAL_PACKAGE_GOLD',
    name: '黃金套餐',
    price: 398000, // 3,980元
    originalPrice: 750000, // 原價7,500元
    quantity: 25,
    duration: 30,
    unitPrice: 15920, // 約159元/筆
    discount: 5.3,
    category: 'RESIDENTIAL' as ProductCategory,
    canReplace: true,
    validDays: 30,
  },
};

// 商用類套餐
export const COMMERCIAL_PACKAGES = {
  BEGINNER: {
    id: 'COMMERCIAL_PACKAGE_BEGINNER',
    name: '新手套餐',
    price: 120000, // 1,200元
    originalPrice: 180000, // 原價1,800元
    quantity: 3,
    duration: 90, // 90天/筆
    unitPrice: 40000, // 400元/筆
    discount: 5.0, // 5折
    category: 'COMMERCIAL' as ProductCategory,
    canReplace: true,
    validDays: 30,
  },
  NORMAL: {
    id: 'COMMERCIAL_PACKAGE_NORMAL',
    name: '普通套餐',
    price: 220000, // 2,200元
    originalPrice: 360000, // 原價3,600元
    quantity: 6,
    duration: 90,
    unitPrice: 36667, // 約366元/筆
    discount: 5.0,
    category: 'COMMERCIAL' as ProductCategory,
    canReplace: true,
    validDays: 30,
  },
  SUPER: {
    id: 'COMMERCIAL_PACKAGE_SUPER',
    name: '超級套餐',
    price: 358000, // 3,580元
    originalPrice: 720000, // 原價7,200元
    quantity: 12,
    duration: 90,
    unitPrice: 29833, // 約298元/筆
    discount: 5.0,
    category: 'COMMERCIAL' as ProductCategory,
    canReplace: true,
    validDays: 30,
  },
};

// 出售類方案
export const SALE_PLANS = {
  NORMAL: {
    id: 'SALE_NORMAL',
    name: '普通廣告',
    price: 60000, // 600元
    duration: 90, // 90天
    category: 'SALE' as ProductCategory,
    features: [],
  },
  VIP: {
    id: 'SALE_VIP',
    name: 'VIP廣告',
    price: 150000, // 1,500元
    duration: 90,
    category: 'SALE' as ProductCategory,
    features: [
      '首頁曝光',
      '加強曝光',
      '定時更新 5次',
      '置頂（排在普通廣告前面）',
      '問答簡訊',
    ],
    clickIncrease: 80, // 提高80%點閱量
  },
};

// 出售類套餐
export const SALE_PACKAGES = {
  BEGINNER: {
    id: 'SALE_PACKAGE_BEGINNER',
    name: '新手套餐',
    price: 120000, // 1,200元
    quantity: 3,
    duration: 60, // 60天/筆
    unitPrice: 40000, // 400元/筆
    discount: 7.0, // 7折
    category: 'SALE' as ProductCategory,
    validDays: 60,
  },
  NORMAL: {
    id: 'SALE_PACKAGE_NORMAL',
    name: '普通套餐',
    price: 220000, // 2,200元
    originalPrice: 240000, // 原價2,400元
    quantity: 6,
    duration: 60,
    unitPrice: 36667, // 約366元/筆
    discount: 7.0,
    category: 'SALE' as ProductCategory,
    validDays: 60,
  },
  SUPER: {
    id: 'SALE_PACKAGE_SUPER',
    name: '超級套餐',
    price: 520000, // 5,200元
    originalPrice: 640000, // 原價6,400元
    quantity: 16,
    duration: 60,
    unitPrice: 32500, // 325元/筆
    discount: 7.0,
    category: 'SALE' as ProductCategory,
    validDays: 60,
  },
  GOLD: {
    id: 'SALE_PACKAGE_GOLD',
    name: '黃金套餐',
    price: 980000, // 9,800元
    originalPrice: 1440000, // 原價14,400元
    quantity: 35,
    duration: 60,
    unitPrice: 28000, // 280元/筆
    discount: 7.0,
    category: 'SALE' as ProductCategory,
    validDays: 60,
  },
};

// 加值服務（電腦版）
export const ADDON_COMPUTER = {
  AUTO_UPDATE: {
    id: 'ADDON_COMPUTER_AUTO_UPDATE',
    name: '定時更新',
    price: 15000, // 150元
    duration: 15, // 15天
    clickIncrease: 25, // 提高25%
    description: '系統每天自動幫你更新，省時省力。',
    purchaseCount: 158711,
  },
  URGENT_TAG: {
    id: 'ADDON_COMPUTER_URGENT_TAG',
    name: '加急標籤',
    price: 15000, // 150元
    duration: 30,
    clickIncrease: 85, // 提高85%
    description: '專屬急租列表，獲得更多瀏覽量。',
    purchaseCount: 42504,
  },
  FEATURED: {
    id: 'ADDON_COMPUTER_FEATURED',
    name: '精選推薦',
    price: 150000, // 1,500元
    duration: 30,
    clickIncrease: 280, // 提高280%
    description: '物件列表及推薦區雙重曝光，捕獲網友的第一眼球。',
    purchaseCount: 368792,
  },
};

// 加值服務（移動版）
export const ADDON_MOBILE = {
  TOP: {
    id: 'ADDON_MOBILE_TOP',
    name: '行動版置頂',
    price: 40000, // 400元
    duration: 30,
    clickIncrease: 150, // 提高150%
    description: '物件固定排在一般物件前，並帶醒目"頂"標籤。',
    purchaseCount: 1093459,
  },
  FEATURED: {
    id: 'ADDON_MOBILE_FEATURED',
    name: '行動版精選推薦',
    price: 150000, // 1,500元
    duration: 30,
    clickIncrease: 280, // 提高280%
    description: '物件固定排在列表頁頂部6個廣告，並帶醒目"頂"標籤。',
    purchaseCount: 155722,
  },
};

// 所有產品映射
export const ALL_PRODUCTS = {
  ...RESIDENTIAL_LISTING_PLANS,
  ...RESIDENTIAL_PACKAGES,
  ...COMMERCIAL_PACKAGES,
  ...SALE_PLANS,
  ...SALE_PACKAGES,
  ...ADDON_COMPUTER,
  ...ADDON_MOBILE,
};

// 根據ID獲取產品
export function getProductById(productId: string) {
  return Object.values(ALL_PRODUCTS).find((p) => p.id === productId);
}

// 獲取所有套餐
export function getAllPackages() {
  return {
    residential: Object.values(RESIDENTIAL_PACKAGES),
    commercial: Object.values(COMMERCIAL_PACKAGES),
    sale: Object.values(SALE_PACKAGES),
  };
}

// 獲取所有單筆刊登方案
export function getAllListingPlans() {
  return {
    residential: Object.values(RESIDENTIAL_LISTING_PLANS),
    sale: Object.values(SALE_PLANS),
  };
}

// 獲取所有加值服務
export function getAllAddons() {
  return {
    computer: Object.values(ADDON_COMPUTER),
    mobile: Object.values(ADDON_MOBILE),
  };
}



