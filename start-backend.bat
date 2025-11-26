@echo off
chcp 65001 >nul
echo ========================================
echo   租屋平台 - 後端服務啟動
echo ========================================
echo.

REM 檢查是否在正確的目錄
if not exist "packages\backend" (
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

REM 檢查 .env 文件
if not exist ".env" (
    echo ⚠️  警告：未找到 .env 文件
    if exist "env.example" (
        echo 📝 正在從 env.example 複製...
        copy env.example .env >nul
        echo ✅ 已建立 .env 文件，請編輯設定
    )
    echo.
)

REM 檢查資料庫
echo 🔍 檢查資料庫配置...
cd packages\backend
if not exist "node_modules\@prisma\client" (
    echo 📦 生成 Prisma Client...
    call npm run db:generate
)
cd ..\..

echo.
echo ========================================
echo   正在啟動後端服務...
echo ========================================
echo.
echo 📌 後端將運行於: http://localhost:4000
echo 📌 API 文件: http://localhost:4000/api-docs
echo.
echo 💡 提示：按 Ctrl+C 可停止服務
echo.

REM 啟動後端
call npm run dev:backend

pause


