# PostgreSQL 備份指南

## 📋 備份策略

### 每日備份
- **AM 備份**: 每天 02:00（低流量時段）
- **PM 備份**: 每天 14:00（業務時段）
- **保留天數**: 30 天（可調整）

---

## 🚀 快速開始

### 方式 1: 手動執行（測試）

#### Linux/Mac
```bash
cd packages/backend/scripts
chmod +x backup-postgres.sh
./backup-postgres.sh AM
```

#### Windows
```powershell
cd packages\backend\scripts
.\backup-postgres.ps1 AM
```

#### Node.js（跨平台）
```bash
cd packages/backend/scripts
node backup-postgres.js AM
```

### 方式 2: 自動排程

#### Linux/Mac
```bash
cd packages/backend/scripts
chmod +x setup-backup-cron.sh
./setup-backup-cron.sh
```

#### Windows
```powershell
# 以管理員身份執行 PowerShell
cd packages\backend\scripts
.\setup-backup-task.ps1
```

---

## ⚙️ 環境變數設定

在 `.env` 或系統環境變數中設定：

```env
# 備份目錄
BACKUP_DIR=/backups/postgresql

# 資料庫連線（從 DATABASE_URL 自動解析）
DATABASE_URL=postgresql://user:password@host:5432/rental_platform

# 保留天數
RETENTION_DAYS=30
```

---

## 📁 備份檔位置

預設位置：
- **Linux/Mac**: `/backups/postgresql/`
- **Windows**: `C:\backups\postgresql\`
- **Node.js**: `./backups/postgresql/`

備份檔命名：
```
rental_platform_AM_20241125_020000.sql.gz
rental_platform_PM_20241125_140000.sql.gz
```

---

## ✅ 備份驗證

備份完成後會自動驗證：
1. 檢查備份檔是否存在
2. 驗證 gzip 壓縮檔完整性
3. 顯示備份檔大小

---

## 🔄 自動清理

腳本會自動刪除超過指定天數的舊備份：
- 預設保留 30 天
- 可透過 `RETENTION_DAYS` 環境變數調整

---

## 📊 備份監控

### 檢查備份狀態

#### Linux/Mac
```bash
# 查看備份日誌
tail -f /var/log/postgres-backup-am.log
tail -f /var/log/postgres-backup-pm.log

# 列出備份檔
ls -lh /backups/postgresql/
```

#### Windows
```powershell
# 查看任務狀態
Get-ScheduledTask -TaskName PostgreSQL-Backup-*

# 查看任務歷史
Get-WinEvent -LogName Microsoft-Windows-TaskScheduler/Operational | Where-Object {$_.Message -like "*PostgreSQL-Backup*"}
```

---

## 🔧 還原備份

### 還原步驟

```bash
# 1. 解壓縮備份檔
gunzip rental_platform_AM_20241125_020000.sql.gz

# 2. 還原資料庫
psql -h localhost -U user -d rental_platform < rental_platform_AM_20241125_020000.sql

# 或使用環境變數
export PGPASSWORD=your_password
psql -h $DB_HOST -U $DB_USER -d $DB_NAME < backup_file.sql
```

### Windows PowerShell
```powershell
# 解壓縮（需要 7-Zip 或類似工具）
Expand-Archive -Path backup.sql.gz -DestinationPath .

# 還原
$env:PGPASSWORD = "your_password"
psql -h localhost -U user -d rental_platform -f backup.sql
```

---

## 🆘 故障排除

### 備份失敗

1. **檢查 DATABASE_URL**
   ```bash
   echo $DATABASE_URL
   ```

2. **檢查 pg_dump 是否安裝**
   ```bash
   pg_dump --version
   ```

3. **測試資料庫連線**
   ```bash
   psql $DATABASE_URL -c "SELECT 1"
   ```

4. **檢查磁碟空間**
   ```bash
   df -h /backups
   ```

### 排程不執行

1. **檢查 cron 服務（Linux）**
   ```bash
   systemctl status cron
   ```

2. **檢查 Task Scheduler（Windows）**
   ```powershell
   Get-Service Schedule
   ```

3. **查看排程**
   ```bash
   # Linux
   crontab -l
   
   # Windows
   Get-ScheduledTask -TaskName PostgreSQL-Backup-*
   ```

4. **檢查執行權限**
   ```bash
   chmod +x backup-postgres.sh
   ```

---

## 📈 備份最佳實踐

1. **定期測試還原**
   - 每月至少測試一次還原流程
   - 驗證備份檔完整性

2. **異地備份**
   - 定期將備份檔複製到雲端儲存
   - 使用 AWS S3、Google Cloud Storage 等

3. **監控備份狀態**
   - 設定告警通知
   - 監控備份檔大小異常

4. **備份加密**
   - 敏感資料備份前加密
   - 使用 GPG 或其他加密工具

---

## 🔐 安全建議

1. **備份檔權限**
   ```bash
   chmod 600 /backups/postgresql/*.sql.gz
   ```

2. **備份檔加密**
   ```bash
   gpg --encrypt --recipient your@email.com backup.sql.gz
   ```

3. **定期清理**
   - 自動刪除舊備份
   - 避免磁碟空間不足

---

## 📚 參考資源

- [PostgreSQL Backup Documentation](https://www.postgresql.org/docs/current/backup.html)
- [pg_dump Manual](https://www.postgresql.org/docs/current/app-pgdump.html)





