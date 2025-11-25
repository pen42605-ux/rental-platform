/**
 * 搜尋控制器
 */
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { meilisearchService } from './meilisearch.service';
import { syncWorker } from './sync.worker';
import { AuthRequest } from '../../middleware/auth.middleware';

// ==================== 驗證 Schema ====================

const searchParamsSchema = z.object({
  q: z.string().optional(),
  min_price: z.coerce.number().int().min(0).optional(),
  max_price: z.coerce.number().int().min(0).optional(),
  type: z.enum(['WHOLE_FLOOR', 'STUDIO', 'SUITE', 'ROOM', 'PARKING']).optional(),
  beds: z.coerce.number().int().min(0).optional(),
  lat: z.coerce.number().min(-90).max(90).optional(),
  lng: z.coerce.number().min(-180).max(180).optional(),
  radius_km: z.coerce.number().positive().max(100).optional(),
  sort: z.enum(['price_asc', 'price_desc', 'newest', 'nearest', 'relevance']).default('relevance'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  amenities: z.string().transform(s => s.split(',')).optional(),
  city: z.string().optional(),
  district: z.string().optional(),
});

// ==================== 控制器 ====================

export class SearchController {
  /**
   * GET /api/search
   * 搜尋房源
   */
  async search(req: Request, res: Response, next: NextFunction) {
    try {
      const params = searchParamsSchema.parse(req.query);

      // 驗證地理搜尋參數
      if ((params.lat !== undefined || params.lng !== undefined) && 
          (params.lat === undefined || params.lng === undefined)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_GEO_PARAMS',
            message: 'lat 和 lng 必須同時提供',
          },
        });
      }

      // 如果有距離排序但沒有座標
      if (params.sort === 'nearest' && (params.lat === undefined || params.lng === undefined)) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_SORT_PARAMS',
            message: '使用距離排序時必須提供 lat 和 lng',
          },
        });
      }

      const result = await meilisearchService.search(params);

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
   * GET /api/search/suggest
   * 搜尋建議（自動完成）
   */
  async suggest(req: Request, res: Response, next: NextFunction) {
    try {
      const { q } = z.object({
        q: z.string().min(1).max(100),
      }).parse(req.query);

      const result = await meilisearchService.search({
        q,
        limit: 5,
      });

      const suggestions = result.items.map(item => ({
        id: item.id,
        title: item.title,
        city: item.city,
        district: item.district,
        price: item.price,
      }));

      res.json({
        success: true,
        data: suggestions,
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
   * POST /api/search/reindex
   * 重建索引（僅限管理員）
   */
  async reindex(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await syncWorker.fullSync();

      res.json({
        success: true,
        message: '索引重建完成',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/search/stats
   * 取得索引統計（僅限管理員）
   */
  async stats(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const stats = await meilisearchService.getStats();

      res.json({
        success: true,
        data: stats,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const searchController = new SearchController();


