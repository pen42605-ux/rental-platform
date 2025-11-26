# 環境變數設置指南

## 快速設置

### 1. 在 monorepo 根目錄創建 `.env` 文件

在 `rental-monorepo/` 目錄下創建 `.env` 文件，內容如下：

```env
# ==================== 資料庫設定 ====================
DATABASE_URL="file:./dev.db"

# ==================== JWT 設定 ====================
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
JWT_REFRESH_SECRET="your-super-secret-refresh-key-change-this-in-production"

# ==================== 前端設定 ====================
NEXT_PUBLIC_API_URL="http://localhost:4000"

# ==================== 其他設定 ====================
NODE_ENV="development"
PORT=4000
FRONTEND_URL="http://localhost:3000"
CORS_ORIGINS="http://localhost:3000"
```

### 2. 在 frontend 目錄創建 `.env.local` 文件（可選）

在 `rental-monorepo/packages/frontend/` 目錄下創建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_FACEBOOK_APP_ID=your-facebook-app-id
```

## 重要說明

### Next.js 環境變數

- **`NEXT_PUBLIC_*`** 前綴的變數會暴露給瀏覽器
- 修改環境變數後，**必須重啟 Next.js 開發服務器**才能生效
- `.env.local` 文件不會被提交到 Git（已在 `.gitignore` 中）

### 環境變數優先級

1. `.env.local` (最高優先級，僅本地開發)
2. `.env.development` 或 `.env.production`
3. `.env`
4. 代碼中的默認值

### 常見問題

#### 問題：`NEXT_PUBLIC_API_URL` 未定義

**解決方案：**
1. 確認已創建 `.env` 或 `.env.local` 文件
2. 確認變數名稱正確（`NEXT_PUBLIC_API_URL`）
3. **重啟 Next.js 開發服務器**（這很重要！）
4. 清除 Next.js 緩存：刪除 `.next` 目錄後重新啟動

#### 問題：環境變數修改後不生效

**解決方案：**
1. 停止 Next.js 服務器（Ctrl+C）
2. 刪除 `.next` 目錄：`rm -rf .next` (Mac/Linux) 或 `rmdir /s .next` (Windows)
3. 重新啟動：`npm run dev`

### 檢查環境變數是否正確加載

在瀏覽器 Console 中運行：
```javascript
console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
```

或在代碼中臨時添加：
```typescript
console.log('API Base URL:', API_BASE_URL);
```

## 生產環境設置

### Vercel 部署

在 Vercel 項目設置中添加環境變數：
- `NEXT_PUBLIC_API_URL`: 你的後端 API URL

### 本地生產構建

```bash
# 設置環境變數
export NEXT_PUBLIC_API_URL=https://api.yourdomain.com

# 構建
npm run build

# 啟動
npm start
```





