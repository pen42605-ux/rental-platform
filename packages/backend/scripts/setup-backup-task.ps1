# 設定 PostgreSQL 備份排程 (Windows Task Scheduler)
# 使用方式: .\setup-backup-task.ps1

# 需要管理員權限
if (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)) {
    Write-Host "錯誤: 需要管理員權限" -ForegroundColor Red
    Write-Host "請以管理員身份執行 PowerShell" -ForegroundColor Yellow
    exit 1
}

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$BackupScript = Join-Path $ScriptDir "backup-postgres.ps1"

# 檢查備份腳本是否存在
if (-not (Test-Path $BackupScript)) {
    Write-Host "錯誤: 找不到備份腳本 $BackupScript" -ForegroundColor Red
    exit 1
}

# PowerShell 執行路徑
$PowerShellPath = (Get-Command powershell.exe).Source

# 建立 AM 備份任務
$TaskNameAM = "PostgreSQL-Backup-AM"
$TaskDescriptionAM = "PostgreSQL 每日 AM 備份 (02:00)"

$ActionAM = New-ScheduledTaskAction -Execute $PowerShellPath -Argument "-File `"$BackupScript`" AM"
$TriggerAM = New-ScheduledTaskTrigger -Daily -At "02:00"
$PrincipalAM = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType S4U -RunLevel Highest
$SettingsAM = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

# 移除舊任務（如果存在）
Unregister-ScheduledTask -TaskName $TaskNameAM -Confirm:$false -ErrorAction SilentlyContinue

# 註冊任務
Register-ScheduledTask -TaskName $TaskNameAM -Action $ActionAM -Trigger $TriggerAM -Principal $PrincipalAM -Settings $SettingsAM -Description $TaskDescriptionAM | Out-Null

Write-Host "✅ AM 備份任務已建立: $TaskNameAM" -ForegroundColor Green

# 建立 PM 備份任務
$TaskNamePM = "PostgreSQL-Backup-PM"
$TaskDescriptionPM = "PostgreSQL 每日 PM 備份 (14:00)"

$ActionPM = New-ScheduledTaskAction -Execute $PowerShellPath -Argument "-File `"$BackupScript`" PM"
$TriggerPM = New-ScheduledTaskTrigger -Daily -At "14:00"
$PrincipalPM = New-ScheduledTaskPrincipal -UserId "$env:USERDOMAIN\$env:USERNAME" -LogonType S4U -RunLevel Highest
$SettingsPM = New-ScheduledTaskSettingsSet -AllowStartIfOnBatteries -DontStopIfGoingOnBatteries -StartWhenAvailable

# 移除舊任務（如果存在）
Unregister-ScheduledTask -TaskName $TaskNamePM -Confirm:$false -ErrorAction SilentlyContinue

# 註冊任務
Register-ScheduledTask -TaskName $TaskNamePM -Action $ActionPM -Trigger $TriggerPM -Principal $PrincipalPM -Settings $SettingsPM -Description $TaskDescriptionPM | Out-Null

Write-Host "✅ PM 備份任務已建立: $TaskNamePM" -ForegroundColor Green

Write-Host ""
Write-Host "備份排程已設定:" -ForegroundColor Cyan
Write-Host "  - AM 備份: 每天 02:00" -ForegroundColor Yellow
Write-Host "  - PM 備份: 每天 14:00" -ForegroundColor Yellow
Write-Host ""
Write-Host "查看任務: Get-ScheduledTask -TaskName PostgreSQL-Backup-*" -ForegroundColor Gray
Write-Host "測試執行: Start-ScheduledTask -TaskName $TaskNameAM" -ForegroundColor Gray





