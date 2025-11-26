# 🏠 租屋平台

一個完整的租屋平台系統，包含前端、後端、管理後台和完整的 CI/CD 流程。

## ✨ 功能特色

### 前端 (Next.js + TypeScript + Tailwind)
- 📱 響應式設計
- 🔍 房源搜尋與篩選
- 🗺️ 地圖預覽 (Leaflet)
- 📸 圖片上傳 (S3 Presigned URLs)
- ❤️ 收藏功能
- 👤 使用者認證

### 後端 (Express + TypeScript + Prisma)
- 🔐 JWT 認證系統
- 📝 房源 CRUD API
- 🔎 進階搜尋 (Meilisearch)
- 📤 S3 圖片上傳
- 👥 使用者管理
- 📊 Admin Panel API

### 管理後台
- 📋 房源審核管理
- 👤 使用者管理
- 🚫 封鎖/解除封鎖
- 📜 審核日誌 (Audit Log)
- 📊 統計儀表板

## 🚀 快速開始

### 前置需求

- Node.js 20.x 或更高版本
- npm 或 yarn
- PostgreSQL 或 SQLite (開發環境)

### 安裝

```bash
# 安裝依賴
npm install

# 設定環境變數
cp .env.example .env
# 編輯 .env 檔案

# 初始化資料庫
npm run db:generate
npm run db:push
npm run db:seed

# 啟動開發伺服器
npm run dev
```

### 環境變數

建立 `.env` 檔案：

```env
# 資料庫
DATABASE_URL="file:./dev.db"  # SQLite (開發)
# 或
DATABASE_URL="postgresql://user:password@localhost:5432/rental_platform"

# JWT
JWT_SECRET="your-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret"

# AWS S3 (選填)
AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION="ap-northeast-1"
AWS_S3_BUCKET=""

# 其他
PORT=4000
FRONTEND_URL="http://localhost:3000"
```

## 📁 專案結構

```
rental-monorepo/
├── packages/
│   ├── frontend/          # Next.js 前端
│   │   ├── src/
│   │   │   ├── app/       # Next.js App Router
│   │   │   ├── components/
│   │   │   └── lib/
│   │   └── package.json
│   │
│   └── backend/           # Express 後端
│       ├── src/
│       │   ├── modules/   # 功能模組
│       │   ├── middleware/
│       │   └── index.ts
│       ├── prisma/
│       │   └── schema.prisma
│       └── package.json
│
├── .github/
│   └── workflows/         # GitHub Actions CI/CD
│
└── package.json           # Monorepo 根配置
```

## 🛠️ 開發指令

```bash
# 開發模式
npm run dev                # 同時啟動前後端
npm run dev:frontend       # 僅啟動前端
npm run dev:backend        # 僅啟動後端

# 建置
npm run build              # 建置所有專案

# 測試
npm run test               # 執行測試
npm run test:coverage      # 測試覆蓋率

# Lint
npm run lint               # 檢查程式碼

# 資料庫
npm run db:generate        # 產生 Prisma Client
npm run db:push            # 推送 Schema 到資料庫
npm run db:migrate         # 執行 Migration
npm run db:studio          # 開啟 Prisma Studio
```

## 🌐 網址

### 開發環境
- **前端**: http://localhost:3000
- **後端 API**: http://localhost:4000
- **API 文件**: http://localhost:4000/api-docs
- **Admin Panel**: http://localhost:3000/admin

### 預設帳號

| 角色 | Email | 密碼 |
|------|-------|------|
| Admin | admin@example.com | admin123 |
| 房東 | landlord@example.com | landlord123 |

## 📚 文件

- [部署指南](./DEPLOYMENT.md) - 完整部署說明
- [CI/CD 設定](./CI_CD_SETUP.md) - 快速設定 CI/CD
- [GitHub 設定](./GITHUB_SETUP.md) - GitHub Repository 設定
- [CI/CD 總結](./CI_CD_SUMMARY.md) - CI/CD 設定總結

## 🔧 技術棧

### Frontend
- **框架**: Next.js 14 (App Router)
- **語言**: TypeScript
- **樣式**: Tailwind CSS
- **狀態管理**: Zustand
- **地圖**: Leaflet
- **動畫**: Framer Motion

### Backend
- **框架**: Express.js
- **語言**: TypeScript
- **ORM**: Prisma
- **資料庫**: PostgreSQL / SQLite
- **認證**: JWT
- **搜尋**: Meilisearch
- **文件**: Swagger/OpenAPI

### DevOps
- **CI/CD**: GitHub Actions
- **部署**: Vercel (Frontend), DigitalOcean/Render (Backend)
- **容器化**: Docker

## 🧪 測試

```bash
# 執行所有測試
npm run test

# Watch 模式
npm run test:watch

# 測試覆蓋率
npm run test:coverage
```

## 📝 API 文件

啟動後端後，訪問 http://localhost:4000/api-docs 查看完整的 API 文件。

## 🤝 貢獻

1. Fork 本專案
2. 建立功能分支 (`git checkout -b feature/AmazingFeature`)
3. Commit 變更 (`git commit -m 'Add some AmazingFeature'`)
4. Push 到分支 (`git push origin feature/AmazingFeature`)
5. 開啟 Pull Request

## 📄 授權

本專案採用 MIT 授權。

## 🆘 問題回報

如有問題，請在 [GitHub Issues](https://github.com/YOUR_USERNAME/rental-platform/issues) 回報。

---

**開發中** 🚧





