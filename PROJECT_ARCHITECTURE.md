# 房地產平台專案架構 (Real Estate Platform Architecture)

## 📁 專案結構 (Project Structure)

本專案採用 Monorepo 架構，使用 Next.js 14 + Tailwind CSS + shadcn/ui 構建現代化的房地產平台。

```
rental-monorepo/
├── packages/
│   ├── frontend/              # Next.js 前端應用
│   │   ├── src/
│   │   │   ├── app/          # Next.js 14 App Router
│   │   │   │   ├── (auth)/   # 認證相關頁面組
│   │   │   │   │   ├── login/
│   │   │   │   │   └── register/
│   │   │   │   ├── (main)/   # 主要頁面組
│   │   │   │   │   ├── page.tsx        # 首頁
│   │   │   │   │   ├── listings/       # 物件列表
│   │   │   │   │   ├── listing/[id]/   # 物件詳情
│   │   │   │   │   ├── search/         # 搜尋頁面
│   │   │   │   │   ├── map/            # 地圖搜尋
│   │   │   │   │   ├── community/      # 社區專區
│   │   │   │   │   ├── news/           # 房產新聞
│   │   │   │   │   └── interior-design/ # 室內設計
│   │   │   │   ├── (dashboard)/  # 儀表板頁面組
│   │   │   │   │   ├── dashboard/      # 用戶儀表板
│   │   │   │   │   ├── favorites/      # 我的收藏
│   │   │   │   │   ├── messages/       # 站內訊息
│   │   │   │   │   └── profile/        # 個人資料
│   │   │   │   ├── (landlord)/  # 房東功能組
│   │   │   │   │   ├── create/         # 刊登物件
│   │   │   │   │   ├── my-listings/    # 我的物件
│   │   │   │   │   └── analytics/      # 數據分析
│   │   │   │   ├── admin/        # 管理後台
│   │   │   │   ├── api/          # API Routes
│   │   │   │   │   ├── auth/
│   │   │   │   │   ├── listings/
│   │   │   │   │   ├── upload/
│   │   │   │   │   └── webhook/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── globals.css
│   │   │   │
│   │   │   ├── components/      # React 組件
│   │   │   │   ├── ui/          # shadcn/ui 基礎組件
│   │   │   │   │   ├── button.tsx
│   │   │   │   │   ├── card.tsx
│   │   │   │   │   ├── input.tsx
│   │   │   │   │   ├── select.tsx
│   │   │   │   │   ├── dialog.tsx
│   │   │   │   │   ├── tabs.tsx
│   │   │   │   │   ├── slider.tsx
│   │   │   │   │   └── ...
│   │   │   │   │
│   │   │   │   ├── layout/      # 佈局組件
│   │   │   │   │   ├── Header.tsx
│   │   │   │   │   ├── Footer.tsx
│   │   │   │   │   ├── Sidebar.tsx
│   │   │   │   │   └── MobileNav.tsx
│   │   │   │   │
│   │   │   │   ├── listings/    # 物件相關組件
│   │   │   │   │   ├── ListingCard.tsx       # 物件卡片
│   │   │   │   │   ├── ListingGrid.tsx       # 物件網格
│   │   │   │   │   ├── ListingDetail.tsx     # 物件詳情
│   │   │   │   │   ├── ListingGallery.tsx    # 圖片畫廊
│   │   │   │   │   ├── FilterSidebar.tsx     # 篩選側邊欄
│   │   │   │   │   ├── FilterModal.tsx       # 篩選彈窗
│   │   │   │   │   ├── SortDropdown.tsx      # 排序下拉選單
│   │   │   │   │   └── Pagination.tsx        # 分頁
│   │   │   │   │
│   │   │   │   ├── map/         # 地圖相關組件
│   │   │   │   │   ├── ListingMap.tsx        # 物件地圖
│   │   │   │   │   ├── MapMarker.tsx         # 地圖標記
│   │   │   │   │   ├── MapCluster.tsx        # 標記聚合
│   │   │   │   │   └── MapFilter.tsx         # 地圖篩選
│   │   │   │   │
│   │   │   │   ├── search/      # 搜尋相關組件
│   │   │   │   │   ├── SearchBar.tsx         # 搜尋欄
│   │   │   │   │   ├── SearchFilters.tsx     # 搜尋篩選
│   │   │   │   │   ├── LocationSelect.tsx    # 地區選擇
│   │   │   │   │   ├── PriceRangeSlider.tsx  # 價格範圍
│   │   │   │   │   └── AdvancedFilters.tsx   # 進階篩選
│   │   │   │   │
│   │   │   │   ├── forms/       # 表單組件
│   │   │   │   │   ├── ListingForm.tsx       # 物件刊登表單
│   │   │   │   │   ├── LoginForm.tsx         # 登入表單
│   │   │   │   │   ├── RegisterForm.tsx      # 註冊表單
│   │   │   │   │   └── ProfileForm.tsx       # 個人資料表單
│   │   │   │   │
│   │   │   │   ├── auth/        # 認證組件
│   │   │   │   │   ├── FacebookLoginButton.tsx
│   │   │   │   │   ├── GoogleLoginButton.tsx
│   │   │   │   │   └── ProtectedRoute.tsx
│   │   │   │   │
│   │   │   │   ├── upload/      # 上傳組件
│   │   │   │   │   ├── ImageUploader.tsx
│   │   │   │   │   ├── ImagePreview.tsx
│   │   │   │   │   └── DragDropZone.tsx
│   │   │   │   │
│   │   │   │   ├── common/      # 通用組件
│   │   │   │   │   ├── LoadingSpinner.tsx
│   │   │   │   │   ├── ErrorBoundary.tsx
│   │   │   │   │   ├── EmptyState.tsx
│   │   │   │   │   ├── Breadcrumb.tsx
│   │   │   │   │   └── ShareButton.tsx
│   │   │   │   │
│   │   │   │   └── features/    # 功能組件
│   │   │   │       ├── FavoriteButton.tsx    # 收藏按鈕
│   │   │   │       ├── ContactLandlord.tsx   # 聯絡房東
│   │   │   │       ├── VirtualTour.tsx       # 虛擬導覽
│   │   │   │       ├── PropertyComparison.tsx # 物件比較
│   │   │   │       └── RecommendedListings.tsx # 推薦物件
│   │   │   │
│   │   │   ├── lib/             # 工具函式庫
│   │   │   │   ├── api.ts       # API 請求封裝
│   │   │   │   ├── utils.ts     # 通用工具函式
│   │   │   │   ├── districts.ts # 台灣地區資料
│   │   │   │   ├── store.ts     # Zustand 狀態管理
│   │   │   │   ├── constants.ts # 常數定義
│   │   │   │   └── validators.ts # 表單驗證
│   │   │   │
│   │   │   ├── hooks/           # 自定義 React Hooks
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useListings.ts
│   │   │   │   ├── useFavorites.ts
│   │   │   │   ├── useSearch.ts
│   │   │   │   ├── useMap.ts
│   │   │   │   └── useDebounce.ts
│   │   │   │
│   │   │   ├── types/           # TypeScript 類型定義
│   │   │   │   ├── listing.ts
│   │   │   │   ├── user.ts
│   │   │   │   ├── api.ts
│   │   │   │   └── common.ts
│   │   │   │
│   │   │   └── styles/          # 樣式文件
│   │   │       ├── map.css      # 地圖樣式
│   │   │       └── animations.css # 動畫樣式
│   │   │
│   │   ├── public/              # 靜態資源
│   │   │   ├── images/
│   │   │   ├── icons/
│   │   │   └── fonts/
│   │   │
│   │   ├── components.json      # shadcn/ui 配置
│   │   ├── next.config.js       # Next.js 配置
│   │   ├── tailwind.config.ts   # Tailwind CSS 配置
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── backend/                 # Express 後端 API
│       ├── src/
│       │   ├── modules/
│       │   │   ├── auth/        # 認證模組
│       │   │   ├── listings/    # 物件模組
│       │   │   ├── search/      # 搜尋模組
│       │   │   ├── payment/     # 支付模組
│       │   │   └── admin/       # 管理模組
│       │   ├── middleware/
│       │   └── lib/
│       └── prisma/
│           └── schema.prisma    # 資料庫 Schema
│
└── docs/                        # 文檔

```

## 🛠 技術棧 (Tech Stack)

### 前端 (Frontend)
- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **UI 組件庫**: shadcn/ui
- **地圖**: React Leaflet
- **狀態管理**: Zustand
- **HTTP 客戶端**: Axios
- **表單處理**: React Hook Form + Zod
- **動畫**: Framer Motion
- **圖片上傳**: React Dropzone
- **通知**: React Hot Toast
- **日期處理**: date-fns

### 後端 (Backend)
- **框架**: Express.js
- **語言**: TypeScript
- **資料庫**: PostgreSQL + Prisma ORM
- **搜尋**: Meilisearch
- **認證**: JWT + OAuth (Facebook, Google)
- **支付**: ECPay, LinePay, NewebPay
- **監控**: Sentry
- **日誌**: Winston

## 🎨 設計系統 (Design System)

### 色彩配置
- **主色調 (Primary)**: Orange (#e97020) - 溫暖、積極的橘色
- **次要色調 (Secondary)**: Blue (#467db2) - 信賴、專業的藍色
- **中性色**: Gray scale

### 字體
- **中文**: Noto Sans TC
- **英文**: Inter, Outfit
- **標題**: Outfit

### 響應式斷點
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 📦 已安裝的套件 (Installed Packages)

### shadcn/ui 組件
✅ Button - 按鈕
✅ Card - 卡片
✅ Input - 輸入框
✅ Select - 下拉選單
✅ Dialog - 對話框
✅ Dropdown Menu - 下拉選單
✅ Tabs - 標籤頁
✅ Badge - 徽章
✅ Avatar - 頭像
✅ Label - 標籤
✅ Slider - 滑桿
✅ Calendar - 日曆
✅ Checkbox - 複選框
✅ Radio Group - 單選組
✅ Form - 表單
✅ Textarea - 文字區域
✅ Separator - 分隔線

### 地圖套件
✅ leaflet - 地圖核心庫
✅ react-leaflet - React 地圖組件

### 其他核心套件
✅ axios - HTTP 請求
✅ zustand - 狀態管理
✅ framer-motion - 動畫
✅ react-dropzone - 檔案上傳
✅ react-hot-toast - 通知提示
✅ date-fns - 日期處理

## 🚀 核心功能模組 (Core Features)

### 1. 物件搜尋與瀏覽
- 關鍵字搜尋
- 進階篩選（價格、坪數、房型、地區）
- 地圖搜尋
- 列表/地圖切換檢視
- 排序（價格、時間、人氣）

### 2. 物件詳情
- 圖片輪播
- 詳細資訊展示
- 地圖位置
- 聯絡房東
- 收藏功能
- 社群分享

### 3. 用戶系統
- 註冊/登入
- 社交登入 (Facebook, Google)
- 個人資料管理
- 收藏清單
- 站內訊息

### 4. 房東功能
- 刊登物件
- 物件管理
- 數據分析
- 訂單管理

### 5. 管理後台
- 用戶管理
- 物件審核
- 系統監控
- 數據統計

## 📝 開發指南 (Development Guide)

### 安裝依賴
```bash
# 安裝所有依賴
npm install

# 安裝前端依賴
npm install -w @rental/frontend

# 安裝後端依賴
npm install -w @rental/backend
```

### 啟動開發伺服器
```bash
# 同時啟動前後端
npm run dev

# 只啟動前端
npm run dev:frontend

# 只啟動後端
npm run dev:backend
```

### 建構專案
```bash
npm run build
```

### 資料庫操作
```bash
# 生成 Prisma Client
npm run db:generate

# 執行資料庫遷移
npm run db:migrate

# 開啟 Prisma Studio
npm run db:studio
```

## 🎯 下一步建議 (Next Steps)

1. **建立核心組件**
   - 完善物件卡片組件
   - 開發地圖整合組件
   - 建立搜尋篩選器

2. **實作頁面**
   - 首頁 (含熱門物件、最新物件)
   - 搜尋結果頁
   - 物件詳情頁
   - 用戶儀表板

3. **API 整合**
   - 串接後端 API
   - 實作狀態管理
   - 錯誤處理

4. **優化體驗**
   - 載入狀態
   - 錯誤提示
   - 響應式設計
   - 效能優化

5. **進階功能**
   - 即時通訊
   - 推薦系統
   - 數據分析
   - SEO 優化

## 📚 相關文檔 (Documentation)

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [React Leaflet Documentation](https://react-leaflet.js.org)
- [Prisma Documentation](https://www.prisma.io/docs)

---

**建立日期**: 2026-02-06
**專案類型**: 房地產租賃平台 (Real Estate Rental Platform)
**參考平台**: 591 租屋網
