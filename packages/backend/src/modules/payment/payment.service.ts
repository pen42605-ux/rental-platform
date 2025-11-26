import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import {
  IPaymentService,
  CreatePaymentInput,
  PaymentResponse,
  PaymentCallbackData,
  PaymentStatus,
  PaymentMethod,
} from './payment.types';
import { logWebhook, updateWebhookStatus } from './webhook.service';

const prisma = new PrismaClient();

/**
 * 生成付款編號
 */
async function generatePaymentNumber(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const prefix = `PAY${dateStr}`;

  const count = await prisma.payment.count({
    where: {
      paymentNumber: {
        startsWith: prefix,
      },
    },
  });

  const sequence = String(count + 1).padStart(4, '0');
  return `${prefix}${sequence}`;
}

/**
 * 模擬支付服務（用於開發測試）
 */
class MockPaymentService implements IPaymentService {
  async createPayment(input: CreatePaymentInput): Promise<PaymentResponse> {
    const paymentNumber = await generatePaymentNumber();
    const transactionId = `MOCK_${uuidv4()}`;

    // 根據支付方式設定不同的付款資訊
    let paymentUrl: string | undefined;
    let bankCode: string | undefined;
    let accountNumber: string | undefined;
    let expireDate: Date | undefined;

    if (input.paymentMethod === 'ATM') {
      // 模擬 ATM 虛擬帳號
      bankCode = '013'; // 國泰世華
      accountNumber = `1234${Math.random().toString().slice(2, 10)}`;
      expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 3); // 3天後過期
      paymentUrl = `https://example.com/payment/atm/${accountNumber}`;
    } else if (input.paymentMethod === 'CVS') {
      // 模擬超商代碼
      accountNumber = `${Math.random().toString().slice(2, 14)}`;
      expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 1); // 1天後過期
      paymentUrl = `https://example.com/payment/cvs/${accountNumber}`;
    } else if (input.paymentMethod === 'CREDIT_CARD') {
      // 信用卡直接跳轉付款頁面
      paymentUrl = `https://example.com/payment/credit-card/${transactionId}`;
    }

    // 創建付款記錄
    const payment = await prisma.payment.create({
      data: {
        orderId: input.orderId,
        paymentNumber,
        amount: input.amount,
        currency: input.currency || 'TWD',
        paymentMethod: input.paymentMethod,
        paymentProvider: input.paymentProvider || 'MOCK',
        transactionId,
        paymentUrl,
        bankCode,
        accountNumber,
        expireDate,
        status: 'PENDING',
        metadata: input.metadata ? JSON.stringify(input.metadata) : null,
      },
    });

    return {
      id: payment.id,
      paymentNumber: payment.paymentNumber,
      paymentUrl: payment.paymentUrl || undefined,
      bankCode: payment.bankCode || undefined,
      accountNumber: payment.accountNumber || undefined,
      expireDate: payment.expireDate || undefined,
      transactionId: payment.transactionId || undefined,
      status: payment.status as PaymentStatus,
    };
  }

  async handleCallback(data: any): Promise<PaymentCallbackData> {
    // 模擬支付回調處理
    const transactionId = data.transactionId || data.MerchantTradeNo;
    const status = data.status || (data.RtnCode === '1' ? 'SUCCESS' : 'FAILED');

    return {
      transactionId,
      orderId: data.orderId || '',
      amount: data.amount || 0,
      status: status as PaymentStatus,
      paidAt: status === 'SUCCESS' ? new Date() : undefined,
      metadata: data,
    };
  }

  async queryPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    const payment = await prisma.payment.findFirst({
      where: { transactionId },
    });

    return (payment?.status as PaymentStatus) || 'PENDING';
  }

  async refund(transactionId: string, amount: number, reason?: string): Promise<boolean> {
    // 模擬退款
    const payment = await prisma.payment.updateMany({
      where: {
        transactionId,
        status: 'SUCCESS',
      },
      data: {
        status: 'REFUNDED',
        refundedAt: new Date(),
        refundAmount: amount,
      },
    });

    return payment.count > 0;
  }
}

// 導入支付服務提供者（在函數定義之後）

// 支付服務工廠
export function getPaymentService(provider: string = 'MOCK'): IPaymentService {
  // 動態導入支付服務提供者（避免循環依賴）
  switch (provider.toUpperCase()) {
    case 'MOCK':
      return new MockPaymentService();
    case 'ECPAY': {
      const { EcpayPaymentService } = require('./providers/ecpay.service');
      return new EcpayPaymentService();
    }
    case 'NEWEBPAY': {
      const { NewebpayPaymentService } = require('./providers/newebpay.service');
      return new NewebpayPaymentService();
    }
    case 'LINE_PAY': {
      const { LinePayPaymentService } = require('./providers/linepay.service');
      return new LinePayPaymentService();
    }
    default:
      return new MockPaymentService();
  }
}

/**
 * 根據支付方式獲取支付服務提供者
 */
export function getProviderByPaymentMethod(paymentMethod: string): string {
  const mapping: Record<string, string> = {
    CREDIT_CARD: process.env.PAYMENT_PROVIDER_CREDIT_CARD || 'ECPAY',
    ATM: process.env.PAYMENT_PROVIDER_ATM || 'ECPAY',
    CVS: process.env.PAYMENT_PROVIDER_CVS || 'ECPAY',
    WEBATM: process.env.PAYMENT_PROVIDER_WEBATM || 'NEWEBPAY',
    LINE_PAY: 'LINE_PAY',
    APPLE_PAY: process.env.PAYMENT_PROVIDER_APPLE_PAY || 'ECPAY', // Apple Pay 通常透過信用卡處理
    GOOGLE_PAY: process.env.PAYMENT_PROVIDER_GOOGLE_PAY || 'ECPAY', // Google Pay 通常透過信用卡處理
  };
  
  return mapping[paymentMethod] || 'MOCK';
}

/**
 * 創建付款
 */
export async function createPayment(input: CreatePaymentInput): Promise<PaymentResponse> {
  // 根據支付方式自動選擇提供者
  const provider = input.paymentProvider || getProviderByPaymentMethod(input.paymentMethod) || 'MOCK';
  const service = getPaymentService(provider);
  
  const paymentResponse = await service.createPayment(input);
  
  // 保存付款記錄到資料庫
  const payment = await prisma.payment.create({
    data: {
      orderId: input.orderId,
      paymentNumber: paymentResponse.paymentNumber,
      amount: input.amount,
      currency: input.currency || 'TWD',
      paymentMethod: input.paymentMethod,
      paymentProvider: provider,
      transactionId: paymentResponse.transactionId,
      paymentUrl: paymentResponse.paymentUrl,
      bankCode: paymentResponse.bankCode,
      accountNumber: paymentResponse.accountNumber,
      expireDate: paymentResponse.expireDate,
      status: paymentResponse.status,
      metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    },
  });

  return {
    ...paymentResponse,
    id: payment.id,
  };
}

/**
 * 處理支付回調
 */
export async function handlePaymentCallback(
  provider: string,
  data: any
): Promise<PaymentCallbackData> {
  // 記錄 Webhook
  const webhook = await logWebhook(
    provider as any,
    'payment.callback',
    data,
    { status: 'PENDING' }
  );

  try {
    const service = getPaymentService(provider);
    const callbackData = await service.handleCallback(data);

  // 更新付款記錄
  const payment = await prisma.payment.findFirst({
    where: { transactionId: callbackData.transactionId },
  });

  if (payment) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: callbackData.status,
        paidAt: callbackData.paidAt,
      },
    });

    // 如果付款成功，更新訂單狀態
    if (callbackData.status === 'SUCCESS') {
      await prisma.order.update({
        where: { id: payment.orderId },
        data: {
          paymentStatus: 'PAID',
          status: 'PAID',
          paidAt: callbackData.paidAt || new Date(),
        },
      });

      // 創建訂閱記錄（如果是套餐）
      const order = await prisma.order.findUnique({
        where: { id: payment.orderId },
        include: { items: true },
      });

      if (order) {
        for (const item of order.items) {
          if (item.productType === 'PACKAGE') {
            const validFrom = new Date();
            const validUntil = new Date();
            validUntil.setDate(validUntil.getDate() + (item.duration || 30));

            await prisma.subscription.create({
              data: {
                userId: order.userId,
                orderId: order.id,
                orderItemId: item.id,
                productType: item.productType,
                productId: item.productId,
                productName: item.productName,
                totalQuantity: item.quantity,
                remainingQuantity: item.quantity,
                validFrom,
                validUntil,
                status: 'ACTIVE',
                metadata: item.metadata,
              },
            });
          }
        }
      }
    }

    // 更新 Webhook 狀態為成功
    await updateWebhookStatus(webhook.id, 'SUCCESS', callbackData);

    return callbackData;
  } catch (error: any) {
    // 更新 Webhook 狀態為失敗
    await updateWebhookStatus(
      webhook.id,
      'FAILED',
      null,
      error.message || '處理回調失敗'
    );
    throw error;
  }
}

/**
 * 查詢付款狀態
 */
export async function queryPaymentStatus(transactionId: string): Promise<PaymentStatus> {
  const payment = await prisma.payment.findFirst({
    where: { transactionId },
  });

  if (!payment) {
    return 'PENDING';
  }

  // 如果付款記錄已更新，直接返回
  if (payment.status !== 'PENDING') {
    return payment.status as PaymentStatus;
  }

  // 否則向支付服務查詢
  const provider = payment.paymentProvider || 'MOCK';
  const service = getPaymentService(provider);
  const status = await service.queryPaymentStatus(transactionId);

  // 更新付款記錄
  if (status !== payment.status) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status },
    });
  }

  return status;
}

