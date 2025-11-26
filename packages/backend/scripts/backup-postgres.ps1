# PostgreSQL 備份腳本 (PowerShell)
# 使用方式: .\backup-postgres.ps1 [AM|PM]

param(
    [Parameter(Mandatory=$false)]
    [ValidateSet("AM", "PM")]
    [string]$Period = "AM"
)

# 設定變數
$BackupDir = if ($env:BACKUP_DIR) { $env:BACKUP_DIR } else { "C:\backups\postgresql" }
$DatabaseUrl = if ($env:DATABASE_URL) { $env:DATABASE_URL } else { "postgresql://user:password@localhost:5432/rental_platform" }
$RetentionDays = if ($env:RETENTION_DAYS) { [int]$env:RETENTION_DAYS } else { 30 }

# 建立備份目錄
if (-not (Test-Path $BackupDir)) {
    New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
}

# 取得時間戳記
$Timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
$BackupFile = Join-Path $BackupDir "rental_platform_${Period}_${Timestamp}.sql.gz"

# 從 DATABASE_URL 解析連線資訊
# 格式: postgresql://user:password@host:port/database
$UrlPattern = "postgresql://([^:]+):([^@]+)@([^:]+):([^/]+)/(.+)"
if ($DatabaseUrl -match $UrlPattern) {
    $DbUser = $matches[1]
    $DbPass = $matches[2]
    $DbHost = $matches[3]
    $DbPort = $matches[4]
    $DbName = $matches[5]
} else {
    Write-Host "錯誤: 無法解析 DATABASE_URL" -ForegroundColor Red
    exit 1
}

# 設定環境變數
$env:PGPASSWORD = $DbPass

# 執行備份
Write-Host "開始備份資料庫: $DbName" -ForegroundColor Green
Write-Host "時間: $(Get-Date)"
Write-Host "備份檔: $BackupFile"

# 使用 pg_dump 備份
$TempSqlFile = Join-Path $env:TEMP "backup_${Timestamp}.sql"
& pg_dump -h $DbHost -p $DbPort -U $DbUser -d $DbName --no-owner --no-acl --clean --if-exists | Out-File -FilePath $TempSqlFile -Encoding UTF8

if ($LASTEXITCODE -eq 0) {
    # 壓縮備份檔
    $Content = Get-Content $TempSqlFile -Raw -Encoding UTF8
    $Bytes = [System.Text.Encoding]::UTF8.GetBytes($Content)
    $GzipStream = New-Object System.IO.Compression.GzipStream(
        [System.IO.File]::Create($BackupFile),
        [System.IO.Compression.CompressionLevel]::Optimal
    )
    $GzipStream.Write($Bytes, 0, $Bytes.Length)
    $GzipStream.Close()
    
    # 刪除暫存檔
    Remove-Item $TempSqlFile -Force
    
    # 檢查備份檔大小
    $BackupSize = (Get-Item $BackupFile).Length / 1MB
    Write-Host "✅ 備份成功: $BackupFile ($([math]::Round($BackupSize, 2)) MB)" -ForegroundColor Green
    
    # 清理舊備份
    Write-Host "清理 $RetentionDays 天前的備份..." -ForegroundColor Yellow
    $CutoffDate = (Get-Date).AddDays(-$RetentionDays)
    Get-ChildItem -Path $BackupDir -Filter "rental_platform_*.sql.gz" | 
        Where-Object { $_.LastWriteTime -lt $CutoffDate } | 
        Remove-Item -Force
    
    Write-Host "✅ 清理完成" -ForegroundColor Green
} else {
    Write-Host "❌ 備份失敗" -ForegroundColor Red
    if (Test-Path $TempSqlFile) {
        Remove-Item $TempSqlFile -Force
    }
    exit 1
}

# 清除密碼
Remove-Item Env:\PGPASSWORD

Write-Host "備份完成: $(Get-Date)" -ForegroundColor Green





