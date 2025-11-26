import { IPaymentService, CreatePaymentInput, PaymentResponse, PaymentCallbackData, PaymentStatus } from '../payment.types';
import crypto from 'crypto';

/**
 * LINE Pay 支付服務
 * 文檔：https://pay.line.me/documents/online_v3_zh_TW.html
 */
export class LinePayPaymentService implements IPaymentService {
  private channelId: string;
  private channelSecret: string;
  private isSandbox: boolean;
  private returnUrl: string;
  private cancelUrl: string;

  constructor() {
    this.channelId = process.env.LINEPAY_CHANNEL_ID || '';
    this.channelSecret = process.env.LINEPAY_CHANNEL_SECRET || '';
    this.isSandbox = process.env.LINEPAY_SANDBOX === 'true' || !process.env.LINEPAY_CHANNEL_ID;
    this.returnUrl = process.env.LINEPAY_RETURN_URL || `${process.env.API_BASE_URL || 'http://localhost:4000'}/api/payment/callback/linepay/return`;
    this.cancelUrl = process.env.LINEPAY_CANCEL_URL || `${process.env.API_BASE_URL || 'http://localhost:4000'}/api/payment/callback/linepay/cancel`;
  }

  /**
   * 建立簽名
   */
  private createSignature(nonce: string, secret: string, requestBody: string): string {
    const message = this.channelSecret + nonce + requestBody;
    return crypto.createHmac('sha256', secret).update(message).digest('base64');
  }

  /**
   * 創建付款
   */
  async createPayment(input: CreatePaymentInput): Promise<PaymentResponse> {
    const baseUrl = this.isSandbox
      ? 'https://sandbox-api-pay.line.me'
      : 'https://api-pay.line.me';

    const orderId = `LP${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const amount = Math.floor(input.amount / 100); // 轉換為元

    const requestBody = {
      amount: amount,
      currency: input.currency || 'TWD',
      orderId: orderId,
      packages: [
        {
          id: 'package-1',
          amount: amount,
          name: '租屋平台服務',
          products: [
            {
              name: '租屋平台服務費',
              quantity: 1,
              price: amount,
            },
          ],
        },
      ],
      redirectUrls: {
        confirmUrl: this.returnUrl,
        cancelUrl: this.cancelUrl,
      },
    };

    const nonce = crypto.randomBytes(16).toString('hex');
    const requestBodyStr = JSON.stringify(requestBody);
    const signature = this.createSignature(nonce, this.channelSecret, requestBodyStr);

    // 調用 LINE Pay API
    try {
      const response = await fetch(`${baseUrl}/v3/payments/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-LINE-ChannelId': this.channelId,
          'X-LINE-Authorization-Nonce': nonce,
          'X-LINE-Authorization': signature,
        },
        body: requestBodyStr,
      });

      const data = await response.json();

      if (data.returnCode === '0000') {
        return {
          id: '',
          paymentNumber: orderId,
          paymentUrl: data.info.paymentUrl.web,
          transactionId: data.info.transactionId.toString(),
          status: 'PENDING',
        };
      } else {
        throw new Error(`LINE Pay 錯誤: ${data.returnMessage}`);
      }
    } catch (error: any) {
      throw new Error(`LINE Pay 請求失敗: ${error.message}`);
    }
  }

  /**
   * 處理支付回調
   */
  async handleCallback(data: any): Promise<PaymentCallbackData> {
    const transactionId = data.transactionId;
    const returnCode = data.returnCode;
    const status: PaymentStatus = returnCode === '0000' ? 'SUCCESS' : 'FAILED';

    return {
      transactionId: transactionId?.toString() || '',
      orderId: data.orderId || '',
      amount: parseInt(data.payInfo?.payAmount || 0) * 100,
      status,
      paidAt: status === 'SUCCESS' ? new Date() : undefined,
      metadata: data,
    };
  }

  /**
   * 查詢付款狀態
   */
  async queryPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    // LINE Pay 查詢 API（需要實作）
    return 'PENDING';
  }

  /**
   * 退款
   */
  async refund(transactionId: string, amount: number, reason?: string): Promise<boolean> {
    // LINE Pay 退款 API（需要實作）
    return false;
  }
}



