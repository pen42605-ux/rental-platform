/**
 * 監控中間件 - 追蹤 API 效能與資源使用
 */
import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';
import * as Sentry from '@sentry/node';

interface RequestMetrics {
  method: string;
  url: string;
  startTime: number;
  statusCode?: number;
  responseTime?: number;
}

/**
 * API 效能監控中間件
 */
export function monitoringMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const startTime = Date.now();
  const metrics: RequestMetrics = {
    method: req.method,
    url: req.url,
    startTime,
  };

  // 監控回應完成
  res.on('finish', () => {
    const responseTime = Date.now() - startTime;
    metrics.statusCode = res.statusCode;
    metrics.responseTime = responseTime;

    // 記錄慢查詢（> 1 秒）
    if (responseTime > 1000) {
      logger.warn('Slow API request', {
        ...metrics,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });

      // 發送到 Sentry
      Sentry.addBreadcrumb({
        category: 'performance',
        message: 'Slow API request',
        level: 'warning',
        data: metrics,
      });
    }

    // 記錄錯誤請求（4xx, 5xx）
    if (res.statusCode >= 400) {
      logger.error('API error', {
        ...metrics,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
      });
    }

    // 記錄正常請求（僅開發環境）
    if (process.env.NODE_ENV === 'development') {
      logger.debug('API request', metrics);
    }
  });

  next();
}

/**
 * 系統資源監控
 */
export function systemMetricsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 每 100 個請求檢查一次資源使用
  if (Math.random() < 0.01) {
    const memUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();

    const metrics = {
      memory: {
        heapUsed: Math.round((memUsage.heapUsed / 1024 / 1024) * 100) / 100,
        heapTotal: Math.round((memUsage.heapTotal / 1024 / 1024) * 100) / 100,
        rss: Math.round((memUsage.rss / 1024 / 1024) * 100) / 100,
      },
      cpu: {
        user: cpuUsage.user,
        system: cpuUsage.system,
      },
      uptime: process.uptime(),
    };

    // 檢查記憶體使用率
    const memoryUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;
    if (memoryUsagePercent > 85) {
      logger.warn('High memory usage', metrics);
      Sentry.captureMessage('High memory usage detected', {
        level: 'warning',
        extra: metrics,
      });
    }

    // 記錄到 Sentry
    Sentry.addBreadcrumb({
      category: 'system',
      message: 'System metrics',
      level: 'info',
      data: metrics,
    });
  }

  next();
}





