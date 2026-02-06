# 591 租屋平台 - 前端專案

這是一個使用 Next.js 14、Tailwind CSS 和 shadcn/ui 建立的現代化房地產租賃平台前端專案。

## 技術棧

- **框架**: Next.js 14 (App Router)
- **樣式**: Tailwind CSS + shadcn/ui
- **狀態管理**: Zustand
- **地圖**: React Leaflet
- **HTTP 客戶端**: Axios
- **動畫**: Framer Motion
- **語言**: TypeScript

## 專案結構

```
packages/frontend/
├── src/
│   ├── app/                      # Next.js App Router 頁面
│   │   ├── (auth)/              # 認證相關頁面
│   │   │   ├── login/           # 登入頁面
│   │   │   └── register/        # 註冊頁面
│   │   ├── admin/               # 管理後台
│   │   │   ├── listings/        # 房源管理
│   │   │   ├── users/           # 用戶管理
│   │   │   └── audit/           # 審核日誌
│   │   ├── listing/             # 房源詳情頁
│   │   │   └── [id]/            # 動態路由
│   │   ├── create/              # 發布房源
│   │   ├── pricing/             # 方案定價
│   │   ├── checkout/            # 結帳流程
│   │   ├── orders/              # 訂單管理
│   │   ├── community/           # 社群功能
│   │   ├── news/                # 租屋新聞
│   │   ├── interior-design/     # 裝潢服務
│   │   ├── api/                 # API Routes
│   │   ├── layout.tsx           # 全局佈局
│   │   ├── page.tsx             # 首頁
│   │   └── globals.css          # 全局樣式
│   │
│   ├── components/              # React 組件
│   │   ├── ui/                  # shadcn/ui 基礎組件
│   │   │   ├── button.tsx       # 按鈕組件
│   │   │   ├── card.tsx         # 卡片組件
│   │   │   ├── input.tsx        # 輸入框組件
│   │   │   ├── badge.tsx        # 徽章組件
│   │   │   └── select.tsx       # 下拉選單組件
│   │   │
│   │   ├── features/            # 功能組件
│   │   │   ├── PropertyCard.tsx         # 房源卡片
│   │   │   ├── SearchBar.tsx            # 搜尋列
│   │   │   └── PropertyFilters.tsx      # 篩選器
│   │   │
│   │   ├── layout/              # 佈局組件
│   │   │   ├── Header.tsx       # 頁首
│   │   │   └── Footer.tsx       # 頁尾
│   │   │
│   │   ├── listings/            # 房源相關組件
│   │   │   ├── ListingCard.tsx  # 房源卡片
│   │   │   ├── FilterSidebar.tsx # 篩選側邊欄
│   │   │   └── Pagination.tsx   # 分頁組件
│   │   │
│   │   ├── map/                 # 地圖相關組件
│   │   │   └── ListingMap.tsx   # 房源地圖
│   │   │
│   │   ├── auth/                # 認證相關組件
│   │   │   └── FacebookLoginButton.tsx
│   │   │
│   │   └── upload/              # 上傳相關組件
│   │       └── ImageUploader.tsx
│   │
│   ├── lib/                     # 工具函數庫
│   │   ├── api.ts               # API 客戶端配置
│   │   ├── utils.ts             # 通用工具函數
│   │   ├── store.ts             # Zustand 狀態管理
│   │   ├── districts.ts         # 台灣行政區資料
│   │   └── payment-products.ts  # 付費方案配置
│   │
│   ├── hooks/                   # 自訂 React Hooks
│   │   ├── useAuth.ts           # 認證相關 Hook
│   │   ├── useProperties.ts     # 房源相關 Hook
│   │   └── index.ts             # Hooks 統一導出
│   │
│   ├── services/                # API 服務層
│   │   ├── property.service.ts  # 房源 API 服務
│   │   ├── auth.service.ts      # 認證 API 服務
│   │   └── index.ts             # Services 統一導出
│   │
│   ├── types/                   # TypeScript 類型定義
│   │   └── index.ts             # 全局類型定義
│   │
│   └── constants/               # 常量配置
│       └── index.ts             # 全局常量
│
├── public/                      # 靜態資源
│   ├── images/                  # 圖片資源
│   └── icons/                   # 圖標資源
│
├── components.json              # shadcn/ui 配置
├── tailwind.config.ts           # Tailwind CSS 配置
├── next.config.js               # Next.js 配置
├── tsconfig.json                # TypeScript 配置
├── postcss.config.js            # PostCSS 配置
└── package.json                 # 專案依賴
```

## 主要功能模組

### 1. 房源管理
- **房源列表**: 顯示所有可租賃房源
- **房源詳情**: 展示房源詳細資訊、圖片、地圖位置
- **房源搜尋**: 支援關鍵字、地區、價格、房型等多維度搜尋
- **房源篩選**: 提供豐富的篩選條件
- **發布房源**: 房東可以發布新房源

### 2. 用戶系統
- **註冊/登入**: 支援傳統註冊、Facebook 登入
- **角色管理**: 區分租客、房東、管理員
- **個人資料**: 用戶可以管理個人資料

### 3. 地圖功能
- **互動地圖**: 使用 React Leaflet 顯示房源位置
- **地圖搜尋**: 在地圖上瀏覽和搜尋房源
- **位置標記**: 標記房源精確位置

### 4. 付費方案
- **方案選擇**: 提供多種刊登方案
- **在線支付**: 整合第三方支付（ECPay、NewebPay、LinePay）
- **訂單管理**: 查看和管理訂單記錄

### 5. 管理後台
- **房源審核**: 管理員審核房源
- **用戶管理**: 管理平台用戶
- **審核日誌**: 查看操作記錄

## 安裝與執行

### 安裝依賴

```bash
cd packages/frontend
npm install
```

### 環境變數

在專案根目錄創建 `.env.local` 文件：

```env
# API 地址
NEXT_PUBLIC_API_URL=http://localhost:3001

# Facebook App ID (可選)
NEXT_PUBLIC_FACEBOOK_APP_ID=your_facebook_app_id

# 站點 URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Sentry (可選)
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
```

### 開發模式

```bash
npm run dev
```

訪問 http://localhost:3000

### 生產構建

```bash
npm run build
npm start
```

## 核心組件使用指南

### 使用 shadcn/ui 組件

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>範例卡片</CardTitle>
      </CardHeader>
      <CardContent>
        <Input placeholder="輸入內容" />
        <Button>提交</Button>
      </CardContent>
    </Card>
  );
}
```

### 使用自訂 Hook

```tsx
import { useProperties } from '@/hooks';

export default function PropertiesPage() {
  const { properties, loading, error, pagination } = useProperties(
    { city: '台北市' },
    1,
    12
  );

  if (loading) return <div>載入中...</div>;
  if (error) return <div>錯誤: {error}</div>;

  return (
    <div>
      {properties.map(property => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  );
}
```

### 使用 API 服務

```tsx
import { propertyService } from '@/services';

async function createProperty(data: Partial<Property>) {
  try {
    const property = await propertyService.createProperty(data);
    console.log('房源創建成功', property);
  } catch (error) {
    console.error('創建失敗', error);
  }
}
```

## 樣式設計

### Tailwind CSS 工具類

```tsx
// 使用自訂主題色彩
<div className="bg-primary-500 text-white">
<div className="bg-secondary-100 text-secondary-900">

// 使用自訂動畫
<div className="animate-fade-in">
<div className="animate-slide-up">

// 響應式設計
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### 使用 cn() 函數合併類名

```tsx
import { cn } from '@/lib/utils';

<button className={cn(
  'base-class',
  isActive && 'active-class',
  className // 外部傳入的 className
)}>
```

## 地圖整合

### 使用 React Leaflet

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
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={MAP_DEFAULT_CENTER}>
        <Popup>房源位置</Popup>
      </Marker>
    </MapContainer>
  );
}
```

## 狀態管理

使用 Zustand 進行全局狀態管理：

```typescript
// lib/store.ts
import { create } from 'zustand';

interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

## 部署

### Vercel 部署

1. 將專案推送到 GitHub
2. 在 Vercel 中導入專案
3. 設置環境變數
4. 部署

### Docker 部署

```bash
docker build -t rental-frontend .
docker run -p 3000:3000 rental-frontend
```

## 效能優化建議

1. **圖片優化**: 使用 Next.js Image 組件
2. **代碼分割**: 使用動態導入 (dynamic import)
3. **快取策略**: 合理使用 SWR 或 React Query
4. **SEO 優化**: 使用 Next.js Metadata API

## 開發規範

1. **TypeScript**: 使用嚴格模式，定義清晰的類型
2. **組件設計**: 遵循單一職責原則
3. **命名規範**: 使用有意義的變數名和函數名
4. **註釋**: 為複雜邏輯添加註釋
5. **測試**: 編寫單元測試和集成測試

## 常見問題

### Q: 地圖不顯示？
A: 確保在客戶端組件中使用 'use client' 指令，並正確導入 leaflet.css

### Q: API 請求失敗？
A: 檢查 NEXT_PUBLIC_API_URL 環境變數是否正確配置

### Q: 樣式不生效？
A: 確認 Tailwind CSS 配置正確，檢查 content 路徑

## 貢獻指南

歡迎提交 Issue 和 Pull Request！

## 授權

MIT License
