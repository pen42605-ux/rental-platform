# 🚀 快速啟動指南

## 問題：ERR_CONNECTION_REFUSED

這個錯誤表示**後端服務器沒有運行**。請按照以下步驟啟動服務。

---

## ✅ 解決方法

### 方法 1：同時啟動前端和後端（推薦）

```bash
# 在專案根目錄執行
cd rental-monorepo
npm run dev
```

這會同時啟動：
- 後端：http://localhost:4000
- 前端：http://localhost:3000

### 方法 2：分別啟動（如果方法 1 失敗）

#### 步驟 1：啟動後端

打開**第一個終端視窗**：

```bash
cd rental-monorepo
npm run dev:backend
```

應該看到：
```
🚀 伺服器運行於 http://localhost:4000
📚 API 文件: http://localhost:4000/api-docs
```

#### 步驟 2：啟動前端

打開**第二個終端視窗**：

```bash
cd rental-monorepo
npm run dev:frontend
```

應該看到：
```
- ready started server on 0.0.0.0:3000
```

---

## 🔧 如果仍然無法啟動

### 1. 檢查環境變數

確認 `rental-monorepo/.env` 文件存在：

```bash
cd rental-monorepo
# 如果沒有 .env 文件，複製範例
cp env.example .env
```

### 2. 檢查依賴是否安裝

```bash
cd rental-monorepo
npm install
```

### 3. 檢查資料庫配置

```bash
cd rental-monorepo/packages/backend

# 生成 Prisma Client
npm run db:generate

# 推送資料庫 Schema
npm run db:push
```

### 4. 檢查端口是否被占用

**Windows PowerShell:**
```powershell
# 檢查 4000 端口
netstat -ano | findstr :4000

# 檢查 3000 端口
netstat -ano | findstr :3000
```

**如果端口被占用，可以：**
- 關閉占用端口的程序
- 或修改 `.env` 文件中的端口設定

---

## 📋 完整啟動檢查清單

- [ ] 已安裝 Node.js (版本 20.x 或更高)
- [ ] 已執行 `npm install`
- [ ] 已建立 `.env` 文件
- [ ] 已執行 `npm run db:generate`
- [ ] 已執行 `npm run db:push`
- [ ] 後端服務正在運行（看到 "🚀 伺服器運行於 http://localhost:4000"）
- [ ] 前端服務正在運行（看到 "ready started server on 0.0.0.0:3000"）

---

## 🧪 測試服務是否運行

### 測試後端

在瀏覽器訪問：http://localhost:4000/health

應該看到：
```json
{
  "status": "healthy",
  "timestamp": "...",
  "database": "connected"
}
```

### 測試前端

在瀏覽器訪問：http://localhost:3000

應該看到首頁。

---

## 🆘 常見錯誤

### 錯誤 1：找不到模組

```
Error: Cannot find module 'xxx'
```

**解決方法：**
```bash
cd rental-monorepo
npm install
```

### 錯誤 2：資料庫連接失敗

```
Error: Can't reach database server
```

**解決方法：**
1. 檢查 `.env` 中的 `DATABASE_URL`
2. 如果使用 SQLite，確認文件路徑正確
3. 如果使用 PostgreSQL，確認服務正在運行

### 錯誤 3：端口已被占用

```
Error: listen EADDRINUSE: address already in use :::4000
```

**解決方法：**
1. 關閉占用端口的程序
2. 或修改 `.env` 中的 `BACKEND_PORT`

---

## 📞 需要幫助？

如果以上方法都無法解決，請提供：
1. 終端輸出的完整錯誤訊息
2. 執行 `node --version` 和 `npm --version` 的結果
3. `.env` 文件的內容（隱藏敏感資訊）


