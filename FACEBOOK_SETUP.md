# Facebook OAuth 登入設定指南

## 1. 建立 Facebook App

1. 前往 [Facebook Developers](https://developers.facebook.com/)
2. 點擊「我的應用程式」→「建立應用程式」
3. 選擇「消費者」或「商業」類型
4. 填寫應用程式名稱和聯絡人 Email

## 2. 設定 Facebook Login

1. 在應用程式儀表板中，點擊「新增產品」
2. 選擇「Facebook 登入」
3. 點擊「設定」

## 3. 設定 OAuth 重新導向 URI

在「Facebook 登入」→「設定」中：

**有效的 OAuth 重新導向 URI：**
```
http://localhost:3000
http://localhost:4000/api/auth/facebook/callback
```

**生產環境：**
```
https://yourdomain.com
https://api.yourdomain.com/api/auth/facebook/callback
```

## 4. 取得 App ID 和 App Secret

1. 在應用程式儀表板中，點擊「設定」→「基本」
2. 複製「應用程式編號」（App ID）
3. 複製「應用程式密鑰」（App Secret）

## 5. 設定環境變數

在 `.env` 檔案中添加：

```env
# 後端
FACEBOOK_APP_ID="your-app-id"
FACEBOOK_APP_SECRET="your-app-secret"

# 前端
NEXT_PUBLIC_FACEBOOK_APP_ID="your-app-id"
```

## 6. 設定應用程式網域

在「設定」→「基本」中：

**應用程式網域：**
```
localhost
yourdomain.com
```

## 7. 設定隱私政策網址（選填）

在「設定」→「基本」中，可以添加隱私政策網址（生產環境建議設定）

## 8. 測試

1. 重啟後端服務
2. 重啟前端服務
3. 前往登入/註冊頁面
4. 點擊「使用 Facebook 帳號登入」按鈕
5. 授權後應該會自動登入

## 注意事項

- **開發環境**：Facebook App 預設只能在開發者帳號中測試
- **生產環境**：需要提交應用程式審查才能讓所有用戶使用
- **權限**：目前請求 `email` 和 `public_profile` 權限
- **安全性**：App Secret 請勿提交到 Git，僅在後端使用

## 疑難排解

### Facebook 登入按鈕不顯示
- 檢查 `NEXT_PUBLIC_FACEBOOK_APP_ID` 是否已設定
- 檢查瀏覽器 Console 是否有錯誤

### 登入失敗
- 檢查 Facebook App ID 和 Secret 是否正確
- 檢查 OAuth 重新導向 URI 是否已設定
- 檢查後端日誌查看詳細錯誤

### 無法取得 Email
- 確認已請求 `email` 權限
- 確認用戶的 Facebook 帳號有設定 Email





