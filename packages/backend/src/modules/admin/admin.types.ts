/**
 * Admin 模組類型定義
 */

export interface AdminListingsQuery {
  status?: 'PENDING_REVIEW' | 'PUBLISHED' | 'DRAFT' | 'REMOVED' | 'REJECTED';
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'price';
  sortOrder?: 'asc' | 'desc';
}

export interface AdminUsersQuery {
  search?: string;
  isBlocked?: boolean;
  role?: 'USER' | 'LANDLORD' | 'ADMIN';
  page?: number;
  limit?: number;
}

export interface AuditLogQuery {
  adminId?: string;
  entityType?: 'LISTING' | 'USER';
  entityId?: string;
  action?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface ListingActionInput {
  listingId: string;
  reason?: string;
}

export interface UserBlockInput {
  userId: string;
  reason?: string;
}

export interface AdminStats {
  totalListings: number;
  pendingReview: number;
  published: number;
  removed: number;
  totalUsers: number;
  blockedUsers: number;
  todayAuditActions: number;
}

