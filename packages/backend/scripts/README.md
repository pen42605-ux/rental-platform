# 備份腳本說明

## 📋 備份腳本

### 1. `backup-postgres.sh` (Linux/Mac)
Bash 腳本，使用 `pg_dump` 和 `gzip` 備份 PostgreSQL。

### 2. `backup-postgres.ps1` (Windows)
PowerShell 腳本，使用 `pg_dump` 備份 PostgreSQL。

### 3. `backup-postgres.js` (Node.js)
Node.js 腳本，跨平台備份方案。

## 🚀 使用方式

### 手動執行

#### Linux/Mac
```bash
chmod +x backup-postgres.sh
./backup-postgres.sh AM   # 上午備份
./backup-postgres.sh PM   # 下午備份
```

#### Windows
```powershell
.\backup-postgres.ps1 AM   # 上午備份
.\backup-postgres.ps1 PM   # 下午備份
```

#### Node.js
```bash
node backup-postgres.js AM   # 上午備份
node backup-postgres.js PM   # 下午備份
```

### 自動排程

#### Linux/Mac
```bash
chmod +x setup-backup-cron.sh
./setup-backup-cron.sh
```

#### Windows
```powershell
# 以管理員身份執行
.\setup-backup-task.ps1
```

## ⚙️ 環境變數

```bash
BACKUP_DIR=/backups/postgresql      # 備份目錄
DATABASE_URL=postgresql://...       # 資料庫連線字串
RETENTION_DAYS=30                   # 保留天數
```

## 📁 備份檔命名

格式：`rental_platform_{AM|PM}_{timestamp}.sql.gz`

範例：
- `rental_platform_AM_20241125_020000.sql.gz`
- `rental_platform_PM_20241125_140000.sql.gz`

## 🔄 自動清理

腳本會自動刪除超過指定天數的舊備份（預設 30 天）。

## ✅ 驗證備份

備份完成後會自動驗證備份檔完整性。

## 📊 備份排程建議

- **AM 備份**: 每天 02:00（低流量時段）
- **PM 備份**: 每天 14:00（業務時段）

## 🆘 故障排除

### 備份失敗
1. 檢查 `DATABASE_URL` 是否正確
2. 檢查 `pg_dump` 是否安裝
3. 檢查資料庫連線權限
4. 檢查磁碟空間

### 排程不執行
1. 檢查 cron/Task Scheduler 服務是否運行
2. 檢查腳本執行權限
3. 檢查日誌檔案





