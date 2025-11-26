/**
 * 搜尋引擎監控
 */
import { logger } from '../../lib/logger';
import * as Sentry from '@sentry/node';

interface SearchMetrics {
  query: string;
  responseTime: number;
  resultCount: number;
  error?: string;
}

/**
 * 記錄搜尋效能
 */
export function logSearchMetrics(metrics: SearchMetrics) {
  // 記錄慢查詢（> 100ms）
  if (metrics.responseTime > 100) {
    logger.warn('Slow search query', metrics);
    
    Sentry.addBreadcrumb({
      category: 'search',
      message: 'Slow search query',
      level: 'warning',
      data: metrics,
    });
  }

  // 記錄搜尋錯誤
  if (metrics.error) {
    logger.error('Search error', metrics);
    
    Sentry.captureException(new Error(metrics.error), {
      tags: {
        category: 'search',
      },
      extra: metrics,
    });
  }

  // 記錄正常搜尋（僅開發環境）
  if (process.env.NODE_ENV === 'development') {
    logger.debug('Search query', metrics);
  }
}

/**
 * 監控 Meilisearch 狀態
 */
export async function monitorMeilisearch(meilisearchClient: any) {
  try {
    const health = await meilisearchClient.health();
    const stats = await meilisearchClient.getStats();

    const metrics = {
      status: health.status,
      numberOfDocuments: stats.numberOfDocuments,
      isIndexing: stats.isIndexing,
      databaseSize: stats.databaseSize,
    };

    // 檢查索引狀態
    if (stats.isIndexing) {
      logger.warn('Meilisearch is indexing', metrics);
    }

    // 檢查資料庫大小
    const dbSizeMB = stats.databaseSize / (1024 * 1024);
    if (dbSizeMB > 1000) {
      logger.warn('Large Meilisearch database', metrics);
      Sentry.captureMessage('Large Meilisearch database', {
        level: 'warning',
        extra: metrics,
      });
    }

    return metrics;
  } catch (error: any) {
    logger.error('Meilisearch monitoring failed', { error: error.message });
    Sentry.captureException(error, {
      tags: { category: 'search-monitoring' },
    });
    return null;
  }
}





