# 591 租屋平台 - 前端架構文檔

## 專案概述

這是一個現代化的房地產租賃平台前端專案，採用 Next.js 14 (App Router) + Tailwind CSS + shadcn/ui 技術棧構建，旨在提供類似 591 租屋網的完整功能體驗。

## 技術選型

### 核心技術

| 技術 | 版本 | 用途 | 選擇理由 |
|------|------|------|----------|
| Next.js | 14.0+ | React 框架 | SSR/SSG、優秀的性能、SEO 友好 |
| React | 18.2+ | UI 庫 | 組件化、生態豐富 |
| TypeScript | 5.3+ | 類型系統 | 提高代碼可維護性、減少錯誤 |
| Tailwind CSS | 3.4+ | CSS 框架 | 快速開發、高度可定制 |
| shadcn/ui | latest | UI 組件庫 | 現代化設計、完全可控 |

### 輔助技術

| 技術 | 用途 |
|------|------|
| React Leaflet | 地圖展示與交互 |
| Zustand | 輕量級狀態管理 |
| Axios | HTTP 客戶端 |
| Framer Motion | 動畫效果 |
| React Hot Toast | 通知提示 |
| React Dropzone | 圖片上傳 |
| date-fns | 日期處理 |

## 架構設計

### 整體架構

```
┌─────────────────────────────────────────────────────────┐
│                     前端應用層                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │         Pages (Next.js App Router)               │  │
│  │    首頁、房源列表、詳情頁、用戶中心等            │  │
│  └──────────────────────────────────────────────────┘  │
│                        ↕                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │              Components 組件層                   │  │
│  │  ┌───────────┐  ┌───────────┐  ┌────────────┐  │  │
│  │  │ UI 組件   │  │ 功能組件  │  │ 佈局組件   │  │  │
│  │  │ (shadcn) │  │ (features)│  │ (layout)   │  │  │
│  │  └───────────┘  └───────────┘  └────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│                        ↕                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │               業務邏輯層                         │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │  │
│  │  │ Hooks    │  │ Services │  │ State (店舖) │  │  │
│  │  │ (自訂)   │  │ (API)    │  │ (Zustand)   │  │  │
│  │  └──────────┘  └──────────┘  └──────────────┘  │  │
│  └──────────────────────────────────────────────────┘  │
│                        ↕                                │
│  ┌──────────────────────────────────────────────────┐  │
│  │               工具與配置層                       │  │
│  │   Utils | Types | Constants | Config            │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                         ↕
┌─────────────────────────────────────────────────────────┐
│                    後端 API 服務                         │
│              (Express + PostgreSQL)                     │
└─────────────────────────────────────────────────────────┘
```

### 資料夾結構說明

#### `/app` - 頁面路由層
使用 Next.js 14 的 App Router，採用文件系統路由：
- **動態路由**: `[id]` 文件夾表示動態路由參數
- **路由組**: `(auth)` 括號文件夾用於組織路由，不影響 URL
- **API Routes**: `/api` 文件夾處理服務端 API 端點
- **佈局**: `layout.tsx` 定義共享佈局
- **頁面**: `page.tsx` 定義頁面內容

#### `/components` - 組件層
採用分層組件架構：

1. **`/ui`** - 基礎 UI 組件（shadcn/ui）
   - 可復用的最小單位組件
   - 與業務邏輯無關
   - 例：Button、Card、Input、Badge

2. **`/features`** - 功能組件
   - 與業務邏輯相關的組合組件
   - 通常由多個 UI 組件組成
   - 例：PropertyCard、SearchBar、PropertyFilters

3. **`/layout`** - 佈局組件
   - 頁面結構組件
   - 例：Header、Footer、Sidebar

4. **`/listings`** - 業務模塊組件
   - 特定功能模塊的組件
   - 例：ListingCard、FilterSidebar

5. **`/map`** - 地圖相關組件
   - 地圖展示與交互
   - 例：ListingMap

#### `/lib` - 工具庫
核心工具函數與配置：
- **`api.ts`**: Axios 實例配置、攔截器
- **`utils.ts`**: 通用工具函數（格式化、驗證等）
- **`store.ts`**: Zustand 全局狀態管理
- **`districts.ts`**: 台灣行政區數據

#### `/hooks` - 自訂 Hooks
封裝可復用的邏輯：
- **`useAuth.ts`**: 用戶認證相關邏輯
- **`useProperties.ts`**: 房源數據獲取與管理
- 遵循 React Hooks 規範

#### `/services` - API 服務層
封裝所有 API 調用：
- **`property.service.ts`**: 房源相關 API
- **`auth.service.ts`**: 認證相關 API
- 統一的錯誤處理
- 統一的數據格式

#### `/types` - 類型定義
TypeScript 類型定義：
- 接口定義
- 枚舉類型
- 通用類型
- API 響應類型

#### `/constants` - 常量配置
全局常量：
- API 地址
- 配置選項
- 靜態數據
- 枚舉映射

## 核心功能實現

### 1. 認證系統

```typescript
// 使用 Hook 管理認證狀態
const { user, login, logout, isAuthenticated } = useAuth();

// 登入
await login(email, password);

// 登出
logout();
```

**實現要點**：
- JWT Token 存儲在 localStorage
- Axios 攔截器自動附加 Token
- 路由守衛保護需要認證的頁面

### 2. 房源搜尋與篩選

```typescript
// 使用 Hook 獲取房源列表
const { properties, loading, error, pagination } = useProperties(
  { city: '台北市', minPrice: 10000, maxPrice: 20000 },
  1,
  12
);
```

**實現要點**：
- URL 查詢參數同步篩選條件
- 分頁與篩選聯動
- 防抖搜尋避免頻繁請求

### 3. 地圖功能

```typescript
// 地圖組件
<MapContainer center={[lat, lng]} zoom={13}>
  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
  {properties.map(property => (
    <Marker
      key={property.id}
      position={[property.location.latitude, property.location.longitude]}
    >
      <Popup>
        <PropertyPopup property={property} />
      </Popup>
    </Marker>
  ))}
</MapContainer>
```

**實現要點**：
- 使用 React Leaflet 渲染地圖
- 自訂 Marker 和 Popup 樣式
- 地圖與列表聯動

### 4. 圖片上傳

```typescript
// 使用 React Dropzone
<ImageUploader
  maxFiles={10}
  onUpload={async (files) => {
    const urls = await propertyService.uploadImages(files);
    setImages(urls);
  }}
/>
```

**實現要點**：
- 支援拖拽上傳
- 圖片預覽
- 文件大小與類型驗證
- 上傳進度顯示

### 5. 付費方案

```typescript
// 選擇方案並結帳
const handleCheckout = async (planId: string) => {
  const order = await paymentService.createOrder(planId);
  router.push(`/checkout?orderId=${order.id}`);
};
```

**實現要點**：
- 整合第三方支付（ECPay、NewebPay、LinePay）
- 訂單狀態追蹤
- Webhook 處理支付回調

## 狀態管理策略

### 全局狀態 (Zustand)
用於跨頁面共享的狀態：
- 用戶信息
- 全局配置
- 通知消息

```typescript
interface AppState {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

### 本地狀態 (useState)
用於組件內部狀態：
- 表單輸入
- UI 展開/收起
- 本地計算結果

### 服務器狀態 (Custom Hooks)
用於 API 數據：
- 通過自訂 Hooks 管理
- 自動處理 loading 和 error
- 提供 refetch 方法

## 樣式系統

### Tailwind CSS 配置

```typescript
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      primary: { /* 主色調 */ },
      secondary: { /* 輔助色 */ },
    },
    fontFamily: {
      sans: ['Noto Sans TC', 'Inter', 'system-ui'],
    },
    animation: {
      'fade-in': 'fadeIn 0.5s ease-out',
    },
  },
}
```

### CSS Variables (shadcn/ui)
使用 CSS 變數支援主題切換：

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 24 85% 53%;
  /* ... */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... */
}
```

### 組件樣式規範

1. **使用 Tailwind 工具類**：優先使用 Tailwind
2. **cn() 函數**：合併條件類名
3. **響應式設計**：移動端優先
4. **一致性**：遵循設計系統

## 性能優化

### 1. 代碼分割
- 使用 Next.js 動態導入：`next/dynamic`
- 路由級別自動分割
- 組件級別按需加載

### 2. 圖片優化
- 使用 `next/image` 組件
- 自動響應式圖片
- 懶加載

### 3. 快取策略
- API 響應快取
- 靜態資源 CDN
- Service Worker (PWA)

### 4. 渲染優化
- React.memo 防止不必要渲染
- useMemo/useCallback 優化計算
- 虛擬滾動處理長列表

## SEO 優化

### Metadata API
```typescript
// app/page.tsx
export const metadata: Metadata = {
  title: '591 租屋網 - 全台最大租屋平台',
  description: '提供最新、最完整的租屋資訊',
  keywords: '租屋, 租房, 房屋出租',
};
```

### 結構化資料
```typescript
// JSON-LD 格式
const structuredData = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "name": "591 租屋網",
};
```

## 測試策略

### 單元測試
- 使用 Jest + React Testing Library
- 測試組件渲染
- 測試用戶交互
- 測試工具函數

### 集成測試
- 測試完整用戶流程
- 測試 API 集成
- 測試狀態管理

### E2E 測試
- 使用 Playwright/Cypress
- 測試關鍵業務流程
- 跨瀏覽器測試

## 部署方案

### Vercel (推薦)
- 自動 CI/CD
- 全球 CDN
- 無服務器函數
- 自動 HTTPS

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

### 環境變數管理
- 開發環境：`.env.local`
- 生產環境：Vercel/Docker 環境變數配置

## 安全考慮

1. **XSS 防護**：React 自動轉義、DOMPurify 清理 HTML
2. **CSRF 防護**：CSRF Token
3. **API 安全**：JWT Token、HTTPS
4. **輸入驗證**：客戶端和服務端雙重驗證
5. **敏感數據**：不在客戶端存儲敏感信息

## 監控與錯誤追蹤

### Sentry 集成
- 前端錯誤追蹤
- 性能監控
- 用戶行為追蹤
- Source Map 上傳

### 分析工具
- Google Analytics：用戶行為分析
- Vercel Analytics：性能分析
- 自訂埋點：業務指標追蹤

## 最佳實踐

### 代碼規範
1. 使用 TypeScript 嚴格模式
2. 遵循 ESLint 規則
3. 統一的命名規範
4. 添加有意義的註釋

### Git 工作流
1. 功能分支開發
2. Pull Request 審查
3. 有意義的 Commit 消息
4. 語義化版本控制

### 文檔維護
1. 及時更新 README
2. API 文檔同步
3. 重要決策記錄
4. 問題與解決方案記錄

## 未來擴展

### 計劃功能
- [ ] PWA 支援
- [ ] 即時聊天系統
- [ ] 虛擬實境看房
- [ ] AI 房源推薦
- [ ] 多語言支援
- [ ] 無障礙優化

### 技術升級
- [ ] React Server Components
- [ ] Turbopack (Next.js 編譯器)
- [ ] React 19 新特性
- [ ] WebAssembly 性能優化

## 資源與參考

- [Next.js 官方文檔](https://nextjs.org/docs)
- [Tailwind CSS 文檔](https://tailwindcss.com/docs)
- [shadcn/ui 文檔](https://ui.shadcn.com)
- [React Leaflet 文檔](https://react-leaflet.js.org)
- [Zustand 文檔](https://zustand-demo.pmnd.rs)

---

**維護者**: 開發團隊  
**最後更新**: 2026-02-06  
**版本**: 1.0.0
