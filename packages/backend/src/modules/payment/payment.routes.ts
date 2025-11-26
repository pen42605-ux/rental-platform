import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import {
  createOrderHandler,
  getOrderHandler,
  getUserOrdersHandler,
  createPaymentHandler,
  paymentCallbackHandler,
  queryPaymentStatusHandler,
} from './payment.controller';

const router = Router();

// 訂單相關路由（需要認證）
router.post('/orders', authenticate, createOrderHandler);
router.get('/orders', authenticate, getUserOrdersHandler);
router.get('/orders/:id', authenticate, getOrderHandler);

// 付款相關路由
router.post('/payments', authenticate, createPaymentHandler);
router.get('/payments/:transactionId/status', authenticate, queryPaymentStatusHandler);

// 支付回調（不需要認證，由支付服務商調用）
router.post('/callback/:provider', paymentCallbackHandler);

export default router;

