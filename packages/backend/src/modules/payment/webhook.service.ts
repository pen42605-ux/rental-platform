import { PrismaClient } from '@prisma/client';
import { PaymentProvider, WebhookStatus } from './payment.types';

const prisma = new PrismaClient();

/**
 * 記錄 Webhook 請求
 */
export async function logWebhook(
  provider: PaymentProvider,
  eventType: string,
  requestBody: any,
  options?: {
    transactionId?: string;
    orderId?: string;
    status?: WebhookStatus;
    responseBody?: any;
    errorMessage?: string;
  }
) {
  const webhook = await prisma.webhookLog.create({
    data: {
      provider,
      eventType,
      transactionId: options?.transactionId,
      orderId: options?.orderId,
      status: options?.status || 'PENDING',
      requestBody: JSON.stringify(requestBody),
      responseBody: options?.responseBody ? JSON.stringify(options?.responseBody) : null,
      errorMessage: options?.errorMessage,
      processedAt: options?.status === 'SUCCESS' || options?.status === 'FAILED' ? new Date() : null,
    },
  });

  return webhook;
}

/**
 * 更新 Webhook 記錄狀態
 */
export async function updateWebhookStatus(
  webhookId: string,
  status: WebhookStatus,
  responseBody?: any,
  errorMessage?: string
) {
  const webhook = await prisma.webhookLog.update({
    where: { id: webhookId },
    data: {
      status,
      responseBody: responseBody ? JSON.stringify(responseBody) : undefined,
      errorMessage,
      processedAt: status === 'SUCCESS' || status === 'FAILED' ? new Date() : undefined,
    },
  });

  return webhook;
}

/**
 * 獲取 Webhook 記錄
 */
export async function getWebhookLogs(options?: {
  provider?: PaymentProvider;
  transactionId?: string;
  orderId?: string;
  status?: WebhookStatus;
  page?: number;
  limit?: number;
}) {
  const page = options?.page || 1;
  const limit = options?.limit || 50;
  const skip = (page - 1) * limit;

  const where: any = {};
  if (options?.provider) where.provider = options.provider;
  if (options?.transactionId) where.transactionId = options.transactionId;
  if (options?.orderId) where.orderId = options.orderId;
  if (options?.status) where.status = options.status;

  const [logs, total] = await Promise.all([
    prisma.webhookLog.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.webhookLog.count({ where }),
  ]);

  return {
    items: logs,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}



