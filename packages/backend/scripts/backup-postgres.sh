#!/bin/bash

# PostgreSQL 備份腳本
# 使用方式: ./backup-postgres.sh [AM|PM]

# 設定變數
BACKUP_DIR="${BACKUP_DIR:-/backups/postgresql}"
DATABASE_URL="${DATABASE_URL:-postgresql://user:password@localhost:5432/rental_platform}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"

# 建立備份目錄
mkdir -p "$BACKUP_DIR"

# 取得時間戳記
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
PERIOD="${1:-AM}"  # AM 或 PM

# 備份檔名
BACKUP_FILE="$BACKUP_DIR/rental_platform_${PERIOD}_${TIMESTAMP}.sql.gz"

# 從 DATABASE_URL 解析連線資訊
# 格式: postgresql://user:password@host:port/database
DB_URL_REGEX="postgresql://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+)"
if [[ $DATABASE_URL =~ $DB_URL_REGEX ]]; then
    DB_USER="${BASH_REMATCH[1]}"
    DB_PASS="${BASH_REMATCH[2]}"
    DB_HOST="${BASH_REMATCH[3]}"
    DB_PORT="${BASH_REMATCH[4]}"
    DB_NAME="${BASH_REMATCH[5]}"
else
    echo "錯誤: 無法解析 DATABASE_URL"
    exit 1
fi

# 設定 PGPASSWORD 環境變數
export PGPASSWORD="$DB_PASS"

# 執行備份
echo "開始備份資料庫: $DB_NAME"
echo "時間: $(date)"
echo "備份檔: $BACKUP_FILE"

pg_dump -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" \
    --no-owner \
    --no-acl \
    --clean \
    --if-exists \
    | gzip > "$BACKUP_FILE"

# 檢查備份是否成功
if [ $? -eq 0 ]; then
    BACKUP_SIZE=$(du -h "$BACKUP_FILE" | cut -f1)
    echo "✅ 備份成功: $BACKUP_FILE ($BACKUP_SIZE)"
    
    # 驗證備份檔
    if gzip -t "$BACKUP_FILE" 2>/dev/null; then
        echo "✅ 備份檔驗證通過"
    else
        echo "❌ 備份檔驗證失敗"
        exit 1
    fi
    
    # 清理舊備份（保留指定天數）
    echo "清理 $RETENTION_DAYS 天前的備份..."
    find "$BACKUP_DIR" -name "rental_platform_*.sql.gz" -mtime +$RETENTION_DAYS -delete
    echo "✅ 清理完成"
else
    echo "❌ 備份失敗"
    exit 1
fi

# 清除密碼
unset PGPASSWORD

echo "備份完成: $(date)"





