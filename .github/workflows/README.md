# GitHub Actions Workflows

本目錄包含 CI/CD 自動化流程設定。

## 📋 Workflow 檔案說明

### `ci.yml`
**觸發條件：**
- Push 到 `main` 或 `develop` 分支
- Pull Request 到 `main` 或 `develop` 分支

**執行內容：**
- 安裝依賴
- Lint 檢查（Backend + Frontend）
- 執行單元測試（Backend）
- 建置專案（Backend + Frontend）
- 上傳測試覆蓋率報告

### `deploy.yml`
**觸發條件：**
- Push 到 `main` 分支
- 手動觸發（workflow_dispatch）

**執行內容：**
- 部署 Backend 到 DigitalOcean / Render
- 部署 Frontend 到 Vercel

### `deploy-vercel.yml`
**觸發條件：**
- Push 到 `main` 分支（僅 `packages/frontend/**` 變更時）
- 手動觸發

**執行內容：**
- 僅部署 Frontend 到 Vercel

### `deploy-backend.yml`
**觸發條件：**
- Push 到 `main` 分支（僅 `packages/backend/**` 變更時）
- 手動觸發

**執行內容：**
- 僅部署 Backend 到 DigitalOcean / Render

---

## 🔧 設定步驟

### 1. 設定 GitHub Secrets

前往 Repository → Settings → Secrets and variables → Actions

#### Vercel
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`
- `NEXT_PUBLIC_API_URL`

#### DigitalOcean
- `DIGITALOCEAN_ACCESS_TOKEN`
- `DIGITALOCEAN_APP_NAME`
- `DIGITALOCEAN_APP_ID` (選填)

#### Render
- `RENDER_API_KEY`
- `RENDER_SERVICE_ID`

### 2. 測試 Workflow

```bash
# 建立測試分支
git checkout -b test-ci

# 推送觸發 CI
git push origin test-ci

# 建立 PR 觸發 CI
# 在 GitHub 建立 Pull Request
```

### 3. 手動觸發部署

在 GitHub → Actions → 選擇 Workflow → Run workflow

---

## 📊 監控

- **CI 狀態**: Repository → Actions
- **部署狀態**: 各平台 Dashboard
- **測試覆蓋率**: Codecov (如果已設定)

---

## 🐛 故障排除

### Workflow 失敗

1. **檢查 Secrets**
   - 確認所有必要的 Secrets 都已設定

2. **檢查日誌**
   - GitHub Actions → 選擇失敗的 Workflow → 查看 Logs

3. **本地測試**
   ```bash
   # 測試 Lint
   npm run lint
   
   # 測試 Build
   npm run build
   
   # 測試 Test
   npm run test
   ```

### 部署失敗

1. **檢查環境變數**
   - 確認部署平台的環境變數已設定

2. **檢查建置日誌**
   - 查看 GitHub Actions 的 Build 步驟日誌

3. **檢查平台日誌**
   - Vercel: Deployments → View Function Logs
   - DigitalOcean: App → Runtime Logs
   - Render: Service → Logs

---

## 📚 參考資源

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel GitHub Integration](https://vercel.com/docs/concepts/git)
- [DigitalOcean App Platform](https://docs.digitalocean.com/products/app-platform/)
- [Render GitHub Integration](https://render.com/docs/github)





