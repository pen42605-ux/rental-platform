#!/bin/bash

# 備份到 AWS S3 的腳本
# 使用方式: ./backup-to-s3.sh [AM|PM]

# 載入主要備份腳本
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_SCRIPT="$SCRIPT_DIR/backup-postgres.sh"

# 執行本地備份
echo "執行本地備份..."
"$BACKUP_SCRIPT" "$1"

if [ $? -ne 0 ]; then
    echo "❌ 本地備份失敗，跳過 S3 上傳"
    exit 1
fi

# 取得最新的備份檔
BACKUP_DIR="${BACKUP_DIR:-/backups/postgresql}"
PERIOD="${1:-AM}"
LATEST_BACKUP=$(ls -t "$BACKUP_DIR"/rental_platform_${PERIOD}_*.sql.gz 2>/dev/null | head -1)

if [ -z "$LATEST_BACKUP" ]; then
    echo "❌ 找不到備份檔"
    exit 1
fi

# S3 設定
S3_BUCKET="${S3_BACKUP_BUCKET:-rental-platform-backups}"
S3_PREFIX="postgresql/$(date +%Y/%m)"

# 上傳到 S3
echo "上傳到 S3: s3://$S3_BUCKET/$S3_PREFIX/$(basename $LATEST_BACKUP)"
aws s3 cp "$LATEST_BACKUP" "s3://$S3_BUCKET/$S3_PREFIX/$(basename $LATEST_BACKUP)"

if [ $? -eq 0 ]; then
    echo "✅ S3 上傳成功"
    
    # 清理 S3 舊備份（保留 90 天）
    echo "清理 S3 舊備份..."
    aws s3 ls "s3://$S3_BUCKET/$S3_PREFIX/" | while read -r line; do
        BACKUP_DATE=$(echo $line | awk '{print $1, $2}')
        BACKUP_FILE=$(echo $line | awk '{print $4}')
        
        if [ -n "$BACKUP_FILE" ]; then
            BACKUP_TIMESTAMP=$(date -d "$BACKUP_DATE" +%s)
            CUTOFF_TIMESTAMP=$(date -d "90 days ago" +%s)
            
            if [ $BACKUP_TIMESTAMP -lt $CUTOFF_TIMESTAMP ]; then
                echo "刪除舊備份: $BACKUP_FILE"
                aws s3 rm "s3://$S3_BUCKET/$S3_PREFIX/$BACKUP_FILE"
            fi
        fi
    done
    
    echo "✅ S3 清理完成"
else
    echo "❌ S3 上傳失敗"
    exit 1
fi





