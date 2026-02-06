# 591 房地產平台 - 前端專案

## 技術棧

- **Next.js 14** - React 框架 (App Router)
- **TypeScript** - 類型安全
- **Tailwind CSS** - 樣式框架
- **shadcn/ui** - UI 組件庫
- **React Leaflet** - 地圖功能
- **Zustand** - 狀態管理
- **Axios** - HTTP 客戶端
- **Framer Motion** - 動畫庫
- **Sentry** - 錯誤監控

## 快速開始

### 安裝依賴

```bash
npm install
```

### 環境變量

創建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### 啟動開發伺服器

```bash
npm run dev
```

訪問 [http://localhost:3000](http://localhost:3000)

### 建置生產版本

```bash
npm run build
npm run start
```

## 專案結構

```
src/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # 行銷頁面組
│   ├── listing/[id]/             # 物件詳情
│   ├── admin/                    # 管理後台
│   ├── api/                      # API Routes
│   ├── layout.tsx                # 根佈局
│   └── globals.css               # 全局樣式
│
├── components/                   # React 組件
│   ├── ui/                       # shadcn/ui 基礎組件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── label.tsx
│   │   ├── dialog.tsx
│   │   ├── select.tsx
│   │   ├── tabs.tsx
│   │   └── separator.tsx
│   │
│   ├── layout/                   # 佈局組件
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   │
│   ├── listings/                 # 物件組件
│   │   ├── ListingCard.tsx
│   │   ├── FilterSidebar.tsx
│   │   └── Pagination.tsx
│   │
│   ├── map/                      # 地圖組件
│   │   └── ListingMap.tsx
│   │
│   ├── auth/                     # 認證組件
│   │   └── FacebookLoginButton.tsx
│   │
│   └── upload/                   # 上傳組件
│       └── ImageUploader.tsx
│
└── lib/                          # 工具庫
    ├── api.ts                    # API 客戶端
    ├── utils.ts                  # 工具函數
    ├── store.ts                  # 狀態管理
    ├── districts.ts              # 行政區資料
    └── payment-products.ts       # 付款商品
```

## shadcn/ui 組件

### 已安裝的組件

- **Button** - 按鈕組件，支援多種變體和尺寸
- **Card** - 卡片容器，包含 Header、Content、Footer
- **Input** - 輸入框組件
- **Badge** - 徽章組件，用於標籤顯示
- **Label** - 標籤組件，用於表單
- **Dialog** - 對話框/模態框組件
- **Select** - 下拉選單組件
- **Tabs** - 標籤頁組件
- **Separator** - 分隔線組件

### 使用範例

#### Button 使用

```tsx
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <div className="flex gap-2">
      <Button>預設按鈕</Button>
      <Button variant="secondary">次要按鈕</Button>
      <Button variant="outline">外框按鈕</Button>
      <Button variant="ghost">幽靈按鈕</Button>
      <Button size="lg">大按鈕</Button>
      <Button size="sm">小按鈕</Button>
    </div>
  )
}
```

#### Card 使用

```tsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>溫馨套房出租</CardTitle>
        <CardDescription>台北市大安區</CardDescription>
      </CardHeader>
      <CardContent>
        <p>月租 NT$ 15,000</p>
      </CardContent>
    </Card>
  )
}
```

#### Dialog 使用

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function Example() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>開啟對話框</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>確認操作</DialogTitle>
        </DialogHeader>
        <p>您確定要執行此操作嗎？</p>
      </DialogContent>
    </Dialog>
  )
}
```

## 地圖整合 (React Leaflet)

### 基本使用

```tsx
import dynamic from 'next/dynamic'

// 動態導入地圖組件 (避免 SSR 問題)
const ListingMap = dynamic(() => import('@/components/map/ListingMap'), {
  ssr: false,
  loading: () => <div>載入地圖中...</div>
})

export default function MapPage() {
  return (
    <ListingMap
      center={[25.0330, 121.5654]}
      zoom={13}
      listings={[
        { id: 1, lat: 25.0330, lng: 121.5654, title: "溫馨套房" }
      ]}
    />
  )
}
```

## 狀態管理 (Zustand)

### Store 範例

```typescript
// lib/store.ts
import { create } from 'zustand'

interface User {
  id: string
  email: string
  name: string
}

interface AppState {
  user: User | null
  setUser: (user: User | null) => void
  favorites: string[]
  addFavorite: (id: string) => void
  removeFavorite: (id: string) => void
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  favorites: [],
  addFavorite: (id) => set((state) => ({ 
    favorites: [...state.favorites, id] 
  })),
  removeFavorite: (id) => set((state) => ({ 
    favorites: state.favorites.filter(fav => fav !== id) 
  })),
}))
```

### 使用 Store

```tsx
import { useStore } from '@/lib/store'

export default function Component() {
  const { user, favorites, addFavorite } = useStore()
  
  return (
    <div>
      <p>用戶: {user?.name}</p>
      <p>收藏數量: {favorites.length}</p>
      <button onClick={() => addFavorite('123')}>加入收藏</button>
    </div>
  )
}
```

## API 客戶端

### 使用範例

```typescript
import api from '@/lib/api'

// GET 請求
const listings = await api.get('/listings')

// POST 請求
const newListing = await api.post('/listings', {
  title: '溫馨套房',
  price: 15000,
  city: '台北市'
})

// 帶認證的請求
api.setAuthToken('your-jwt-token')
const userProfile = await api.get('/users/me')
```

## 樣式指南

### Tailwind CSS 類別

```tsx
// 卡片樣式
<div className="rounded-2xl shadow-lg border border-secondary-100 p-6 hover:shadow-xl transition-shadow">

// 按鈕樣式
<button className="btn-primary">
  主要按鈕
</button>

// 輸入框樣式
<input className="input" placeholder="請輸入關鍵字" />

// 徽章樣式
<span className="badge-primary">熱門</span>
```

### 自定義顏色

```tsx
// 主色系 (橙色)
<div className="bg-primary-500 text-white">

// 次色系 (藍色)
<div className="bg-secondary-500 text-white">
```

## 工具函數

### cn() - 類別名稱合併

```tsx
import { cn } from '@/lib/utils'

<div className={cn(
  "base-class",
  isActive && "active-class",
  "additional-class"
)} />
```

### formatPrice() - 價格格式化

```tsx
import { formatPrice } from '@/lib/utils'

formatPrice(15000) // "NT$ 15,000"
```

### formatArea() - 面積格式化

```tsx
import { formatArea } from '@/lib/utils'

formatArea(20.5) // "20.5 坪"
```

## 圖片優化

### 使用 Next.js Image

```tsx
import Image from 'next/image'

<Image
  src="/property.jpg"
  alt="物件照片"
  width={800}
  height={600}
  className="rounded-xl"
  priority
/>
```

## 效能優化

### 代碼分割

```tsx
import dynamic from 'next/dynamic'

// 動態導入重量級組件
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>載入中...</div>
})
```

### 圖片懶加載

```tsx
<Image
  src="/image.jpg"
  alt="描述"
  width={800}
  height={600}
  loading="lazy"
/>
```

## 常見問題

### 地圖不顯示

確保動態導入地圖組件並禁用 SSR：

```tsx
const Map = dynamic(() => import('./Map'), { ssr: false })
```

### Tailwind 樣式不生效

檢查 `tailwind.config.ts` 的 content 路徑是否正確。

### API 請求失敗

檢查 `.env.local` 的 `NEXT_PUBLIC_API_URL` 是否正確設定。

## 部署

### Vercel 部署

1. 連接 GitHub 倉庫
2. 設定環境變量
3. 自動部署

### 環境變量設定

在 Vercel Dashboard 設定：
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_SENTRY_DSN`

## 相關資源

- [Next.js 文件](https://nextjs.org/docs)
- [Tailwind CSS 文件](https://tailwindcss.com/docs)
- [shadcn/ui 文件](https://ui.shadcn.com)
- [React Leaflet 文件](https://react-leaflet.js.org)
- [Zustand 文件](https://zustand-demo.pmnd.rs)

## 授權

MIT License
