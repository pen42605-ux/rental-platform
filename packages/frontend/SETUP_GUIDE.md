# 房地產平台快速安裝指南

## 已安裝的套件清單

### 核心框架
- ✅ Next.js 14.0.4
- ✅ React 18.2.0
- ✅ TypeScript 5.3.3

### 樣式與 UI
- ✅ Tailwind CSS 3.4.0
- ✅ shadcn/ui 相關套件
  - class-variance-authority
  - lucide-react
  - tailwind-merge
  - tailwindcss-animate
- ✅ Framer Motion 10.18.0

### 地圖功能
- ✅ Leaflet 1.9.4
- ✅ React Leaflet 4.2.1
- ✅ @types/leaflet 1.9.21

### 狀態管理與工具
- ✅ Zustand 4.5.7
- ✅ Axios 1.13.2
- ✅ clsx 2.1.1
- ✅ date-fns 3.6.0

### UI 增強
- ✅ @headlessui/react 1.7.19
- ✅ @heroicons/react 2.2.0
- ✅ React Dropzone 14.3.8
- ✅ React Hot Toast 2.6.0

### 監控與錯誤追蹤
- ✅ @sentry/nextjs 7.120.4

## 已建立的檔案結構

```
packages/frontend/
├── components.json                    # shadcn/ui 配置
├── ARCHITECTURE.md                    # 架構文檔
├── README.md                          # 專案說明
├── SETUP_GUIDE.md                     # 本文件
│
├── src/
│   ├── components/
│   │   ├── ui/                       # shadcn/ui 組件
│   │   │   ├── button.tsx           ✅
│   │   │   ├── card.tsx             ✅
│   │   │   ├── input.tsx            ✅
│   │   │   ├── label.tsx            ✅
│   │   │   ├── select.tsx           ✅
│   │   │   ├── textarea.tsx         ✅
│   │   │   ├── badge.tsx            ✅
│   │   │   └── dialog.tsx           ✅
│   │   │
│   │   ├── features/                 # 功能組件目錄
│   │   │   ├── property/            ✅
│   │   │   ├── search/              ✅
│   │   │   ├── user/                ✅
│   │   │   ├── payment/             ✅
│   │   │   ├── map/                 ✅
│   │   │   └── admin/               ✅
│   │   │
│   │   └── shared/                   # 共用組件目錄
│   │       ├── forms/               ✅
│   │       ├── layout/              ✅
│   │       └── navigation/          ✅
│   │
│   ├── hooks/                        # 自訂 Hooks
│   │   ├── useAuth.ts               ✅
│   │   └── useProperty.ts           ✅
│   │
│   ├── services/                     # 服務層
│   │   └── api.ts                   ✅
│   │
│   ├── types/                        # TypeScript 型別
│   │   ├── index.ts                 ✅
│   │   ├── property.ts              ✅
│   │   └── user.ts                  ✅
│   │
│   ├── constants/                    # 常數定義
│   │   ├── property.ts              ✅
│   │   └── cities.ts                ✅
│   │
│   ├── contexts/                     # React Context ✅
│   ├── utils/                        # 工具函數 ✅
│   │
│   └── lib/
│       └── utils.ts                  # 已更新支援 tailwind-merge ✅
```

## 環境配置

### 1. 環境變數

創建 `.env.local` 檔案（或使用 `env.example` 作為模板）：

```env
# API 設定
NEXT_PUBLIC_API_URL=http://localhost:4000/api

# 地圖設定
NEXT_PUBLIC_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png

# Sentry (選填)
NEXT_PUBLIC_SENTRY_DSN=

# Facebook 登入 (選填)
NEXT_PUBLIC_FACEBOOK_APP_ID=
```

### 2. CSS 與主題配置

已配置的檔案：

✅ `tailwind.config.ts` - Tailwind 配置（含 shadcn/ui 主題）
✅ `src/app/globals.css` - 全域樣式（含 CSS 變數）
✅ `postcss.config.js` - PostCSS 配置

### 3. TypeScript 配置

✅ `tsconfig.json` - 已設定路徑別名 `@/*`

## 快速開始

### 1. 安裝依賴（如需重新安裝）

```bash
cd packages/frontend
npm install
```

### 2. 啟動開發伺服器

```bash
npm run dev
```

訪問 [http://localhost:3000](http://localhost:3000)

### 3. 建置專案

```bash
npm run build
```

### 4. 啟動生產環境

```bash
npm start
```

## 使用範例

### 1. 使用 shadcn/ui 組件

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function ExamplePage() {
  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>範例表單</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
            <Button type="submit">送出</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 2. 使用地圖組件

```tsx
import dynamic from 'next/dynamic';

// 動態載入地圖組件（避免 SSR 問題）
const PropertyMap = dynamic(
  () => import('@/components/map/ListingMap'),
  { ssr: false }
);

export default function MapPage() {
  return (
    <div className="h-screen">
      <PropertyMap
        center={[25.033, 121.565]}
        zoom={13}
        properties={[]}
      />
    </div>
  );
}
```

### 3. 使用 API 服務

```tsx
'use client';

import { useEffect, useState } from 'react';
import { api } from '@/services/api';
import { Property } from '@/types';

export default function PropertyList() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const result = await api.searchProperties({
          city: '台北市',
          page: 1,
          limit: 20,
        });
        setProperties(result.data.properties);
      } catch (error) {
        console.error('Failed to fetch properties', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) return <div>載入中...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
```

### 4. 使用自訂 Hooks

```tsx
'use client';

import { useAuth } from '@/hooks/useAuth';
import { usePropertySearch } from '@/hooks/useProperty';

export default function SearchPage() {
  const { user, isAuthenticated } = useAuth();
  const { result, isLoading, search } = usePropertySearch({
    city: '台北市',
    minPrice: 10000,
    maxPrice: 30000,
  });

  const handleSearch = () => {
    search({
      city: '新北市',
      minPrice: 15000,
      maxPrice: 25000,
    });
  };

  return (
    <div>
      <h1>歡迎 {user?.name}</h1>
      <button onClick={handleSearch}>搜尋</button>
      {/* 顯示搜尋結果 */}
    </div>
  );
}
```

## 型別定義使用

### 物件型別

```typescript
import { Property, PropertyType, PropertyStatus } from '@/types';

const property: Property = {
  id: '1',
  title: '台北市大安區優質套房',
  description: '近捷運站，環境優美',
  type: PropertyType.STUDIO,
  status: PropertyStatus.AVAILABLE,
  // ... 其他欄位
};
```

### 搜尋參數型別

```typescript
import { PropertySearchParams } from '@/types';

const searchParams: PropertySearchParams = {
  city: '台北市',
  district: '大安區',
  minPrice: 10000,
  maxPrice: 30000,
  propertyType: [PropertyType.STUDIO, PropertyType.SUITE],
  bedrooms: [1, 2],
  amenities: ['wifi', 'ac', 'elevator'],
  sortBy: 'price',
  sortOrder: 'asc',
  page: 1,
  limit: 20,
};
```

## 常數使用

```typescript
import { PROPERTY_TYPE_LABELS, AMENITY_OPTIONS, TAIWAN_CITIES } from '@/constants';

// 顯示房型標籤
const label = PROPERTY_TYPE_LABELS[PropertyType.STUDIO]; // "獨立套房"

// 渲染設施選項
{AMENITY_OPTIONS.map((amenity) => (
  <Checkbox key={amenity.id} label={amenity.label} icon={amenity.icon} />
))}

// 顯示縣市選單
{TAIWAN_CITIES.map((city) => (
  <option key={city.name} value={city.name}>
    {city.name}
  </option>
))}
```

## 樣式自訂

### 使用 Tailwind 自訂顏色

```tsx
<div className="bg-primary-500 text-white">主要色彩</div>
<div className="bg-secondary-100 text-secondary-900">次要色彩</div>
```

### 使用 CSS 變數

```css
/* 在自訂 CSS 中 */
.my-component {
  background: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  border-radius: var(--radius);
}
```

## 常見問題

### Q: 地圖不顯示？

A: 確保使用動態載入且關閉 SSR：

```tsx
const MapComponent = dynamic(
  () => import('@/components/map/PropertyMap'),
  { ssr: false }
);
```

並且在 `globals.css` 中引入 Leaflet CSS：

```css
@import 'leaflet/dist/leaflet.css';
```

### Q: API 呼叫 401 錯誤？

A: 檢查 token 是否正確設定在 localStorage，並確認 API 端點正確。

### Q: TypeScript 路徑別名不工作？

A: 確認 `tsconfig.json` 中的 `paths` 設定正確：

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Q: Tailwind 樣式不生效？

A: 確認 `tailwind.config.ts` 的 `content` 路徑包含所有組件檔案。

## 下一步

1. ✅ 基礎架構已完成
2. 📝 開始開發功能組件
   - 建立 PropertyCard 組件
   - 建立 SearchBar 組件
   - 建立 FilterPanel 組件
3. 🗺️ 整合地圖功能
4. 🔐 實作認證流程
5. 📱 建立響應式頁面
6. 🧪 撰寫測試

## 支援與文檔

- [完整 README](./README.md)
- [架構文檔](./ARCHITECTURE.md)
- [Next.js 文檔](https://nextjs.org/docs)
- [Tailwind CSS 文檔](https://tailwindcss.com)
- [shadcn/ui 文檔](https://ui.shadcn.com)

---

專案已經準備就緒，可以開始開發！🚀
