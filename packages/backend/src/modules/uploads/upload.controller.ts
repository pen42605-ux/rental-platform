/**
 * 上傳控制器
 */
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { uploadService } from './upload.service';
import { localUploadService } from './local-upload.service';
import { AuthRequest } from '../../middleware/auth.middleware';

// ==================== 驗證 Schema ====================

const presignSchema = z.object({
  filename: z.string().min(1, '請提供檔案名稱'),
  mimeType: z.string().min(1, '請提供 MIME Type'),
  size: z.number().int().positive('請提供有效的檔案大小'),
});

const batchPresignSchema = z.object({
  files: z.array(presignSchema).min(1).max(10),
});

// ==================== 控制器 ====================

export class UploadController {
  /**
   * POST /api/uploads/presign
   * 取得單一 presigned URL
   */
  async presign(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = presignSchema.parse(req.body);
      const result = await uploadService.generatePresignedUrl(input);

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
          },
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/uploads/presign-batch
   * 批次取得 presigned URL
   */
  async presignBatch(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { files } = batchPresignSchema.parse(req.body);
      const results = await uploadService.generateMultiplePresignedUrls(files);

      res.json({
        success: true,
        data: results,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
          },
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/uploads/local/:key
   * 本地上傳端點
   */
  async localUpload(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { key } = req.params;
      
      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'NO_FILE',
            message: '未提供檔案',
          },
        });
      }

      // 儲存檔案
      await localUploadService.saveFile(key, req.file.buffer);

      res.json({
        success: true,
        message: '上傳成功',
        data: { key },
      });
    } catch (error) {
      next(error);
    }
  }
}

export const uploadController = new UploadController();
