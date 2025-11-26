# 金流功能說明文檔

## 功能概述

本系統實現了完整的金流功能，支援多種支付方式和支付服務商，適用於租屋平台的會員付費、刊登費、VIP、置頂等服務。

## 已實現功能

### ✅ 1. 資料庫結構
- **Order（訂單）**：記錄用戶購買的訂單
- **OrderItem（訂單項目）**：訂單中的具體商品/服務
- **Payment（付款記錄）**：記錄每筆付款
- **Subscription（訂閱/套餐）**：用戶的套餐使用記錄
- **WebhookLog（Webhook 記錄）**：記錄所有支付回調

### ✅ 2. 支付方式支援
- ✅ 信用卡（透過綠界/藍新）
- ✅ ATM 轉帳（虛擬帳號）
- ✅ 超商代碼（CVS）
- ✅ 網路 ATM（WebATM）
- ✅ LINE Pay
- ✅ Apple Pay（透過信用卡處理）
- ✅ Google Pay（透過信用卡處理）

### ✅ 3. 支付服務商整合
- ✅ **模擬支付（MOCK）**：用於開發測試
- ✅ **綠界（ECPay）**：台灣常用支付服務商
- ✅ **藍新（NewebPay）**：台灣常用支付服務商
- ✅ **LINE Pay**：LINE 支付服務

### ✅ 4. Webhook 處理
- ✅ 自動記錄所有 Webhook 請求
- ✅ 驗證支付回調簽名
- ✅ 自動更新訂單和付款狀態
- ✅ 付款成功後自動創建訂閱記錄

### ✅ 5. 前端頁面
- ✅ **選擇方案頁面** (`/pricing/select`)：選擇要購買的方案
- ✅ **結帳頁面** (`/checkout`)：Stripe-like 結帳體驗
- ✅ **訂單列表頁面** (`/orders`)：查看所有訂單
- ✅ **訂單詳情頁面** (`/orders/[id]`)：查看訂單詳情和付款記錄

## API 端點

### 訂單相關
- `POST /api/payment/orders` - 創建訂單
- `GET /api/payment/orders` - 獲取用戶訂單列表
- `GET /api/payment/orders/:id` - 獲取訂單詳情

### 付款相關
- `POST /api/payment/payments` - 創建付款
- `GET /api/payment/payments/:transactionId/status` - 查詢付款狀態
- `POST /api/payment/callback/:provider` - 支付回調（由支付服務商調用）

## 環境變數設定

在 `.env` 或 `.env.local` 中設定以下變數：

```bash
# 支付服務商選擇
PAYMENT_PROVIDER="MOCK"  # 開發時使用 MOCK，生產環境使用 ECPAY 或 NEWEBPAY

# 綠界（ECPay）設定
ECPAY_MERCHANT_ID=""
ECPAY_HASH_KEY=""
ECPAY_HASH_IV=""
ECPAY_SANDBOX="true"  # 沙盒模式
ECPAY_RETURN_URL="http://localhost:4000/api/payment/callback/ecpay/return"
ECPAY_NOTIFY_URL="http://localhost:4000/api/payment/callback/ecpay/notify"

# 藍新（NewebPay）設定
NEWEBPAY_MERCHANT_ID=""
NEWEBPAY_HASH_KEY=""
NEWEBPAY_HASH_IV=""
NEWEBPAY_SANDBOX="true"  # 沙盒模式
NEWEBPAY_RETURN_URL="http://localhost:4000/api/payment/callback/newebpay/return"
NEWEBPAY_NOTIFY_URL="http://localhost:4000/api/payment/callback/newebpay/notify"

# LINE Pay 設定
LINEPAY_CHANNEL_ID=""
LINEPAY_CHANNEL_SECRET=""
LINEPAY_SANDBOX="true"  # 沙盒模式
LINEPAY_RETURN_URL="http://localhost:4000/api/payment/callback/linepay/return"
LINEPAY_CANCEL_URL="http://localhost:4000/api/payment/callback/linepay/cancel"

# API 基礎 URL
API_BASE_URL="http://localhost:4000"
```

## 使用流程

### 1. 用戶選擇方案
- 訪問 `/pricing/select`
- 選擇要購買的方案（單筆刊登、套餐、加值服務）
- 點擊「前往結帳」

### 2. 創建訂單
- 系統自動創建訂單
- 跳轉到 `/checkout?orderId=xxx`

### 3. 選擇支付方式
- 在結帳頁面選擇支付方式（信用卡、LINE Pay、ATM、CVS）
- 點擊「確認付款」

### 4. 處理付款
- **信用卡/LINE Pay**：跳轉到支付服務商頁面
- **ATM/CVS**：顯示虛擬帳號或超商代碼

### 5. 支付回調
- 支付服務商調用 `/api/payment/callback/:provider`
- 系統自動驗證並更新訂單狀態
- 付款成功後自動創建訂閱記錄

### 6. 查看訂單
- 訪問 `/orders` 查看所有訂單
- 點擊訂單查看詳情和付款記錄

## 測試模式（沙盒）

所有支付服務商都支援沙盒模式：
- 設定 `ECPAY_SANDBOX="true"`
- 設定 `NEWEBPAY_SANDBOX="true"`
- 設定 `LINEPAY_SANDBOX="true"`

在沙盒模式下，可以使用測試帳號和測試卡片進行測試。

## 下一步建議

1. **整合真實支付服務商**：
   - 申請綠界、藍新或 LINE Pay 帳號
   - 設定生產環境的 API Key 和 Secret
   - 更新環境變數

2. **完善退款功能**：
   - 實作各支付服務商的退款 API
   - 建立退款審核流程

3. **訂閱管理**：
   - 建立套餐使用介面
   - 實作套餐過期提醒
   - 建立套餐續費功能

4. **報表和分析**：
   - 建立銷售報表
   - 分析熱門方案
   - 收入統計

## 注意事項

1. **安全性**：
   - 所有支付相關的 API 都需要認證
   - Webhook 回調需要驗證簽名
   - 敏感資訊不要記錄在日誌中

2. **錯誤處理**：
   - 所有支付操作都有錯誤處理
   - Webhook 記錄所有回調，方便排查問題

3. **測試**：
   - 建議先在沙盒環境測試
   - 測試各種支付方式和場景
   - 測試 Webhook 回調處理



