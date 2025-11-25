/**
 * 身分驗證服務
 */
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import prisma from '../../lib/prisma';
import { config } from '../../config';
import { AppError } from '../../middleware/errorHandler';

// ==================== 類型定義 ====================

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  phone?: string;
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
    const { email, password, name, phone } = input;

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
        phone,
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
}

export const authService = new AuthService();

