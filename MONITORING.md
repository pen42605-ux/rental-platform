# 監控與錯誤追蹤清單

## 📋 監控項目清單

### 1. 錯誤追蹤 (Error Tracking)
- [x] **Sentry** - 整合完成
  - 後端錯誤追蹤
  - 前端錯誤追蹤
  - 自動發送通知
  - 錯誤分組與分析

### 2. APM (Application Performance Monitoring)
- [ ] **Sentry Performance** - 已整合
  - API 回應時間監控
  - 資料庫查詢效能
  - 慢查詢追蹤
- [ ] **New Relic** (選用)
- [ ] **Datadog APM** (選用)

### 3. 日誌管理 (Logging)
- [x] **Winston** - 後端日誌
  - 錯誤日誌
  - 存取日誌
  - 審核日誌
- [ ] **Logtail** (選用)
- [ ] **Papertrail** (選用)
- [ ] **CloudWatch Logs** (AWS)

### 4. 系統資源監控
- [ ] **CPU 使用率**
  - 監控閾值：> 80%
  - 告警通知
- [ ] **Memory 使用率**
  - 監控閾值：> 85%
  - 告警通知
- [ ] **Disk 使用率**
  - 監控閾值：> 90%
  - 告警通知
- [ ] **Network 流量**

### 5. 應用程式監控
- [ ] **API 回應時間**
  - 目標：< 200ms (P95)
  - 慢查詢：> 1s
- [ ] **API 錯誤率**
  - 目標：< 1%
  - 告警：> 5%
- [ ] **資料庫連線數**
- [ ] **活躍使用者數**

### 6. 搜尋引擎監控
- [ ] **Meilisearch 延遲**
  - 搜尋回應時間：< 100ms
  - 索引延遲：< 5s
- [ ] **搜尋錯誤率**
- [ ] **索引大小**

### 7. 資料庫監控
- [ ] **PostgreSQL 連線數**
- [ ] **慢查詢追蹤**
- [ ] **資料庫大小**
- [ ] **備份狀態**
  - 每日 AM/PM 備份
  - 備份驗證

### 8. 第三方服務監控
- [ ] **AWS S3 狀態**
- [ ] **外部 API 可用性**

---

## 🔧 整合工具

### Sentry
- **用途**: 錯誤追蹤、效能監控
- **設定**: 見 `packages/backend/src/lib/sentry.ts`
- **Dashboard**: https://sentry.io

### Winston
- **用途**: 結構化日誌
- **設定**: 見 `packages/backend/src/lib/logger.ts`

### Health Check
- **端點**: `/health`
- **監控項目**: 資料庫連線、搜尋引擎狀態

---

## 📊 監控 Dashboard

### 建議使用
- **Grafana** - 視覺化監控
- **Sentry Dashboard** - 錯誤分析
- **CloudWatch** - AWS 資源監控

---

## 🚨 告警規則

### 錯誤率告警
- **條件**: 錯誤率 > 5% (5 分鐘)
- **通知**: Email + Slack

### 效能告警
- **條件**: P95 回應時間 > 1s (5 分鐘)
- **通知**: Email

### 資源告警
- **條件**: CPU > 80% 或 Memory > 85% (10 分鐘)
- **通知**: Email

### 資料庫告警
- **條件**: 連線數 > 80% 或慢查詢 > 10 (5 分鐘)
- **通知**: Email

---

## 📝 日誌保留政策

- **錯誤日誌**: 保留 90 天
- **存取日誌**: 保留 30 天
- **審核日誌**: 保留 1 年
- **效能日誌**: 保留 30 天

---

## 🔍 監控檢查清單

### 每日檢查
- [ ] 檢查 Sentry 錯誤報告
- [ ] 檢查系統資源使用率
- [ ] 檢查資料庫備份狀態
- [ ] 檢查 API 回應時間

### 每週檢查
- [ ] 分析錯誤趨勢
- [ ] 檢查慢查詢
- [ ] 檢查搜尋引擎效能
- [ ] 檢查日誌大小

### 每月檢查
- [ ] 效能報告分析
- [ ] 成本優化檢討
- [ ] 監控規則調整

---

## 📚 參考資源

- [Sentry Documentation](https://docs.sentry.io)
- [Winston Documentation](https://github.com/winstonjs/winston)
- [PostgreSQL Monitoring](https://www.postgresql.org/docs/current/monitoring.html)





