# 🏠 591 風格房地產平台 - 完整架構

> 使用 Next.js 14 + Tailwind CSS + shadcn/ui + React Leaflet 打造的現代化房地產租賃平台

## ✨ 功能特色

### 已完成功能
- ✅ **現代化技術棧**: Next.js 14 (App Router) + TypeScript + Tailwind CSS
- ✅ **UI 組件系統**: shadcn/ui - 17 個可重用的高品質組件
- ✅ **地圖整合**: React Leaflet 地圖系統
- ✅ **狀態管理**: Zustand 輕量級狀態管理
- ✅ **認證系統**: JWT + OAuth (Facebook/Google)
- ✅ **完整類型定義**: TypeScript 類型系統
- ✅ **自定義 Hooks**: useAuth, useListings, useFavorites, useDebounce
- ✅ **響應式設計**: 移動端優先的響應式設計

### 核心模組

#### 1. 搜尋與篩選系統
- **SearchBar** - 關鍵字、城市、物件類型搜尋
- **PriceRangeSlider** - 價格範圍滑桿
- **FilterSidebar** - 進階篩選選項
- 地圖/列表切換檢視

#### 2. 物件展示
- **ListingCard** - 物件卡片組件
- **ListingCardEnhanced** - 增強版物件卡片
- **ListingDetail** - 物件詳情頁
- **ListingGallery** - 圖片輪播

#### 3. 地圖功能
- **ListingMap** - 互動式地圖
- 物件標記與聚合
- 地圖搜尋與範圍篩選

#### 4. 用戶系統
- 註冊/登入 (本地 + 社交登入)
- 個人資料管理
- 收藏清單
- 瀏覽歷史

#### 5. 房東功能
- 物件刊登表單
- 物件管理
- 圖片上傳
- 數據統計

## 📁 專案結構

```
rental-monorepo/
├── packages/
│   ├── frontend/                    # Next.js 前端
│   │   ├── src/
│   │   │   ├── app/                # App Router 頁面
│   │   │   │   ├── (auth)/        # 認證頁面組
│   │   │   │   ├── (main)/        # 主要頁面組
│   │   │   │   ├── (dashboard)/   # 儀表板頁面組
│   │   │   │   ├── (landlord)/    # 房東功能組
│   │   │   │   ├── admin/         # 管理後台
│   │   │   │   └── api/           # API Routes
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── ui/            # shadcn/ui 組件 (17個)
│   │   │   │   ├── layout/        # 佈局組件
│   │   │   │   ├── listings/      # 物件組件
│   │   │   │   ├── map/           # 地圖組件
│   │   │   │   ├── search/        # 搜尋組件
│   │   │   │   ├── forms/         # 表單組件
│   │   │   │   ├── auth/          # 認證組件
│   │   │   │   ├── upload/        # 上傳組件
│   │   │   │   ├── common/        # 通用組件
│   │   │   │   └── features/      # 功能組件
│   │   │   │
│   │   │   ├── hooks/             # 自定義 Hooks
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useListings.ts
│   │   │   │   ├── useFavorites.ts
│   │   │   │   └── useDebounce.ts
│   │   │   │
│   │   │   ├── lib/               # 工具函式
│   │   │   │   ├── api.ts
│   │   │   │   ├── utils.ts
│   │   │   │   ├── constants.ts
│   │   │   │   ├── validators.ts
│   │   │   │   └── districts.ts
│   │   │   │
│   │   │   └── types/             # TypeScript 類型
│   │   │       ├── listing.ts
│   │   │       ├── user.ts
│   │   │       └── common.ts
│   │   │
│   │   └── public/                # 靜態資源
│   │
│   └── backend/                    # Express 後端
│       ├── src/
│       │   └── modules/
│       │       ├── auth/          # 認證模組
│       │       ├── listings/      # 物件模組
│       │       ├── search/        # 搜尋模組
│       │       ├── payment/       # 支付模組
│       │       └── admin/         # 管理模組
│       └── prisma/
│           └── schema.prisma
│
├── docs/                          # 文檔
├── PROJECT_ARCHITECTURE.md        # 專案架構文檔
└── SETUP_GUIDE.md                # 設置指南
```

## 🛠 技術棧

### 前端技術

| 技術 | 版本 | 用途 |
|------|------|------|
| Next.js | 14.0.4 | React 框架 (App Router) |
| TypeScript | 5.3.3 | 類型安全 |
| Tailwind CSS | 3.4.0 | CSS 框架 |
| shadcn/ui | Latest | UI 組件庫 |
| React Leaflet | 4.2.1 | 地圖組件 |
| Zustand | 4.5.7 | 狀態管理 |
| Axios | 1.13.2 | HTTP 客戶端 |
| Framer Motion | 10.18.0 | 動畫庫 |
| React Hook Form | 7.71.1 | 表單處理 |
| Zod | 4.3.6 | Schema 驗證 |
| React Dropzone | 14.3.8 | 檔案上傳 |
| React Hot Toast | 2.6.0 | 通知提示 |
| Lucide React | 0.563.0 | 圖標庫 |
| date-fns | 3.6.0 | 日期處理 |

### 後端技術

| 技術 | 用途 |
|------|------|
| Express.js | Node.js 框架 |
| PostgreSQL | 關聯式資料庫 |
| Prisma | ORM |
| Meilisearch | 搜尋引擎 |
| JWT | 認證 |
| Sentry | 錯誤監控 |

## 📦 shadcn/ui 組件清單

已安裝的 17 個 shadcn/ui 組件：

1. ✅ **Button** - 按鈕
2. ✅ **Card** - 卡片
3. ✅ **Input** - 輸入框
4. ✅ **Select** - 下拉選單
5. ✅ **Dialog** - 對話框
6. ✅ **Dropdown Menu** - 下拉選單
7. ✅ **Tabs** - 標籤頁
8. ✅ **Badge** - 徽章
9. ✅ **Avatar** - 頭像
10. ✅ **Label** - 標籤
11. ✅ **Slider** - 滑桿
12. ✅ **Calendar** - 日曆
13. ✅ **Checkbox** - 複選框
14. ✅ **Radio Group** - 單選組
15. ✅ **Form** - 表單
16. ✅ **Textarea** - 文字區域
17. ✅ **Separator** - 分隔線

## 🚀 快速開始

### 1. 安裝依賴

```bash
npm install
```

### 2. 環境設置

```bash
cp env.example .env
```

### 3. 資料庫設置

```bash
npm run db:generate
npm run db:migrate
```

### 4. 啟動開發伺服器

```bash
# 同時啟動前端和後端
npm run dev

# 前端: http://localhost:3000
# 後端: http://localhost:8000
```

## 📖 使用範例

### 使用搜尋欄

```tsx
import { SearchBar } from '@/components/search/SearchBar';

export default function HomePage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold mb-8">找到理想的家</h1>
      <SearchBar />
    </div>
  );
}
```

### 使用物件卡片

```tsx
import { ListingCardEnhanced } from '@/components/listings/ListingCardEnhanced';

export default function ListingsPage({ listings }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {listings.map(listing => (
        <ListingCardEnhanced key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
```

### 使用認證 Hook

```tsx
import { useAuth } from '@/hooks';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>請先登入</div>;
  }

  return (
    <div>
      <h1>歡迎, {user?.name}</h1>
      <button onClick={logout}>登出</button>
    </div>
  );
}
```

### 使用價格滑桿

```tsx
import { PriceRangeSlider } from '@/components/search/PriceRangeSlider';

export default function FilterPanel() {
  const [priceRange, setPriceRange] = useState([0, 50000]);

  return (
    <PriceRangeSlider
      min={0}
      max={50000}
      defaultValue={priceRange}
      onChange={setPriceRange}
    />
  );
}
```

### 使用收藏按鈕

```tsx
import { FavoriteButton } from '@/components/features/FavoriteButton';

export default function ListingDetail({ listing }) {
  return (
    <div>
      <h1>{listing.title}</h1>
      <FavoriteButton 
        listingId={listing.id}
        size="lg"
        showLabel
      />
    </div>
  );
}
```

### 使用載入狀態

```tsx
import { LoadingSpinner, EmptyState } from '@/components/common';

export default function DataPage({ data, isLoading }) {
  if (isLoading) {
    return <LoadingSpinner size="lg" text="載入中..." />;
  }

  if (!data || data.length === 0) {
    return (
      <EmptyState
        icon="search"
        title="找不到物件"
        description="試試調整搜尋條件"
        actionLabel="重新搜尋"
        onAction={() => router.push('/search')}
      />
    );
  }

  return <div>{/* 顯示資料 */}</div>;
}
```

## 🎨 設計系統

### 色彩配置

```ts
// 主色調 (Primary) - 橘色
primary: {
  500: '#e97020',
  // ... 其他色階
}

// 次要色調 (Secondary) - 藍色
secondary: {
  500: '#467db2',
  // ... 其他色階
}
```

### 字體

- **中文**: Noto Sans TC
- **英文**: Inter, Outfit
- **標題**: Outfit

### 響應式斷點

```ts
// Mobile: < 768px
// Tablet: 768px - 1024px
// Desktop: > 1024px
```

## 📋 待開發功能

### 高優先級
- [ ] 完善首頁設計
- [ ] 搜尋結果頁實作
- [ ] 物件詳情頁完整功能
- [ ] 用戶儀表板
- [ ] 物件刊登表單

### 中優先級
- [ ] 即時通訊功能
- [ ] 進階篩選選項
- [ ] 地圖聚合功能
- [ ] 圖片畫廊優化
- [ ] 虛擬導覽

### 低優先級
- [ ] 推薦系統
- [ ] 數據分析儀表板
- [ ] A/B 測試
- [ ] SEO 優化
- [ ] 效能優化

## 🔧 開發工具

### 可用指令

```bash
# 開發
npm run dev                # 啟動前後端
npm run dev:frontend       # 只啟動前端
npm run dev:backend        # 只啟動後端

# 建構
npm run build              # 建構前後端
npm run start              # 啟動生產環境

# 程式碼品質
npm run lint               # 執行 ESLint

# 資料庫
npm run db:generate        # 生成 Prisma Client
npm run db:migrate         # 執行資料庫遷移
npm run db:push            # 推送 Schema 到資料庫
npm run db:studio          # 開啟 Prisma Studio
```

### 添加 shadcn/ui 組件

```bash
cd packages/frontend
npx shadcn@latest add [component-name]
```

## 📚 文檔

- **PROJECT_ARCHITECTURE.md** - 完整專案架構說明
- **SETUP_GUIDE.md** - 詳細設置指南
- **docs/** - 各模組詳細文檔

## 🤝 貢獻指南

1. Fork 專案
2. 創建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權

本專案採用 MIT 授權。

## 🙏 致謝

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [React Leaflet](https://react-leaflet.js.org/)
- [Zustand](https://zustand-demo.pmnd.rs/)

---

**建立日期**: 2026-02-06  
**專案類型**: 房地產租賃平台  
**參考平台**: 591 租屋網  
**狀態**: 開發中 🚧

如有任何問題或建議，歡迎開 issue 或聯繫開發團隊。
