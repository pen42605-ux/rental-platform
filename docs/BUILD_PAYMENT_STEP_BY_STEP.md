# 🎯 金流功能 - 一步一步實作指南

> **注意：** 本指南將從頭開始，一步一步教您建立完整的金流功能。

---

## 📋 步驟總覽

1. ✅ **步驟 1：建立後端框架** - 確認 Express.js 框架設定
2. ⏳ **步驟 2：安裝金流 SDK** - 安裝必要的支付套件
3. ⏳ **步驟 3：建立資料庫** - 建立 Prisma Schema 和資料表
4. ⏳ **步驟 4：建立 /pay/create API** - 創建付款端點
5. ⏳ **步驟 5：建立 /pay/webhook API** - 處理支付回調
6. ⏳ **步驟 6：建立前端結帳按鈕與跳轉頁** - 建立前端介面

---

## ✅ 步驟 1：建立後端框架

### 📍 檢查檔案位置

**檔案：** `packages/backend/src/index.ts`

### ✅ 確認事項

您的後端框架已經建立完成！

**已確認：**
- ✅ Express.js 已安裝
- ✅ TypeScript 已設定
- ✅ 路由系統已建立
- ✅ 中間件已配置

**下一步：** 進行步驟 2

---

## ⏳ 步驟 2：安裝金流 SDK

### 📍 檢查套件

**檔案：** `packages/backend/package.json`

### ✅ 確認套件

所有必要的套件都已安裝：
- ✅ `express` - Web 框架
- ✅ `typescript` - TypeScript
- ✅ `prisma` - ORM
- ✅ `zod` - 資料驗證
- ✅ `uuid` - UUID 生成
- ✅ `crypto` - Node.js 內建模組

### 📝 執行安裝（如果需要）

```bash
cd packages/backend
npm install
```

### ✅ 步驟 2 完成！

**下一步：** 進行步驟 3

---

## ⏳ 步驟 3：建立資料庫

### 📍 建立 Prisma Schema

**檔案位置：** `packages/backend/prisma/schema.prisma`

### ✅ 確認 Schema

您的資料庫 Schema 已經包含完整的金流模型：
- ✅ Order（訂單表）
- ✅ OrderItem（訂單項目表）
- ✅ Payment（付款記錄表）
- ✅ Subscription（訂閱表）
- ✅ WebhookLog（Webhook 記錄表）

### 📝 執行資料庫 Migration

```bash
cd packages/backend
npx prisma db push
```

### ✅ 步驟 3 完成！

**下一步：** 進行步驟 4

---

## ⏳ 步驟 4：建立 /pay/create API

### 📍 建立付款控制器

**檔案位置：** `packages/backend/src/modules/payment/payment.controller.ts`

### ✅ 確認檔案

您的付款控制器已經建立完成！

**已包含的功能：**
- ✅ `createPaymentHandler` - 創建付款
- ✅ `getOrderHandler` - 獲取訂單
- ✅ `getUserOrdersHandler` - 獲取用戶訂單列表

### 📍 建立付款路由

**檔案位置：** `packages/backend/src/modules/payment/payment.routes.ts`

### ✅ 確認路由

路由已設定：
- ✅ `POST /api/payment/payments` - 創建付款

### ✅ 步驟 4 完成！

**下一步：** 進行步驟 5

---

## ⏳ 步驟 5：建立 /pay/webhook API

### 📍 建立 Webhook 處理器

**檔案位置：** `packages/backend/src/modules/payment/payment.controller.ts`

### ✅ 確認功能

Webhook 處理器已建立：
- ✅ `paymentCallbackHandler` - 處理支付回調
- ✅ 支援多種支付服務商（綠界、藍新、LINE Pay）

### 📍 建立 Webhook 路由

**檔案位置：** `packages/backend/src/modules/payment/payment.routes.ts`

### ✅ 確認路由

路由已設定：
- ✅ `POST /api/payment/callback/:provider` - 支付回調

### ✅ 步驟 5 完成！

**下一步：** 進行步驟 6

---

## ⏳ 步驟 6：建立前端結帳按鈕與跳轉頁

### 📍 建立結帳頁面

**檔案位置：** `packages/frontend/src/app/checkout/page.tsx`

### ✅ 確認功能

結帳頁面已建立並包含：
- ✅ 訂單摘要顯示
- ✅ 支付方式選擇（信用卡、ATM、CVS、LINE Pay）
- ✅ 付款資訊顯示（ATM/CVS）
- ✅ 安全提示

### 📍 建立選擇方案頁面

**檔案位置：** `packages/frontend/src/app/pricing/select/page.tsx`

### ✅ 確認功能

選擇方案頁面已建立並包含：
- ✅ 方案選擇（出租、出售、加值服務）
- ✅ 購物車功能
- ✅ 總金額計算

### 📍 建立訂單列表頁面

**檔案位置：** `packages/frontend/src/app/orders/page.tsx`

### ✅ 確認功能

訂單列表頁面已建立並包含：
- ✅ 訂單列表顯示
- ✅ 狀態篩選
- ✅ 分頁功能

### ✅ 步驟 6 完成！

---

## 🎉 所有步驟完成！

### 🚀 快速測試

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

### 📝 環境變數設定

在 `.env` 檔案中設定：

```env
PAYMENT_PROVIDER="MOCK"  # 開發時使用 MOCK
```

### 🔧 下一步

1. 申請支付服務商帳號（綠界、藍新或 LINE Pay）
2. 設定生產環境的 API Key
3. 測試完整流程
4. 部署到生產環境

---

## 📚 相關檔案清單

### 後端檔案
- `packages/backend/src/modules/payment/payment.controller.ts` - 付款控制器
- `packages/backend/src/modules/payment/payment.routes.ts` - 付款路由
- `packages/backend/src/modules/payment/payment.service.ts` - 付款服務
- `packages/backend/src/modules/payment/order.service.ts` - 訂單服務
- `packages/backend/src/modules/payment/webhook.service.ts` - Webhook 服務
- `packages/backend/src/modules/payment/products.config.ts` - 產品配置
- `packages/backend/prisma/schema.prisma` - 資料庫 Schema

### 前端檔案
- `packages/frontend/src/app/checkout/page.tsx` - 結帳頁面
- `packages/frontend/src/app/pricing/select/page.tsx` - 選擇方案頁面
- `packages/frontend/src/app/orders/page.tsx` - 訂單列表頁面
- `packages/frontend/src/app/orders/[id]/page.tsx` - 訂單詳情頁面
- `packages/frontend/src/lib/api.ts` - API 客戶端
- `packages/frontend/src/lib/payment-products.ts` - 產品配置

---

## 🎓 學習重點

1. **後端架構：** Express.js + TypeScript + Prisma
2. **支付整合：** 支援多種支付服務商
3. **Webhook 處理：** 安全的回調驗證
4. **前端體驗：** Stripe-like 結帳流程
5. **資料庫設計：** 完整的訂單和付款記錄

---

**恭喜！您已經完成了完整的金流功能實作！** 🎉



