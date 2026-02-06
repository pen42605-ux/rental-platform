# 591 房地產平台架構文件

## 專案概述

這是一個現代化的房地產租售平台，類似於 591，採用 monorepo 架構，前後端分離設計。

## 技術棧

### 前端技術
- **框架**: Next.js 14 (App Router)
- **樣式**: Tailwind CSS + shadcn/ui
- **地圖**: React Leaflet
- **狀態管理**: Zustand
- **HTTP 客戶端**: Axios
- **UI 動畫**: Framer Motion
- **日期處理**: date-fns
- **監控**: Sentry

### 後端技術
- **運行環境**: Node.js + TypeScript
- **框架**: Express
- **ORM**: Prisma
- **資料庫**: PostgreSQL
- **搜索引擎**: MeiliSearch
- **監控**: Sentry

## 專案結構

```
/workspace
├── packages/
│   ├── frontend/                    # Next.js 前端應用
│   │   ├── src/
│   │   │   ├── app/                 # Next.js App Router 頁面
│   │   │   │   ├── (marketing)/     # 行銷頁面組
│   │   │   │   │   ├── page.tsx     # 首頁
│   │   │   │   │   ├── news/        # 房產新聞
│   │   │   │   │   ├── community/   # 社區資訊
│   │   │   │   │   └── interior-design/ # 室內設計
│   │   │   │   ├── listing/         # 物件詳情
│   │   │   │   │   └── [id]/
│   │   │   │   │       └── page.tsx
│   │   │   │   ├── create/          # 發布物件
│   │   │   │   ├── login/           # 登入頁面
│   │   │   │   ├── register/        # 註冊頁面
│   │   │   │   ├── pricing/         # 方案價格
│   │   │   │   ├── checkout/        # 付款結帳
│   │   │   │   ├── orders/          # 訂單管理
│   │   │   │   ├── admin/           # 管理後台
│   │   │   │   │   ├── page.tsx     # 儀表板
│   │   │   │   │   ├── listings/    # 物件管理
│   │   │   │   │   ├── users/       # 用戶管理
│   │   │   │   │   └── audit/       # 審計日誌
│   │   │   │   ├── api/             # API Routes
│   │   │   │   │   └── auth/
│   │   │   │   ├── layout.tsx       # 根佈局
│   │   │   │   └── globals.css      # 全局樣式
│   │   │   │
│   │   │   ├── components/          # React 組件
│   │   │   │   ├── ui/              # shadcn/ui 基礎組件
│   │   │   │   │   ├── button.tsx   # 按鈕
│   │   │   │   │   ├── card.tsx     # 卡片
│   │   │   │   │   ├── input.tsx    # 輸入框
│   │   │   │   │   ├── badge.tsx    # 徽章
│   │   │   │   │   ├── label.tsx    # 標籤
│   │   │   │   │   ├── dialog.tsx   # 對話框
│   │   │   │   │   ├── select.tsx   # 下拉選單
│   │   │   │   │   ├── tabs.tsx     # 標籤頁
│   │   │   │   │   └── separator.tsx # 分隔線
│   │   │   │   │
│   │   │   │   ├── layout/          # 佈局組件
│   │   │   │   │   ├── Header.tsx   # 頁首
│   │   │   │   │   └── Footer.tsx   # 頁尾
│   │   │   │   │
│   │   │   │   ├── listings/        # 物件相關組件
│   │   │   │   │   ├── ListingCard.tsx      # 物件卡片
│   │   │   │   │   ├── FilterSidebar.tsx    # 篩選側邊欄
│   │   │   │   │   └── Pagination.tsx       # 分頁
│   │   │   │   │
│   │   │   │   ├── map/             # 地圖組件
│   │   │   │   │   └── ListingMap.tsx       # 物件地圖
│   │   │   │   │
│   │   │   │   ├── auth/            # 認證組件
│   │   │   │   │   └── FacebookLoginButton.tsx
│   │   │   │   │
│   │   │   │   └── upload/          # 上傳組件
│   │   │   │       └── ImageUploader.tsx    # 圖片上傳
│   │   │   │
│   │   │   └── lib/                 # 工具庫
│   │   │       ├── api.ts           # API 客戶端
│   │   │       ├── utils.ts         # 工具函數
│   │   │       ├── store.ts         # Zustand 狀態管理
│   │   │       ├── districts.ts     # 行政區資料
│   │   │       └── payment-products.ts # 付款商品
│   │   │
│   │   ├── public/                  # 靜態資源
│   │   ├── components.json          # shadcn/ui 配置
│   │   ├── tailwind.config.ts       # Tailwind 配置
│   │   ├── next.config.js           # Next.js 配置
│   │   ├── tsconfig.json            # TypeScript 配置
│   │   └── package.json             # 依賴管理
│   │
│   └── backend/                     # Express 後端應用
│       ├── src/
│       │   ├── modules/             # 功能模組
│       │   │   ├── auth/            # 認證模組
│       │   │   ├── listings/        # 物件模組
│       │   │   ├── search/          # 搜索模組
│       │   │   ├── payment/         # 付款模組
│       │   │   └── admin/           # 管理模組
│       │   ├── middleware/          # 中間件
│       │   ├── lib/                 # 工具庫
│       │   └── index.ts             # 入口文件
│       ├── prisma/                  # Prisma ORM
│       │   ├── schema.prisma        # 資料庫模型
│       │   └── seed.ts              # 種子資料
│       └── package.json
│
├── .github/                         # GitHub Actions CI/CD
├── docs/                            # 專案文件
└── README.md                        # 專案說明

```

## 核心功能模組

### 1. 物件管理 (Listings)
- 物件列表顯示與篩選
- 物件詳情頁面
- 地圖檢視
- 收藏功能
- 比較功能

### 2. 搜索與篩選 (Search)
- 關鍵字搜索
- 進階篩選 (價格、坪數、房型等)
- 地圖搜索
- 搜索結果排序
- 全文搜索 (MeiliSearch)

### 3. 用戶系統 (Auth)
- 註冊/登入
- 社交登入 (Facebook)
- Email 驗證
- 角色權限 (房東/房客/管理員)
- 個人資料管理

### 4. 付款系統 (Payment)
- 刊登方案管理
- 多種付款方式
  - ECPay (綠界)
  - LINE Pay
  - NewebPay (藍新)
- 訂單管理
- 付款紀錄

### 5. 管理後台 (Admin)
- 儀表板
- 物件審核
- 用戶管理
- 系統設定
- 審計日誌

## 頁面路由結構

### 公開頁面
- `/` - 首頁 (搜索與精選物件)
- `/listing/[id]` - 物件詳情
- `/news` - 房產新聞
- `/community` - 社區資訊
- `/interior-design` - 室內設計
- `/pricing` - 方案價格

### 認證頁面
- `/login` - 登入
- `/register` - 註冊
- `/register/role` - 角色選擇

### 用戶功能
- `/create` - 發布物件
- `/checkout` - 結帳付款
- `/orders` - 我的訂單
- `/orders/[id]` - 訂單詳情

### 管理後台
- `/admin` - 儀表板
- `/admin/listings` - 物件管理
- `/admin/listings/[id]` - 物件審核
- `/admin/users` - 用戶管理
- `/admin/audit` - 審計日誌

## 組件架構

### UI 組件層級

```
shadcn/ui 基礎組件 (components/ui/)
    ↓
業務組件 (components/listings/, components/map/)
    ↓
頁面組件 (app/*/page.tsx)
```

### 組件設計原則
1. **可重用性**: 組件應該可在多個地方使用
2. **單一職責**: 每個組件只做一件事
3. **組合優於繼承**: 通過組合小組件來構建複雜功能
4. **類型安全**: 使用 TypeScript 確保類型安全

## 樣式系統

### Tailwind CSS 配置
- **主色系**: Orange (#e97020) - 代表活力與溫暖
- **次色系**: Blue (#467db2) - 代表專業與信任
- **字體**: Noto Sans TC (中文) + Outfit (英文)
- **圓角**: 統一使用 rounded-xl (12px)
- **陰影**: 使用多層次陰影增加深度

### CSS 變量 (shadcn/ui)
使用 HSL 顏色空間定義主題變量，支援深色模式切換。

## 地圖整合

### React Leaflet
- 顯示物件位置
- 多標記點顯示
- 地圖拖曳搜索
- 自定義標記樣式
- 彈出窗口顯示物件資訊

### 地圖供應商
- OpenStreetMap (免費)
- 可擴展支援 Google Maps

## 狀態管理

### Zustand Store
```typescript
// 全局狀態
- user: 用戶資訊
- auth: 認證狀態
- favorites: 收藏物件
- searchFilters: 搜索篩選條件
```

### 本地狀態
使用 React Hooks (useState, useReducer) 管理組件內部狀態

## API 客戶端

### Axios 配置
- 統一錯誤處理
- 請求/響應攔截器
- 自動添加認證 Token
- 請求重試機制

## 圖片上傳

### 上傳流程
1. 前端選擇圖片
2. 客戶端壓縮 (react-dropzone)
3. 上傳到後端
4. 儲存到檔案系統或雲端儲存
5. 返回圖片 URL

## 搜索功能

### MeiliSearch 整合
- 即時搜索
- 模糊搜索
- 中文分詞
- 搜索高亮
- 分面搜索 (Faceted Search)

## 付款整合

### 支援的付款方式
1. **ECPay (綠界)**
   - 信用卡
   - ATM 轉帳
   - 超商代碼

2. **LINE Pay**
   - LINE 錢包支付

3. **NewebPay (藍新)**
   - 信用卡
   - ATM 轉帳
   - 超商代碼

## 部署架構

### 前端
- **平台**: Vercel
- **CDN**: Vercel Edge Network
- **環境變量**: 通過 Vercel 環境變量配置

### 後端
- **平台**: Render / Railway
- **資料庫**: Render PostgreSQL
- **搜索**: MeiliSearch Cloud
- **檔案儲存**: 本地 / AWS S3

## 開發工作流程

### 本地開發
```bash
# 安裝依賴
npm install

# 啟動前端 (port 3000)
cd packages/frontend
npm run dev

# 啟動後端 (port 5000)
cd packages/backend
npm run dev
```

### 環境變量
- 前端: `.env.local`
- 後端: `.env`

## 最佳實踐

### 代碼規範
- 使用 ESLint 進行代碼檢查
- 使用 Prettier 格式化代碼
- 遵循 Airbnb JavaScript Style Guide

### Git 工作流程
- 使用功能分支開發
- Commit 訊息遵循 Conventional Commits
- Pull Request 代碼審查

### 效能優化
- Next.js 圖片優化 (next/image)
- 代碼分割與懶加載
- API 請求快取
- 資料庫查詢優化
- CDN 加速靜態資源

### 安全性
- HTTPS 加密傳輸
- JWT Token 認證
- XSS 防護
- CSRF 防護
- SQL 注入防護 (Prisma ORM)
- 敏感資料加密

## 監控與日誌

### Sentry 整合
- 前端錯誤監控
- 後端錯誤監控
- 效能監控
- 用戶行為追蹤

## 測試策略

### 前端測試
- 單元測試 (Jest)
- 組件測試 (React Testing Library)
- E2E 測試 (Playwright/Cypress)

### 後端測試
- 單元測試 (Jest)
- 整合測試
- API 測試

## 未來擴展

### 計劃功能
- [ ] 即時通訊 (房東與房客聊天)
- [ ] 虛擬看房 (VR/3D)
- [ ] AI 推薦系統
- [ ] 行動應用 (React Native)
- [ ] 多語言支援
- [ ] 深色模式
- [ ] PWA 支援

## 技術文件

詳細的技術文件請參考：
- [付款整合文件](./docs/PAYMENT_ARCHITECTURE.md)
- [部署指南](./DEPLOYMENT.md)
- [CI/CD 設定](./CI_CD_SETUP.md)
- [監控指南](./MONITORING.md)

## 授權

MIT License
