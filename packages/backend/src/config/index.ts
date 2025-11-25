/**
 * 應用程式配置
 */
import dotenv from 'dotenv';

dotenv.config({ path: '../../.env' });

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.BACKEND_PORT || '4000', 10),
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  
  // JWT 快捷存取
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
  
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
  },
  
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'ap-northeast-1',
    s3Bucket: process.env.AWS_S3_BUCKET || '',
  },
  
  mapApiKey: process.env.MAP_API_KEY || '',
};

export default config;

