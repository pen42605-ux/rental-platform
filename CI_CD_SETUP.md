# CI/CD 快速設定指南

## 🚀 5 分鐘快速設定

### 步驟 1: 設定 GitHub Secrets

前往：`https://github.com/YOUR_USERNAME/YOUR_REPO/settings/secrets/actions`

#### Frontend (Vercel)
```bash
# 1. 取得 Vercel Token
# 前往 https://vercel.com/account/tokens
VERCEL_TOKEN=vercel_xxxxxxxxxxxxx

# 2. 取得 Project ID 和 Org ID
cd packages/frontend
npm i -g vercel
vercel login
vercel link
# 複製 Project ID 和 Org ID

VERCEL_ORG_ID=team_xxxxxxxxxxxxx
VERCEL_PROJECT_ID=prj_xxxxxxxxxxxxx
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

#### Backend (DigitalOcean)
```bash
# 前往 https://cloud.digitalocean.com/account/api/tokens
DIGITALOCEAN_ACCESS_TOKEN=dop_v1_xxxxxxxxxxxxx
DIGITALOCEAN_APP_NAME=rental-platform-backend
```

#### Backend (Render)
```bash
# 前往 https://dashboard.render.com/account/api-keys
RENDER_API_KEY=rnd_xxxxxxxxxxxxx
# 在 Service Settings → Info 取得 Service ID
RENDER_SERVICE_ID=srv_xxxxxxxxxxxxx
```

### 步驟 2: 推送程式碼

```bash
git add .
git commit -m "Add CI/CD workflows"
git push origin main
```

### 步驟 3: 檢查部署狀態

- **CI**: https://github.com/YOUR_USERNAME/YOUR_REPO/actions
- **Vercel**: https://vercel.com/dashboard
- **DigitalOcean**: https://cloud.digitalocean.com/apps
- **Render**: https://dashboard.render.com

---

## 📝 詳細設定

請參考 [DEPLOYMENT.md](./DEPLOYMENT.md) 取得完整設定說明。

---

## ✅ 驗收清單

- [ ] GitHub Secrets 已設定
- [ ] CI Workflow 執行成功
- [ ] Frontend 部署到 Vercel
- [ ] Backend 部署到 DigitalOcean 或 Render
- [ ] 環境變數已設定
- [ ] 資料庫連線正常
- [ ] 健康檢查端點正常

---

## 🆘 常見問題

### Q: CI 失敗怎麼辦？
A: 檢查 GitHub Actions 日誌，通常是 Lint 或 Test 失敗。

### Q: 部署失敗怎麼辦？
A: 檢查平台日誌和環境變數設定。

### Q: 如何手動觸發部署？
A: GitHub → Actions → 選擇 Workflow → Run workflow

---

## 📚 更多資訊

- [GitHub Actions 文件](https://docs.github.com/en/actions)
- [Vercel 文件](https://vercel.com/docs)
- [DigitalOcean 文件](https://docs.digitalocean.com/products/app-platform/)
- [Render 文件](https://render.com/docs)

