# GitHub Repository 設定指南

## 📋 步驟 1: 安裝 Git

### Windows

1. **下載 Git**
   - 前往：https://git-scm.com/download/win
   - 下載並安裝 Git for Windows

2. **驗證安裝**
   ```powershell
   git --version
   ```

---

## 📋 步驟 2: 初始化 Git Repository

### 在專案目錄執行：

```powershell
# 進入專案目錄
cd C:\Users\user\Desktop\PYTHON1\rental-monorepo

# 初始化 Git
git init

# 設定使用者資訊（如果還沒設定）
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# 加入所有檔案
git add .

# 建立第一個 commit
git commit -m "Initial commit: Rental platform with CI/CD"
```

---

## 📋 步驟 3: 在 GitHub 建立 Repository

### 方式 1: 使用 GitHub 網頁

1. **前往 GitHub**
   - 登入：https://github.com
   - 點擊右上角 "+" → "New repository"

2. **設定 Repository**
   - **Repository name**: `rental-platform` (或您喜歡的名稱)
   - **Description**: `租屋平台 - Next.js + Express + TypeScript`
   - **Visibility**: Public 或 Private
   - **不要**勾選 "Initialize this repository with a README"
   - 點擊 "Create repository"

3. **複製 Repository URL**
   - 例如：`https://github.com/YOUR_USERNAME/rental-platform.git`

### 方式 2: 使用 GitHub CLI

```powershell
# 安裝 GitHub CLI (如果還沒安裝)
# 下載：https://cli.github.com/

# 登入
gh auth login

# 建立 Repository
gh repo create rental-platform --public --source=. --remote=origin --push
```

---

## 📋 步驟 4: 連結並推送程式碼

```powershell
# 加入 remote
git remote add origin https://github.com/YOUR_USERNAME/rental-platform.git

# 重新命名分支為 main（如果需要的話）
git branch -M main

# 推送程式碼
git push -u origin main
```

---

## 📋 步驟 5: 設定 GitHub Secrets

推送完成後，設定 CI/CD 所需的 Secrets：

### 前往設定頁面
```
https://github.com/YOUR_USERNAME/rental-platform/settings/secrets/actions
```

### 新增以下 Secrets：

#### Vercel (Frontend)
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `NEXT_PUBLIC_API_URL`

#### DigitalOcean (Backend)
- `DIGITALOCEAN_ACCESS_TOKEN`
- `DIGITALOCEAN_APP_NAME`

#### Render (Backend)
- `RENDER_API_KEY`
- `RENDER_SERVICE_ID`

詳細說明請參考 [CI_CD_SETUP.md](./CI_CD_SETUP.md)

---

## 📋 步驟 6: 驗證 CI/CD

1. **檢查 Actions**
   - 前往：`https://github.com/YOUR_USERNAME/rental-platform/actions`
   - 應該會看到 CI workflow 自動執行

2. **檢查 Repository**
   - 前往：`https://github.com/YOUR_USERNAME/rental-platform`
   - 確認所有檔案都已上傳

---

## 🔧 常用 Git 指令

```powershell
# 查看狀態
git status

# 加入檔案
git add .
git add <檔案名稱>

# Commit
git commit -m "描述訊息"

# 推送
git push origin main

# 拉取更新
git pull origin main

# 查看分支
git branch

# 建立新分支
git checkout -b feature/new-feature

# 切換分支
git checkout main
```

---

## 🆘 常見問題

### Q: 推送時要求輸入帳號密碼？
A: 使用 Personal Access Token 代替密碼，或設定 SSH key。

### Q: 如何建立 Personal Access Token？
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. 選擇權限：`repo` (完整權限)
4. 複製 Token 並使用它作為密碼

### Q: 如何設定 SSH Key？
```powershell
# 產生 SSH key
ssh-keygen -t ed25519 -C "your.email@example.com"

# 複製 public key
cat ~/.ssh/id_ed25519.pub

# 在 GitHub → Settings → SSH and GPG keys → New SSH key
# 貼上 public key
```

---

## 📚 參考資源

- [Git 官方文件](https://git-scm.com/doc)
- [GitHub 文件](https://docs.github.com)
- [GitHub CLI](https://cli.github.com/manual/)

---

## ✅ 檢查清單

- [ ] Git 已安裝
- [ ] Git repository 已初始化
- [ ] GitHub repository 已建立
- [ ] 程式碼已推送到 GitHub
- [ ] GitHub Secrets 已設定
- [ ] CI/CD Workflow 執行成功





