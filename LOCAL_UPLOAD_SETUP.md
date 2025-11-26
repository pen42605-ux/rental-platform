# 本地檔案上傳設定完成 ✅

## 🎉 已自動啟用本地儲存

當 S3 未配置時，系統會**自動使用本地檔案儲存**，無需額外設定！

---

## ✅ 已完成的工作

1. **自動偵測 S3 配置**
   - 如果 S3 未配置，自動切換到本地儲存
   - 無需修改任何代碼

2. **本地儲存服務**
   - 圖片儲存在 `packages/backend/uploads/listings/`
   - 自動建立目錄
   - 支援公開訪問

3. **前端自動適配**
   - 前端會自動判斷使用 S3 或本地儲存
   - 無需修改前端代碼

---

## 📁 檔案結構

```
packages/backend/
├── uploads/
│   └── listings/
│       └── [圖片檔案]
└── src/
    └── modules/
        └── uploads/
            ├── upload.service.ts      # S3 服務（自動切換）
            └── local-upload.service.ts # 本地儲存服務
```

---

## 🚀 使用方式

### 現在就可以上傳圖片！

1. **登入帳號**
   - 訪問: http://localhost:3000/login

2. **建立房源**
   - 訪問: http://localhost:3000/create

3. **上傳圖片**
   - 拖放或選擇圖片
   - 系統會自動使用本地儲存

---

## 📊 圖片訪問

上傳的圖片可以通過以下 URL 訪問：

```
http://localhost:4000/uploads/listings/[檔案名稱]
```

---

## 🔄 切換到 S3（生產環境）

當需要切換到 S3 時，只需設定環境變數：

```env
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
S3_BUCKET=your_bucket
```

系統會**自動切換**到 S3，無需修改代碼！

---

## 📝 注意事項

1. **本地儲存僅用於開發環境**
   - 生產環境建議使用 S3 或類似服務

2. **圖片不會被 Git 追蹤**
   - `uploads/` 目錄已在 `.gitignore` 中

3. **重啟後端**
   - 修改後需要重啟後端服務

---

## ✅ 測試

現在可以：
- ✅ 上傳圖片（自動使用本地儲存）
- ✅ 查看上傳的圖片
- ✅ 建立帶圖片的房源

**無需任何額外設定！**





