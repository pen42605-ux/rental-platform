# Frontend (Next.js + Tailwind CSS)

本專案前端位於 `packages/frontend/`，採用 **Next.js (App Router) + Tailwind CSS**，並已安裝地圖相關套件與 `shadcn/ui` 元件架構，適合作為類 591 房地產平台的前端基底。

## 開發啟動

```bash
cd packages/frontend
npm install
npm run dev
```

預設啟動於 `http://localhost:3000`

## 技術選型

- **Next.js**：React 框架（App Router）
- **Tailwind CSS**：樣式系統（含自訂 `primary-*` / `secondary-*` 色票）
- **Leaflet / react-leaflet**：地圖功能（目前地圖元件位於 `src/components/map/ListingMap.tsx`）
- **shadcn/ui**：UI 元件架構（`src/components/ui/*`）
- **Zustand**：狀態管理

## 資料夾結構（重點）

```text
packages/frontend
├─ components.json                # shadcn/ui 設定
├─ tailwind.config.ts             # Tailwind（含 shadcn tokens + 既有色票）
└─ src
   ├─ app                         # Next.js App Router routes
   │  ├─ layout.tsx               # Root layout
   │  ├─ globals.css              # Tailwind + shadcn CSS variables
   │  ├─ page.tsx                 # 首頁
   │  └─ ui/page.tsx              # shadcn/ui 元件展示頁（Playground）
   ├─ components
   │  ├─ ui                       # shadcn/ui components (Button/Input/Card/Badge/...)
   │  ├─ layout                   # Header/Footer 等版型
   │  ├─ listings                 # 房源列表/卡片/篩選/分頁
   │  └─ map                      # 地圖元件
   └─ lib
      ├─ api.ts                   # API client
      ├─ store.ts                 # Zustand stores
      └─ utils.ts                 # cn() + 各種格式化工具
```

## shadcn/ui 使用方式

本專案已包含：

- `components.json`
- `src/components/ui/*`（範例元件）

若要新增更多元件（例如 dialog、dropdown-menu 等），可在 `packages/frontend/` 下執行：

```bash
npx shadcn@latest add dialog
```

## 地圖（Leaflet）

已安裝：

- `leaflet`
- `react-leaflet`

你可以視需求：

- 直接使用 `leaflet`（目前 `ListingMap.tsx` 採動態載入方式避免 SSR）
- 或改用 `react-leaflet` 以 React component 方式管理地圖狀態

