@echo off
chcp 65001 >nul
echo ========================================
echo   租屋平台 - 前端服務啟動
echo ========================================
echo.

REM 檢查是否在正確的目錄
if not exist "packages\frontend" (
    echo ❌ 錯誤：請在 rental-monorepo 目錄下執行此腳本
    pause
    exit /b 1
)

REM 檢查 Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 錯誤：未找到 Node.js，請先安裝 Node.js
    pause
    exit /b 1
)

echo ✅ 檢查 Node.js 版本...
node --version
echo.

REM 檢查依賴
if not exist "node_modules" (
    echo 📦 安裝依賴中...
    call npm install
    if %errorlevel% neq 0 (
        echo ❌ 依賴安裝失敗
        pause
        exit /b 1
    )
    echo.
)

echo.
echo ========================================
echo   正在啟動前端服務...
echo ========================================
echo.
echo 📌 前端將運行於: http://localhost:3000
echo.
echo 💡 提示：按 Ctrl+C 可停止服務
echo.

REM 啟動前端
call npm run dev:frontend

pause


