/**
 * 手機驗證碼服務
 */
import crypto from 'crypto';
import prisma from '../../lib/prisma';
import { AppError } from '../../middleware/errorHandler';

// 驗證碼有效期（5分鐘）
const CODE_EXPIRY = 5 * 60 * 1000;
// 驗證碼長度
const CODE_LENGTH = 6;
// 發送間隔（60秒）
const SEND_INTERVAL = 60 * 1000;

// 內存存儲（作為後備方案，當資料庫表不存在時使用）
interface VerificationRecord {
  phone: string;
  code: string;
  expiresAt: Date;
  verified: boolean;
  createdAt: Date;
}

const memoryStore = new Map<string, VerificationRecord[]>();

export class VerificationService {
  /**
   * 檢查 PhoneVerification 模型是否可用
   */
  private isPhoneVerificationAvailable(): boolean {
    try {
      return 'phoneVerification' in prisma && typeof (prisma as any).phoneVerification === 'object';
    } catch {
      return false;
    }
  }
  /**
   * 生成 6 位數驗證碼
   */
  private generateCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /**
   * 發送驗證碼
   */
  async sendVerificationCode(phone: string): Promise<{ success: boolean; message: string }> {
    // 驗證手機號碼格式（台灣手機號碼）
    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(phone)) {
      throw new AppError('請輸入有效的手機號碼（格式：09XXXXXXXX）', 400, 'INVALID_PHONE');
    }

    // 檢查是否在發送間隔內
    let existing: any = null;
    
    if (this.isPhoneVerificationAvailable()) {
      try {
        existing = await (prisma as any).phoneVerification.findFirst({
          where: {
            phone,
            createdAt: {
              gte: new Date(Date.now() - SEND_INTERVAL),
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
        });
      } catch (error) {
        // 如果查詢失敗，使用內存存儲
        console.warn('無法查詢 PhoneVerification 表，使用內存存儲');
      }
    }

    // 如果資料庫不可用，檢查內存存儲
    if (!existing && !this.isPhoneVerificationAvailable()) {
      const records = memoryStore.get(phone) || [];
      const recentRecord = records
        .filter((r) => Date.now() - r.createdAt.getTime() < SEND_INTERVAL)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
      
      if (recentRecord) {
        const remainingSeconds = Math.ceil(
          (SEND_INTERVAL - (Date.now() - recentRecord.createdAt.getTime())) / 1000
        );
        throw new AppError(
          `請在 ${remainingSeconds} 秒後再試`,
          429,
          'RATE_LIMIT'
        );
      }
    } else if (existing) {
      const remainingSeconds = Math.ceil(
        (SEND_INTERVAL - (Date.now() - existing.createdAt.getTime())) / 1000
      );
      throw new AppError(
        `請在 ${remainingSeconds} 秒後再試`,
        429,
        'RATE_LIMIT'
      );
    }

    // 生成驗證碼
    const code = this.generateCode();
    const expiresAt = new Date(Date.now() + CODE_EXPIRY);

    // 儲存驗證碼
    if (this.isPhoneVerificationAvailable()) {
      try {
        await (prisma as any).phoneVerification.create({
          data: {
            phone,
            code,
            expiresAt,
          },
        });
      } catch (error: any) {
        console.warn('無法寫入 PhoneVerification 表，使用內存存儲:', error.message);
        // 使用內存存儲作為後備
        this.saveToMemory(phone, code, expiresAt);
      }
    } else {
      // 使用內存存儲
      this.saveToMemory(phone, code, expiresAt);
    }

    // TODO: 整合實際 SMS 服務（如 Twilio、AWS SNS、或其他 SMS 服務商）
    // 目前先輸出到 console（開發環境）
    if (process.env.NODE_ENV === 'development') {
      console.log(`\n📱 手機驗證碼發送給 ${phone}: ${code}\n`);
    }

    // 模擬發送 SMS（生產環境需要整合實際 SMS 服務）
    // await this.sendSMS(phone, `您的驗證碼是：${code}，有效期 5 分鐘。`);

    return {
      success: true,
      message: '驗證碼已發送',
    };
  }

  /**
   * 保存到內存存儲
   */
  private saveToMemory(phone: string, code: string, expiresAt: Date) {
    if (!memoryStore.has(phone)) {
      memoryStore.set(phone, []);
    }
    const records = memoryStore.get(phone)!;
    records.push({
      phone,
      code,
      expiresAt,
      verified: false,
      createdAt: new Date(),
    });
    // 只保留最近 10 條記錄
    if (records.length > 10) {
      records.shift();
    }
  }

  /**
   * 驗證驗證碼
   */
  async verifyCode(phone: string, code: string): Promise<boolean> {
    if (this.isPhoneVerificationAvailable()) {
      try {
        const verification = await (prisma as any).phoneVerification.findFirst({
          where: {
            phone,
            code,
            expiresAt: {
              gt: new Date(),
            },
            verified: false,
          },
          orderBy: {
            createdAt: 'desc',
          },
        });

        if (!verification) {
          return false;
        }

        // 標記為已驗證
        await (prisma as any).phoneVerification.update({
          where: { id: verification.id },
          data: { verified: true },
        });

        return true;
      } catch (error: any) {
        console.warn('無法查詢 PhoneVerification 表，使用內存存儲驗證:', error.message);
        // 回退到內存存儲
      }
    }

    // 使用內存存儲驗證
    const records = memoryStore.get(phone) || [];
    const verification = records
      .filter((r) => !r.verified && r.expiresAt > new Date() && r.code === code)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

    if (verification) {
      verification.verified = true;
      return true;
    }

    // 開發環境：如果內存中也沒有，允許通過（方便測試）
    if (process.env.NODE_ENV === 'development') {
      console.warn('驗證碼未找到，開發環境允許通過（僅用於測試）');
      return true;
    }

    return false;
  }

  /**
   * 清理過期驗證碼（可選，定期執行）
   */
  async cleanupExpiredCodes() {
    const now = new Date();
    
    // 清理資料庫中的過期驗證碼
    if (this.isPhoneVerificationAvailable()) {
      try {
        await (prisma as any).phoneVerification.deleteMany({
          where: {
            expiresAt: {
              lt: now,
            },
          },
        });
      } catch (error) {
        // 忽略錯誤
      }
    }

    // 清理內存存儲中的過期驗證碼
    for (const [phone, records] of memoryStore.entries()) {
      const validRecords = records.filter((r) => r.expiresAt > now);
      if (validRecords.length === 0) {
        memoryStore.delete(phone);
      } else {
        memoryStore.set(phone, validRecords);
      }
    }
  }
}

export const verificationService = new VerificationService();

