# 房地產平台架構文檔

## 概覽

這是一個仿照 591 租屋網的現代化房地產平台，採用 Next.js 14 App Router 架構，整合 Tailwind CSS 和 shadcn/ui 組件庫，提供完整的租屋平台功能。

## 核心技術選型

### 前端框架
- **Next.js 14**: 使用最新的 App Router，支援 Server Components 和 Server Actions
- **React 18**: 利用最新的 Concurrent Features
- **TypeScript**: 完整的型別安全

### 樣式方案
- **Tailwind CSS 3.4**: 原子化 CSS 框架
- **shadcn/ui**: 基於 Radix UI 的高品質組件庫
- **CSS Variables**: 支援主題自訂和深色模式

### 地圖整合
- **React Leaflet**: 開源地圖解決方案
- **Leaflet**: 輕量級地圖庫
- 支援標記、彈窗、邊界等功能

### 狀態管理
- **Zustand**: 輕量級狀態管理
- **React Context**: 全域狀態（認證、主題等）
- **React Hooks**: 本地狀態管理

### 資料獲取
- **Axios**: HTTP 客戶端
- **SWR/React Query**: 資料快取與同步（可選）

## 設計模式

### 1. 分層架構

```
┌─────────────────────────────────────┐
│         Presentation Layer          │
│    (Pages, Components, UI)          │
├─────────────────────────────────────┤
│         Business Logic Layer        │
│    (Hooks, Services, Utils)         │
├─────────────────────────────────────┤
│         Data Access Layer           │
│    (API Client, Services)           │
└─────────────────────────────────────┘
```

### 2. 組件架構

#### UI 組件層級

```
基礎組件 (ui/)
    ↓
共用組件 (shared/)
    ↓
功能組件 (features/)
    ↓
頁面 (app/)
```

#### 組件命名規範

- **基礎組件**: `Button.tsx`, `Input.tsx` - 單一職責，可重用
- **功能組件**: `PropertyCard.tsx`, `SearchBar.tsx` - 業務邏輯相關
- **頁面組件**: `page.tsx`, `layout.tsx` - Next.js 路由相關

### 3. 資料流

```
User Action
    ↓
Component Event Handler
    ↓
Custom Hook (業務邏輯)
    ↓
Service Layer (API 呼叫)
    ↓
Backend API
    ↓
State Update
    ↓
UI Re-render
```

## 核心功能模組

### 1. 認證模組 (Authentication)

**目錄**: `app/(auth)/`, `hooks/useAuth.ts`, `services/auth.service.ts`

**功能**:
- 註冊 (Email, 社群登入)
- 登入
- 登出
- 身份驗證
- 角色管理 (房客、房東、仲介、管理員)

**狀態管理**:
```typescript
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials) => Promise<void>;
  register: (data) => Promise<void>;
  logout: () => Promise<void>;
}
```

### 2. 物件搜尋模組 (Property Search)

**目錄**: `components/features/search/`, `hooks/usePropertySearch.ts`

**功能**:
- 關鍵字搜尋
- 多條件篩選
  - 地區 (縣市、行政區)
  - 價格範圍
  - 坪數範圍
  - 房型
  - 設施
- 排序 (價格、坪數、發布時間)
- 分頁載入

**搜尋參數**:
```typescript
interface PropertySearchParams {
  city?: string;
  district?: string;
  propertyType?: PropertyType[];
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number[];
  amenities?: string[];
  keyword?: string;
  sortBy?: string;
  page?: number;
}
```

### 3. 地圖整合模組 (Map Integration)

**目錄**: `components/features/map/`, `hooks/useMap.ts`

**功能**:
- 地圖顯示
- 物件標記
- 點擊標記顯示物件資訊
- 地圖邊界內搜尋
- 地區熱點顯示

**組件**:
- `PropertyMap.tsx` - 主地圖組件
- `MapMarker.tsx` - 物件標記
- `MapSearch.tsx` - 地圖搜尋

### 4. 物件管理模組 (Property Management)

**目錄**: `app/dashboard/my-listings/`, `components/features/property/`

**功能**:
- 刊登物件
- 編輯物件
- 下架物件
- 圖片上傳 (支援拖拉)
- 物件預覽

**表單驗證**:
- 必填欄位驗證
- 格式驗證 (價格、坪數)
- 圖片大小與格式限制

### 5. 收藏系統 (Favorites)

**目錄**: `app/favorites/`, `hooks/useFavorites.ts`

**功能**:
- 收藏物件
- 取消收藏
- 收藏列表
- 收藏數量顯示

### 6. 付費功能 (Payment)

**目錄**: `app/pricing/`, `components/features/payment/`

**功能**:
- 方案選擇
- 支付整合 (ECPay, LINE Pay, 綠界)
- 訂單管理
- 發票開立

## 資料模型

### Property (物件)

```typescript
interface Property {
  id: string;
  title: string;
  description: string;
  type: PropertyType;
  status: PropertyStatus;
  location: PropertyLocation;
  features: PropertyFeatures;
  amenities: PropertyAmenities;
  price: PropertyPrice;
  images: PropertyImage[];
  owner: User;
  createdAt: string;
  updatedAt: string;
}
```

### User (使用者)

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: UserStatus;
  avatar?: string;
  phone?: string;
  verified: boolean;
}
```

## API 整合

### API 客戶端配置

```typescript
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 請求攔截器 - 添加 Token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 回應攔截器 - 錯誤處理
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // 未授權處理
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### API 端點

```
/api/auth
  POST   /login           # 登入
  POST   /register        # 註冊
  POST   /logout          # 登出
  GET    /me              # 取得當前使用者

/api/properties
  GET    /search          # 搜尋物件
  GET    /:id             # 取得單一物件
  POST   /                # 建立物件
  PUT    /:id             # 更新物件
  DELETE /:id             # 刪除物件

/api/favorites
  GET    /                # 取得收藏列表
  POST   /:propertyId     # 新增收藏
  DELETE /:propertyId     # 移除收藏

/api/upload
  POST   /                # 上傳單一圖片
  POST   /multiple        # 上傳多張圖片
```

## 效能優化

### 1. 圖片優化
- 使用 Next.js Image 組件
- 自動 WebP 轉換
- 響應式圖片
- 懶加載

### 2. 程式碼分割
- 動態 import
- Route-based splitting
- Component-based splitting

```typescript
const PropertyMap = dynamic(
  () => import('@/components/features/map/PropertyMap'),
  { ssr: false, loading: () => <LoadingSpinner /> }
);
```

### 3. 快取策略
- SWR/React Query 資料快取
- 靜態頁面生成 (SSG)
- 增量靜態再生 (ISR)

### 4. 資料預取
- Link prefetching
- API 資料預取
- 關鍵資源預載

## 安全性考量

### 1. 認證與授權
- JWT Token 驗證
- HttpOnly Cookie (推薦)
- CSRF Protection
- XSS Protection

### 2. 輸入驗證
- 前端驗證
- 後端驗證
- SQL Injection 防護
- XSS 過濾

### 3. 資料保護
- HTTPS 強制
- 敏感資料加密
- 環境變數保護

## 測試策略

### 1. 單元測試
- Jest + React Testing Library
- 組件測試
- Hook 測試
- 工具函數測試

### 2. 整合測試
- API 整合測試
- 端到端流程測試

### 3. E2E 測試
- Playwright/Cypress
- 關鍵使用者流程測試

## 部署架構

```
┌─────────────┐
│   Vercel    │ (Frontend Hosting)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  CDN/Cache  │
└──────┬──────┘
       │
       ↓
┌─────────────┐
│ Backend API │ (Node.js/Express)
└──────┬──────┘
       │
       ↓
┌─────────────┐
│  Database   │ (PostgreSQL)
└─────────────┘
```

## 開發工作流程

### 1. 本地開發
```bash
npm run dev          # 啟動開發伺服器
npm run build        # 建置專案
npm run lint         # 程式碼檢查
npm run type-check   # 型別檢查
```

### 2. Git 工作流程
- `main` - 生產環境
- `develop` - 開發環境
- `feature/*` - 功能分支
- `hotfix/*` - 緊急修復

### 3. CI/CD
- GitHub Actions
- 自動測試
- 自動部署

## 未來擴展

### 短期規劃
- [ ] 深色模式支援
- [ ] PWA 支援
- [ ] 即時通訊功能
- [ ] 通知系統

### 中期規劃
- [ ] 多語言支援 (i18n)
- [ ] 物件比較功能
- [ ] 進階搜尋儲存
- [ ] AI 推薦系統

### 長期規劃
- [ ] 虛擬看房 (VR/AR)
- [ ] 智能合約整合
- [ ] 區塊鏈應用
- [ ] 大數據分析

## 參考資源

- [Next.js 文檔](https://nextjs.org/docs)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)
- [shadcn/ui 文檔](https://ui.shadcn.com)
- [React Leaflet 文檔](https://react-leaflet.js.org)
- [TypeScript 文檔](https://www.typescriptlang.org/docs)
