/**
 * Admin 控制器 - HTTP 請求處理
 */
import { Response, NextFunction } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as adminService from './admin.service';

// ==================== 統計儀表板 ====================

export async function getStats(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const stats = await adminService.getAdminStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
}

// ==================== 房源管理 ====================

export async function getListings(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const query = {
      status: req.query.status as any,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
      sortBy: (req.query.sortBy as any) || 'createdAt',
      sortOrder: (req.query.sortOrder as any) || 'desc',
    };

    const result = await adminService.getAdminListings(query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getListingDetail(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const result = await adminService.getListingDetail(id);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function publishListing(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user!.id;
    const ipAddress = req.ip;
    const userAgent = req.get('User-Agent');

    const listing = await adminService.publishListing(
      { listingId: id, reason },
      adminId,
      ipAddress,
      userAgent
    );

    res.json({
      success: true,
      message: '房源已發布',
      data: listing,
    });
  } catch (error) {
    next(error);
  }
}

export async function unpublishListing(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user!.id;
    const ipAddress = req.ip;
    const userAgent = req.get('User-Agent');

    const listing = await adminService.unpublishListing(
      { listingId: id, reason },
      adminId,
      ipAddress,
      userAgent
    );

    res.json({
      success: true,
      message: '房源已下架',
      data: listing,
    });
  } catch (error) {
    next(error);
  }
}

export async function rejectListing(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user!.id;
    const ipAddress = req.ip;
    const userAgent = req.get('User-Agent');

    const listing = await adminService.rejectListing(
      { listingId: id, reason },
      adminId,
      ipAddress,
      userAgent
    );

    res.json({
      success: true,
      message: '房源已拒絕',
      data: listing,
    });
  } catch (error) {
    next(error);
  }
}

// ==================== 使用者管理 ====================

export async function getUsers(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const query = {
      search: req.query.search as string,
      isBlocked: req.query.isBlocked === 'true' ? true : req.query.isBlocked === 'false' ? false : undefined,
      role: req.query.role as any,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 20,
    };

    const result = await adminService.getAdminUsers(query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function blockUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user!.id;
    const ipAddress = req.ip;
    const userAgent = req.get('User-Agent');

    const user = await adminService.blockUser(
      { userId: id, reason },
      adminId,
      ipAddress,
      userAgent
    );

    res.json({
      success: true,
      message: '使用者已封鎖',
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function unblockUser(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const adminId = req.user!.id;
    const ipAddress = req.ip;
    const userAgent = req.get('User-Agent');

    const user = await adminService.unblockUser(
      { userId: id, reason },
      adminId,
      ipAddress,
      userAgent
    );

    res.json({
      success: true,
      message: '使用者已解除封鎖',
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

// ==================== 審核日誌 ====================

export async function getAuditLogs(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const query = {
      adminId: req.query.adminId as string,
      entityType: req.query.entityType as any,
      entityId: req.query.entityId as string,
      action: req.query.action as string,
      startDate: req.query.startDate ? new Date(req.query.startDate as string) : undefined,
      endDate: req.query.endDate ? new Date(req.query.endDate as string) : undefined,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 50,
    };

    const result = await adminService.getAuditLogs(query);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}





