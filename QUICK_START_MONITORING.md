# 監控系統快速開始

## 🚀 5 分鐘設定

### 步驟 1: 安裝依賴

```bash
# Backend
cd packages/backend
npm install @sentry/node @sentry/profiling-node winston

# Frontend
cd packages/frontend
npm install @sentry/nextjs
```

### 步驟 2: 取得 Sentry DSN

1. 前往：https://sentry.io/signup/
2. 建立專案（Node.js 和 Next.js）
3. 複製 DSN

### 步驟 3: 設定環境變數

在 `.env` 檔案加入：

```env
# Backend
SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx

# Frontend (.env.local)
NEXT_PUBLIC_SENTRY_DSN=https://xxx@xxx.ingest.sentry.io/xxx
```

### 步驟 4: 重啟服務

```bash
npm run dev
```

---

## 📊 查看監控

### Sentry Dashboard
- 網址: https://sentry.io
- 查看錯誤和效能

### 健康檢查
- 網址: http://localhost:4000/health
- 查看系統狀態

### 日誌檔案
- 位置: `packages/backend/logs/`
- 檔案: `error.log`, `combined.log`

---

## 💾 設定備份

### Windows
```powershell
# 以管理員身份執行
cd packages\backend\scripts
.\setup-backup-task.ps1
```

### Linux/Mac
```bash
cd packages/backend/scripts
chmod +x setup-backup-cron.sh
./setup-backup-cron.sh
```

---

## ✅ 完成！

現在你的系統已經有：
- ✅ 錯誤追蹤
- ✅ 效能監控
- ✅ 日誌記錄
- ✅ 自動備份

查看詳細文件：
- [MONITORING.md](./MONITORING.md)
- [SENTRY_SETUP.md](./SENTRY_SETUP.md)
- [BACKUP_GUIDE.md](./BACKUP_GUIDE.md)





