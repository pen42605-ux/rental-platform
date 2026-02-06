# 房地產平台設置指南

## 🚀 快速開始

### 前置要求

- Node.js 18+ 
- npm 或 yarn
- PostgreSQL 資料庫

### 1. 安裝依賴

```bash
# 安裝根目錄和所有工作區的依賴
npm install
```

### 2. 環境變數設置

複製 `env.example` 到 `.env` 並填入相關配置：

```bash
cp env.example .env
```

必須設置的環境變數：

```env
# 資料庫
DATABASE_URL="postgresql://user:password@localhost:5432/rental_db"

# JWT
JWT_SECRET="your-secret-key"

# API URL
NEXT_PUBLIC_API_URL="http://localhost:8000"

# Facebook OAuth (選用)
FACEBOOK_APP_ID="your-facebook-app-id"
FACEBOOK_APP_SECRET="your-facebook-app-secret"

# Sentry (選用)
SENTRY_DSN="your-sentry-dsn"
```

### 3. 資料庫設置

```bash
# 生成 Prisma Client
npm run db:generate

# 執行資料庫遷移
npm run db:migrate

# (選用) 填充種子資料
npm run db:seed
```

### 4. 啟動開發伺服器

```bash
# 同時啟動前端和後端
npm run dev

# 或分別啟動
npm run dev:frontend  # 前端運行在 http://localhost:3000
npm run dev:backend   # 後端運行在 http://localhost:8000
```

## 📦 已安裝的套件

### 前端核心

✅ **Next.js 14** - React 框架 (App Router)
✅ **TypeScript** - 類型安全
✅ **Tailwind CSS** - 工具優先的 CSS 框架

### UI 組件庫

✅ **shadcn/ui** - 高品質 React 組件
  - Button, Card, Input, Select
  - Dialog, Dropdown Menu, Tabs
  - Badge, Avatar, Label
  - Slider, Calendar, Checkbox
  - Radio Group, Form, Textarea
  - Separator

### 地圖與位置

✅ **Leaflet** - 開源地圖庫
✅ **React Leaflet** - Leaflet 的 React 組件

### 狀態管理與資料獲取

✅ **Zustand** - 輕量級狀態管理
✅ **Axios** - HTTP 客戶端

### UI/UX 增強

✅ **Framer Motion** - 動畫庫
✅ **React Hot Toast** - 通知提示
✅ **React Dropzone** - 檔案上傳
✅ **Lucide React** - 圖標庫

### 工具函式

✅ **date-fns** - 日期處理
✅ **clsx** - 條件類名工具

## 🏗️ 專案結構

```
packages/frontend/
├── src/
│   ├── app/                    # Next.js App Router 頁面
│   ├── components/             # React 組件
│   │   ├── ui/                # shadcn/ui 基礎組件
│   │   ├── layout/            # 佈局組件
│   │   ├── listings/          # 物件相關組件
│   │   ├── map/               # 地圖組件
│   │   ├── search/            # 搜尋組件
│   │   ├── forms/             # 表單組件
│   │   ├── auth/              # 認證組件
│   │   ├── upload/            # 上傳組件
│   │   ├── common/            # 通用組件
│   │   └── features/          # 功能組件
│   ├── hooks/                 # 自定義 React Hooks
│   ├── lib/                   # 工具函式
│   ├── types/                 # TypeScript 類型定義
│   └── styles/                # 樣式文件
├── public/                    # 靜態資源
└── components.json            # shadcn/ui 配置
```

## 🎨 使用 shadcn/ui 組件

### 添加新組件

```bash
cd packages/frontend
npx shadcn@latest add [component-name]
```

範例：
```bash
npx shadcn@latest add tooltip
npx shadcn@latest add popover
npx shadcn@latest add sheet
```

### 使用組件

```tsx
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function MyComponent() {
  return (
    <Card>
      <Button>點擊我</Button>
    </Card>
  );
}
```

## 🗺️ 使用地圖功能

### 基本地圖組件

已經有一個基礎的 `ListingMap` 組件在 `src/components/map/ListingMap.tsx`。

### 使用範例

```tsx
import dynamic from 'next/dynamic';

// 動態導入以避免 SSR 問題
const ListingMap = dynamic(
  () => import('@/components/map/ListingMap').then(mod => mod.ListingMap),
  { ssr: false }
);

export function MapPage() {
  return (
    <div className="h-screen">
      <ListingMap 
        center={[25.0330, 121.5654]} // 台北市
        zoom={13}
      />
    </div>
  );
}
```

### 添加 Leaflet CSS

確保在 `layout.tsx` 中導入 Leaflet CSS：

```tsx
import 'leaflet/dist/leaflet.css';
```

## 🎯 核心功能使用

### 1. 認證系統

```tsx
import { useAuth } from '@/hooks';

function LoginComponent() {
  const { login, isAuthenticated, user } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ email, password });
      // 登入成功
    } catch (error) {
      // 處理錯誤
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <p>歡迎, {user?.name}</p>
      ) : (
        <Button onClick={handleLogin}>登入</Button>
      )}
    </>
  );
}
```

### 2. 物件搜尋

```tsx
import { useListings } from '@/hooks';

function ListingsPage() {
  const { listings, isLoading, total } = useListings({
    filters: {
      city: 'taipei',
      minPrice: 10000,
      maxPrice: 30000,
    },
    page: 1,
    pageSize: 20,
  });

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <p>找到 {total} 個物件</p>
      {listings.map(listing => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
```

### 3. 收藏功能

```tsx
import { FavoriteButton } from '@/components/features/FavoriteButton';

function ListingDetail({ listingId }) {
  return (
    <div>
      <FavoriteButton 
        listingId={listingId}
        size="lg"
        showLabel
      />
    </div>
  );
}
```

### 4. 搜尋欄

```tsx
import { SearchBar } from '@/components/search/SearchBar';

function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <SearchBar 
        onSearch={(params) => {
          console.log('搜尋參數:', params);
        }}
      />
    </div>
  );
}
```

## 🎨 自定義主題

編輯 `tailwind.config.ts` 來自定義顏色、字體等：

```ts
theme: {
  extend: {
    colors: {
      primary: {
        500: '#e97020', // 主色調
        // ... 其他色階
      },
    },
  },
}
```

shadcn/ui 組件使用 CSS 變數，可在 `globals.css` 中調整：

```css
:root {
  --primary: 25 95% 53%;
  --secondary: 210 50% 60%;
  /* ... */
}
```

## 📝 開發建議

### 1. 頁面開發順序

1. ✅ 首頁 (Hero + 搜尋欄 + 精選物件)
2. ✅ 搜尋結果頁 (列表/地圖切換)
3. ✅ 物件詳情頁
4. ✅ 用戶儀表板
5. ✅ 物件刊登表單

### 2. API 整合

確保後端 API 在 `http://localhost:8000` 運行，然後在前端使用：

```tsx
import { api } from '@/lib/api';

const response = await api.get('/listings');
```

### 3. 類型安全

使用已定義的 TypeScript 類型：

```tsx
import type { Listing, SearchFilters, User } from '@/types';

const filters: SearchFilters = {
  city: 'taipei',
  minPrice: 10000,
};
```

### 4. 響應式設計

使用 Tailwind CSS 的響應式工具類：

```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* 內容 */}
</div>
```

## 🔧 故障排除

### 問題：地圖不顯示

**解決方案**：
1. 確保已導入 Leaflet CSS
2. 使用 `dynamic` 導入避免 SSR 問題
3. 設置容器高度

```tsx
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';

const Map = dynamic(
  () => import('@/components/map/ListingMap'),
  { ssr: false }
);
```

### 問題：shadcn/ui 組件樣式不正確

**解決方案**：
1. 確保 Tailwind CSS 已正確配置
2. 檢查 `components.json` 配置
3. 重新生成組件：`npx shadcn@latest init`

### 問題：API 請求失敗

**解決方案**：
1. 確認後端服務正在運行
2. 檢查 `NEXT_PUBLIC_API_URL` 環境變數
3. 查看瀏覽器控制台的 CORS 錯誤

## 📚 參考資料

- [Next.js 文檔](https://nextjs.org/docs)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)
- [shadcn/ui 文檔](https://ui.shadcn.com)
- [React Leaflet 文檔](https://react-leaflet.js.org)
- [Zustand 文檔](https://zustand-demo.pmnd.rs)

## 🚀 部署

### Vercel 部署 (推薦用於前端)

```bash
# 安裝 Vercel CLI
npm install -g vercel

# 部署
cd packages/frontend
vercel
```

### Docker 部署

```bash
# 建構映像
docker build -t rental-platform .

# 運行容器
docker run -p 3000:3000 rental-platform
```

---

**祝你開發愉快！** 🎉

如有問題，請參考 `PROJECT_ARCHITECTURE.md` 或查看現有程式碼範例。
