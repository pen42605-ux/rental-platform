/**
 * Swagger / OpenAPI 配置
 */
import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: '租屋平台 API',
      version: '1.0.0',
      description: '類似 591 的租屋平台 RESTful API',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: '開發環境',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Listing: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'integer' },
            currency: { type: 'string' },
            propertyType: {
              type: 'string',
              enum: ['WHOLE_FLOOR', 'STUDIO', 'SUITE', 'ROOM', 'PARKING'],
            },
            beds: { type: 'integer' },
            baths: { type: 'integer' },
            area: { type: 'number' },
            address: { type: 'string' },
            city: { type: 'string' },
            district: { type: 'string' },
            latitude: { type: 'number' },
            longitude: { type: 'number' },
            amenities: { type: 'array', items: { type: 'string' } },
            status: { type: 'string', enum: ['DRAFT', 'PUBLISHED', 'REMOVED'] },
            viewCount: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            role: { type: 'string', enum: ['USER', 'LANDLORD', 'ADMIN'] },
            avatarUrl: { type: 'string' },
            isVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                message: { type: 'string' },
              },
            },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: '身分驗證' },
      { name: 'Listings', description: '房源管理' },
      { name: 'Uploads', description: '檔案上傳' },
      { name: 'Search', description: '進階搜尋' },
    ],
  },
  apis: ['./src/modules/**/*.routes.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

