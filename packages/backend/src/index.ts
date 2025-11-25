/**
 * 租屋平台後端 - 主程式入口
 */
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

import { config } from './config';
import { errorHandler } from './middleware/errorHandler';
import { swaggerSpec } from './swagger';

// 路由
import { authRoutes } from './modules/auth';
import { listingRoutes } from './modules/listings';
import { uploadRoutes } from './modules/uploads';
import { searchRoutes, syncWorker } from './modules/search';
import { adminRoutes } from './modules/admin';

const app = express();

// 中間件
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));

// Swagger 文件
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 健康檢查
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
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

// 錯誤處理
app.use(errorHandler);

// 啟動伺服器
const PORT = config.port;

app.listen(PORT, async () => {
  console.log(`🚀 伺服器運行於 http://localhost:${PORT}`);
  console.log(`📚 API 文件: http://localhost:${PORT}/api-docs`);

  // 初始化搜尋同步 Worker
  try {
    await syncWorker.initialize();
  } catch (error) {
    console.warn('⚠️ 搜尋引擎未連接，搜尋功能將無法使用');
  }
});

export default app;
