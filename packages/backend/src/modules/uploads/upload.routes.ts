/**
 * 上傳路由
 */
import { Router } from 'express';
import { uploadController } from './upload.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/uploads/presign:
 *   post:
 *     summary: 取得 S3 Presigned URL
 *     description: |
 *       取得 presigned URL 後，前端可直接上傳檔案到 S3。
 *       
 *       ## 使用流程
 *       1. 呼叫此 API 取得 uploadUrl
 *       2. 使用 PUT 方法將檔案上傳到 uploadUrl
 *       3. 建立 listing 時傳入 key、url 等資訊
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [filename, mimeType, size]
 *             properties:
 *               filename:
 *                 type: string
 *                 example: photo.jpg
 *               mimeType:
 *                 type: string
 *                 example: image/jpeg
 *               size:
 *                 type: integer
 *                 example: 1024000
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     uploadUrl:
 *                       type: string
 *                       description: S3 presigned URL
 *                     key:
 *                       type: string
 *                       description: S3 object key
 *                     url:
 *                       type: string
 *                       description: 檔案公開 URL
 *                     bucket:
 *                       type: string
 *                     expiresIn:
 *                       type: integer
 *                       description: URL 有效秒數
 */
router.post('/presign', authenticate, (req, res, next) => uploadController.presign(req, res, next));

/**
 * @swagger
 * /api/uploads/presign-batch:
 *   post:
 *     summary: 批次取得 S3 Presigned URL
 *     tags: [Uploads]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [files]
 *             properties:
 *               files:
 *                 type: array
 *                 maxItems: 10
 *                 items:
 *                   type: object
 *                   properties:
 *                     filename:
 *                       type: string
 *                     mimeType:
 *                       type: string
 *                     size:
 *                       type: integer
 *     responses:
 *       200:
 *         description: 成功
 */
router.post('/presign-batch', authenticate, (req, res, next) => uploadController.presignBatch(req, res, next));

export default router;
