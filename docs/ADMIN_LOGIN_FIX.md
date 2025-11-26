# 🔧 Admin 登入問題修復指南

## 問題：Admin 登入失敗

### 可能原因

1. **資料庫中沒有 Admin 帳號**
2. **密碼不正確**
3. **帳號被鎖定（isBlocked = true）**
4. **資料庫連線問題**

---

## ✅ 解決方案

### 方法 1：執行 Seed 建立 Admin 帳號

```bash
cd packages/backend
npm run db:seed
```

這會建立：
- **Email**: `admin@example.com`
- **密碼**: `admin123`
- **角色**: `ADMIN`

### 方法 2：使用 Admin 管理工具（推薦）

我們提供了一個互動式工具來建立或重置 Admin 帳號：

```bash
cd packages/backend
npm run create-admin
```

工具會詢問：
- Admin Email（預設：admin@example.com）
- Admin 密碼（預設：admin123）
- Admin 名稱（預設：Admin）

### 方法 3：手動建立 Admin 帳號

#### 使用 Prisma Studio

```bash
cd packages/backend
npm run db:studio
```

然後在 Prisma Studio 中：
1. 打開 `User` 表
2. 點擊 "Add record"
3. 填入以下資料：
   - `email`: `admin@example.com`
   - `passwordHash`: 需要先 Hash 密碼（見下方）
   - `name`: `Admin`
   - `role`: `ADMIN`
   - `isVerified`: `true`
   - `isBlocked`: `false`

#### 使用 SQL（SQLite）

```bash
cd packages/backend
sqlite3 prisma/dev.db
```

```sql
-- 注意：需要先 Hash 密碼，這裡只是範例
-- 實際密碼 hash 可以使用 Node.js 生成
INSERT INTO users (id, email, password_hash, name, role, is_verified, created_at, updated_at)
VALUES (
  lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))), 2) || '-' || substr('89ab', abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))), 2) || '-' || lower(hex(randomblob(6))),
  'admin@example.com',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYqJZ5q5q5q', -- admin123 的 hash
  'Admin',
  'ADMIN',
  1,
  datetime('now'),
  datetime('now')
);
```

---

## 🔍 檢查 Admin 帳號

### 檢查帳號是否存在

```bash
cd packages/backend
npm run db:studio
```

在 Prisma Studio 中查看 `User` 表，確認：
- ✅ 有 `admin@example.com` 的記錄
- ✅ `role` 欄位是 `ADMIN`
- ✅ `isBlocked` 是 `false`
- ✅ `isVerified` 是 `true`

### 測試登入

#### 使用 curl

```bash
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "admin123"
  }'
```

#### 使用前端

1. 訪問：http://localhost:3000/login
2. 輸入：
   - Email: `admin@example.com`
   - 密碼: `admin123`
3. 點擊登入

---

## 🚨 常見問題

### 問題 1：密碼不正確

**解決方法：**
- 使用 `npm run create-admin` 重置密碼
- 或執行 `npm run db:seed` 重新建立

### 問題 2：帳號被鎖定

**檢查：**
```sql
SELECT email, is_blocked, blocked_at, blocked_reason 
FROM users 
WHERE email = 'admin@example.com';
```

**解鎖：**
```sql
UPDATE users 
SET is_blocked = 0, blocked_at = NULL, blocked_reason = NULL 
WHERE email = 'admin@example.com';
```

### 問題 3：後端未啟動

**檢查：**
```bash
# 確認後端是否運行
curl http://localhost:4000/health
```

**啟動後端：**
```bash
cd packages/backend
npm run dev
```

### 問題 4：資料庫連線問題

**檢查：**
```bash
cd packages/backend
npm run db:studio
```

如果無法開啟，檢查：
- 資料庫檔案是否存在：`prisma/dev.db`
- 執行 `npx prisma db push` 同步 Schema

---

## 📝 預設 Admin 帳號資訊

- **Email**: `admin@example.com`
- **密碼**: `admin123`
- **角色**: `ADMIN`

**⚠️ 重要：** 生產環境請務必更改預設密碼！

---

## 🔐 生成密碼 Hash

如果需要手動生成密碼 hash：

```javascript
const bcrypt = require('bcryptjs');
const hash = await bcrypt.hash('your-password', 12);
console.log(hash);
```

或在 Node.js REPL 中：

```bash
node
> const bcrypt = require('bcryptjs');
> bcrypt.hash('admin123', 12).then(h => console.log(h));
```

---

## ✅ 驗證修復

登入成功後，您應該能夠：
1. ✅ 訪問 `/admin` 頁面
2. ✅ 查看用戶列表
3. ✅ 管理房源
4. ✅ 查看審計日誌

如果還有問題，請檢查：
- 瀏覽器 Console 的錯誤訊息
- 後端日誌
- 網路請求（Network tab）



