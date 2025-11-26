# 登入問題診斷指南

## 常見登入問題及解決方法

### 1. 檢查後端服務是否運行

**問題**: 無法連接到伺服器

**解決方法**:
```bash
# 進入後端目錄
cd packages/backend

# 檢查後端是否運行
# 應該看到類似 "🚀 伺服器運行於 http://localhost:4000" 的訊息

# 如果沒有運行，啟動後端
npm run dev
```

### 2. 檢查 API URL 配置

**問題**: 前端無法連接到後端 API

**檢查方法**:
1. 確認 `.env` 文件中有 `NEXT_PUBLIC_API_URL` 設定
2. 預設值應該是 `http://localhost:4000`
3. 如果後端運行在不同端口，請更新此設定

**解決方法**:
在 `rental-monorepo/.env` 文件中添加或修改：
```
NEXT_PUBLIC_API_URL=http://localhost:4000
```

### 3. 檢查資料庫連接

**問題**: 資料庫連接失敗

**檢查方法**:
```bash
# 進入後端目錄
cd packages/backend

# 檢查資料庫連接
npx prisma db pull

# 或檢查健康狀態
curl http://localhost:4000/health
```

**解決方法**:
1. 確認 `.env` 文件中的 `DATABASE_URL` 設定正確
2. 如果使用 PostgreSQL，確認服務正在運行
3. 如果使用 SQLite，確認文件路徑正確

### 4. 檢查 JWT Secret 配置

**問題**: Token 生成失敗

**解決方法**:
在 `rental-monorepo/.env` 文件中確認有設定：
```
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 5. 檢查 CORS 設定

**問題**: CORS 錯誤

**解決方法**:
在 `rental-monorepo/.env` 文件中確認：
```
CORS_ORIGINS=http://localhost:3000
FRONTEND_URL=http://localhost:3000
```

### 6. 檢查使用者是否存在

**問題**: Email 或密碼錯誤

**檢查方法**:
```bash
# 進入後端目錄
cd packages/backend

# 使用 Prisma Studio 查看資料庫
npx prisma studio

# 或創建測試使用者
npm run create-admin
```

### 7. 檢查瀏覽器控制台

**問題**: 前端錯誤

**檢查方法**:
1. 打開瀏覽器開發者工具 (F12)
2. 查看 Console 標籤頁的錯誤訊息
3. 查看 Network 標籤頁的請求狀態

### 8. 完整診斷步驟

1. **確認後端運行**:
   ```bash
   curl http://localhost:4000/health
   ```
   應該返回 JSON 健康狀態

2. **確認前端運行**:
   訪問 `http://localhost:3000` 應該能看到首頁

3. **測試 API 端點**:
   ```bash
   curl -X POST http://localhost:4000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"test1234"}'
   ```

4. **檢查環境變數**:
   ```bash
   # 後端
   cd packages/backend
   cat ../../.env | grep -E "(DATABASE_URL|JWT_SECRET|PORT)"
   
   # 前端
   cd packages/frontend
   cat ../../.env | grep NEXT_PUBLIC_API_URL
   ```

### 9. 常見錯誤訊息對照

| 錯誤訊息 | 可能原因 | 解決方法 |
|---------|---------|---------|
| 無法連接到伺服器 | 後端未運行 | 啟動後端服務 |
| Email 或密碼錯誤 | 使用者不存在或密碼錯誤 | 檢查資料庫或註冊新帳號 |
| CORS 錯誤 | CORS 設定不正確 | 檢查 CORS_ORIGINS 設定 |
| 伺服器錯誤 | 資料庫連接失敗或配置錯誤 | 檢查資料庫連接和環境變數 |
| Token 無效 | JWT_SECRET 設定錯誤 | 確認 JWT_SECRET 設定 |

### 10. 快速修復命令

```bash
# 1. 重新啟動後端
cd packages/backend
npm run dev

# 2. 重新啟動前端
cd packages/frontend
npm run dev

# 3. 重置資料庫（開發環境）
cd packages/backend
npx prisma migrate reset

# 4. 創建測試使用者
cd packages/backend
npm run create-admin
```

## 需要更多幫助？

如果以上方法都無法解決問題，請：
1. 檢查後端日誌輸出
2. 檢查瀏覽器控制台錯誤
3. 確認所有環境變數都已正確設定
4. 確認資料庫服務正在運行


