# 部署指南

本文件說明如何設定 CI/CD 自動部署流程。

## 📋 目錄

- [GitHub Actions 設定](#github-actions-設定)
- [Vercel 部署（Frontend）](#vercel-部署frontend)
- [DigitalOcean App Platform 部署（Backend）](#digitalocean-app-platform-部署backend)
- [Render 部署（Backend）](#render-部署backend)
- [環境變數設定](#環境變數設定)

---

## GitHub Actions 設定

### 1. 設定 GitHub Secrets

前往 GitHub Repository → Settings → Secrets and variables → Actions，新增以下 Secrets：

#### Frontend (Vercel)
```
VERCEL_TOKEN              # Vercel API Token
VERCEL_ORG_ID             # Vercel Organization ID
VERCEL_PROJECT_ID         # Vercel Project ID
NEXT_PUBLIC_API_URL       # 後端 API URL (例如: https://api.example.com)
```

#### Backend (DigitalOcean)
```
DIGITALOCEAN_ACCESS_TOKEN # DigitalOcean API Token
DIGITALOCEAN_APP_NAME     # App 名稱
DIGITALOCEAN_APP_ID       # App ID (選填)
```

#### Backend (Render)
```
RENDER_API_KEY            # Render API Key
RENDER_SERVICE_ID         # Render Service ID
```

---

## Vercel 部署（Frontend）

### 方式 1: 使用 GitHub Actions（推薦）

1. **取得 Vercel Token**
   - 前往 https://vercel.com/account/tokens
   - 建立新的 Token
   - 複製 Token 並設定為 `VERCEL_TOKEN` secret

2. **取得 Project ID 和 Org ID**
   ```bash
   # 安裝 Vercel CLI
   npm i -g vercel
   
   # 登入
   vercel login
   
   # 連結專案（在 packages/frontend 目錄下）
   cd packages/frontend
   vercel link
   
   # 查看專案資訊
   vercel inspect
   ```
   - 複製 `Project ID` → 設定為 `VERCEL_PROJECT_ID`
   - 複製 `Org ID` → 設定為 `VERCEL_ORG_ID`

3. **設定環境變數**
   - 在 Vercel Dashboard → Project Settings → Environment Variables
   - 新增 `NEXT_PUBLIC_API_URL`

### 方式 2: 使用 Vercel Dashboard

1. 前往 https://vercel.com/new
2. 連結 GitHub Repository
3. 設定：
   - **Root Directory**: `packages/frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm ci`

### Vercel 設定檔範例

建立 `packages/frontend/vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm ci",
  "framework": "nextjs",
  "outputDirectory": ".next",
  "env": {
    "NEXT_PUBLIC_API_URL": "@api_url"
  }
}
```

---

## DigitalOcean App Platform 部署（Backend）

### 1. 建立 App

1. 前往 https://cloud.digitalocean.com/apps
2. 點擊 "Create App"
3. 選擇 GitHub Repository
4. 設定：

   **App 設定：**
   - **Name**: `rental-platform-backend`
   - **Region**: 選擇最近的區域

   **Service 設定：**
   - **Type**: Web Service
   - **Source Directory**: `packages/backend`
   - **Build Command**: 
     ```bash
     npm ci && npm run db:generate && npm run build
     ```
   - **Run Command**: 
     ```bash
     npm start
     ```
   - **HTTP Port**: `4000`
   - **Environment**: Production

### 2. 設定環境變數

在 App Settings → App-Level Environment Variables：

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET=your_bucket_name
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=your_meilisearch_key
FRONTEND_URL=https://your-frontend.vercel.app
CORS_ORIGINS=https://your-frontend.vercel.app
```

### 3. 設定資料庫

1. 在 App 中新增 PostgreSQL Database Component
2. 複製 Connection String 到 `DATABASE_URL`
3. 執行 Migration：
   ```bash
   # 在 App Console 或透過 GitHub Actions
   npm run db:migrate
   ```

### 4. 設定 GitHub Actions

取得 DigitalOcean API Token：
1. 前往 https://cloud.digitalocean.com/account/api/tokens
2. 建立新的 Token
3. 設定為 `DIGITALOCEAN_ACCESS_TOKEN` secret

---

## Render 部署（Backend）

### 1. 建立 Web Service

1. 前往 https://dashboard.render.com
2. 點擊 "New +" → "Web Service"
3. 連結 GitHub Repository
4. 設定：

   **Service 設定：**
   - **Name**: `rental-platform-backend`
   - **Region**: 選擇最近的區域
   - **Branch**: `main`
   - **Root Directory**: `packages/backend`
   - **Environment**: `Node`
   - **Build Command**: 
     ```bash
     npm ci && npm run db:generate && npm run build
     ```
   - **Start Command**: 
     ```bash
     npm start
     ```

### 2. 設定環境變數

在 Environment 標籤新增：

```env
NODE_ENV=production
PORT=4000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=30d
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET=your_bucket_name
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=your_meilisearch_key
FRONTEND_URL=https://your-frontend.vercel.app
CORS_ORIGINS=https://your-frontend.vercel.app
```

### 3. 設定資料庫

1. 在 Render Dashboard 建立 PostgreSQL Database
2. 複製 Internal Database URL 到 `DATABASE_URL`
3. 執行 Migration：
   ```bash
   # 在 Render Shell 中執行
   npm run db:migrate
   ```

### 4. 設定 GitHub Actions

取得 Render API Key：
1. 前往 https://dashboard.render.com/account/api-keys
2. 建立新的 API Key
3. 設定為 `RENDER_API_KEY` secret
4. 取得 Service ID（在 Service Settings → Info）
5. 設定為 `RENDER_SERVICE_ID` secret

---

## 環境變數設定

### Frontend 環境變數

在 Vercel Dashboard 或 `.env.production`:

```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

### Backend 環境變數

#### 必要變數
```env
DATABASE_URL=postgresql://user:password@host:5432/database
JWT_SECRET=your-super-secret-jwt-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
```

#### 選填變數
```env
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=ap-northeast-1
AWS_S3_BUCKET=
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=
FRONTEND_URL=https://your-frontend.vercel.app
CORS_ORIGINS=https://your-frontend.vercel.app
```

---

## 部署流程

### 自動部署（推薦）

1. **Push 到 main 分支**
   ```bash
   git push origin main
   ```

2. **GitHub Actions 自動執行**
   - CI Pipeline: Lint + Test
   - Deploy Pipeline: 部署到 Vercel / DigitalOcean / Render

### 手動部署

#### Frontend (Vercel)
```bash
cd packages/frontend
vercel --prod
```

#### Backend (DigitalOcean)
- 使用 GitHub Actions workflow_dispatch
- 或在 DigitalOcean Dashboard 手動觸發部署

#### Backend (Render)
- 使用 GitHub Actions workflow_dispatch
- 或在 Render Dashboard 手動觸發部署

---

## 故障排除

### CI 失敗

1. **Lint 錯誤**
   ```bash
   npm run lint
   ```

2. **測試失敗**
   ```bash
   npm run test
   ```

3. **建置失敗**
   ```bash
   npm run build
   ```

### 部署失敗

1. **檢查環境變數**
   - 確認所有必要的環境變數都已設定

2. **檢查日誌**
   - Vercel: Dashboard → Deployments → View Function Logs
   - DigitalOcean: App → Runtime Logs
   - Render: Service → Logs

3. **檢查資料庫連線**
   ```bash
   # 測試連線
   npm run db:studio
   ```

---

## 監控與維護

### 健康檢查端點

- **Backend**: `https://your-api.com/health`
- **Frontend**: `https://your-frontend.vercel.app`

### 定期維護

1. **更新依賴**
   ```bash
   npm update
   ```

2. **執行 Migration**
   ```bash
   npm run db:migrate
   ```

3. **備份資料庫**
   - DigitalOcean: 自動備份
   - Render: 手動備份

---

## 參考資源

- [Vercel Documentation](https://vercel.com/docs)
- [DigitalOcean App Platform](https://docs.digitalocean.com/products/app-platform/)
- [Render Documentation](https://render.com/docs)
- [GitHub Actions](https://docs.github.com/en/actions)





