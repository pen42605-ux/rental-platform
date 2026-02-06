# 591 租屋平台 - 前端快速開始指南

## 快速啟動步驟

### 1. 安裝依賴

```bash
cd packages/frontend
npm install
```

### 2. 配置環境變數

在 `packages/frontend` 目錄下創建 `.env.local` 文件：

```env
# 必填：後端 API 地址
NEXT_PUBLIC_API_URL=http://localhost:3001

# 可選：站點 URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# 可選：Facebook 登入
NEXT_PUBLIC_FACEBOOK_APP_ID=

# 可選：錯誤追蹤
NEXT_PUBLIC_SENTRY_DSN=
```

### 3. 啟動開發服務器

```bash
npm run dev
```

訪問 http://localhost:3000

## 已安裝的套件

### 核心框架
- ✅ Next.js 14 (App Router)
- ✅ React 18
- ✅ TypeScript 5

### UI 相關
- ✅ Tailwind CSS 3.4
- ✅ shadcn/ui 組件庫
  - Button, Card, Input, Badge, Select
- ✅ Headless UI
- ✅ Heroicons
- ✅ Framer Motion (動畫)
- ✅ Lucide React (圖標)

### 功能套件
- ✅ React Leaflet (地圖)
- ✅ Leaflet
- ✅ Zustand (狀態管理)
- ✅ Axios (HTTP 客戶端)
- ✅ React Hot Toast (通知)
- ✅ React Dropzone (文件上傳)
- ✅ date-fns (日期處理)
- ✅ clsx + tailwind-merge (樣式合併)

### 開發工具
- ✅ TypeScript
- ✅ ESLint
- ✅ PostCSS
- ✅ Autoprefixer

## 專案結構一覽

```
packages/frontend/
├── src/
│   ├── app/                 # Next.js 頁面
│   ├── components/
│   │   ├── ui/             # shadcn/ui 基礎組件 ✅
│   │   ├── features/       # 業務功能組件 ✅
│   │   ├── layout/         # 佈局組件
│   │   ├── listings/       # 房源相關組件
│   │   ├── map/            # 地圖組件
│   │   ├── auth/           # 認證組件
│   │   └── upload/         # 上傳組件
│   ├── lib/                # 工具函數 ✅
│   ├── hooks/              # 自訂 Hooks ✅
│   ├── services/           # API 服務 ✅
│   ├── types/              # TypeScript 類型 ✅
│   └── constants/          # 常量配置 ✅
├── public/                 # 靜態資源
├── components.json         # shadcn/ui 配置 ✅
├── tailwind.config.ts      # Tailwind 配置 ✅
└── package.json
```

## 可用的組件

### shadcn/ui 基礎組件
已創建並可直接使用：

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select } from '@/components/ui/select';

// 使用示例
<Card>
  <CardHeader>
    <CardTitle>標題</CardTitle>
  </CardHeader>
  <CardContent>
    <Input placeholder="輸入內容" />
    <Button>提交</Button>
  </CardContent>
</Card>
```

### 功能組件
房地產平台專用組件：

```tsx
import { PropertyCard } from '@/components/features/PropertyCard';
import { SearchBar } from '@/components/features/SearchBar';
import { PropertyFilters } from '@/components/features/PropertyFilters';

// 使用示例
<SearchBar />
<PropertyFilters onFiltersChange={(filters) => console.log(filters)} />
<PropertyCard property={propertyData} />
```

## 可用的 Hooks

### 認證相關
```tsx
import { useAuth } from '@/hooks';

const { user, login, logout, isAuthenticated, isLandlord } = useAuth();

// 登入
await login('email@example.com', 'password');

// 檢查認證狀態
if (isAuthenticated) {
  console.log('已登入', user);
}

// 登出
logout();
```

### 房源相關
```tsx
import { useProperties, useProperty } from '@/hooks';

// 獲取房源列表
const { properties, loading, error, pagination } = useProperties(
  { city: '台北市' },  // 篩選條件
  1,                    // 頁碼
  12                    // 每頁數量
);

// 獲取單個房源
const { property, loading, error } = useProperty('property-id');
```

## 可用的服務

### 房源服務
```tsx
import { propertyService } from '@/services';

// 獲取房源列表
const properties = await propertyService.getProperties(filters, page, limit);

// 獲取房源詳情
const property = await propertyService.getProperty(id);

// 創建房源
const newProperty = await propertyService.createProperty(data);

// 更新房源
const updated = await propertyService.updateProperty(id, data);

// 刪除房源
await propertyService.deleteProperty(id);

// 搜尋房源
const results = await propertyService.searchProperties(query, filters);

// 上傳圖片
const imageUrls = await propertyService.uploadImages(files);
```

### 認證服務
```tsx
import { authService } from '@/services';

// 登入
const { token, user } = await authService.login(email, password);

// 註冊
const { token, user } = await authService.register(email, password, name, role);

// 獲取當前用戶
const user = await authService.getCurrentUser();

// 更新資料
const updated = await authService.updateProfile(data);

// 修改密碼
await authService.changePassword(oldPassword, newPassword);
```

## 工具函數

### 格式化函數
```tsx
import { formatPrice, formatArea, formatDate } from '@/lib/utils';

formatPrice(15000);           // NT$15,000
formatArea(20);               // 20 坪
formatDate('2024-01-01');     // 2024年1月1日
```

### 樣式合併
```tsx
import { cn } from '@/lib/utils';

<div className={cn(
  'base-class',
  isActive && 'active-class',
  className
)} />
```

## 常用常量

```tsx
import {
  CITIES,              // 台灣縣市列表
  PROPERTY_TYPES,      // 房型選項
  PRICE_RANGES,        // 價格範圍
  AREA_RANGES,         // 面積範圍
  AMENITIES,           // 設施選項
  MAP_DEFAULT_CENTER,  // 地圖預設中心 (台北)
  MAP_DEFAULT_ZOOM,    // 地圖預設縮放
} from '@/constants';
```

## 類型定義

### 主要類型
```tsx
import {
  User,
  UserRole,
  Property,
  PropertyType,
  PropertyStatus,
  SearchFilters,
  PaginatedResponse,
  ApiResponse,
} from '@/types';
```

## 使用地圖

### 基本地圖
```tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { MAP_DEFAULT_CENTER, MAP_DEFAULT_ZOOM } from '@/constants';

export function PropertyMap() {
  return (
    <MapContainer
      center={MAP_DEFAULT_CENTER}
      zoom={MAP_DEFAULT_ZOOM}
      className="h-96 rounded-xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap'
      />
      <Marker position={MAP_DEFAULT_CENTER}>
        <Popup>標記位置</Popup>
      </Marker>
    </MapContainer>
  );
}
```

**重要**: 地圖組件必須使用 `'use client'` 指令！

## 常見使用場景

### 1. 創建新頁面

```tsx
// app/my-page/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '我的頁面',
  description: '頁面描述',
};

export default function MyPage() {
  return (
    <div>
      <h1>我的頁面</h1>
    </div>
  );
}
```

### 2. 創建新組件

```tsx
// components/MyComponent.tsx
'use client'; // 如果需要客戶端交互

import { Button } from '@/components/ui/button';

interface MyComponentProps {
  title: string;
}

export function MyComponent({ title }: MyComponentProps) {
  return (
    <div>
      <h2>{title}</h2>
      <Button>點擊</Button>
    </div>
  );
}
```

### 3. 添加新的 API 服務

```tsx
// services/my.service.ts
import { api } from '@/lib/api';

export const myService = {
  async getData(): Promise<any> {
    const response = await api.get('/api/my-endpoint');
    return response.data;
  },
};
```

### 4. 創建新的 Hook

```tsx
// hooks/useMyData.ts
import { useState, useEffect } from 'react';

export function useMyData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 獲取數據邏輯
      setLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  return { data, loading };
}
```

## 樣式指南

### Tailwind 常用類名

```tsx
// 佈局
<div className="container mx-auto px-4">
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
<div className="flex items-center justify-between">

// 間距
<div className="p-4 m-4 space-y-4 space-x-4">

// 顏色（使用自訂主題）
<div className="bg-primary-500 text-white">
<div className="bg-secondary-100 text-secondary-900">

// 陰影與圓角
<div className="shadow-lg rounded-xl">

// 響應式
<div className="hidden md:block">
<div className="text-sm md:text-base lg:text-lg">

// 動畫
<div className="animate-fade-in">
<div className="hover:scale-105 transition-transform">
```

## 開發建議

### 1. TypeScript 最佳實踐
- 為所有組件定義 Props 接口
- 避免使用 `any`，使用具體類型
- 利用類型推斷，不過度標註

### 2. 組件設計原則
- 單一職責：一個組件做一件事
- 可復用：抽離通用邏輯
- 易測試：避免過度耦合

### 3. 性能優化
- 使用 `React.memo` 避免不必要渲染
- 圖片使用 `next/image`
- 大列表使用虛擬滾動

### 4. 代碼風格
- 使用 ESLint 檢查代碼
- 統一的命名規範
- 添加必要的註釋

## 調試技巧

### 1. React DevTools
安裝瀏覽器擴展查看組件樹

### 2. 網絡請求
使用瀏覽器開發者工具的 Network 標籤

### 3. 日誌輸出
```tsx
console.log('Debug:', data);
console.table(arrayData);
console.error('Error:', error);
```

### 4. Source Maps
生產環境錯誤可通過 Sentry 追蹤

## 下一步

### 學習資源
- 📚 [Next.js 官方教程](https://nextjs.org/learn)
- 🎨 [Tailwind CSS 文檔](https://tailwindcss.com/docs)
- 🧩 [shadcn/ui 示例](https://ui.shadcn.com/examples)
- 🗺️ [React Leaflet 示例](https://react-leaflet.js.org/docs/example-popup-marker/)

### 推薦開發順序
1. ✅ 熟悉現有組件
2. ✅ 了解專案結構
3. 🔨 實現房源列表頁
4. 🔨 實現房源詳情頁
5. 🔨 實現搜尋功能
6. 🔨 實現地圖整合
7. 🔨 實現用戶中心
8. 🔨 實現房源發布
9. 🔨 實現付費功能
10. 🔨 優化與測試

## 常見問題

### Q: 如何添加新的 shadcn/ui 組件？
```bash
npx shadcn-ui@latest add [component-name]
```

### Q: 如何處理環境變數？
在 `.env.local` 中添加，使用 `NEXT_PUBLIC_` 前綴的變數可在客戶端訪問。

### Q: 如何處理圖片？
使用 `next/image` 組件，圖片放在 `public` 目錄下。

### Q: 如何處理 API 錯誤？
API 客戶端已配置攔截器，會自動處理常見錯誤並顯示通知。

## 幫助與支援

遇到問題？
1. 📖 查看完整文檔：`FRONTEND_ARCHITECTURE.md`
2. 🔍 搜尋現有代碼找到類似實現
3. 💬 詢問團隊成員
4. 🐛 提交 Issue

---

**快速開始完成！** 現在可以開始開發了 🚀
