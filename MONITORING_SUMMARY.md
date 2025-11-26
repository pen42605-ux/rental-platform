# 監控系統總結

## ✅ 已實作功能

### 1. 錯誤追蹤 (Sentry)
- ✅ 後端 Sentry 整合
- ✅ 前端 Sentry 整合
- ✅ 自動錯誤捕獲
- ✅ 效能監控
- ✅ 使用者追蹤

### 2. 日誌系統 (Winston)
- ✅ 結構化日誌
- ✅ 錯誤日誌檔案
- ✅ 存取日誌檔案
- ✅ 日誌輪轉

### 3. 系統監控
- ✅ CPU/Memory 監控
- ✅ API 回應時間追蹤
- ✅ 慢查詢追蹤
- ✅ 健康檢查端點

### 4. 搜尋引擎監控
- ✅ 搜尋延遲追蹤
- ✅ Meilisearch 狀態監控
- ✅ 索引大小監控

### 5. 資料庫備份
- ✅ AM/PM 自動備份腳本
- ✅ 備份驗證
- ✅ 自動清理舊備份
- ✅ S3 雲端備份（選用）

---

## 📁 檔案清單

### 監控相關
- `packages/backend/src/lib/sentry.ts` - Sentry 初始化
- `packages/backend/src/lib/logger.ts` - Winston 日誌
- `packages/backend/src/middleware/sentry.middleware.ts` - Sentry 中間件
- `packages/backend/src/middleware/monitoring.middleware.ts` - 效能監控
- `packages/backend/src/modules/search/search.monitoring.ts` - 搜尋監控
- `packages/frontend/src/lib/sentry.ts` - 前端 Sentry
- `packages/frontend/sentry.*.config.ts` - Sentry 配置檔

### 備份相關
- `packages/backend/scripts/backup-postgres.sh` - Linux/Mac 備份
- `packages/backend/scripts/backup-postgres.ps1` - Windows 備份
- `packages/backend/scripts/backup-postgres.js` - Node.js 備份
- `packages/backend/scripts/setup-backup-cron.sh` - Linux/Mac 排程
- `packages/backend/scripts/setup-backup-task.ps1` - Windows 排程
- `packages/backend/scripts/backup-to-s3.sh` - S3 備份

### 文件
- `MONITORING.md` - 監控清單
- `SENTRY_SETUP.md` - Sentry 設定指南
- `BACKUP_GUIDE.md` - 備份指南
- `MONITORING_SUMMARY.md` - 本檔案

---

## 🚀 快速開始

### 1. 安裝依賴

```bash
# Backend
cd packages/backend
npm install @sentry/node @sentry/profiling-node winston

# Frontend
cd packages/frontend
npm install @sentry/nextjs
```

### 2. 設定環境變數

#### Backend (.env)
```env
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
LOG_LEVEL=info
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

### 3. 設定備份

```bash
# Linux/Mac
cd packages/backend/scripts
chmod +x setup-backup-cron.sh
./setup-backup-cron.sh

# Windows (管理員)
cd packages\backend\scripts
.\setup-backup-task.ps1
```

---

## 📊 監控端點

### Health Check
```
GET /health
```

回應範例：
```json
{
  "status": "healthy",
  "timestamp": "2024-11-25T08:00:00.000Z",
  "uptime": 86400,
  "memory": {
    "used": 150.5,
    "total": 200.0,
    "rss": 180.0
  },
  "cpu": {
    "user": 1000000,
    "system": 500000
  },
  "database": "connected"
}
```

---

## 🔍 監控項目

### 自動監控
- ✅ API 回應時間
- ✅ 錯誤率
- ✅ 記憶體使用
- ✅ CPU 使用
- ✅ 資料庫連線
- ✅ 搜尋延遲

### 手動監控
- 查看 Sentry Dashboard
- 查看日誌檔案
- 檢查備份狀態

---

## 📈 監控 Dashboard

### Sentry
- 網址: https://sentry.io
- 功能: 錯誤追蹤、效能監控、告警

### 日誌檔案
- 位置: `packages/backend/logs/`
- 檔案:
  - `error.log` - 錯誤日誌
  - `combined.log` - 所有日誌
  - `exceptions.log` - 例外日誌

---

## 🚨 告警設定

### Sentry 告警
1. 前往 Sentry Dashboard
2. Project Settings → Alerts
3. 建立告警規則

### 建議告警
- 錯誤數 > 10 (5 分鐘)
- 回應時間 > 1s (5 分鐘)
- 記憶體使用 > 85%

---

## 📝 備份排程

### 預設排程
- **AM 備份**: 每天 02:00
- **PM 備份**: 每天 14:00
- **保留天數**: 30 天

### 備份位置
- 本地: `/backups/postgresql/` 或 `C:\backups\postgresql\`
- S3: `s3://your-bucket/postgresql/YYYY/MM/`

---

## ✅ 驗收清單

- [x] Sentry 錯誤追蹤整合
- [x] Winston 日誌系統
- [x] 效能監控中間件
- [x] 健康檢查端點
- [x] 搜尋延遲監控
- [x] PostgreSQL 備份腳本
- [x] AM/PM 自動備份排程
- [x] 備份驗證機制
- [x] 自動清理舊備份

---

## 📚 相關文件

- [MONITORING.md](./MONITORING.md) - 完整監控清單
- [SENTRY_SETUP.md](./SENTRY_SETUP.md) - Sentry 設定
- [BACKUP_GUIDE.md](./BACKUP_GUIDE.md) - 備份指南





