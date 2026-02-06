# 🚀 快速開始指南

## 🎉 平台已完成初始化！

您的 591 風格房地產平台架構已經成功建立並配置完成。

## 📂 已建立的檔案結構

```
packages/frontend/src/
├── components/
│   ├── ui/ (17 個 shadcn/ui 組件)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   ├── avatar.tsx
│   │   ├── label.tsx
│   │   ├── slider.tsx
│   │   ├── calendar.tsx
│   │   ├── checkbox.tsx
│   │   ├── radio-group.tsx
│   │   ├── form.tsx
│   │   ├── textarea.tsx
│   │   └── separator.tsx
│   │
│   ├── common/ (通用組件)
│   │   ├── LoadingSpinner.tsx
│   │   └── EmptyState.tsx
│   │
│   ├── features/ (功能組件)
│   │   └── FavoriteButton.tsx
│   │
│   ├── search/ (搜尋組件)
│   │   ├── SearchBar.tsx
│   │   └── PriceRangeSlider.tsx
│   │
│   ├── listings/ (物件組件)
│   │   ├── ListingCardEnhanced.tsx (新增)
│   │   ├── ListingCard.tsx (已存在)
│   │   ├── FilterSidebar.tsx (已存在)
│   │   └── Pagination.tsx (已存在)
│   │
│   ├── layout/ (已存在)
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   │
│   ├── map/ (已存在)
│   │   └── ListingMap.tsx
│   │
│   ├── auth/ (已存在)
│   │   └── FacebookLoginButton.tsx
│   │
│   └── upload/ (已存在)
│       └── ImageUploader.tsx
│
├── hooks/
│   ├── index.ts
│   ├── useAuth.ts
│   ├── useListings.ts
│   ├── useFavorites.ts
│   └── useDebounce.ts
│
├── types/
│   ├── index.ts
│   ├── listing.ts
│   ├── user.ts
│   └── common.ts
│
└── lib/
    ├── api.ts (已存在)
    ├── utils.ts (已存在)
    ├── constants.ts (新增)
    ├── validators.ts (新增)
    ├── districts.ts (已存在)
    ├── store.ts (已存在)
    └── ...
```

## 🛠 已安裝的技術棧

### 核心框架
- ✅ Next.js 14.0.4
- ✅ React 18.2.0
- ✅ TypeScript 5.3.3
- ✅ Tailwind CSS 3.4.0

### UI & 動畫
- ✅ shadcn/ui (完整配置)
- ✅ Lucide React (圖標庫)
- ✅ Framer Motion (動畫)
- ✅ Radix UI (底層組件)

### 地圖
- ✅ Leaflet 1.9.4
- ✅ React Leaflet 4.2.1

### 狀態與表單
- ✅ Zustand 4.5.7
- ✅ React Hook Form 7.71.1
- ✅ Zod 4.3.6

### 工具
- ✅ Axios 1.13.2
- ✅ date-fns 3.6.0
- ✅ React Hot Toast 2.6.0
- ✅ React Dropzone 14.3.8

## 🎯 立即開始開發

### 1. 啟動開發伺服器

```bash
cd /workspace
npm run dev
```

- 前端: http://localhost:3000
- 後端: http://localhost:8000

### 2. 使用範例

#### 建立搜尋頁面

```tsx
// app/search/page.tsx
import { SearchBar } from '@/components/search/SearchBar';
import { ListingCardEnhanced } from '@/components/listings/ListingCardEnhanced';
import { useListings } from '@/hooks';

export default function SearchPage() {
  const { listings, isLoading } = useListings();

  return (
    <div className="container mx-auto py-8">
      <SearchBar />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        {listings.map(listing => (
          <ListingCardEnhanced key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}
```

#### 使用 UI 組件

```tsx
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <h2>我的組件</h2>
        <Badge>新</Badge>
      </CardHeader>
      <CardContent>
        <Input placeholder="搜尋..." />
        <Button>提交</Button>
      </CardContent>
    </Card>
  );
}
```

#### 使用認證

```tsx
import { useAuth } from '@/hooks';

export function ProfileButton() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <Button href="/login">登入</Button>;
  }

  return (
    <div>
      <span>歡迎, {user?.name}</span>
      <Button onClick={logout}>登出</Button>
    </div>
  );
}
```

#### 使用收藏功能

```tsx
import { FavoriteButton } from '@/components/features/FavoriteButton';

export function ListingActions({ listingId }) {
  return (
    <div className="flex gap-2">
      <FavoriteButton 
        listingId={listingId}
        size="lg"
        showLabel
      />
      <Button>聯絡房東</Button>
    </div>
  );
}
```

## 📚 重要文檔

閱讀以下文檔以獲得更多資訊：

1. **IMPLEMENTATION_SUMMARY.md** - 完整實作總結
2. **PROJECT_ARCHITECTURE.md** - 專案架構詳解
3. **SETUP_GUIDE.md** - 詳細設置指南
4. **README_PLATFORM.md** - 平台完整說明

## 🎨 組件展示

### SearchBar (搜尋欄)
- 關鍵字搜尋
- 城市選擇
- 物件類型選擇
- 響應式設計

### ListingCardEnhanced (物件卡片)
- 精美圖片展示
- 價格資訊
- 物件詳情
- 收藏按鈕整合
- Hover 動畫效果

### FavoriteButton (收藏按鈕)
- 一鍵收藏/取消
- 樂觀更新
- 動畫反饋
- 需登入提示

### PriceRangeSlider (價格滑桿)
- 雙向範圍選擇
- 即時價格顯示
- 格式化輸出

### LoadingSpinner (載入動畫)
- 三種尺寸
- 可選文字
- 旋轉動畫

### EmptyState (空狀態)
- 友善提示
- 自定義圖示
- 操作按鈕

## 🔧 常用指令

```bash
# 開發
npm run dev              # 啟動前後端
npm run dev:frontend     # 只啟動前端
npm run dev:backend      # 只啟動後端

# 建構
npm run build            # 建構專案
npm run start            # 啟動生產環境

# 程式碼品質
npm run lint             # 執行 ESLint

# 資料庫
npm run db:generate      # 生成 Prisma Client
npm run db:migrate       # 執行資料庫遷移
npm run db:studio        # 開啟 Prisma Studio

# 添加 shadcn/ui 組件
cd packages/frontend
npx shadcn@latest add [component-name]
```

## 📋 下一步開發建議

### 優先開發頁面

1. **首頁** (`app/page.tsx`)
   - Hero Section
   - 使用 `SearchBar` 組件
   - 精選物件列表 (使用 `ListingCardEnhanced`)

2. **搜尋結果頁** (`app/search/page.tsx`)
   - 使用 `useListings` hook
   - 篩選側邊欄 (使用 `PriceRangeSlider`)
   - 列表/地圖切換

3. **物件詳情頁** (`app/listing/[id]/page.tsx`)
   - 使用 `useListing` hook
   - 圖片輪播
   - 地圖展示
   - 使用 `FavoriteButton`

4. **用戶儀表板** (`app/dashboard/page.tsx`)
   - 使用 `useAuth` hook
   - 收藏列表
   - 瀏覽歷史

## 💡 開發提示

### TypeScript 類型
所有類型都已定義在 `src/types/` 中，直接導入使用：

```tsx
import type { Listing, User, SearchFilters } from '@/types';
```

### API 請求
使用封裝好的 API 客戶端：

```tsx
import { api } from '@/lib/api';

const response = await api.get('/listings');
```

### 常數使用
使用定義好的常數：

```tsx
import { CITIES, PROPERTY_TYPES, FACILITIES } from '@/lib/constants';
```

### 表單驗證
使用內建的驗證函式：

```tsx
import { validators, messages } from '@/lib/validators';

if (!validators.email(email)) {
  alert(messages.email);
}
```

## ✨ 特色功能

- ✅ **完整的類型系統** - 避免執行時錯誤
- ✅ **可重用組件** - 加速開發流程
- ✅ **響應式設計** - 支援各種裝置
- ✅ **狀態管理** - Zustand 輕量高效
- ✅ **地圖整合** - React Leaflet 強大功能
- ✅ **樂觀更新** - 更好的用戶體驗
- ✅ **錯誤處理** - 完善的錯誤提示
- ✅ **載入狀態** - 友善的載入提示

## 🎊 準備就緒！

所有的基礎設施都已經建立完成，您現在可以：

- ✅ 開始開發具體頁面
- ✅ 串接後端 API
- ✅ 客製化 UI 設計
- ✅ 添加更多功能

---

**祝開發順利！** 🚀

如有問題，請參考詳細文檔或查看程式碼範例。
