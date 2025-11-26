# 上傳 404 錯誤修復指南

## 🔍 問題診斷

404 錯誤通常表示：
1. 後端路由未正確註冊
2. 前端請求路徑不正確
3. 後端未重啟，新路由未生效

---

## ✅ 已修復的問題

1. **前端上傳邏輯**
   - 使用 `api` 實例（自動加上 baseURL 和認證）
   - 正確處理相對路徑

2. **後端路由**
   - `/api/uploads/local/:key` 路由已註冊
   - 使用 multer 處理檔案上傳

---

## 🔧 解決步驟

### 1. 確認後端已重啟

**重要**：修改後端代碼後，必須重啟後端服務！

```bash
# 停止後端（Ctrl+C）
# 重新啟動
cd packages/backend
npm run dev
```

### 2. 檢查路由是否註冊

訪問後端 API 文件：
```
http://localhost:4000/api-docs
```

應該能看到：
- `POST /api/uploads/presign`
- `POST /api/uploads/presign-batch`
- `POST /api/uploads/local/:key` (本地上傳)

### 3. 檢查瀏覽器 Console

按 F12 > Console，查看具體錯誤：
- 404 錯誤的完整 URL
- 請求方法（GET/POST）
- 錯誤訊息

### 4. 測試上傳流程

1. **登入帳號**
   - 訪問: http://localhost:3000/login

2. **建立房源**
   - 訪問: http://localhost:3000/create

3. **上傳圖片**
   - 拖放或選擇圖片
   - 查看 Console 是否有錯誤

---

## 🐛 常見問題

### 問題 1: 後端未重啟

**症狀**：404 錯誤，路由不存在

**解決**：
```bash
# 停止後端
# 重新啟動
npm run dev:backend
```

### 問題 2: 認證問題

**症狀**：401 錯誤

**解決**：
- 確認已登入
- 檢查 localStorage 是否有 `accessToken`

### 問題 3: 路由路徑錯誤

**症狀**：404 錯誤，但路由存在

**解決**：
- 檢查前端請求的完整 URL
- 確認 baseURL 設定正確

---

## 📝 檢查清單

- [ ] 後端已重啟
- [ ] 已登入帳號
- [ ] 路由已註冊（檢查 `/api-docs`）
- [ ] 瀏覽器 Console 無其他錯誤
- [ ] 網路請求路徑正確

---

## 🔍 調試步驟

### 1. 檢查後端日誌

查看後端終端輸出，確認：
- 路由是否正確註冊
- 是否有錯誤訊息

### 2. 檢查網路請求

按 F12 > Network：
- 找到失敗的請求
- 查看 Request URL
- 查看 Response

### 3. 測試 API 端點

使用 Postman 或 curl 測試：

```bash
# 1. 先登入取得 token
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123"}'

# 2. 取得 presigned URL
curl -X POST http://localhost:4000/api/uploads/presign \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"filename":"test.jpg","mimeType":"image/jpeg","size":1000}'
```

---

## ✅ 如果還是無法解決

1. **清除瀏覽器快取**
   - 按 Ctrl+Shift+Delete
   - 清除快取和 Cookie

2. **重新安裝依賴**
   ```bash
   cd packages/backend
   rm -rf node_modules
   npm install
   ```

3. **檢查後端日誌**
   - 查看終端輸出
   - 尋找錯誤訊息

---

## 📞 需要幫助？

提供以下資訊：
1. 瀏覽器 Console 的完整錯誤訊息
2. Network 標籤中失敗請求的詳細資訊
3. 後端終端的錯誤日誌





