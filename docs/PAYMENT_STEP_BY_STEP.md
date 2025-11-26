# 金流功能 - 一步一步教學指南

## 📋 步驟總覽

1. ✅ 建立後端框架
2. ⏳ 安裝金流 SDK
3. ⏳ 建立資料庫
4. ⏳ 建立 /pay/create API
5. ⏳ 建立 /pay/webhook API
6. ⏳ 建立前端結帳按鈕與跳轉頁

---

## 步驟 1：建立後端框架 ✅

### 檢查現有結構

您的專案已經有完整的後端框架了！

**檔案位置：**
- 後端主程式：`packages/backend/src/index.ts`
- 後端設定：`packages/backend/package.json`
- 路由已註冊：支付路由已在 `index.ts` 中引入

**確認事項：**
✅ Express.js 框架已安裝
✅ TypeScript 已設定
✅ Prisma ORM 已安裝
✅ 路由系統已建立

**下一步：** 安裝金流 SDK

---

## 步驟 2：安裝金流 SDK

### 需要安裝的套件

我們需要安裝以下套件來支援金流功能：

1. **crypto** - Node.js 內建模組（用於加密和簽名驗證）
2. **uuid** - 已安裝 ✅
3. **zod** - 已安裝 ✅（用於資料驗證）

### 執行安裝

```bash
cd packages/backend
npm install
```

**注意：** 所有必要的套件都已經在 `package.json` 中了！

---

## 步驟 3：建立資料庫

### 3.1 更新 Prisma Schema

**檔案位置：** `packages/backend/prisma/schema.prisma`

這個檔案已經包含了完整的金流相關模型：
- ✅ Order（訂單）
- ✅ OrderItem（訂單項目）
- ✅ Payment（付款記錄）
- ✅ Subscription（訂閱/套餐）
- ✅ WebhookLog（Webhook 記錄）

### 3.2 執行資料庫 Migration

```bash
cd packages/backend
npx prisma db push
```

這會將 Schema 同步到資料庫。

---

## 步驟 4：建立 /pay/create API

### 4.1 建立付款控制器

**檔案位置：** `packages/backend/src/modules/payment/payment.controller.ts`

這個檔案已經存在並包含：
- ✅ `createPaymentHandler` - 創建付款的處理函數

### 4.2 建立付款路由

**檔案位置：** `packages/backend/src/modules/payment/payment.routes.ts`

路由已設定為：
- `POST /api/payment/payments` - 創建付款

### 4.3 測試 API

使用以下命令測試：

```bash
# 啟動後端
cd packages/backend
npm run dev
```

然後使用 Postman 或 curl 測試：

```bash
curl -X POST http://localhost:4000/api/payment/payments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "orderId": "order-uuid",
    "paymentMethod": "CREDIT_CARD"
  }'
```

---

## 步驟 5：建立 /pay/webhook API

### 5.1 Webhook 處理器

**檔案位置：** `packages/backend/src/modules/payment/payment.controller.ts`

已包含：
- ✅ `paymentCallbackHandler` - 處理支付回調

### 5.2 Webhook 路由

**檔案位置：** `packages/backend/src/modules/payment/payment.routes.ts`

路由已設定為：
- `POST /api/payment/callback/:provider` - 支付回調

### 5.3 設定 Webhook URL

在支付服務商後台設定：
- 綠界：`https://yourdomain.com/api/payment/callback/ecpay`
- 藍新：`https://yourdomain.com/api/payment/callback/newebpay`
- LINE Pay：`https://yourdomain.com/api/payment/callback/linepay`

---

## 步驟 6：建立前端結帳按鈕與跳轉頁

### 6.1 結帳頁面

**檔案位置：** `packages/frontend/src/app/checkout/page.tsx`

這個檔案已經存在並包含完整的結帳功能！

### 6.2 選擇方案頁面

**檔案位置：** `packages/frontend/src/app/pricing/select/page.tsx`

這個檔案已經存在！

### 6.3 訂單列表頁面

**檔案位置：** `packages/frontend/src/app/orders/page.tsx`

這個檔案已經存在！

---

## 🎉 完成！

所有功能都已經建立完成！您可以直接使用。

### 快速測試流程

1. **啟動後端：**
   ```bash
   cd packages/backend
   npm run dev
   ```

2. **啟動前端：**
   ```bash
   cd packages/frontend
   npm run dev
   ```

3. **測試流程：**
   - 訪問 `http://localhost:3000/pricing/select`
   - 選擇方案
   - 點擊「前往結帳」
   - 選擇支付方式
   - 完成付款

---

## 📝 環境變數設定

記得在 `.env` 檔案中設定支付服務商的 API Key：

```env
# 支付服務商選擇
PAYMENT_PROVIDER="MOCK"  # 開發時使用 MOCK

# 綠界設定（如果需要）
ECPAY_MERCHANT_ID=""
ECPAY_HASH_KEY=""
ECPAY_HASH_IV=""
ECPAY_SANDBOX="true"
```

---

## 🔧 下一步

1. 申請支付服務商帳號（綠界、藍新或 LINE Pay）
2. 設定生產環境的 API Key
3. 測試完整流程
4. 部署到生產環境



