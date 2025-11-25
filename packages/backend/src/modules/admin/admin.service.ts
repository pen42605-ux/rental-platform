/**
 * Admin 服務層 - 管理員操作邏輯
 */
import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';
import type {
  AdminListingsQuery,
  AdminUsersQuery,
  AuditLogQuery,
  ListingActionInput,
  UserBlockInput,
  AdminStats,
} from './admin.types';

// ==================== 統計儀表板 ====================

export async function getAdminStats(): Promise<AdminStats> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalListings,
    pendingReview,
    published,
    removed,
    totalUsers,
    blockedUsers,
    todayAuditActions,
  ] = await Promise.all([
    prisma.listing.count(),
    prisma.listing.count({ where: { status: 'PENDING_REVIEW' } }),
    prisma.listing.count({ where: { status: 'PUBLISHED' } }),
    prisma.listing.count({ where: { status: 'REMOVED' } }),
    prisma.user.count(),
    prisma.user.count({ where: { isBlocked: true } }),
    prisma.auditLog.count({ where: { createdAt: { gte: today } } }),
  ]);

  return {
    totalListings,
    pendingReview,
    published,
    removed,
    totalUsers,
    blockedUsers,
    todayAuditActions,
  };
}

// ==================== 房源管理 ====================

export async function getAdminListings(query: AdminListingsQuery) {
  const { status, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' } = query;

  const where = status ? { status: status as any } : {};

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            isBlocked: true,
          },
        },
        images: {
          where: { isCover: true },
          take: 1,
        },
        _count: {
          select: { favorites: true },
        },
      },
      orderBy: { [sortBy]: sortOrder },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.listing.count({ where }),
  ]);

  return {
    listings,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getListingDetail(listingId: string) {
  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          isBlocked: true,
          createdAt: true,
        },
      },
      images: {
        orderBy: { sortOrder: 'asc' },
      },
      _count: {
        select: { favorites: true },
      },
    },
  });

  if (!listing) {
    throw new AppError('房源不存在', 404, 'LISTING_NOT_FOUND');
  }

  // 取得該房源相關的審核記錄
  const auditLogs = await prisma.auditLog.findMany({
    where: {
      entityType: 'LISTING',
      entityId: listingId,
    },
    include: {
      admin: {
        select: { id: true, name: true, email: true },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  return { listing, auditLogs };
}

export async function publishListing(
  input: ListingActionInput,
  adminId: string,
  ipAddress?: string,
  userAgent?: string
) {
  const { listingId, reason } = input;

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true, status: true, userId: true, title: true },
  });

  if (!listing) {
    throw new AppError('房源不存在', 404, 'LISTING_NOT_FOUND');
  }

  const previousStatus = listing.status;

  // 更新房源狀態
  const updatedListing = await prisma.listing.update({
    where: { id: listingId },
    data: { status: 'PUBLISHED' },
  });

  // 記錄審核日誌
  await prisma.auditLog.create({
    data: {
      adminId,
      action: 'LISTING_PUBLISH',
      entityType: 'LISTING',
      entityId: listingId,
      targetUserId: listing.userId,
      previousValue: JSON.stringify({ status: previousStatus }),
      newValue: JSON.stringify({ status: 'PUBLISHED' }),
      reason,
      ipAddress,
      userAgent,
    },
  });

  return updatedListing;
}

export async function unpublishListing(
  input: ListingActionInput,
  adminId: string,
  ipAddress?: string,
  userAgent?: string
) {
  const { listingId, reason } = input;

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true, status: true, userId: true },
  });

  if (!listing) {
    throw new AppError('房源不存在', 404, 'LISTING_NOT_FOUND');
  }

  const previousStatus = listing.status;

  const updatedListing = await prisma.listing.update({
    where: { id: listingId },
    data: { status: 'REMOVED' },
  });

  await prisma.auditLog.create({
    data: {
      adminId,
      action: 'LISTING_UNPUBLISH',
      entityType: 'LISTING',
      entityId: listingId,
      targetUserId: listing.userId,
      previousValue: JSON.stringify({ status: previousStatus }),
      newValue: JSON.stringify({ status: 'REMOVED' }),
      reason,
      ipAddress,
      userAgent,
    },
  });

  return updatedListing;
}

export async function rejectListing(
  input: ListingActionInput,
  adminId: string,
  ipAddress?: string,
  userAgent?: string
) {
  const { listingId, reason } = input;

  if (!reason) {
    throw new AppError('拒絕房源必須提供原因', 400, 'REASON_REQUIRED');
  }

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    select: { id: true, status: true, userId: true },
  });

  if (!listing) {
    throw new AppError('房源不存在', 404, 'LISTING_NOT_FOUND');
  }

  const previousStatus = listing.status;

  const updatedListing = await prisma.listing.update({
    where: { id: listingId },
    data: { status: 'REJECTED' },
  });

  await prisma.auditLog.create({
    data: {
      adminId,
      action: 'LISTING_REJECT',
      entityType: 'LISTING',
      entityId: listingId,
      targetUserId: listing.userId,
      previousValue: JSON.stringify({ status: previousStatus }),
      newValue: JSON.stringify({ status: 'REJECTED' }),
      reason,
      ipAddress,
      userAgent,
    },
  });

  return updatedListing;
}

// ==================== 使用者管理 ====================

export async function getAdminUsers(query: AdminUsersQuery) {
  const { search, isBlocked, role, page = 1, limit = 20 } = query;

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ];
  }

  if (typeof isBlocked === 'boolean') {
    where.isBlocked = isBlocked;
  }

  if (role) {
    where.role = role;
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        isBlocked: true,
        blockedAt: true,
        blockedReason: true,
        createdAt: true,
        _count: {
          select: { listings: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function blockUser(
  input: UserBlockInput,
  adminId: string,
  ipAddress?: string,
  userAgent?: string
) {
  const { userId, reason } = input;

  if (userId === adminId) {
    throw new AppError('不能封鎖自己', 400, 'CANNOT_BLOCK_SELF');
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, isBlocked: true },
  });

  if (!user) {
    throw new AppError('使用者不存在', 404, 'USER_NOT_FOUND');
  }

  if (user.role === 'ADMIN') {
    throw new AppError('不能封鎖管理員', 403, 'CANNOT_BLOCK_ADMIN');
  }

  if (user.isBlocked) {
    throw new AppError('使用者已被封鎖', 400, 'USER_ALREADY_BLOCKED');
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      isBlocked: true,
      blockedAt: new Date(),
      blockedReason: reason,
    },
  });

  // 同時下架該使用者所有房源
  await prisma.listing.updateMany({
    where: { userId, status: 'PUBLISHED' },
    data: { status: 'REMOVED' },
  });

  await prisma.auditLog.create({
    data: {
      adminId,
      action: 'USER_BLOCK',
      entityType: 'USER',
      entityId: userId,
      targetUserId: userId,
      previousValue: JSON.stringify({ isBlocked: false }),
      newValue: JSON.stringify({ isBlocked: true }),
      reason,
      ipAddress,
      userAgent,
    },
  });

  return updatedUser;
}

export async function unblockUser(
  input: UserBlockInput,
  adminId: string,
  ipAddress?: string,
  userAgent?: string
) {
  const { userId, reason } = input;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, isBlocked: true },
  });

  if (!user) {
    throw new AppError('使用者不存在', 404, 'USER_NOT_FOUND');
  }

  if (!user.isBlocked) {
    throw new AppError('使用者未被封鎖', 400, 'USER_NOT_BLOCKED');
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      isBlocked: false,
      blockedAt: null,
      blockedReason: null,
    },
  });

  await prisma.auditLog.create({
    data: {
      adminId,
      action: 'USER_UNBLOCK',
      entityType: 'USER',
      entityId: userId,
      targetUserId: userId,
      previousValue: JSON.stringify({ isBlocked: true }),
      newValue: JSON.stringify({ isBlocked: false }),
      reason,
      ipAddress,
      userAgent,
    },
  });

  return updatedUser;
}

// ==================== 審核日誌 ====================

export async function getAuditLogs(query: AuditLogQuery) {
  const {
    adminId,
    entityType,
    entityId,
    action,
    startDate,
    endDate,
    page = 1,
    limit = 50,
  } = query;

  const where: any = {};

  if (adminId) where.adminId = adminId;
  if (entityType) where.entityType = entityType;
  if (entityId) where.entityId = entityId;
  if (action) where.action = action;

  if (startDate || endDate) {
    where.createdAt = {};
    if (startDate) where.createdAt.gte = startDate;
    if (endDate) where.createdAt.lte = endDate;
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        admin: {
          select: { id: true, name: true, email: true },
        },
        targetUser: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

