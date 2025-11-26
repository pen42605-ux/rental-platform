/**
 * 身分驗證控制器
 */
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from './auth.service';
import { AuthRequest } from '../../middleware/auth.middleware';

// ==================== 驗證 Schema ====================

const registerSchema = z.object({
  email: z.string().email('請輸入有效的 Email'),
  password: z.string().min(8, '密碼至少 8 個字元'),
  name: z.string().min(1, '請輸入姓名').max(50),
  phone: z.string().optional(),
  gender: z.enum(['MALE', 'FEMALE']).optional(),
  referralSource: z.string().optional(),
  
  // 聯絡資訊
  lineUrl: z.string().url('請輸入有效的 Line 網址').optional().or(z.literal('')),
  
  // 緊急聯絡人（AGENT, AGENCY 需要）
  emergencyContactRelation: z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  
  // 工作相關（AGENT, AGENCY 需要）
  workArea: z.string().optional(),
  companyId: z.string().optional(),
  companyName: z.string().optional(),
  branchId: z.string().optional(),
  branchName: z.string().optional(),
  branchType: z.enum(['DIRECT', 'FRANCHISE']).optional(), // 直營店, 加盟店
  position: z.string().optional(),
  brokerageName: z.string().optional(), // 經紀業名稱
  hideCompanyInfo: z.boolean().optional(),
  
  // 公司相關（AGENCY, DEVELOPER 需要）
  accountType: z.enum(['GROUP', 'BRANCH', 'OTHER']).optional(), // 集團賬號, 分店賬號, 其他
  companyNameFull: z.string().optional(), // 公司名稱（DEVELOPER）
  
  // 發票相關
  invoiceMethod: z.enum(['DONATE', 'CLOUD', 'UNIFIED', 'MOBILE']).optional(),
  unifiedNumber: z.string().optional(),
  invoiceBuyer: z.string().optional(),
  invoicePhone: z.string().optional(),
  invoiceCity: z.string().optional(),
  invoiceDistrict: z.string().optional(),
  invoiceAddress: z.string().optional(),
  mobileCarrier: z.string().optional(),
  
  verificationCode: z.string().optional(), // 手機驗證碼
  role: z.enum(['USER', 'LANDLORD', 'AGENT', 'AGENCY', 'DEVELOPER'], {
    errorMap: () => ({ message: '請選擇有效的註冊身份' }),
  }).default('USER'),
});

const loginSchema = z.object({
  email: z.string().email('請輸入有效的 Email'),
  password: z.string().min(1, '請輸入密碼'),
});

const refreshSchema = z.object({
  refreshToken: z.string().min(1, '請提供 Refresh Token'),
});

const resetRequestSchema = z.object({
  email: z.string().email('請輸入有效的 Email'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, '請提供重設 Token'),
  password: z.string().min(8, '密碼至少 8 個字元'),
});

// ==================== 控制器 ====================

export class AuthController {
  /**
   * POST /api/auth/register
   */
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const input = registerSchema.parse(req.body);
      const result = await authService.register(input);

      res.status(201).json({
        success: true,
        message: '註冊成功',
        data: result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
          },
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/login
   */
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const input = loginSchema.parse(req.body);
      const result = await authService.login(input);

      res.json({
        success: true,
        message: '登入成功',
        data: result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
          },
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/refresh
   */
  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = refreshSchema.parse(req.body);
      const tokens = await authService.refreshTokens(refreshToken);

      res.json({
        success: true,
        data: tokens,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
          },
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/logout
   */
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = refreshSchema.parse(req.body);
      await authService.logout(refreshToken);

      res.json({
        success: true,
        message: '登出成功',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
          },
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/forgot-password
   */
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = resetRequestSchema.parse(req.body);
      await authService.requestPasswordReset(email);

      res.json({
        success: true,
        message: '如果該 Email 存在，重設連結已發送',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
          },
        });
      }
      next(error);
    }
  }

  /**
   * POST /api/auth/reset-password
   */
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, password } = resetPasswordSchema.parse(req.body);
      await authService.resetPassword(token, password);

      res.json({
        success: true,
        message: '密碼已重設',
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: error.errors[0].message,
          },
        });
      }
      next(error);
    }
  }

  /**
   * GET /api/auth/me
   */
  async me(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      res.json({
        success: true,
        data: req.user,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/auth/facebook
   */
  async facebookLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { accessToken } = req.body;
      
      if (!accessToken) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: '請提供 Facebook Access Token',
          },
        });
      }

      const result = await authService.facebookLogin(accessToken);

      res.json({
        success: true,
        message: 'Facebook 登入成功',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
