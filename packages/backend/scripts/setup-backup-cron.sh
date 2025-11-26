#!/bin/bash

# 設定 PostgreSQL 備份排程 (Linux/Mac)
# 使用方式: ./setup-backup-cron.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_SCRIPT="$SCRIPT_DIR/backup-postgres.sh"

# 檢查備份腳本是否存在
if [ ! -f "$BACKUP_SCRIPT" ]; then
    echo "錯誤: 找不到備份腳本 $BACKUP_SCRIPT"
    exit 1
fi

# 設定執行權限
chmod +x "$BACKUP_SCRIPT"

# 取得當前使用者的 crontab
CRON_FILE=$(mktemp)
crontab -l > "$CRON_FILE" 2>/dev/null || true

# 檢查是否已經設定
if grep -q "backup-postgres.sh" "$CRON_FILE"; then
    echo "⚠️  備份排程已存在，跳過設定"
    rm "$CRON_FILE"
    exit 0
fi

# 新增 AM 備份 (每天上午 2:00)
echo "0 2 * * * $BACKUP_SCRIPT AM >> /var/log/postgres-backup-am.log 2>&1" >> "$CRON_FILE"

# 新增 PM 備份 (每天下午 2:00)
echo "0 14 * * * $BACKUP_SCRIPT PM >> /var/log/postgres-backup-pm.log 2>&1" >> "$CRON_FILE"

# 安裝 crontab
crontab "$CRON_FILE"
rm "$CRON_FILE"

echo "✅ 備份排程已設定:"
echo "   - AM 備份: 每天 02:00"
echo "   - PM 備份: 每天 14:00"
echo ""
echo "查看排程: crontab -l"
echo "編輯排程: crontab -e"

