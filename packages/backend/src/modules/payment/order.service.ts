import { PrismaClient } from '@prisma/client';
import { getProductById } from './products.config';

const prisma = new PrismaClient();

export interface CreateOrderInput {
  userId: string;
  items: Array<{
    productId: string;
    productName: string;
    productType: 'LISTING_AD' | 'PACKAGE' | 'ADDON';
    productCategory?: 'RESIDENTIAL' | 'COMMERCIAL' | 'SALE';
    quantity: number;
    unitPrice: number;
    duration?: number;
    metadata?: Record<string, any>;
  }>;
  notes?: string;
}

export interface OrderResponse {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  currency: string;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }>;
  createdAt: Date;
  expiresAt: Date | null;
}

/**
 * 生成訂單編號
 * 格式：ORD + YYYYMMDD + 3位序號
 */
async function generateOrderNumber(): Promise<string> {
  const today = new Date();
  const dateStr = today.toISOString().slice(0, 10).replace(/-/g, '');
  const prefix = `ORD${dateStr}`;

  // 查詢今天已有的訂單數量
  const todayStart = new Date(today.setHours(0, 0, 0, 0));
  const todayEnd = new Date(today.setHours(23, 59, 59, 999));

  const count = await prisma.order.count({
    where: {
      orderNumber: {
        startsWith: prefix,
      },
      createdAt: {
        gte: todayStart,
        lte: todayEnd,
      },
    },
  });

  const sequence = String(count + 1).padStart(3, '0');
  return `${prefix}${sequence}`;
}

/**
 * 創建訂單
 */
export async function createOrder(input: CreateOrderInput): Promise<OrderResponse> {
  // 計算總金額
  const totalAmount = input.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0
  );

  // 生成訂單編號
  const orderNumber = await generateOrderNumber();

  // 設定訂單過期時間（24小時後）
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24);

  // 創建訂單和訂單項目
  const order = await prisma.order.create({
    data: {
      userId: input.userId,
      orderNumber,
      totalAmount,
      expiresAt,
      notes: input.notes,
      items: {
        create: input.items.map((item) => ({
          productType: item.productType,
          productId: item.productId,
          productName: item.productName,
          productCategory: item.productCategory || null,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.quantity,
          duration: item.duration || null,
          metadata: item.metadata ? JSON.stringify(item.metadata) : null,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  return {
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    totalAmount: order.totalAmount,
    currency: order.currency,
    items: order.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    })),
    createdAt: order.createdAt,
    expiresAt: order.expiresAt,
  };
}

/**
 * 根據ID獲取訂單
 */
export async function getOrderById(orderId: string, userId?: string) {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      ...(userId ? { userId } : {}),
    },
    include: {
      items: true,
      payments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      subscriptions: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return order;
}

/**
 * 根據訂單編號獲取訂單
 */
export async function getOrderByNumber(orderNumber: string, userId?: string) {
  const order = await prisma.order.findFirst({
    where: {
      orderNumber,
      ...(userId ? { userId } : {}),
    },
    include: {
      items: true,
      payments: {
        orderBy: {
          createdAt: 'desc',
        },
      },
      subscriptions: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
  });

  return order;
}

/**
 * 獲取用戶的所有訂單
 */
export async function getUserOrders(
  userId: string,
  options?: {
    page?: number;
    limit?: number;
    status?: string;
  }
) {
  const page = options?.page || 1;
  const limit = options?.limit || 20;
  const skip = (page - 1) * limit;

  const where: any = { userId };
  if (options?.status) {
    where.status = options.status;
  }

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        items: true,
        payments: {
          take: 1,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    items: orders,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

/**
 * 更新訂單狀態
 */
export async function updateOrderStatus(
  orderId: string,
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED' | 'EXPIRED',
  userId?: string
) {
  const order = await prisma.order.updateMany({
    where: {
      id: orderId,
      ...(userId ? { userId } : {}),
    },
    data: {
      status,
      ...(status === 'PAID' ? { paidAt: new Date() } : {}),
    },
  });

  return order.count > 0;
}

/**
 * 更新訂單付款狀態
 */
export async function updateOrderPaymentStatus(
  orderId: string,
  paymentStatus: 'UNPAID' | 'PAID' | 'FAILED' | 'REFUNDED'
) {
  const order = await prisma.order.update({
    where: { id: orderId },
    data: {
      paymentStatus,
      ...(paymentStatus === 'PAID' ? { paidAt: new Date(), status: 'PAID' } : {}),
    },
  });

  return order;
}

/**
 * 檢查訂單是否過期並更新狀態
 */
export async function checkAndUpdateExpiredOrders() {
  const now = new Date();
  const result = await prisma.order.updateMany({
    where: {
      status: 'PENDING',
      expiresAt: {
        lt: now,
      },
    },
    data: {
      status: 'EXPIRED',
    },
  });

  return result.count;
}



