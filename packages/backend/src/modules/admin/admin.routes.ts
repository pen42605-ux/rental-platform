/**
 * Admin API 路由
 */
import { Router } from 'express';
import { authenticate, requireRole } from '../../middleware/auth.middleware';
import * as adminController from './admin.controller';

const router = Router();

// 所有 Admin 路由都需要登入 + ADMIN 角色
router.use(authenticate);
router.use(requireRole('ADMIN'));

/**
 * @swagger
 * /api/admin/stats:
 *   get:
 *     summary: 取得管理員儀表板統計
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/stats', adminController.getStats);

// ==================== 房源管理 ====================

/**
 * @swagger
 * /api/admin/listings:
 *   get:
 *     summary: 取得房源列表（管理員）
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING_REVIEW, PUBLISHED, DRAFT, REMOVED, REJECTED]
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/listings', adminController.getListings);

/**
 * @swagger
 * /api/admin/listings/{id}:
 *   get:
 *     summary: 取得房源詳情（管理員）
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/listings/:id', adminController.getListingDetail);

/**
 * @swagger
 * /api/admin/listings/{id}/publish:
 *   post:
 *     summary: 發布房源
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功
 */
router.post('/listings/:id/publish', adminController.publishListing);

/**
 * @swagger
 * /api/admin/listings/{id}/unpublish:
 *   post:
 *     summary: 下架房源
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功
 */
router.post('/listings/:id/unpublish', adminController.unpublishListing);

/**
 * @swagger
 * /api/admin/listings/{id}/reject:
 *   post:
 *     summary: 拒絕房源
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - reason
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功
 */
router.post('/listings/:id/reject', adminController.rejectListing);

// ==================== 使用者管理 ====================

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: 取得使用者列表（管理員）
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: isBlocked
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [USER, LANDLORD, ADMIN]
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/users', adminController.getUsers);

/**
 * @swagger
 * /api/admin/users/{id}/block:
 *   post:
 *     summary: 封鎖使用者
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功
 */
router.post('/users/:id/block', adminController.blockUser);

/**
 * @swagger
 * /api/admin/users/{id}/unblock:
 *   post:
 *     summary: 解除封鎖使用者
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *     responses:
 *       200:
 *         description: 成功
 */
router.post('/users/:id/unblock', adminController.unblockUser);

// ==================== 審核日誌 ====================

/**
 * @swagger
 * /api/admin/audit-logs:
 *   get:
 *     summary: 取得審核日誌
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: entityType
 *         schema:
 *           type: string
 *           enum: [LISTING, USER]
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/audit-logs', adminController.getAuditLogs);

export default router;

