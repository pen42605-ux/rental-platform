# 圖片上傳問題修復指南

## 🔍 問題診斷

### 常見錯誤

1. **401 未授權**
   - 原因：未登入或 token 過期
   - 解決：先登入帳號

2. **S3 未配置**
   - 原因：缺少 AWS 配置
   - 錯誤碼：`S3_NOT_CONFIGURED`
   - 解決：設定環境變數

3. **檔案格式/大小錯誤**
   - 原因：不支援的格式或檔案過大
   - 解決：使用 JPG/PNG/WebP/GIF，每張 < 10MB

---

## ⚙️ 設定 S3（生產環境）

### 1. 建立 AWS S3 Bucket

1. 登入 AWS Console
2. 前往 S3 服務
3. 建立新 Bucket
4. 設定公開讀取權限（可選）

### 2. 建立 IAM 使用者

1. 前往 IAM > Users
2. 建立新使用者
3. 附加政策：`AmazonS3FullAccess` 或自訂政策
4. 建立 Access Key

### 3. 設定環境變數

在 `.env` 檔案中加入：

```env
# AWS S3 設定
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=ap-northeast-1
S3_BUCKET=your-bucket-name
```

### 4. 重啟後端

```bash
# 停止後端
# 重新啟動
npm run dev:backend
```

---

## 🛠️ 開發環境替代方案

如果沒有 AWS S3，可以使用本地儲存：

### 方案 1: 使用本地檔案系統（需要修改後端）

建立 `packages/backend/src/modules/uploads/local-upload.service.ts`：

```typescript
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuid } from 'uuid';

export async function uploadToLocal(file: File, filename: string) {
  const uploadDir = join(process.cwd(), 'uploads', 'listings');
  await mkdir(uploadDir, { recursive: true });
  
  const ext = filename.split('.').pop();
  const key = `${uuid()}.${ext}`;
  const filePath = join(uploadDir, key);
  
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);
  
  return {
    key,
    url: `/uploads/listings/${key}`,
  };
}
```

### 方案 2: 使用 Cloudinary（免費方案）

1. 註冊 Cloudinary：https://cloudinary.com
2. 取得 API Key
3. 安裝套件：`npm install cloudinary`
4. 修改上傳服務使用 Cloudinary

---

## ✅ 測試上傳

### 1. 確認已登入

```bash
# 檢查 localStorage
# 在瀏覽器 Console 執行
console.log(localStorage.getItem('accessToken'));
```

### 2. 測試 API

```bash
# 使用 curl（需要 token）
curl -X POST http://localhost:4000/api/uploads/presign \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "filename": "test.jpg",
    "mimeType": "image/jpeg",
    "size": 100000
  }'
```

### 3. 檢查錯誤訊息

- 打開瀏覽器開發者工具 (F12)
- 前往 Network 標籤
- 選擇失敗的請求
- 查看 Response 中的錯誤訊息

---

## 🔧 快速修復步驟

### 如果沒有 S3：

1. **暫時跳過圖片上傳**
   - 建立房源時不選擇圖片
   - 或使用測試圖片 URL

2. **設定環境變數為空**
   ```env
   AWS_ACCESS_KEY_ID=
   AWS_SECRET_ACCESS_KEY=
   S3_BUCKET=
   ```
   - 後端會回傳錯誤，但不會崩潰

3. **使用免費 S3 替代方案**
   - Cloudinary（免費 25GB）
   - ImgBB（免費圖片託管）
   - 或使用本地儲存

---

## 📝 檢查清單

- [ ] 已登入帳號
- [ ] 設定 AWS_ACCESS_KEY_ID
- [ ] 設定 AWS_SECRET_ACCESS_KEY
- [ ] 設定 S3_BUCKET
- [ ] 設定 AWS_REGION
- [ ] 後端已重啟
- [ ] 圖片格式正確（JPG/PNG/WebP/GIF）
- [ ] 圖片大小 < 10MB

---

## 🆘 如果還是無法上傳

1. **檢查後端日誌**
   ```bash
   # 查看後端終端輸出
   # 尋找錯誤訊息
   ```

2. **檢查瀏覽器 Console**
   - 按 F12 > Console
   - 查看錯誤訊息

3. **檢查 Network 請求**
   - 按 F12 > Network
   - 找到失敗的請求
   - 查看 Status Code 和 Response

4. **測試 API 端點**
   - 訪問：http://localhost:4000/api-docs
   - 測試 `/api/uploads/presign` 端點





