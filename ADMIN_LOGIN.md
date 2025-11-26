# Admin 登入指南

## 🔑 預設 Admin 帳號

### 登入資訊
- **Email**: `admin@example.com`
- **密碼**: `admin123`

### 登入步驟

1. **前往登入頁面**
   - 網址: http://localhost:3000/login

2. **輸入帳號密碼**
   - Email: `admin@example.com`
   - 密碼: `admin123`

3. **登入後訪問 Admin Panel**
   - 網址: http://localhost:3000/admin

---

## ✅ 已修復的問題

1. **API 認證問題**
   - ✅ API 攔截器會自動從 localStorage 和 Zustand store 讀取 token
   - ✅ Token 驗證邏輯已改進
   - ✅ 401 錯誤時會自動清除認證並重定向到登入頁

2. **認證狀態檢查**
   - ✅ `checkAuth` 會驗證 token 是否有效
   - ✅ 無效 token 會自動清除

---

## 🚨 如果還是無法載入

### 檢查步驟

1. **確認已登入**
   ```javascript
   // 在瀏覽器 Console 執行
   console.log(localStorage.getItem('accessToken'));
   console.log(localStorage.getItem('auth-storage'));
   ```

2. **清除快取並重新登入**
   - 打開瀏覽器開發者工具 (F12)
   - 前往 Application > Local Storage
   - 清除所有項目
   - 重新登入

3. **檢查後端是否運行**
   - 訪問: http://localhost:4000/health
   - 應該看到 `{"status":"healthy"}`

4. **檢查 API 路徑**
   - 前端 API 路徑: `/admin/users`, `/admin/listings`, `/admin/audit-logs`
   - 後端 API 路徑: `/api/admin/users`, `/api/admin/listings`, `/api/admin/audit-logs`

---

## 📝 測試 API

### 使用 curl 測試（需要 token）

```bash
# 1. 先登入取得 token
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# 2. 使用 token 訪問 API
curl -X GET http://localhost:4000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🔧 如果沒有 Admin 帳號

### 建立 Admin 帳號

1. **使用 Prisma Studio**
   ```bash
   cd packages/backend
   npm run db:studio
   ```

2. **或執行 Seed**
   ```bash
   cd packages/backend
   npm run db:seed
   ```

Seed 會自動建立：
- Admin: `admin@example.com` / `admin123`
- Landlord: `landlord@example.com` / `landlord123`





