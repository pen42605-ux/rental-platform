import { Request, Response } from 'express';
import { z } from 'zod';
import { createOrder, getOrderById, getUserOrders } from './order.service';
import { createPayment, handlePaymentCallback, queryPaymentStatus } from './payment.service';
import { getProductById } from './products.config';
import { logWebhook } from './webhook.service';

// 創建訂單的驗證 Schema
const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      quantity: z.number().int().positive(),
      metadata: z.record(z.any()).optional(),
    })
  ),
  notes: z.string().optional(),
});

// 創建付款的驗證 Schema
const createPaymentSchema = z.object({
  orderId: z.string().uuid(),
  paymentMethod: z.enum(['CREDIT_CARD', 'ATM', 'CVS', 'WEBATM', 'LINE_PAY', 'APPLE_PAY', 'GOOGLE_PAY']),
  paymentProvider: z.enum(['MOCK', 'ECPAY', 'NEWEBPAY', 'LINE_PAY']).optional(),
});

/**
 * 創建訂單
 * POST /api/payment/orders
 */
export async function createOrderHandler(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: '未授權' });
    }

    const validated = createOrderSchema.parse(req.body);

    // 驗證並獲取產品資訊
    const orderItems = [];
    for (const item of validated.items) {
      const product = getProductById(item.productId);
      if (!product) {
        return res.status(400).json({ error: `產品不存在: ${item.productId}` });
      }

      orderItems.push({
        productId: product.id,
        productName: product.name,
        productType: 'id' in product && product.id.includes('PACKAGE') ? 'PACKAGE' : 'LISTING_AD',
        productCategory: 'category' in product ? product.category : undefined,
        quantity: item.quantity,
        unitPrice: product.price,
        duration: 'duration' in product ? product.duration : undefined,
        metadata: item.metadata,
      });
    }

    const order = await createOrder({
      userId,
      items: orderItems,
      notes: validated.notes,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: '驗證失敗',
        details: error.errors,
      });
    }

    console.error('創建訂單錯誤:', error);
    res.status(500).json({
      success: false,
      error: '創建訂單失敗',
    });
  }
}

/**
 * 獲取訂單詳情
 * GET /api/payment/orders/:id
 */
export async function getOrderHandler(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    const orderId = req.params.id;

    const order = await getOrderById(orderId, userId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: '訂單不存在',
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('獲取訂單錯誤:', error);
    res.status(500).json({
      success: false,
      error: '獲取訂單失敗',
    });
  }
}

/**
 * 獲取用戶訂單列表
 * GET /api/payment/orders
 */
export async function getUserOrdersHandler(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: '未授權' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string | undefined;

    const result = await getUserOrders(userId, { page, limit, status });

    res.json({
      success: true,
      data: result.items,
      pagination: result.pagination,
    });
  } catch (error) {
    console.error('獲取訂單列表錯誤:', error);
    res.status(500).json({
      success: false,
      error: '獲取訂單列表失敗',
    });
  }
}

/**
 * 創建付款
 * POST /api/payment/payments
 */
export async function createPaymentHandler(req: Request, res: Response) {
  try {
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ error: '未授權' });
    }

    const validated = createPaymentSchema.parse(req.body);

    // 驗證訂單屬於當前用戶
    const order = await getOrderById(validated.orderId, userId);
    if (!order) {
      return res.status(404).json({
        success: false,
        error: '訂單不存在',
      });
    }

    if (order.status !== 'PENDING') {
      return res.status(400).json({
        success: false,
        error: '訂單狀態不正確，無法付款',
      });
    }

    // 創建付款
    const payment = await createPayment({
      orderId: validated.orderId,
      amount: order.totalAmount,
      currency: order.currency,
      paymentMethod: validated.paymentMethod,
      paymentProvider: validated.paymentProvider,
    });

    res.status(201).json({
      success: true,
      data: payment,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        error: '驗證失敗',
        details: error.errors,
      });
    }

    console.error('創建付款錯誤:', error);
    res.status(500).json({
      success: false,
      error: '創建付款失敗',
    });
  }
}

/**
 * 支付回調
 * POST /api/payment/callback/:provider
 */
export async function paymentCallbackHandler(req: Request, res: Response) {
  try {
    const provider = req.params.provider || 'MOCK';
    
    // 記錄 Webhook（在 payment.service.ts 中已經記錄，這裡是備份）
    await logWebhook(
      provider as any,
      'payment.callback',
      { body: req.body, query: req.query, headers: req.headers },
      { status: 'PENDING' }
    );

    const callbackData = await handlePaymentCallback(provider, {
      ...req.body,
      ...req.query,
    });

    // 返回成功響應（支付服務商要求）
    res.json({
      success: true,
      message: '回調處理成功',
    });
  } catch (error: any) {
    console.error('支付回調錯誤:', error);
    
    // 記錄失敗的 Webhook
    await logWebhook(
      req.params.provider as any,
      'payment.callback',
      { body: req.body, query: req.query },
      {
        status: 'FAILED',
        errorMessage: error.message || '處理回調失敗',
      }
    );

    res.status(500).json({
      success: false,
      error: '處理回調失敗',
    });
  }
}

/**
 * 查詢付款狀態
 * GET /api/payment/payments/:transactionId/status
 */
export async function queryPaymentStatusHandler(req: Request, res: Response) {
  try {
    const transactionId = req.params.transactionId;
    const status = await queryPaymentStatus(transactionId);

    res.json({
      success: true,
      data: { status },
    });
  } catch (error) {
    console.error('查詢付款狀態錯誤:', error);
    res.status(500).json({
      success: false,
      error: '查詢付款狀態失敗',
    });
  }
}
