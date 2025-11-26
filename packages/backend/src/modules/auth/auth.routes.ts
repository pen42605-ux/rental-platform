/**
 * 身分驗證路由
 */
import { Router } from 'express';
import { authController } from './auth.controller';
import { authenticate } from '../../middleware/auth.middleware';

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: 使用者註冊
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 8
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: 註冊成功
 *       409:
 *         description: Email 已存在
 */
router.post('/register', (req, res, next) => authController.register(req, res, next));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: 使用者登入
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 登入成功
 *       401:
 *         description: 帳號或密碼錯誤
 */
router.post('/login', (req, res, next) => authController.login(req, res, next));

/**
 * @swagger
 * /api/auth/refresh:
 *   post:
 *     summary: 刷新 Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token 刷新成功
 */
router.post('/refresh', (req, res, next) => authController.refresh(req, res, next));

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: 登出
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: 登出成功
 */
router.post('/logout', (req, res, next) => authController.logout(req, res, next));

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     summary: 忘記密碼
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: 重設連結已發送
 */
router.post('/forgot-password', (req, res, next) => authController.forgotPassword(req, res, next));

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     summary: 重設密碼
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [token, password]
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: 密碼已重設
 */
router.post('/reset-password', (req, res, next) => authController.resetPassword(req, res, next));

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: 取得目前使用者資訊
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 成功
 */
router.get('/me', authenticate, (req, res, next) => authController.me(req, res, next));

/**
 * @swagger
 * /api/auth/facebook:
 *   post:
 *     summary: Facebook OAuth 登入/註冊
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [accessToken]
 *             properties:
 *               accessToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: 登入成功
 *       400:
 *         description: 驗證失敗
 */
router.post('/facebook', (req, res, next) => authController.facebookLogin(req, res, next));

// 手機驗證碼路由
import { verificationController } from './verification.controller';

/**
 * @swagger
 * /api/auth/verification/send:
 *   post:
 *     summary: 發送手機驗證碼
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone]
 *             properties:
 *               phone:
 *                 type: string
 *                 pattern: '^09\d{8}$'
 *     responses:
 *       200:
 *         description: 驗證碼已發送
 *       429:
 *         description: 發送過於頻繁
 */
router.post('/verification/send', (req, res, next) =>
  verificationController.sendCode(req, res, next)
);

/**
 * @swagger
 * /api/auth/verification/verify:
 *   post:
 *     summary: 驗證手機驗證碼
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [phone, code]
 *             properties:
 *               phone:
 *                 type: string
 *               code:
 *                 type: string
 *                 length: 6
 *     responses:
 *       200:
 *         description: 驗證成功
 *       400:
 *         description: 驗證碼錯誤
 */
router.post('/verification/verify', (req, res, next) =>
  verificationController.verifyCode(req, res, next)
);

export default router;
