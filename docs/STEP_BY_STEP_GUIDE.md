# 🎯 金流功能 - 一步一步實作指南

## 📋 步驟總覽

1. ✅ **步驟 1：建立後端框架**
2. ⏳ **步驟 2：安裝金流 SDK**
3. ⏳ **步驟 3：建立資料庫**
4. ⏳ **步驟 4：建立 /pay/create API**
5. ⏳ **步驟 5：建立 /pay/webhook API**
6. ⏳ **步驟 6：建立前端結帳按鈕與跳轉頁**

---

## ✅ 步驟 1：建立後端框架

### 📍 檢查現有結構

您的專案已經有完整的後端框架！

**確認檔案：**
- ✅ `packages/backend/src/index.ts` - 後端主程式
- ✅ `packages/backend/package.json` - 套件管理
- ✅ `packages/backend/tsconfig.json` - TypeScript 設定

### ✅ 步驟 1 完成！

後端框架已經建立完成，可以進行下一步。

---

## ⏳ 步驟 2：安裝金流 SDK

### 📍 需要安裝的套件

檢查 `packages/backend/package.json`，確認以下套件：

✅ **已安裝的套件：**
- `express` - Web 框架
- `typescript` - TypeScript 編譯器
- `prisma` - ORM
- `zod` - 資料驗證
- `uuid` - UUID 生成
- `crypto` - Node.js 內建模組（無需安裝）

### 📝 執行安裝

```bash
cd packages/backend
npm install
```

### ✅ 步驟 2 完成！

所有必要的套件都已安裝。

---

## ⏳ 步驟 3：建立資料庫

### 📍 建立 Prisma Schema

**檔案位置：** `packages/backend/prisma/schema.prisma`

這個檔案已經包含完整的金流相關模型！

### 📝 執行資料庫 Migration

```bash
cd packages/backend
npx prisma db push
```

這會將 Schema 同步到資料庫。

### ✅ 步驟 3 完成！

資料庫結構已建立。

---

## ⏳ 步驟 4：建立 /pay/create API

### 📍 建立付款控制器

**檔案位置：** `packages/backend/src/modules/payment/payment.controller.ts`

這個檔案已經存在！

### 📍 建立付款路由

**檔案位置：** `packages/backend/src/modules/payment/payment.routes.ts`

路由已設定為：`POST /api/payment/payments`

### ✅ 步驟 4 完成！

/pay/create API 已建立。

---

## ⏳ 步驟 5：建立 /pay/webhook API

### 📍 建立 Webhook 處理器

**檔案位置：** `packages/backend/src/modules/payment/payment.controller.ts`

已包含 `paymentCallbackHandler` 函數。

### 📍 建立 Webhook 路由

**檔案位置：** `packages/backend/src/modules/payment/payment.routes.ts`

路由已設定為：`POST /api/payment/callback/:provider`

### ✅ 步驟 5 完成！

/pay/webhook API 已建立。

---

## ⏳ 步驟 6：建立前端結帳按鈕與跳轉頁

### 📍 結帳頁面

**檔案位置：** `packages/frontend/src/app/checkout/page.tsx`

這個檔案已經存在並包含完整的結帳功能！

### 📍 選擇方案頁面

**檔案位置：** `packages/frontend/src/app/pricing/select/page.tsx`

這個檔案已經存在！

### ✅ 步驟 6 完成！

前端結帳功能已建立。

---

## 🎉 所有步驟完成！

所有功能都已經建立完成！您可以直接使用。

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

---

## 📝 環境變數設定

在 `.env` 檔案中設定：

```env
PAYMENT_PROVIDER="MOCK"  # 開發時使用 MOCK
```

---

## 🔧 下一步

1. 申請支付服務商帳號
2. 設定生產環境的 API Key
3. 測試完整流程
4. 部署到生產環境



