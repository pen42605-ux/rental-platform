/**
 * 支付相關類型定義
 */

export type PaymentMethod = 
  | 'CREDIT_CARD' 
  | 'ATM' 
  | 'CVS' 
  | 'WEBATM'
  | 'LINE_PAY'
  | 'APPLE_PAY'
  | 'GOOGLE_PAY';

export type PaymentProvider = 'MOCK' | 'ECPAY' | 'NEWEBPAY' | 'LINE_PAY' | 'STRIPE';
export type PaymentStatus = 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
export type WebhookStatus = 'SUCCESS' | 'FAILED' | 'PENDING';

export interface CreatePaymentInput {
  orderId: string;
  amount: number; // 金額（分）
  currency?: string;
  paymentMethod: PaymentMethod;
  paymentProvider?: PaymentProvider;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  id: string;
  paymentNumber: string;
  paymentUrl?: string; // 付款連結（ATM、CVS）
  bankCode?: string; // ATM 銀行代碼
  accountNumber?: string; // ATM 虛擬帳號
  expireDate?: Date; // 付款截止日
  transactionId?: string; // 第三方交易ID
  status: PaymentStatus;
}

export interface PaymentCallbackData {
  transactionId: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  paidAt?: Date;
  metadata?: Record<string, any>;
}

export interface WebhookLog {
  id: string;
  provider: PaymentProvider;
  eventType: string;
  transactionId?: string;
  orderId?: string;
  status: WebhookStatus;
  requestBody: string;
  responseBody?: string;
  errorMessage?: string;
  processedAt?: Date;
  createdAt: Date;
}

/**
 * 支付服務介面
 */
export interface IPaymentService {
  /**
   * 創建付款
   */
  createPayment(input: CreatePaymentInput): Promise<PaymentResponse>;

  /**
   * 處理支付回調
   */
  handleCallback(data: any): Promise<PaymentCallbackData>;

  /**
   * 查詢付款狀態
   */
  queryPaymentStatus(transactionId: string): Promise<PaymentStatus>;

  /**
   * 退款
   */
  refund(transactionId: string, amount: number, reason?: string): Promise<boolean>;
}

