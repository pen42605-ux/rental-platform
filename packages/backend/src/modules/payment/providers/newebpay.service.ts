import { IPaymentService, CreatePaymentInput, PaymentResponse, PaymentCallbackData, PaymentStatus } from '../payment.types';
import crypto from 'crypto';

/**
 * 藍新（NewebPay）支付服務
 * 文檔：https://www.newebpay.com/
 */
export class NewebpayPaymentService implements IPaymentService {
  private merchantId: string;
  private hashKey: string;
  private hashIV: string;
  private isSandbox: boolean;
  private returnUrl: string;
  private notifyUrl: string;

  constructor() {
    this.merchantId = process.env.NEWEBPAY_MERCHANT_ID || '';
    this.hashKey = process.env.NEWEBPAY_HASH_KEY || '';
    this.hashIV = process.env.NEWEBPAY_HASH_IV || '';
    this.isSandbox = process.env.NEWEBPAY_SANDBOX === 'true' || !process.env.NEWEBPAY_MERCHANT_ID;
    this.returnUrl = process.env.NEWEBPAY_RETURN_URL || `${process.env.API_BASE_URL || 'http://localhost:4000'}/api/payment/callback/newebpay/return`;
    this.notifyUrl = process.env.NEWEBPAY_NOTIFY_URL || `${process.env.API_BASE_URL || 'http://localhost:4000'}/api/payment/callback/newebpay/notify`;
  }

  /**
   * AES 加密
   */
  private aesEncrypt(data: string): string {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.hashKey), Buffer.from(this.hashIV));
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted.toUpperCase();
  }

  /**
   * AES 解密
   */
  private aesDecrypt(encrypted: string): string {
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(this.hashKey), Buffer.from(this.hashIV));
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  /**
   * SHA256 雜湊
   */
  private sha256Hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex').toUpperCase();
  }

  /**
   * 創建付款
   */
  async createPayment(input: CreatePaymentInput): Promise<PaymentResponse> {
    const baseUrl = this.isSandbox
      ? 'https://ccore.newebpay.com/MPG/mpg_gateway'
      : 'https://core.newebpay.com/MPG/mpg_gateway';

    const merchantOrderNo = `NP${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    const amt = Math.floor(input.amount / 100); // 轉換為元

    const tradeInfo: any = {
      MerchantID: this.merchantId,
      RespondType: 'JSON',
      TimeStamp: Math.floor(Date.now() / 1000).toString(),
      Version: '2.0',
      MerchantOrderNo: merchantOrderNo,
      Amt: amt,
      ItemDesc: '租屋平台服務費',
      ReturnURL: this.returnUrl,
      NotifyURL: this.notifyUrl,
    };

    // 根據支付方式設定
    if (input.paymentMethod === 'CREDIT_CARD') {
      tradeInfo.CREDIT = 1;
    } else if (input.paymentMethod === 'ATM') {
      tradeInfo.VACC = 1;
      tradeInfo.ExpireDate = this.getExpireDate(3); // 3天後過期
    } else if (input.paymentMethod === 'CVS') {
      tradeInfo.CVS = 1;
      tradeInfo.ExpireDate = this.getExpireDate(1); // 1天後過期
    } else if (input.paymentMethod === 'WEBATM') {
      tradeInfo.WEBATM = 1;
    }

    // 加密 TradeInfo
    const tradeInfoStr = JSON.stringify(tradeInfo);
    const encryptedTradeInfo = this.aesEncrypt(tradeInfoStr);

    // 建立檢查碼
    const checkValue = this.sha256Hash(`HashKey=${this.hashKey}&${encryptedTradeInfo}&HashIV=${this.hashIV}`);

    // 建立付款表單參數
    const paymentParams = {
      MerchantID: this.merchantId,
      TradeInfo: encryptedTradeInfo,
      TradeSha: checkValue,
      Version: '2.0',
    };

    const paymentUrl = `${baseUrl}?${new URLSearchParams(
      Object.entries(paymentParams).map(([k, v]) => [k, String(v)])
    ).toString()}`;

    return {
      id: '',
      paymentNumber: merchantOrderNo,
      paymentUrl,
      transactionId: merchantOrderNo,
      status: 'PENDING',
    };
  }

  /**
   * 處理支付回調
   */
  async handleCallback(data: any): Promise<PaymentCallbackData> {
    // 驗證 TradeSha
    const tradeSha = data.TradeSha;
    const tradeInfo = data.TradeInfo;

    const calculatedSha = this.sha256Hash(`HashKey=${this.hashKey}&${tradeInfo}&HashIV=${this.hashIV}`);
    
    if (tradeSha !== calculatedSha) {
      throw new Error('檢查碼驗證失敗');
    }

    // 解密 TradeInfo
    const decryptedInfo = JSON.parse(this.aesDecrypt(tradeInfo));
    
    const status: PaymentStatus = decryptedInfo.Status === 'SUCCESS' ? 'SUCCESS' : 'FAILED';

    return {
      transactionId: decryptedInfo.MerchantOrderNo,
      orderId: decryptedInfo.CustomField1 || '',
      amount: parseInt(decryptedInfo.Amt) * 100,
      status,
      paidAt: status === 'SUCCESS' ? new Date() : undefined,
      metadata: decryptedInfo,
    };
  }

  /**
   * 查詢付款狀態
   */
  async queryPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    // 藍新查詢 API（需要實作）
    return 'PENDING';
  }

  /**
   * 退款
   */
  async refund(transactionId: string, amount: number, reason?: string): Promise<boolean> {
    // 藍新退款 API（需要實作）
    return false;
  }

  /**
   * 獲取過期日期（YYYYMMDD）
   */
  private getExpireDate(days: number): string {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10).replace(/-/g, '');
  }
}



