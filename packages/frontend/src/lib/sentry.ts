/**
 * Sentry 前端錯誤追蹤設定
 */
import * as Sentry from '@sentry/nextjs';

/**
 * 初始化 Sentry
 */
export function initSentry() {
  const sentryDsn = (typeof process !== 'undefined' && process.env?.NEXT_PUBLIC_SENTRY_DSN) 
    ? process.env.NEXT_PUBLIC_SENTRY_DSN 
    : '';
  
  if (!sentryDsn) {
    console.warn('⚠️  Sentry DSN 未設定，錯誤追蹤功能將無法使用');
    return;
  }

  const nodeEnv = (typeof process !== 'undefined' && process.env?.NODE_ENV) 
    ? process.env.NODE_ENV 
    : 'development';

  Sentry.init({
    dsn: sentryDsn,
    environment: nodeEnv,
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
      Sentry.browserTracingIntegration(),
    ],
    // 過濾敏感資訊
    beforeSend(event, hint) {
      // 移除敏感資訊
      if (event.request?.cookies) {
        delete event.request.cookies;
      }
      return event;
    },
    // 忽略特定錯誤
    ignoreErrors: [
      // 瀏覽器擴充功能錯誤
      'ResizeObserver loop limit exceeded',
      'Non-Error promise rejection captured',
      // 網路錯誤
      'NetworkError',
      'Failed to fetch',
    ],
  });
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

export default Sentry;

