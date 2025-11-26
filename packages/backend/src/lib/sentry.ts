/**
 * Sentry 錯誤追蹤與效能監控設定
 */
import * as Sentry from '@sentry/node';
import { config } from '../config';

/**
 * 初始化 Sentry
 */
export function initSentry() {
  if (!process.env.SENTRY_DSN) {
    // 開發環境不顯示警告，直接返回
    if (process.env.NODE_ENV === 'production') {
      console.warn('⚠️  Sentry DSN 未設定，錯誤追蹤功能將無法使用');
    }
    return;
  }

  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV || 'development',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    integrations: [
      // 自動追蹤 HTTP 請求
      Sentry.httpIntegration(),
      // 追蹤 Express
      Sentry.expressIntegration(),
    ],
    // 過濾敏感資訊
    beforeSend(event, hint) {
      // 移除敏感 headers
      if (event.request?.headers) {
        delete event.request.headers.authorization;
        delete event.request.headers.cookie;
      }

      // 移除敏感環境變數
      if (event.extra) {
        delete event.extra.DATABASE_URL;
        delete event.extra.JWT_SECRET;
      }

      return event;
    },
    // 忽略特定錯誤
    ignoreErrors: [
      'ValidationError',
      'UnauthorizedError',
      // 忽略 4xx 錯誤（客戶端錯誤）
      /^4\d{2}$/,
    ],
  });

  console.log('✅ Sentry 已初始化');
}

/**
 * 手動捕獲錯誤
 */
export function captureException(error: Error, context?: Record<string, any>) {
  if (context) {
    Sentry.withScope((scope) => {
      Object.entries(context).forEach(([key, value]) => {
        scope.setContext(key, value);
      });
      Sentry.captureException(error);
    });
  } else {
    Sentry.captureException(error);
  }
}

/**
 * 手動捕獲訊息
 */
export function captureMessage(message: string, level: Sentry.SeverityLevel = 'info') {
  Sentry.captureMessage(message, level);
}

/**
 * 設定使用者資訊
 */
export function setUser(user: { id: string; email?: string; username?: string }) {
  Sentry.setUser({
    id: user.id,
    email: user.email,
    username: user.username,
  });
}

/**
 * 清除使用者資訊
 */
export function clearUser() {
  Sentry.setUser(null);
}

/**
 * 開始效能追蹤
 */
export function startTransaction(name: string, op: string) {
  return Sentry.startTransaction({
    name,
    op,
  });
}

/**
 * 設定額外上下文
 */
export function setContext(key: string, context: Record<string, any>) {
  Sentry.setContext(key, context);
}

/**
 * 設定標籤
 */
export function setTag(key: string, value: string) {
  Sentry.setTag(key, value);
}

export default Sentry;

