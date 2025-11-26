/**
 * 租屋平台後端 - 主程式入口
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '../../.env' });

import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { swaggerSpec } from './swagger';
import { initSentry } from './lib/sentry';
import { logger } from './lib/logger';
import {
  sentryRequestHandler,
  sentryTracingHandler,
  sentryErrorHandler,
} from './middleware/sentry.middleware';
import {
  monitoringMiddleware,
  systemMetricsMiddleware,
} from './middleware/monitoring.middleware';

// 路由
import { authRoutes } from './modules/auth';
import { listingRoutes } from './modules/listings';
import { uploadRoutes } from './modules/uploads';
import { searchRoutes, syncWorker } from './modules/search';
import { adminRoutes } from './modules/admin';
import { paymentRoutes } from './modules/payment';

// 初始化 Sentry（必須在所有其他中間件之前）
initSentry();

const app = express();

// Sentry 中間件（必須在其他中間件之前）
app.use(sentryRequestHandler());
app.use(sentryTracingHandler());

// 中間件
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

// 監控中間件
app.use(monitoringMiddleware);
app.use(systemMetricsMiddleware);

// Swagger 文件
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 靜態檔案服務（用於本地上傳的圖片）
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// 健康檢查（包含監控資訊）
app.get('/health', async (req, res) => {
  // 使用寬鬆型別，方便在後面動態加入 `database` 等欄位
  const health: {
    status: string;
    timestamp: string;
    uptime: number;
    memory: {
      used: number;
      total: number;
      rss: number;
    };
    cpu: NodeJS.CpuUsage;
    env: string;
    database?: string;
    [key: string]: unknown;
  } = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      used: Math.round((process.memoryUsage().heapUsed / 1024 / 1024) * 100) / 100,
      total: Math.round((process.memoryUsage().heapTotal / 1024 / 1024) * 100) / 100,
      rss: Math.round((process.memoryUsage().rss / 1024 / 1024) * 100) / 100,
    },
    cpu: process.cpuUsage(),
    env: process.env.NODE_ENV || 'development',
  };

  // 檢查資料庫連線
  try {
    // 注意：這裡使用 require 而不是動態 import，以避免在 TS + Node16 moduleResolution 下要求副檔名
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const prisma = require('./lib/prisma').default;
    await prisma.$queryRaw`SELECT 1`;
    health.database = 'connected';
  } catch (error) {
    health.database = 'disconnected';
    health.status = 'degraded';
    logger.error('Database health check failed', { error });
  }

  const statusCode = health.status === 'healthy' ? 200 : 503;
  res.status(statusCode).json(health);
});

// 根路徑
app.get('/', (req, res) => {
  res.json({
    message: '🏠 租屋平台 API',
    version: '1.0.0',
    docs: '/api-docs',
  });
});

// API 路由
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);

// Sentry 錯誤處理（必須在錯誤處理之前）
app.use(sentryErrorHandler());

// 錯誤處理
app.use(errorHandler);

// 啟動伺服器
const PORT = config.port;

app.listen(PORT, async () => {
  logger.info(`🚀 伺服器運行於 http://localhost:${PORT}`);
  logger.info(`📚 API 文件: http://localhost:${PORT}/api-docs`);

  // 初始化搜尋同步 Worker
  try {
    await syncWorker.initialize();
    logger.info('✅ 搜尋引擎已連接');
  } catch (error) {
    logger.warn('⚠️ 搜尋引擎未連接，搜尋功能將無法使用', { error });
  }
});

export default app;
