# 房地產平台前端專案

這是一個基於 Next.js 14 + Tailwind CSS + shadcn/ui 的現代化房地產平台前端專案，類似 591 租屋網。

## 技術棧

- **框架**: Next.js 14 (App Router)
- **樣式**: Tailwind CSS 3.4
- **UI 組件**: shadcn/ui
- **地圖**: React Leaflet
- **狀態管理**: Zustand
- **HTTP 客戶端**: Axios
- **語言**: TypeScript
- **動畫**: Framer Motion
- **表單處理**: React Dropzone
- **通知**: React Hot Toast

## 專案結構

```
src/
├── app/                          # Next.js App Router 頁面
│   ├── (auth)/                   # 認證相關頁面
│   │   ├── login/                # 登入頁
│   │   └── register/             # 註冊頁
│   ├── (main)/                   # 主要頁面
│   │   ├── page.tsx              # 首頁
│   │   ├── search/               # 搜尋結果頁
│   │   ├── property/[id]/        # 物件詳情頁
│   │   └── favorites/            # 收藏列表頁
│   ├── (dashboard)/              # 使用者儀表板
│   │   ├── dashboard/            # 儀表板首頁
│   │   ├── my-listings/          # 我的物件
│   │   └── settings/             # 設定頁
│   ├── api/                      # API 路由
│   ├── globals.css               # 全域樣式
│   └── layout.tsx                # 根佈局
│
├── components/                   # React 組件
│   ├── ui/                       # shadcn/ui 基礎組件
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── badge.tsx
│   │   ├── label.tsx
│   │   └── textarea.tsx
│   ├── features/                 # 功能組件
│   │   ├── property/             # 物件相關組件
│   │   │   ├── PropertyCard.tsx
│   │   │   ├── PropertyList.tsx
│   │   │   ├── PropertyDetail.tsx
│   │   │   └── PropertyForm.tsx
│   │   ├── search/               # 搜尋相關組件
│   │   │   ├── SearchBar.tsx
│   │   │   ├── FilterPanel.tsx
│   │   │   └── SearchResults.tsx
│   │   ├── map/                  # 地圖相關組件
│   │   │   ├── PropertyMap.tsx
│   │   │   ├── MapMarker.tsx
│   │   │   └── MapSearch.tsx
│   │   ├── user/                 # 使用者相關組件
│   │   │   ├── UserProfile.tsx
│   │   │   └── UserMenu.tsx
│   │   ├── payment/              # 支付相關組件
│   │   └── admin/                # 管理員相關組件
│   └── shared/                   # 共用組件
│       ├── forms/                # 表單組件
│       ├── layout/               # 佈局組件
│       │   ├── Header.tsx
│       │   ├── Footer.tsx
│       │   └── Sidebar.tsx
│       └── navigation/           # 導航組件
│
├── hooks/                        # 自訂 Hooks
│   ├── useAuth.ts                # 認證 Hook
│   ├── useProperty.ts            # 物件相關 Hook
│   ├── useMap.ts                 # 地圖 Hook
│   └── useMediaQuery.ts          # 響應式 Hook
│
├── services/                     # 服務層
│   ├── api.ts                    # API 服務
│   ├── auth.service.ts           # 認證服務
│   ├── property.service.ts       # 物件服務
│   └── map.service.ts            # 地圖服務
│
├── lib/                          # 工具函數庫
│   ├── utils.ts                  # 通用工具函數
│   ├── api.ts                    # API 客戶端
│   ├── store.ts                  # Zustand 狀態管理
│   └── districts.ts              # 行政區資料
│
├── types/                        # TypeScript 型別定義
│   ├── index.ts                  # 統一匯出
│   ├── property.ts               # 物件型別
│   ├── user.ts                   # 使用者型別
│   └── api.ts                    # API 型別
│
├── constants/                    # 常數定義
│   ├── property.ts               # 物件相關常數
│   ├── cities.ts                 # 縣市與行政區資料
│   └── config.ts                 # 配置常數
│
└── contexts/                     # React Context
    ├── AuthContext.tsx           # 認證 Context
    └── ThemeContext.tsx          # 主題 Context
```

## 主要功能

### 1. 物件搜尋與瀏覽
- 多條件篩選（地區、價格、坪數、房型等）
- 地圖檢視與列表檢視切換
- 物件詳情頁（圖片輪播、設施清單、地圖位置）

### 2. 使用者認證
- 註冊/登入/登出
- 社群登入（Facebook）
- 角色管理（房客、房東、仲介）

### 3. 物件管理
- 刊登物件（含圖片上傳）
- 編輯/下架物件
- 物件審核（管理員）

### 4. 收藏與通知
- 收藏物件
- Email 通知
- 瀏覽紀錄

### 5. 付費功能
- 刊登方案購買
- 多種支付方式（ECPay、LINE Pay、綠界）

## 開始使用

### 安裝依賴

```bash
npm install
```

### 環境變數設定

複製 `.env.example` 到 `.env.local` 並填入相關設定：

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_MAP_TILE_URL=https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
```

### 開發模式

```bash
npm run dev
```

開啟瀏覽器訪問 [http://localhost:3000](http://localhost:3000)

### 建置專案

```bash
npm run build
```

### 啟動生產環境

```bash
npm start
```

## shadcn/ui 組件使用

本專案已整合 shadcn/ui，可以直接使用以下基礎組件：

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>範例卡片</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">名稱</Label>
            <Input id="name" placeholder="請輸入名稱" />
          </div>
          <Button>送出</Button>
          <Badge>新物件</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
```

## 地圖整合

使用 React Leaflet 整合地圖功能：

```tsx
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function PropertyMap() {
  return (
    <MapContainer center={[25.033, 121.565]} zoom={13} style={{ height: '400px' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Marker position={[25.033, 121.565]}>
        <Popup>物件位置</Popup>
      </Marker>
    </MapContainer>
  );
}
```

## API 整合

使用內建的 API 服務：

```tsx
import { api } from '@/services/api';

// 搜尋物件
const searchProperties = async () => {
  const result = await api.searchProperties({
    city: '台北市',
    minPrice: 10000,
    maxPrice: 30000,
  });
  console.log(result.data);
};

// 取得單一物件
const getProperty = async (id: string) => {
  const result = await api.getProperty(id);
  console.log(result.data);
};
```

## 自訂 Hooks

```tsx
import { useProperty, usePropertySearch, useFavorites } from '@/hooks/useProperty';
import { useAuth } from '@/hooks/useAuth';

function MyComponent() {
  // 認證
  const { user, isAuthenticated, login, logout } = useAuth();
  
  // 物件搜尋
  const { result, isLoading, search } = usePropertySearch({
    city: '台北市',
  });
  
  // 收藏管理
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  
  return <div>...</div>;
}
```

## 樣式指南

### Tailwind CSS 自訂類別

專案已預設多個自訂 Tailwind 類別：

```css
.btn              /* 按鈕基礎樣式 */
.btn-primary      /* 主要按鈕 */
.btn-secondary    /* 次要按鈕 */
.btn-ghost        /* 幽靈按鈕 */
.card             /* 卡片樣式 */
.input            /* 輸入框樣式 */
.badge            /* 徽章樣式 */
```

### CSS 變數

使用 shadcn/ui 的 CSS 變數系統進行主題自訂：

```css
:root {
  --primary: 24 88% 52%;
  --secondary: 210 40% 96.1%;
  --accent: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
  --border: 214.3 31.8% 91.4%;
  --radius: 0.5rem;
}
```

## 部署

### Vercel 部署

```bash
vercel deploy
```

### Docker 部署

```bash
docker build -t rental-frontend .
docker run -p 3000:3000 rental-frontend
```

## 貢獻指南

1. Fork 本專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交變更 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 授權

MIT License

## 聯絡方式

如有問題或建議，歡迎開 Issue 或聯繫開發團隊。
