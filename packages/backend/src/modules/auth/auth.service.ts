/**
 * 身分驗證服務
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../../lib/prisma';
import { config } from '../../config';
import { AppError } from '../../middleware/errorHandler';
import { verificationService } from './verification.service';

// ==================== 類型定義 ====================

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE';
  referralSource?: string;
  
  // 聯絡資訊
  lineUrl?: string;
  
  // 緊急聯絡人（AGENT, AGENCY 需要）
  emergencyContactRelation?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  
  // 工作相關（AGENT, AGENCY 需要）
  workArea?: string;
  companyId?: string;
  companyName?: string;
  branchId?: string;
  branchName?: string;
  branchType?: 'DIRECT' | 'FRANCHISE';
  position?: string;
  brokerageName?: string;
  hideCompanyInfo?: boolean;
  
  // 公司相關（AGENCY, DEVELOPER 需要）
  accountType?: 'GROUP' | 'BRANCH' | 'OTHER';
  companyNameFull?: string;
  
  // 發票相關
  invoiceMethod?: 'DONATE' | 'CLOUD' | 'UNIFIED' | 'MOBILE';
  unifiedNumber?: string;
  invoiceBuyer?: string;
  invoicePhone?: string;
  invoiceCity?: string;
  invoiceDistrict?: string;
  invoiceAddress?: string;
  mobileCarrier?: string;
  
  verificationCode?: string; // 手機驗證碼
  role?: 'USER' | 'LANDLORD' | 'AGENT' | 'AGENCY' | 'DEVELOPER';
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

// ==================== 服務類別 ====================

export class AuthService {
  private readonly saltRounds = 12;
  private readonly accessTokenExpiry = '15m';
  private readonly refreshTokenExpiry = 7 * 24 * 60 * 60 * 1000; // 7 days

  /**
   * 註冊新使用者
   */
  async register(input: RegisterInput): Promise<{ user: any; tokens: AuthTokens }> {
    const { email, password, name, phone, verificationCode, role } = input;

    // 如果是 USER 或 LANDLORD 角色且有手機號碼，驗證驗證碼
    if ((role === 'USER' || role === 'LANDLORD') && phone) {
      if (!verificationCode) {
        throw new AppError('請輸入手機驗證碼', 400, 'VERIFICATION_CODE_REQUIRED');
      }

      const isValid = await verificationService.verifyCode(phone, verificationCode);
      if (!isValid) {
        throw new AppError('手機驗證碼錯誤或已過期', 400, 'INVALID_VERIFICATION_CODE');
      }
    }

    // 檢查 email 是否已存在
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError('Email 已被使用', 409, 'EMAIL_EXISTS');
    }

    // Hash 密碼
    const passwordHash = await bcrypt.hash(password, this.saltRounds);

    // 建立使用者
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        phone: phone || null,
        role: input.role || 'USER',
        gender: input.gender || null,
        referralSource: input.referralSource || null,
        lineUrl: input.lineUrl || null,
        emergencyContactRelation: input.emergencyContactRelation || null,
        emergencyContactName: input.emergencyContactName || null,
        emergencyContactPhone: input.emergencyContactPhone || null,
        workArea: input.workArea || null,
        companyId: input.companyId || null,
        companyName: input.companyName || null,
        branchId: input.branchId || null,
        branchName: input.branchName || null,
        branchType: input.branchType || null,
        position: input.position || null,
        brokerageName: input.brokerageName || null,
        hideCompanyInfo: input.hideCompanyInfo || false,
        accountType: input.accountType || null,
        companyNameFull: input.companyNameFull || null,
        invoiceMethod: input.invoiceMethod || null,
        unifiedNumber: input.unifiedNumber || null,
        invoiceBuyer: input.invoiceBuyer || null,
        invoicePhone: input.invoicePhone || null,
        invoiceCity: input.invoiceCity || null,
        invoiceDistrict: input.invoiceDistrict || null,
        invoiceAddress: input.invoiceAddress || null,
        mobileCarrier: input.mobileCarrier || null,
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatarUrl: true,
        isVerified: true,
        createdAt: true,
      },
    });

    // 生成 tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return { user, tokens };
  }

  /**
   * 登入
   */
  async login(input: LoginInput): Promise<{ user: any; tokens: AuthTokens }> {
    const { email, password } = input;

    // 查詢使用者
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Email 或密碼錯誤', 401, 'INVALID_CREDENTIALS');
    }

    // 驗證密碼
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError('Email 或密碼錯誤', 401, 'INVALID_CREDENTIALS');
    }

    // 生成 tokens
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
        avatarUrl: user.avatarUrl,
        isVerified: user.isVerified,
        createdAt: user.createdAt,
      },
      tokens,
    };
  }

  /**
   * 刷新 Token
   */
  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    // 查詢 refresh token
    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord) {
      throw new AppError('無效的 Refresh Token', 401, 'INVALID_REFRESH_TOKEN');
    }

    if (tokenRecord.expiresAt < new Date()) {
      await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });
      throw new AppError('Refresh Token 已過期', 401, 'REFRESH_TOKEN_EXPIRED');
    }

    // 刪除舊的 refresh token
    await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });

    // 生成新的 tokens
    return this.generateTokens(
      tokenRecord.user.id,
      tokenRecord.user.email,
      tokenRecord.user.role
    );
  }

  /**
   * 登出
   */
  async logout(refreshToken: string): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });
  }

  /**
   * 請求密碼重設
   */
  async requestPasswordReset(email: string): Promise<string> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // 不揭露 email 是否存在
      return 'reset-token-placeholder';
    }

    // 生成重設 token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // 儲存到 refresh token 表（臨時方案）
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: hashedToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    // 在實際環境中，這裡應該發送 email
    console.log(`Password reset token for ${email}: ${resetToken}`);

    return resetToken;
  }

  /**
   * 重設密碼
   */
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const tokenRecord = await prisma.refreshToken.findUnique({
      where: { token: hashedToken },
    });

    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      throw new AppError('無效或已過期的重設連結', 400, 'INVALID_RESET_TOKEN');
    }

    // Hash 新密碼
    const passwordHash = await bcrypt.hash(newPassword, this.saltRounds);

    // 更新密碼
    await prisma.user.update({
      where: { id: tokenRecord.userId },
      data: { passwordHash },
    });

    // 刪除 token
    await prisma.refreshToken.delete({ where: { id: tokenRecord.id } });

    // 刪除該使用者所有 refresh tokens（強制登出）
    await prisma.refreshToken.deleteMany({
      where: { userId: tokenRecord.userId },
    });
  }

  /**
   * 驗證 Access Token
   */
  verifyAccessToken(token: string): JwtPayload {
    try {
      return jwt.verify(token, config.jwtSecret) as JwtPayload;
    } catch {
      throw new AppError('無效的 Token', 401, 'INVALID_TOKEN');
    }
  }

  // ==================== 私有方法 ====================

  private async generateTokens(userId: string, email: string, role: string): Promise<AuthTokens> {
    const payload: JwtPayload = { userId, email, role };

    // 生成 access token
    const accessToken = jwt.sign(payload, config.jwtSecret, {
      expiresIn: this.accessTokenExpiry,
    });

    // 生成 refresh token
    const refreshToken = crypto.randomBytes(40).toString('hex');

    // 儲存 refresh token
    await prisma.refreshToken.create({
      data: {
        userId,
        token: refreshToken,
        expiresAt: new Date(Date.now() + this.refreshTokenExpiry),
      },
    });

    return {
      accessToken,
      refreshToken,
      expiresIn: 900, // 15 minutes in seconds
    };
  }

  /**
   * Facebook OAuth 登入/註冊
   */
  async facebookLogin(accessToken: string): Promise<{ user: any; tokens: AuthTokens }> {
    try {
      // 驗證 Facebook access token 並取得用戶資訊
      const response = await fetch(
        `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
      );

      if (!response.ok) {
        throw new AppError('Facebook 登入失敗', 401, 'FACEBOOK_AUTH_FAILED');
      }

      const facebookUser = await response.json();

      if (!facebookUser.email) {
        throw new AppError('無法取得 Facebook Email，請確認已授權 Email 權限', 400, 'FACEBOOK_EMAIL_REQUIRED');
      }

      // 查找或創建用戶
      let user = await prisma.user.findUnique({
        where: { email: facebookUser.email },
      });

      if (!user) {
        // 創建新用戶（OAuth 用戶使用隨機密碼 hash，因為 passwordHash 是必填欄位）
        const randomPassword = crypto.randomBytes(32).toString('hex');
        const passwordHash = await bcrypt.hash(randomPassword, this.saltRounds);
        
        user = await prisma.user.create({
          data: {
            email: facebookUser.email,
            name: facebookUser.name || 'Facebook User',
            passwordHash, // OAuth 用戶使用隨機密碼（不會被使用）
            avatarUrl: facebookUser.picture?.data?.url || null,
            isVerified: true, // Facebook 帳號視為已驗證
            role: 'USER',
          },
          select: {
            id: true,
            email: true,
            name: true,
            phone: true,
            role: true,
            avatarUrl: true,
            isVerified: true,
            createdAt: true,
          },
        });
      } else {
        // 更新頭像（如果有的話）
        if (facebookUser.picture?.data?.url && !user.avatarUrl) {
          await prisma.user.update({
            where: { id: user.id },
            data: { avatarUrl: facebookUser.picture.data.url },
          });
          user.avatarUrl = facebookUser.picture.data.url;
        }
      }

      // 生成 tokens
      const tokens = await this.generateTokens(user.id, user.email, user.role);

      return {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          role: user.role,
          avatarUrl: user.avatarUrl,
          isVerified: user.isVerified,
          createdAt: user.createdAt,
        },
        tokens,
      };
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Facebook 登入失敗', 500, 'FACEBOOK_AUTH_ERROR');
    }
  }
}

export const authService = new AuthService();

