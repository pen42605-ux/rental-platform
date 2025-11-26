# 監控與備份系統驗收清單

## ✅ 已完成項目

### 1. 錯誤追蹤 (Sentry)
- [x] 後端 Sentry 整合 (`packages/backend/src/lib/sentry.ts`)
- [x] 前端 Sentry 整合 (`packages/frontend/src/lib/sentry.ts`)
- [x] Sentry 中間件 (`packages/backend/src/middleware/sentry.middleware.ts`)
- [x] 自動錯誤捕獲
- [x] 效能監控 (APM)
- [x] 使用者追蹤

### 2. 日誌系統 (Winston)
- [x] 結構化日誌 (`packages/backend/src/lib/logger.ts`)
- [x] 錯誤日誌檔案 (`logs/error.log`)
- [x] 所有日誌檔案 (`logs/combined.log`)
- [x] 例外日誌 (`logs/exceptions.log`)
- [x] 日誌輪轉（5MB，保留 5 個檔案）

### 3. 系統監控
- [x] CPU/Memory 監控 (`monitoring.middleware.ts`)
- [x] API 回應時間追蹤
- [x] 慢查詢追蹤（> 1 秒）
- [x] 健康檢查端點 (`/health`)
- [x] 資料庫連線狀態檢查

### 4. 搜尋引擎監控
- [x] 搜尋延遲追蹤 (`search.monitoring.ts`)
- [x] Meilisearch 狀態監控
- [x] 索引大小監控
- [x] 慢搜尋查詢警告（> 100ms）

### 5. 資料庫備份
- [x] AM/PM 備份腳本（3 種版本）
  - [x] Bash (`backup-postgres.sh`)
  - [x] PowerShell (`backup-postgres.ps1`)
  - [x] Node.js (`backup-postgres.js`)
- [x] 自動排程設定
  - [x] Linux/Mac cron (`setup-backup-cron.sh`)
  - [x] Windows Task Scheduler (`setup-backup-task.ps1`)
- [x] 備份驗證機制
- [x] 自動清理舊備份（30 天）
- [x] S3 雲端備份 (`backup-to-s3.sh`)

---

## 📋 設定步驟

### 1. 安裝依賴

```bash
# Backend
cd packages/backend
npm install

# Frontend
cd packages/frontend
npm install
```

### 2. 設定 Sentry

1. 前往 https://sentry.io 建立專案
2. 複製 DSN
3. 設定環境變數：
   ```env
   # Backend
   SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   
   # Frontend
   NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
   ```

### 3. 設定備份

#### Windows
```powershell
# 以管理員身份執行
cd packages\backend\scripts
.\setup-backup-task.ps1
```

#### Linux/Mac
```bash
cd packages/backend/scripts
chmod +x setup-backup-cron.sh
./setup-backup-cron.sh
```

---

## 🔍 驗收測試

### 測試錯誤追蹤

```bash
# 觸發一個錯誤
curl http://localhost:4000/api/nonexistent

# 檢查 Sentry Dashboard
# 應該會看到錯誤報告
```

### 測試健康檢查

```bash
curl http://localhost:4000/health
```

應該回應：
```json
{
  "status": "healthy",
  "uptime": 12345,
  "memory": { ... },
  "database": "connected"
}
```

### 測試備份

```bash
# 手動執行備份
cd packages/backend/scripts
node backup-postgres.js AM

# 檢查備份檔
ls -lh backups/postgresql/
```

### 測試日誌

```bash
# 查看日誌
tail -f packages/backend/logs/combined.log
tail -f packages/backend/logs/error.log
```

---

## 📊 監控 Dashboard

### Sentry
- **網址**: https://sentry.io
- **功能**: 
  - Issues（錯誤列表）
  - Performance（效能監控）
  - Releases（版本追蹤）
  - Alerts（告警設定）

### 健康檢查
- **端點**: `GET /health`
- **監控項目**:
  - 系統狀態
  - 記憶體使用
  - CPU 使用
  - 資料庫連線

---

## 🚨 告警設定建議

### Sentry 告警
1. 錯誤數 > 10 (5 分鐘)
2. 回應時間 > 1s (5 分鐘)
3. 記憶體使用 > 85%

### 系統告警
- CPU > 80% (10 分鐘)
- Memory > 85% (10 分鐘)
- Disk > 90% (10 分鐘)

---

## 📝 備份排程

### 預設設定
- **AM 備份**: 每天 02:00
- **PM 備份**: 每天 14:00
- **保留天數**: 30 天

### 備份位置
- **本地**: `/backups/postgresql/` 或 `C:\backups\postgresql\`
- **S3**: `s3://your-bucket/postgresql/YYYY/MM/`

---

## 📚 相關文件

- [MONITORING.md](./MONITORING.md) - 完整監控清單
- [SENTRY_SETUP.md](./SENTRY_SETUP.md) - Sentry 設定指南
- [BACKUP_GUIDE.md](./BACKUP_GUIDE.md) - 備份指南
- [QUICK_START_MONITORING.md](./QUICK_START_MONITORING.md) - 快速開始

---

## ✅ 驗收完成

所有監控和備份功能已實作完成！





