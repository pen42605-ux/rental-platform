/**
 * Sentry 錯誤追蹤中間件
 */
import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import * as Sentry from '@sentry/node';
import { AuthRequest } from './auth.middleware';

/**
 * Sentry 請求追蹤中間件
 */
export function sentryRequestHandler() {
  return Sentry.Handlers.requestHandler({
    // 包含請求資料
    include: {
      ip: true,
      request: true,
      transaction: true,
      user: true,
    },
    // 過濾敏感資訊
    request: {
      ip: true,
    },
  });
}

/**
 * Sentry 追蹤中間件
 */
export function sentryTracingHandler() {
  return Sentry.Handlers.tracingHandler();
}

/**
 * Sentry 錯誤處理中間件
 * 明確標註回傳型別為 Express 的 ErrorRequestHandler，避免引用
 * Sentry 內部的 MiddlewareError 型別導致 TS4058。
 */
export function sentryErrorHandler(): ErrorRequestHandler {
  return Sentry.Handlers.errorHandler({
    // 不自動捕獲 4xx 錯誤
    shouldHandleError(error) {
      // 只處理 5xx 錯誤和未預期的錯誤
      if ((error as any).status && (error as any).status < 500) {
        return false;
      }
      return true;
    },
  }) as unknown as ErrorRequestHandler;
}

/**
 * 手動設定使用者資訊（在認證後使用）
 */
export function setSentryUser(req: AuthRequest, res: Response, next: NextFunction) {
  if (req.user) {
    Sentry.setUser({
      id: req.user.id,
      email: req.user.email,
      username: req.user.name,
    });
  }
  next();
}

/**
 * 清除使用者資訊（在登出後使用）
 */
export function clearSentryUser(req: Request, res: Response, next: NextFunction) {
  Sentry.setUser(null);
  next();
}

/**
 * 效能追蹤裝飾器
 */
export function trackPerformance(name: string, op: string = 'http.server') {
  return (req: Request, res: Response, next: NextFunction) => {
    const transaction = Sentry.startTransaction({
      name,
      op,
    });

    // 設定請求資訊
    transaction.setData('method', req.method);
    transaction.setData('url', req.url);
    transaction.setData('query', req.query);
    transaction.setData('params', req.params);

    // 監控回應時間
    res.on('finish', () => {
      transaction.setData('statusCode', res.statusCode);
      transaction.setData('responseTime', Date.now() - transaction.startTimestamp);
      transaction.finish();
    });

    next();
  };
}





