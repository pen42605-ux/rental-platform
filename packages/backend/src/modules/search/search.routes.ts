/**
 * 搜尋路由
 */
import { Router } from 'express';
import { searchController } from './search.controller';
import { authenticate, requireRole } from '../../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/search:
 *   get:
 *     summary: 搜尋房源
 *     description: |
 *       進階搜尋 API，支援關鍵字、價格範圍、房型、地理位置等多種篩選條件。
 *       
 *       ## 地理搜尋
 *       提供 `lat`、`lng` 和 `radius_km` 參數可以進行地理範圍搜尋。
 *       
 *       ## 排序選項
 *       - `relevance`: 相關性（預設）
 *       - `price_asc`: 價格由低到高
 *       - `price_desc`: 價格由高到低
 *       - `newest`: 最新發布
 *       - `nearest`: 距離最近（需要提供座標）
 *       
 *       ## 範例
 *       ```
 *       GET /api/search?q=捷運&city=台北市&min_price=8000&max_price=15000&type=STUDIO
 *       GET /api/search?lat=25.0330&lng=121.5654&radius_km=3&sort=nearest
 *       ```
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: 搜尋關鍵字
 *       - in: query
 *         name: min_price
 *         schema:
 *           type: integer
 *         description: 最低價格
 *       - in: query
 *         name: max_price
 *         schema:
 *           type: integer
 *         description: 最高價格
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [WHOLE_FLOOR, STUDIO, SUITE, ROOM, PARKING]
 *         description: 房源類型
 *       - in: query
 *         name: beds
 *         schema:
 *           type: integer
 *         description: 最少臥室數
 *       - in: query
 *         name: lat
 *         schema:
 *           type: number
 *         description: 緯度
 *       - in: query
 *         name: lng
 *         schema:
 *           type: number
 *         description: 經度
 *       - in: query
 *         name: radius_km
 *         schema:
 *           type: number
 *         description: 搜尋半徑（公里）
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           enum: [price_asc, price_desc, newest, nearest, relevance]
 *           default: relevance
 *         description: 排序方式
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
 *         name: amenities
 *         schema:
 *           type: string
 *         description: 設施（逗號分隔）
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: 縣市
 *       - in: query
 *         name: district
 *         schema:
 *           type: string
 *         description: 區域
 *     responses:
 *       200:
 *         description: 搜尋成功
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
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Listing'
 *                     pagination:
 *                       type: object
 *                     meta:
 *                       type: object
 *                       properties:
 *                         query:
 *                           type: string
 *                         processingTimeMs:
 *                           type: number
 *                         facets:
 *                           type: object
 */
router.get('/', (req, res, next) => searchController.search(req, res, next));

/**
 * @swagger
 * /api/search/suggest:
 *   get:
 *     summary: 搜尋建議（自動完成）
 *     tags: [Search]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema:
 *           type: string
 *         description: 搜尋關鍵字
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/suggest', (req, res, next) => searchController.suggest(req, res, next));

/**
 * @swagger
 * /api/search/reindex:
 *   post:
 *     summary: 重建搜尋索引
 *     description: 重新同步所有房源到搜尋引擎（僅限管理員）
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 索引重建完成
 */
router.post('/reindex', authenticate, requireRole('ADMIN'), (req, res, next) => searchController.reindex(req, res, next));

/**
 * @swagger
 * /api/search/stats:
 *   get:
 *     summary: 取得搜尋索引統計
 *     tags: [Search]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/stats', authenticate, requireRole('ADMIN'), (req, res, next) => searchController.stats(req, res, next));

export default router;


