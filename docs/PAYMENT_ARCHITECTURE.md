# 金流系統技術架構文件

## 目錄
1. [系統概述](#系統概述)
2. [技術棧選擇](#技術棧選擇)
3. [資料庫 Schema](#資料庫-schema)
4. [金流流程設計](#金流流程設計)
5. [API 端點設計](#api-端點設計)
6. [安全性考量](#安全性考量)
7. [部署架構](#部署架構)

---

## 系統概述

本系統是一個完整的租屋平台金流解決方案，支援多種支付方式和支付服務商，提供會員付費、刊登費、VIP、置頂等服務的付款功能。

### 核心功能
- ✅ 訂單管理（創建、查詢、更新）
- ✅ 多種支付方式（信用卡、ATM、CVS、LINE Pay 等）
- ✅ 多支付服務商整合（綠界、藍新、LINE Pay）
- ✅ Webhook 回調處理
- ✅ 訂閱/套餐管理
- ✅ 沙盒測試支援

---

## 技術棧選擇

### 後端技術建議

#### 方案一：Node.js + Express + TypeScript（當前實作）
**優點：**
- ✅ 與前端 Next.js 技術棧一致
- ✅ TypeScript 提供類型安全
- ✅ 豐富的生態系統和套件
- ✅ 非同步處理能力強
- ✅ 適合快速開發和迭代

**適用場景：**
- 中小型專案
- 需要快速開發
- 團隊熟悉 JavaScript/TypeScript

**技術棧：**
```
- Runtime: Node.js 18+
- Framework: Express.js
- Language: TypeScript
- ORM: Prisma
- Database: PostgreSQL / SQLite (開發)
- Payment SDK: 自建抽象層
```

#### 方案二：NestJS
**優點：**
- ✅ 模組化架構，易於維護
- ✅ 內建依賴注入
- ✅ 完整的 TypeScript 支援
- ✅ 豐富的裝飾器和功能
- ✅ 適合大型專案

**適用場景：**
- 大型專案
- 需要嚴格的架構規範
- 團隊規模較大

**技術棧：**
```
- Framework: NestJS
- Language: TypeScript
- ORM: TypeORM / Prisma
- Database: PostgreSQL
- Payment SDK: 自建模組
```

#### 方案三：Laravel (PHP)
**優點：**
- ✅ 成熟的框架和生態系統
- ✅ 豐富的支付套件（Laravel Cashier）
- ✅ 優秀的文檔和社群支援
- ✅ 內建很多實用功能

**適用場景：**
- PHP 團隊
- 需要快速整合支付功能
- 偏好傳統 MVC 架構

**技術棧：**
```
- Framework: Laravel 10+
- Language: PHP 8.1+
- ORM: Eloquent
- Database: MySQL / PostgreSQL
- Payment SDK: Laravel Cashier / 自建
```

#### 方案四：Next.js API Routes
**優點：**
- ✅ 與前端完全整合
- ✅ 無需額外後端服務
- ✅ 簡化部署流程
- ✅ 共享類型定義

**適用場景：**
- 全端 Next.js 專案
- 中小型專案
- 需要簡化架構

**技術棧：**
```
- Framework: Next.js 14+ (App Router)
- Language: TypeScript
- ORM: Prisma
- Database: PostgreSQL
- Payment SDK: 自建 API Routes
```

### 推薦方案

**當前專案推薦：Node.js + Express + TypeScript**

理由：
1. 已實作且運行良好
2. 與前端 Next.js 技術棧一致
3. 靈活度高，易於擴展
4. TypeScript 提供類型安全

---

## 資料庫 Schema

### 實體關係圖（ERD）

```
┌─────────┐         ┌──────────┐         ┌──────────┐
│  User   │────────<│  Order   │────────<│ Payment  │
└─────────┘         └──────────┘         └──────────┘
     │                    │                       │
     │                    │                       │
     │                    │                       │
     │                    ▼                       │
     │              ┌──────────┐                 │
     │              │OrderItem │                 │
     │              └──────────┘                 │
     │                    │                       │
     │                    │                       │
     │                    ▼                       │
     │              ┌─────────────┐              │
     │              │Subscription │              │
     │              └─────────────┘              │
     │                                            │
     └────────────────────────────────────────────┘
                    │
                    ▼
              ┌─────────────┐
              │ WebhookLog  │
              └─────────────┘
```

### 詳細 Schema

#### 1. User（用戶表）
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) DEFAULT 'USER',
  -- 發票相關欄位
  invoice_method VARCHAR(50), -- DONATE, CLOUD, UNIFIED, MOBILE
  unified_number VARCHAR(20),
  invoice_buyer VARCHAR(255),
  invoice_phone VARCHAR(20),
  invoice_city VARCHAR(50),
  invoice_district VARCHAR(50),
  invoice_address TEXT,
  mobile_carrier VARCHAR(50),
  -- 時間戳
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

#### 2. Order（訂單表）
```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_number VARCHAR(50) UNIQUE NOT NULL, -- ORD20240101001
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, PAID, CANCELLED, REFUNDED, EXPIRED
  total_amount INTEGER NOT NULL, -- 金額（分）
  currency VARCHAR(3) DEFAULT 'TWD',
  payment_method VARCHAR(20), -- CREDIT_CARD, ATM, CVS, etc.
  payment_status VARCHAR(20) DEFAULT 'UNPAID', -- UNPAID, PAID, FAILED, REFUNDED
  paid_at TIMESTAMP,
  expires_at TIMESTAMP, -- 訂單過期時間
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_payment_status ON orders(payment_status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
```

#### 3. OrderItem（訂單項目表）
```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_type VARCHAR(20) NOT NULL, -- LISTING_AD, PACKAGE, ADDON
  product_id VARCHAR(100), -- 產品ID
  product_name VARCHAR(255) NOT NULL,
  product_category VARCHAR(20), -- RESIDENTIAL, COMMERCIAL, SALE
  quantity INTEGER DEFAULT 1,
  unit_price INTEGER NOT NULL, -- 單價（分）
  total_price INTEGER NOT NULL, -- 總價（分）
  duration INTEGER, -- 天數
  metadata JSONB, -- 額外資訊
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_type ON order_items(product_type);
```

#### 4. Payment（付款記錄表）
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  payment_number VARCHAR(50) UNIQUE NOT NULL, -- PAY20240101001
  amount INTEGER NOT NULL, -- 付款金額（分）
  currency VARCHAR(3) DEFAULT 'TWD',
  payment_method VARCHAR(20) NOT NULL, -- CREDIT_CARD, ATM, CVS, etc.
  payment_provider VARCHAR(20) NOT NULL, -- ECPAY, NEWEBPAY, LINE_PAY, MOCK
  status VARCHAR(20) DEFAULT 'PENDING', -- PENDING, SUCCESS, FAILED, CANCELLED, REFUNDED
  transaction_id VARCHAR(255), -- 第三方交易ID
  payment_url TEXT, -- 付款連結（ATM、CVS）
  bank_code VARCHAR(10), -- ATM 銀行代碼
  account_number VARCHAR(50), -- ATM 虛擬帳號或 CVS 代碼
  expire_date TIMESTAMP, -- 付款截止日
  paid_at TIMESTAMP,
  refunded_at TIMESTAMP,
  refund_amount INTEGER DEFAULT 0,
  metadata JSONB, -- 額外資訊
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_payment_number ON payments(payment_number);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_transaction_id ON payments(transaction_id);
CREATE INDEX idx_payments_created_at ON payments(created_at);
```

#### 5. Subscription（訂閱/套餐表）
```sql
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  order_item_id UUID NOT NULL REFERENCES order_items(id),
  product_type VARCHAR(20) NOT NULL, -- PACKAGE, LISTING_AD
  product_id VARCHAR(100),
  product_name VARCHAR(255) NOT NULL,
  status VARCHAR(20) DEFAULT 'ACTIVE', -- ACTIVE, EXPIRED, CANCELLED, USED_UP
  total_quantity INTEGER DEFAULT 0, -- 總數量（如套餐筆數）
  used_quantity INTEGER DEFAULT 0, -- 已使用數量
  remaining_quantity INTEGER DEFAULT 0, -- 剩餘數量
  valid_from TIMESTAMP NOT NULL, -- 生效日期
  valid_until TIMESTAMP NOT NULL, -- 到期日期
  metadata JSONB, -- 額外資訊
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_order_id ON subscriptions(order_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_valid_until ON subscriptions(valid_until);
```

#### 6. WebhookLog（Webhook 記錄表）
```sql
CREATE TABLE webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider VARCHAR(20) NOT NULL, -- MOCK, ECPAY, NEWEBPAY, LINE_PAY
  event_type VARCHAR(50) NOT NULL, -- payment.success, payment.failed, etc.
  transaction_id VARCHAR(255),
  order_id UUID,
  status VARCHAR(20) DEFAULT 'PENDING', -- SUCCESS, FAILED, PENDING
  request_body JSONB NOT NULL, -- 請求內容
  response_body JSONB, -- 響應內容
  error_message TEXT,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_webhook_logs_provider ON webhook_logs(provider);
CREATE INDEX idx_webhook_logs_transaction_id ON webhook_logs(transaction_id);
CREATE INDEX idx_webhook_logs_order_id ON webhook_logs(order_id);
CREATE INDEX idx_webhook_logs_status ON webhook_logs(status);
CREATE INDEX idx_webhook_logs_created_at ON webhook_logs(created_at);
```

### Prisma Schema（當前實作）

```prisma
model User {
  id            String     @id @default(uuid())
  email         String     @unique
  passwordHash  String     @map("password_hash")
  name          String
  phone         String?
  role          String     @default("USER")
  // ... 其他欄位
  orders        Order[]
  subscriptions Subscription[]
  createdAt     DateTime   @default(now()) @map("created_at")
  updatedAt     DateTime   @updatedAt @map("updated_at")
  @@map("users")
}

model Order {
  id              String      @id @default(uuid())
  userId          String      @map("user_id")
  orderNumber     String      @unique @map("order_number")
  status          String      @default("PENDING")
  totalAmount     Int         @map("total_amount")
  currency        String      @default("TWD")
  paymentMethod   String?     @map("payment_method")
  paymentStatus   String      @default("UNPAID") @map("payment_status")
  paidAt          DateTime?   @map("paid_at")
  expiresAt       DateTime?   @map("expires_at")
  notes           String?
  createdAt       DateTime    @default(now()) @map("created_at")
  updatedAt       DateTime    @updatedAt @map("updated_at")
  
  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  items           OrderItem[]
  payments        Payment[]
  subscriptions   Subscription[]
  
  @@index([userId])
  @@index([orderNumber])
  @@index([status])
  @@map("orders")
}

model OrderItem {
  id              String   @id @default(uuid())
  orderId         String   @map("order_id")
  productType     String   @map("product_type")
  productId       String?  @map("product_id")
  productName     String   @map("product_name")
  productCategory String?  @map("product_category")
  quantity        Int      @default(1)
  unitPrice       Int      @map("unit_price")
  totalPrice      Int      @map("total_price")
  duration        Int?
  metadata        String?  @default("{}")
  createdAt       DateTime @default(now()) @map("created_at")
  
  order           Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  @@index([orderId])
  @@map("order_items")
}

model Payment {
  id              String   @id @default(uuid())
  orderId         String   @map("order_id")
  paymentNumber   String   @unique @map("payment_number")
  amount          Int
  currency        String   @default("TWD")
  paymentMethod   String   @map("payment_method")
  paymentProvider String   @map("payment_provider")
  status          String   @default("PENDING")
  transactionId   String?  @map("transaction_id")
  paymentUrl      String?  @map("payment_url")
  bankCode        String?  @map("bank_code")
  accountNumber   String?  @map("account_number")
  expireDate      DateTime? @map("expire_date")
  paidAt          DateTime? @map("paid_at")
  refundedAt      DateTime? @map("refunded_at")
  refundAmount    Int?     @default(0) @map("refund_amount")
  metadata        String?  @default("{}")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  
  order           Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  @@index([orderId])
  @@index([paymentNumber])
  @@index([status])
  @@index([transactionId])
  @@map("payments")
}

model Subscription {
  id              String   @id @default(uuid())
  userId          String   @map("user_id")
  orderId         String   @map("order_id")
  orderItemId     String   @map("order_item_id")
  productType     String   @map("product_type")
  productId       String?  @map("product_id")
  productName     String   @map("product_name")
  status          String   @default("ACTIVE")
  totalQuantity   Int      @default(0) @map("total_quantity")
  usedQuantity    Int      @default(0) @map("used_quantity")
  remainingQuantity Int    @default(0) @map("remaining_quantity")
  validFrom       DateTime @map("valid_from")
  validUntil      DateTime @map("valid_until")
  metadata        String?  @default("{}")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  
  user            User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  order           Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([orderId])
  @@index([status])
  @@map("subscriptions")
}

model WebhookLog {
  id            String   @id @default(uuid())
  provider      String
  eventType     String   @map("event_type")
  transactionId String?  @map("transaction_id")
  orderId       String?  @map("order_id")
  status        String   @default("PENDING")
  requestBody   String   @map("request_body")
  responseBody  String?  @map("response_body")
  errorMessage  String?  @map("error_message")
  processedAt   DateTime? @map("processed_at")
  createdAt     DateTime @default(now()) @map("created_at")
  
  @@index([provider])
  @@index([transactionId])
  @@index([orderId])
  @@index([status])
  @@map("webhook_logs")
}
```

---

## 金流流程設計

### 1. 訂單創建流程

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. 選擇方案
     ▼
┌─────────────────┐
│ Frontend        │
│ /pricing/select │
└────┬────────────┘
     │
     │ 2. POST /api/payment/orders
     ▼
┌─────────────────┐
│ Backend         │
│ Order Service   │
└────┬────────────┘
     │
     │ 3. 創建訂單
     │    - 生成訂單編號
     │    - 計算總金額
     │    - 設定過期時間
     ▼
┌─────────────────┐
│ Database        │
│ Order Table     │
└────┬────────────┘
     │
     │ 4. 返回訂單資訊
     ▼
┌─────────────────┐
│ Frontend        │
│ /checkout       │
└─────────────────┘
```

### 2. 付款流程（信用卡/LINE Pay）

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. 選擇支付方式
     ▼
┌─────────────────┐
│ Frontend        │
│ /checkout       │
└────┬────────────┘
     │
     │ 2. POST /api/payment/payments
     ▼
┌─────────────────┐
│ Backend         │
│ Payment Service │
└────┬────────────┘
     │
     │ 3. 調用支付服務商 API
     │    - 綠界/藍新/LINE Pay
     ▼
┌─────────────────┐
│ Payment Gateway │
│ (ECPay/NewebPay)│
└────┬────────────┘
     │
     │ 4. 返回付款連結
     ▼
┌─────────────────┐
│ Frontend        │
│ 跳轉到支付頁面   │
└────┬────────────┘
     │
     │ 5. 用戶完成付款
     ▼
┌─────────────────┐
│ Payment Gateway │
│ 處理付款         │
└────┬────────────┘
     │
     │ 6. POST /api/payment/callback/:provider
     │    (Webhook)
     ▼
┌─────────────────┐
│ Backend         │
│ Webhook Handler │
└────┬────────────┘
     │
     │ 7. 驗證簽名
     │ 8. 更新訂單狀態
     │ 9. 創建訂閱記錄
     ▼
┌─────────────────┐
│ Database        │
│ Update Tables   │
└─────────────────┘
```

### 3. 付款流程（ATM/CVS）

```
┌─────────┐
│  User   │
└────┬────┘
     │
     │ 1. 選擇 ATM/CVS
     ▼
┌─────────────────┐
│ Frontend        │
│ /checkout       │
└────┬────────────┘
     │
     │ 2. POST /api/payment/payments
     ▼
┌─────────────────┐
│ Backend         │
│ Payment Service │
└────┬────────────┘
     │
     │ 3. 調用支付服務商 API
     │    - 生成虛擬帳號/超商代碼
     ▼
┌─────────────────┐
│ Payment Gateway │
│ 生成付款資訊     │
└────┬────────────┘
     │
     │ 4. 返回付款資訊
     │    - 銀行代碼 + 虛擬帳號
     │    - 或超商代碼
     ▼
┌─────────────────┐
│ Frontend        │
│ 顯示付款資訊     │
└────┬────────────┘
     │
     │ 5. 用戶完成付款
     │    (ATM 轉帳 / 超商繳費)
     ▼
┌─────────────────┐
│ Payment Gateway │
│ 確認付款         │
└────┬────────────┘
     │
     │ 6. POST /api/payment/callback/:provider
     │    (Webhook)
     ▼
┌─────────────────┐
│ Backend         │
│ Webhook Handler │
└────┬────────────┘
     │
     │ 7. 驗證簽名
     │ 8. 更新訂單狀態
     │ 9. 創建訂閱記錄
     ▼
┌─────────────────┐
│ Database        │
│ Update Tables   │
└─────────────────┘
```

### 4. Webhook 處理流程

```
┌─────────────────┐
│ Payment Gateway │
│ (ECPay/NewebPay)│
└────┬────────────┘
     │
     │ 1. 發送 Webhook
     │    POST /api/payment/callback/:provider
     ▼
┌─────────────────┐
│ Backend         │
│ Webhook Handler │
└────┬────────────┘
     │
     │ 2. 記錄 Webhook
     │    (WebhookLog)
     ▼
┌─────────────────┐
│ Database        │
│ webhook_logs    │
└────┬────────────┘
     │
     │ 3. 驗證簽名
     │    - CheckMacValue (ECPay)
     │    - TradeSha (NewebPay)
     ▼
┌─────────────────┐
│ Validation      │
│ ✓ 簽名正確       │
│ ✗ 簽名錯誤 → 拒絕│
└────┬────────────┘
     │
     │ 4. 解析回調資料
     │    - transactionId
     │    - status
     │    - amount
     ▼
┌─────────────────┐
│ Payment Service │
│ 更新付款狀態     │
└────┬────────────┘
     │
     │ 5. 更新 Payment 記錄
     │ 6. 更新 Order 狀態
     │ 7. 如果付款成功：
     │    - 創建 Subscription
     │    - 發送通知
     ▼
┌─────────────────┐
│ Database        │
│ Update Tables   │
└────┬────────────┘
     │
     │ 8. 更新 WebhookLog 狀態
     ▼
┌─────────────────┐
│ Response        │
│ 200 OK          │
└─────────────────┘
```

### 5. 狀態機流程

```
訂單狀態流程：
PENDING → PAID / CANCELLED / EXPIRED
  │
  ├─→ PAID (付款成功)
  │     └─→ REFUNDED (退款)
  │
  ├─→ CANCELLED (用戶取消)
  │
  └─→ EXPIRED (訂單過期)

付款狀態流程：
PENDING → SUCCESS / FAILED
  │
  ├─→ SUCCESS (付款成功)
  │     └─→ REFUNDED (退款)
  │
  └─→ FAILED (付款失敗)

訂閱狀態流程：
ACTIVE → EXPIRED / CANCELLED / USED_UP
  │
  ├─→ EXPIRED (到期)
  ├─→ CANCELLED (取消)
  └─→ USED_UP (用完)
```

---

## API 端點設計

### 基礎 URL
```
開發環境: http://localhost:4000
生產環境: https://api.yourdomain.com
```

### 認證
所有需要認證的端點都需要在 Header 中帶上 JWT Token：
```
Authorization: Bearer <token>
```

### API 端點列表

#### 1. 訂單相關

##### 1.1 創建訂單
```http
POST /api/payment/orders
Content-Type: application/json
Authorization: Bearer <token>

Request Body:
{
  "items": [
    {
      "productId": "RESIDENTIAL_VIP",
      "quantity": 1,
      "metadata": {
        "listingId": "xxx" // 可選
      }
    }
  ],
  "notes": "備註" // 可選
}

Response 201:
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD20240101001",
    "status": "PENDING",
    "totalAmount": 78900,
    "currency": "TWD",
    "items": [
      {
        "id": "uuid",
        "productName": "超級VIP廣告",
        "quantity": 1,
        "unitPrice": 78900,
        "totalPrice": 78900
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "expiresAt": "2024-01-02T00:00:00Z"
  }
}
```

##### 1.2 獲取訂單列表
```http
GET /api/payment/orders?page=1&limit=20&status=PENDING
Authorization: Bearer <token>

Query Parameters:
- page: number (default: 1)
- limit: number (default: 20)
- status: string (optional) - PENDING, PAID, CANCELLED, etc.

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "orderNumber": "ORD20240101001",
      "status": "PENDING",
      "totalAmount": 78900,
      "items": [...],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

##### 1.3 獲取訂單詳情
```http
GET /api/payment/orders/:id
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "data": {
    "id": "uuid",
    "orderNumber": "ORD20240101001",
    "status": "PENDING",
    "totalAmount": 78900,
    "items": [...],
    "payments": [
      {
        "id": "uuid",
        "paymentNumber": "PAY20240101001",
        "status": "PENDING",
        "paymentMethod": "CREDIT_CARD",
        "amount": 78900
      }
    ],
    "createdAt": "2024-01-01T00:00:00Z",
    "expiresAt": "2024-01-02T00:00:00Z"
  }
}
```

#### 2. 付款相關

##### 2.1 創建付款
```http
POST /api/payment/payments
Content-Type: application/json
Authorization: Bearer <token>

Request Body:
{
  "orderId": "uuid",
  "paymentMethod": "CREDIT_CARD", // CREDIT_CARD, ATM, CVS, LINE_PAY, etc.
  "paymentProvider": "ECPAY" // 可選，自動選擇
}

Response 201:
{
  "success": true,
  "data": {
    "id": "uuid",
    "paymentNumber": "PAY20240101001",
    "paymentUrl": "https://payment.ecpay.com.tw/...", // 信用卡/LINE Pay
    "bankCode": "013", // ATM
    "accountNumber": "1234567890", // ATM/CVS
    "expireDate": "2024-01-04T00:00:00Z", // ATM/CVS
    "transactionId": "EC20240101001",
    "status": "PENDING"
  }
}
```

##### 2.2 查詢付款狀態
```http
GET /api/payment/payments/:transactionId/status
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "data": {
    "status": "SUCCESS" // PENDING, SUCCESS, FAILED, REFUNDED
  }
}
```

#### 3. Webhook 回調

##### 3.1 支付回調（綠界）
```http
POST /api/payment/callback/ecpay
Content-Type: application/x-www-form-urlencoded

Request Body:
MerchantID=xxx&MerchantTradeNo=xxx&RtnCode=1&...

Response 200:
{
  "success": true,
  "message": "回調處理成功"
}
```

##### 3.2 支付回調（藍新）
```http
POST /api/payment/callback/newebpay
Content-Type: application/json

Request Body:
{
  "TradeInfo": "encrypted_data",
  "TradeSha": "hash_value"
}

Response 200:
{
  "success": true,
  "message": "回調處理成功"
}
```

##### 3.3 支付回調（LINE Pay）
```http
POST /api/payment/callback/linepay
Content-Type: application/json

Request Body:
{
  "returnCode": "0000",
  "returnMessage": "Success",
  "transactionId": "xxx"
}

Response 200:
{
  "success": true,
  "message": "回調處理成功"
}
```

#### 4. 訂閱相關（未來擴展）

##### 4.1 獲取用戶訂閱列表
```http
GET /api/payment/subscriptions?status=ACTIVE
Authorization: Bearer <token>

Response 200:
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "productName": "新手套餐",
      "status": "ACTIVE",
      "totalQuantity": 3,
      "usedQuantity": 1,
      "remainingQuantity": 2,
      "validUntil": "2024-02-01T00:00:00Z"
    }
  ]
}
```

### API 錯誤處理

所有 API 錯誤都遵循統一格式：

```json
{
  "success": false,
  "error": "錯誤訊息",
  "details": [
    {
      "field": "orderId",
      "message": "訂單不存在"
    }
  ]
}
```

常見 HTTP 狀態碼：
- `200` - 成功
- `201` - 創建成功
- `400` - 請求錯誤（驗證失敗）
- `401` - 未授權
- `404` - 資源不存在
- `500` - 伺服器錯誤

---

## 安全性考量

### 1. 認證與授權
- ✅ JWT Token 認證
- ✅ Token 過期機制
- ✅ 用戶只能訪問自己的訂單
- ✅ 管理員權限控制

### 2. 資料驗證
- ✅ 使用 Zod 進行請求驗證
- ✅ 金額驗證（防止負數、過大金額）
- ✅ 訂單狀態驗證
- ✅ 支付方式驗證

### 3. Webhook 安全
- ✅ 簽名驗證（CheckMacValue / TradeSha）
- ✅ IP 白名單（可選）
- ✅ 重複請求檢查
- ✅ 所有 Webhook 記錄到資料庫

### 4. 資料加密
- ✅ 敏感資訊加密存儲
- ✅ HTTPS 傳輸
- ✅ 支付資訊不記錄在日誌中

### 5. 防護措施
- ✅ 訂單過期機制（24小時）
- ✅ 付款限額檢查
- ✅ 頻率限制（Rate Limiting）
- ✅ SQL Injection 防護（Prisma ORM）

---

## 部署架構

### 開發環境
```
┌─────────────┐
│  Frontend   │
│  Next.js    │
│  :3000      │
└──────┬──────┘
       │
       │ API Calls
       │
┌──────▼──────┐
│  Backend    │
│  Express    │
│  :4000      │
└──────┬──────┘
       │
       │ Prisma ORM
       │
┌──────▼──────┐
│  Database   │
│  SQLite     │
│  (dev.db)   │
└─────────────┘
```

### 生產環境
```
┌─────────────┐
│   CDN       │
│  (Vercel)   │
└──────┬──────┘
       │
       │ HTTPS
       │
┌──────▼──────┐
│  Frontend   │
│  Next.js    │
│  (Vercel)   │
└──────┬──────┘
       │
       │ API Calls
       │
┌──────▼──────┐
│  Backend    │
│  Express    │
│  (Render)   │
└──────┬──────┘
       │
       │ Prisma ORM
       │
┌──────▼──────┐
│  Database   │
│  PostgreSQL │
│  (Supabase) │
└─────────────┘
       │
       │ Webhook
       │
┌──────▼──────┐
│  Payment    │
│  Gateways   │
│  (ECPay/    │
│   NewebPay)│
└─────────────┘
```

### 環境變數管理

**開發環境：**
- 使用 `.env.local`
- 使用 SQLite 資料庫
- 使用 MOCK 支付服務

**生產環境：**
- 使用環境變數管理平台（Vercel/Render）
- 使用 PostgreSQL 資料庫
- 使用真實支付服務商
- 設定 Webhook URL 為生產環境 URL

---

## 總結

本技術架構文件涵蓋了：
1. ✅ 後端技術選擇建議
2. ✅ 完整的資料庫 Schema 設計
3. ✅ 詳細的金流流程圖
4. ✅ 完整的 API 端點設計
5. ✅ 安全性考量
6. ✅ 部署架構建議

系統採用模組化設計，易於擴展和維護，支援多種支付方式和支付服務商，適合中小型到大型專案使用。



