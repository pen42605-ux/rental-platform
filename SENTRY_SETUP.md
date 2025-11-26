# Sentry 錯誤追蹤設定指南

## 📋 快速設定

### 1. 建立 Sentry 帳號

1. 前往：https://sentry.io/signup/
2. 建立帳號或使用 GitHub 登入
3. 建立新專案：
   - **Platform**: Node.js (Backend)
   - **Platform**: Next.js (Frontend)

### 2. 取得 DSN

在 Sentry 專案設定中複製 DSN：
- Backend DSN: `https://xxx@xxx.ingest.sentry.io/xxx`
- Frontend DSN: `https://xxx@xxx.ingest.sentry.io/xxx`

### 3. 設定環境變數

#### Backend (.env)
```env
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ORG=your-org
SENTRY_PROJECT=rental-platform-backend
NODE_ENV=production
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
SENTRY_ORG=your-org
SENTRY_PROJECT=rental-platform-frontend
```

### 4. 安裝依賴

```bash
# Backend
cd packages/backend
npm install @sentry/node @sentry/profiling-node winston

# Frontend
cd packages/frontend
npm install @sentry/nextjs
```

### 5. 初始化 Sentry

Sentry 會自動初始化，無需額外設定。

---

## 🔧 功能說明

### 錯誤追蹤
- 自動捕獲未處理的錯誤
- 記錄錯誤堆疊
- 錯誤分組與分析

### 效能監控
- API 回應時間
- 慢查詢追蹤
- 資料庫查詢效能

### 使用者追蹤
- 自動記錄使用者資訊
- 追蹤使用者操作流程

### 日誌整合
- Winston 日誌自動發送到 Sentry
- 結構化日誌記錄

---

## 📊 Sentry Dashboard

登入 https://sentry.io 查看：
- **Issues**: 錯誤列表
- **Performance**: 效能監控
- **Releases**: 版本追蹤
- **Alerts**: 告警設定

---

## 🚨 告警設定

### 在 Sentry Dashboard 設定告警：

1. 前往 Project Settings → Alerts
2. 建立新告警規則：
   - **條件**: 錯誤數 > 10 (5 分鐘)
   - **通知**: Email + Slack

---

## 📝 手動使用

### Backend

```typescript
import { captureException, captureMessage } from './lib/sentry';

// 捕獲錯誤
try {
  // ...
} catch (error) {
  captureException(error, { context: 'user-action' });
}

// 捕獲訊息
captureMessage('重要事件', 'warning');
```

### Frontend

```typescript
import { captureException } from '@/lib/sentry';

try {
  // ...
} catch (error) {
  captureException(error);
}
```

---

## 🔍 監控端點

### Health Check
```
GET /health
```

回應包含：
- 系統狀態
- 記憶體使用
- CPU 使用
- 資料庫連線狀態

---

## 📚 參考資源

- [Sentry Documentation](https://docs.sentry.io)
- [Sentry Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- [Sentry Node.js](https://docs.sentry.io/platforms/node/)





