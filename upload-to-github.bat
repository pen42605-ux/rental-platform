@echo off
chcp 65001 >nul
echo ========================================
echo 正在上傳程式碼到 GitHub...
echo ========================================
echo.

cd /d "%~dp0"

echo [1/6] 初始化 Git...
git init
if errorlevel 1 (
    echo 錯誤：Git 未安裝或無法執行
    echo 請先安裝 Git: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo [2/6] 加入所有檔案...
git add .

echo [3/6] 建立第一個 Commit...
git commit -m "Initial commit: Rental platform with CI/CD"
if errorlevel 1 (
    echo 警告：可能需要先設定 Git 使用者資訊
    echo 正在設定...
    git config user.name "pen42605-ux"
    git config user.email "pen42605-ux@users.noreply.github.com"
    git commit -m "Initial commit: Rental platform with CI/CD"
)

echo [4/6] 設定分支名稱...
git branch -M main

echo [5/6] 連結到 GitHub...
git remote add origin https://github.com/pen42605-ux/rental-platform.git
if errorlevel 1 (
    echo 警告：Remote 可能已存在，嘗試更新...
    git remote set-url origin https://github.com/pen42605-ux/rental-platform.git
)

echo [6/6] 上傳程式碼到 GitHub...
echo 這可能需要一些時間，請稍候...
git push -u origin main

if errorlevel 1 (
    echo.
    echo ========================================
    echo 上傳失敗！
    echo 可能的原因：
    echo 1. 需要輸入 GitHub 帳號密碼
    echo 2. 需要使用 Personal Access Token
    echo.
    echo 請手動執行：git push -u origin main
    echo 然後輸入您的 GitHub 帳號和 Personal Access Token
    echo ========================================
) else (
    echo.
    echo ========================================
    echo ✅ 上傳成功！
    echo.
    echo 請前往查看：
    echo https://github.com/pen42605-ux/rental-platform
    echo ========================================
)

echo.
pause





