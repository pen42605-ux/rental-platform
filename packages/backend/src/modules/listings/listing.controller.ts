/**
 * Listing 控制器
 */
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { listingService } from './listing.service';
import { AuthRequest } from '../../middleware/auth.middleware';

// ==================== 驗證 Schema ====================

const imageSchema = z.object({
  key: z.string(),
  url: z.string().url(),
  bucket: z.string(),
  filename: z.string(),
  mimeType: z.string(),
  size: z.number().int().positive(),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  isCover: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
});

const createListingSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().max(10000).optional(),
  price: z.number().int().positive(),
  currency: z.string().length(3).default('TWD'),
  propertyType: z.enum(['WHOLE_FLOOR', 'STUDIO', 'SUITE', 'ROOM', 'PARKING']),
  beds: z.number().int().min(0).default(1),
  baths: z.number().int().min(0).default(1),
  area: z.number().positive().optional(),
  address: z.string().max(500).optional(),
  city: z.string().min(1, '請選擇縣市').max(50),
  district: z.string().min(1, '請輸入區域').max(50),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  amenities: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED']).default('DRAFT'),
  images: z.array(imageSchema).optional(),
});

const updateListingSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(10000).optional(),
  price: z.number().int().positive().optional(),
  currency: z.string().length(3).optional(),
  propertyType: z.enum(['WHOLE_FLOOR', 'STUDIO', 'SUITE', 'ROOM', 'PARKING']).optional(),
  beds: z.number().int().min(0).optional(),
  baths: z.number().int().min(0).optional(),
  area: z.number().positive().optional(),
  address: z.string().max(500).optional(),
  city: z.string().max(50).optional(),
  district: z.string().max(50).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  amenities: z.array(z.string()).optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'REMOVED']).optional(),
  addImages: z.array(imageSchema).optional(),
  removeImageIds: z.array(z.string().uuid()).optional(),
});

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['DRAFT', 'PUBLISHED', 'REMOVED']).optional(),
  propertyType: z.enum(['WHOLE_FLOOR', 'STUDIO', 'SUITE', 'ROOM', 'PARKING']).optional(),
  city: z.string().optional(),
  minPrice: z.coerce.number().int().min(0).optional(),
  maxPrice: z.coerce.number().int().min(0).optional(),
  sortBy: z.enum(['createdAt', 'price', 'viewCount']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// ==================== 控制器 ====================

export class ListingController {
  /**
   * POST /api/listings
   * 建立房源
   */
  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const input = createListingSchema.parse(req.body);
      const listing = await listingService.create(req.user!.id, input);

      res.status(201).json({
        success: true,
        data: listing,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
            details: error.errors,
          },
        });
      }
      next(error);
    }
  }

  /**
   * GET /api/listings
   * 取得房源列表
   */
  async getList(req: Request, res: Response, next: NextFunction) {
    try {
      const params = querySchema.parse(req.query);
      const result = await listingService.getList(params);

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
   * GET /api/listings/:id
   * 取得單一房源
   */
  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const listing = await listingService.getById(id, true);

      res.json({
        success: true,
        data: listing,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/listings/:id
   * 更新房源
   */
  async update(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const input = updateListingSchema.parse(req.body);
      const isAdmin = req.user!.role === 'ADMIN';

      const listing = await listingService.update(id, req.user!.id, input, isAdmin);

      res.json({
        success: true,
        data: listing,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
            details: error.errors,
          },
        });
      }
      next(error);
    }
  }

  /**
   * DELETE /api/listings/:id
   * 刪除房源
   */
  async delete(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const isAdmin = req.user!.role === 'ADMIN';

      await listingService.delete(id, req.user!.id, isAdmin);

      res.json({
        success: true,
        message: '房源已刪除',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/listings/:id/publish
   * 發布房源
   */
  async publish(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const isAdmin = req.user!.role === 'ADMIN';

      const listing = await listingService.updateStatus(id, req.user!.id, 'PUBLISHED', isAdmin);

      res.json({
        success: true,
        data: listing,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/listings/:id/unpublish
   * 下架房源
   */
  async unpublish(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const isAdmin = req.user!.role === 'ADMIN';

      const listing = await listingService.updateStatus(id, req.user!.id, 'REMOVED', isAdmin);

      res.json({
        success: true,
        data: listing,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/listings/my
   * 取得我的房源
   */
  async getMyListings(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const params = querySchema.parse(req.query);
      const result = await listingService.getByUser(req.user!.id, params);

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
}

export const listingController = new ListingController();
