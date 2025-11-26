import { IPaymentService, CreatePaymentInput, PaymentResponse, PaymentCallbackData, PaymentStatus } from '../payment.types';
import crypto from 'crypto';

/**
 * 綠界（ECPay）支付服務
 * 文檔：https://www.ecpay.com.tw/Service/API_Dwnld
 */
export class EcpayPaymentService implements IPaymentService {
  private merchantId: string;
  private hashKey: string;
  private hashIV: string;
  private isSandbox: boolean;
  private returnUrl: string;
  private notifyUrl: string;

  constructor() {
    this.merchantId = process.env.ECPAY_MERCHANT_ID || '';
    this.hashKey = process.env.ECPAY_HASH_KEY || '';
    this.hashIV = process.env.ECPAY_HASH_IV || '';
    this.isSandbox = process.env.ECPAY_SANDBOX === 'true' || !process.env.ECPAY_MERCHANT_ID;
    this.returnUrl = process.env.ECPAY_RETURN_URL || `${process.env.API_BASE_URL || 'http://localhost:4000'}/api/payment/callback/ecpay/return`;
    this.notifyUrl = process.env.ECPAY_NOTIFY_URL || `${process.env.API_BASE_URL || 'http://localhost:4000'}/api/payment/callback/ecpay/notify`;
  }

  /**
   * 創建 AES 加密
   */
  private aesEncrypt(data: string): string {
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(this.hashKey), Buffer.from(this.hashIV));
    let encrypted = cipher.update(data, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  /**
   * 創建 SHA256 雜湊
   */
  private sha256Hash(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex').toUpperCase();
  }

  /**
   * 創建付款
   */
  async createPayment(input: CreatePaymentInput): Promise<PaymentResponse> {
    const baseUrl = this.isSandbox 
      ? 'https://payment-stage.ecpay.com.tw/Cashier/AioCheckOut/V5'
      : 'https://payment.ecpay.com.tw/Cashier/AioCheckOut/V5';

    const orderDate = new Date().toISOString().slice(0, 19).replace(/[-:]/g, '/').replace('T', ' ');
    const merchantTradeNo = `EC${Date.now()}${Math.random().toString(36).substring(2, 9).toUpperCase()}`;
    
    // 根據支付方式設定參數
    const choosePayment = this.getChoosePayment(input.paymentMethod);
    const paymentParams: any = {
      MerchantID: this.merchantId,
      MerchantTradeNo: merchantTradeNo,
      MerchantTradeDate: orderDate,
      PaymentType: 'aio',
      TotalAmount: Math.floor(input.amount / 100), // 轉換為元
      TradeDesc: '租屋平台服務費',
      ItemName: '租屋平台服務',
      ReturnURL: this.returnUrl,
      OrderResultURL: this.returnUrl,
      ChoosePayment: choosePayment,
      EncryptType: 1, // SHA256
    };

    // 根據支付方式添加額外參數
    if (input.paymentMethod === 'ATM') {
      paymentParams.ExpireDate = 3; // 3天後過期
    } else if (input.paymentMethod === 'CVS') {
      paymentParams.StoreExpireDate = 1; // 1天後過期
    }

    // 建立檢查碼
    const checkValue = this.buildCheckValue(paymentParams);
    paymentParams.CheckMacValue = checkValue;

    // 建立付款表單 HTML（前端會自動提交）
    const paymentUrl = `${baseUrl}?${new URLSearchParams(
      Object.entries(paymentParams).map(([k, v]) => [k, String(v)])
    ).toString()}`;

    return {
      id: '', // 會在 payment.service.ts 中設置
      paymentNumber: merchantTradeNo,
      paymentUrl,
      transactionId: merchantTradeNo,
      status: 'PENDING',
    };
  }

  /**
   * 處理支付回調
   */
  async handleCallback(data: any): Promise<PaymentCallbackData> {
    // 驗證檢查碼
    const checkMacValue = data.CheckMacValue;
    delete data.CheckMacValue;
    
    const calculatedCheckMac = this.buildCheckValue(data);
    
    if (checkMacValue !== calculatedCheckMac) {
      throw new Error('檢查碼驗證失敗');
    }

    const transactionId = data.MerchantTradeNo;
    const rtnCode = data.RtnCode;
    const status: PaymentStatus = rtnCode === '1' ? 'SUCCESS' : 'FAILED';

    return {
      transactionId,
      orderId: data.CustomField1 || '', // 可以將 orderId 放在 CustomField1
      amount: parseInt(data.TradeAmt) * 100, // 轉換為分
      status,
      paidAt: status === 'SUCCESS' ? new Date(data.PaymentDate) : undefined,
      metadata: data,
    };
  }

  /**
   * 查詢付款狀態
   */
  async queryPaymentStatus(transactionId: string): Promise<PaymentStatus> {
    // 綠界查詢 API（需要實作）
    // 這裡先返回 PENDING，實際應該調用綠界 API
    return 'PENDING';
  }

  /**
   * 退款
   */
  async refund(transactionId: string, amount: number, reason?: string): Promise<boolean> {
    // 綠界退款 API（需要實作）
    return false;
  }

  /**
   * 獲取支付方式代碼
   */
  private getChoosePayment(method: string): string {
    const mapping: Record<string, string> = {
      CREDIT_CARD: 'Credit',
      ATM: 'ATM',
      CVS: 'CVS',
      WEBATM: 'WebATM',
    };
    return mapping[method] || 'ALL';
  }

  /**
   * 建立檢查碼
   */
  private buildCheckValue(params: Record<string, any>): string {
    // 按照參數名稱排序
    const sortedKeys = Object.keys(params).sort();
    const checkString = sortedKeys
      .map(key => `${key}=${params[key]}`)
      .join('&');
    
    const hashString = `HashKey=${this.hashKey}&${checkString}&HashIV=${this.hashIV}`;
    return this.sha256Hash(hashString);
  }
}



