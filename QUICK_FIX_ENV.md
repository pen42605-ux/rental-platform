# 快速修復 NEXT_PUBLIC_API_URL 錯誤

## 問題
如果看到 "Context access might be invalid: NEXT_PUBLIC_API_URL" 錯誤，這是因為環境變數未設置。

## 解決方案

### 方法 1：創建 .env 文件（最簡單）

在 `rental-monorepo/` 目錄下創建 `.env` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 方法 2：創建 .env.local 文件

在 `rental-monorepo/packages/frontend/` 目錄下創建 `.env.local` 文件：

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

## 重要步驟

**修改環境變數後，必須：**

1. **停止前端服務**（按 `Ctrl+C`）

2. **清除 Next.js 緩存**（可選但推薦）：
   ```powershell
   # Windows PowerShell
   Remove-Item -Recurse -Force packages\frontend\.next
   ```

3. **重新啟動前端服務**：
   ```bash
   npm run dev:frontend
   ```

## 驗證

重啟後，錯誤應該消失。如果仍有問題，檢查：

1. `.env` 文件是否在正確的位置
2. 變數名稱是否正確（`NEXT_PUBLIC_API_URL`）
3. 是否已重啟服務

## 注意

- 代碼已經有默認值 `http://localhost:4000`，所以即使不設置環境變數，API 也會使用默認值
- 但 Next.js 在構建時可能會警告，設置環境變數可以消除警告





