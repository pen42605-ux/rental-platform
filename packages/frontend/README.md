# Frontend（Next.js + Tailwind + shadcn/ui + Leaflet）

此資料夾為租屋/房地產平台前端（App Router）。

## 開發指令

在 repo root：

```bash
npm run dev:frontend
```

或在此資料夾：

```bash
npm run dev
```

## shadcn/ui

- 設定檔：`components.json`
- 元件目錄：`src/components/ui/*`
- 常用工具：`src/lib/utils.ts`（`cn()`）

新增元件範例：

```bash
npx shadcn@latest add dialog dropdown-menu sheet toast
```

## 地圖（Leaflet / react-leaflet）

已安裝：

- `leaflet`
- `react-leaflet`

現有地圖元件：`src/components/map/ListingMap.tsx`（以動態載入方式避開 SSR 問題，並在 client 端插入 Leaflet CSS）。

## 建議資料夾職責（重點）

- `src/app/*`：路由與頁面（App Router）
- `src/components/ui/*`：shadcn/ui 基礎 UI 元件
- `src/components/*`：產品/頁面用元件（Header、ListingCard、Map…）
- `src/lib/*`：API client、共用工具、常數
- `src/hooks/*`：共用 hooks（如 `useDebounce`）

