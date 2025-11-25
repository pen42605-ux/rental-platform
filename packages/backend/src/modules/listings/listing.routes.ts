/**
 * Listing 路由
 */
import { Router } from 'express';
import { listingController } from './listing.controller';
import { authenticate, optionalAuth } from '../../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/listings:
 *   get:
 *     summary: 取得房源列表
 *     tags: [Listings]
 *     parameters:
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
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [DRAFT, PUBLISHED, REMOVED]
 *       - in: query
 *         name: propertyType
 *         schema:
 *           type: string
 *           enum: [WHOLE_FLOOR, STUDIO, SUITE, ROOM, PARKING]
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: integer
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: integer
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, price, viewCount]
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/', (req, res, next) => listingController.getList(req, res, next));

/**
 * @swagger
 * /api/listings/my:
 *   get:
 *     summary: 取得我的房源
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/my', authenticate, (req, res, next) => listingController.getMyListings(req, res, next));

/**
 * @swagger
 * /api/listings/{id}:
 *   get:
 *     summary: 取得單一房源
 *     tags: [Listings]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功
 *       404:
 *         description: 房源不存在
 */
router.get('/:id', (req, res, next) => listingController.getById(req, res, next));

/**
 * @swagger
 * /api/listings:
 *   post:
 *     summary: 建立房源
 *     tags: [Listings]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - price
 *               - propertyType
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: integer
 *               currency:
 *                 type: string
 *                 default: TWD
 *               propertyType:
 *                 type: string
 *                 enum: [WHOLE_FLOOR, STUDIO, SUITE, ROOM, PARKING]
 *               beds:
 *                 type: integer
 *               baths:
 *                 type: integer
 *               area:
 *                 type: number
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               district:
 *                 type: string
 *               latitude:
 *                 type: number
 *               longitude:
 *                 type: number
 *               amenities:
 *                 type: array
 *                 items:
 *                   type: string
 *               status:
 *                 type: string
 *                 enum: [DRAFT, PUBLISHED]
 *               images:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     key:
 *                       type: string
 *                     url:
 *                       type: string
 *                     bucket:
 *                       type: string
 *                     filename:
 *                       type: string
 *                     mimeType:
 *                       type: string
 *                     size:
 *                       type: integer
 *     responses:
 *       201:
 *         description: 建立成功
 */
router.post('/', authenticate, (req, res, next) => listingController.create(req, res, next));

/**
 * @swagger
 * /api/listings/{id}:
 *   put:
 *     summary: 更新房源
 *     tags: [Listings]
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
 *     responses:
 *       200:
 *         description: 更新成功
 */
router.put('/:id', authenticate, (req, res, next) => listingController.update(req, res, next));

/**
 * @swagger
 * /api/listings/{id}:
 *   delete:
 *     summary: 刪除房源
 *     tags: [Listings]
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
 *         description: 刪除成功
 */
router.delete('/:id', authenticate, (req, res, next) => listingController.delete(req, res, next));

/**
 * @swagger
 * /api/listings/{id}/publish:
 *   post:
 *     summary: 發布房源
 *     tags: [Listings]
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
 *         description: 發布成功
 */
router.post('/:id/publish', authenticate, (req, res, next) => listingController.publish(req, res, next));

/**
 * @swagger
 * /api/listings/{id}/unpublish:
 *   post:
 *     summary: 下架房源
 *     tags: [Listings]
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
 *         description: 下架成功
 */
router.post('/:id/unpublish', authenticate, (req, res, next) => listingController.unpublish(req, res, next));

export default router;
