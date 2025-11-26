/**
 * 手機驗證碼控制器
 */
import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { verificationService } from './verification.service';

const sendCodeSchema = z.object({
  phone: z.string().regex(/^09\d{8}$/, '請輸入有效的手機號碼（格式：09XXXXXXXX）'),
});

const verifyCodeSchema = z.object({
  phone: z.string().regex(/^09\d{8}$/, '請輸入有效的手機號碼'),
  code: z.string().length(6, '驗證碼必須為 6 位數'),
});

export class VerificationController {
  /**
   * POST /api/auth/verification/send
   * 發送驗證碼
   */
  async sendCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone } = sendCodeSchema.parse(req.body);
      const result = await verificationService.sendVerificationCode(phone);

      res.json({
        success: true,
        message: result.message,
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
   * POST /api/auth/verification/verify
   * 驗證驗證碼
   */
  async verifyCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, code } = verifyCodeSchema.parse(req.body);
      const isValid = await verificationService.verifyCode(phone, code);

      if (!isValid) {
        return res.status(400).json({
          success: false,
          error: {
            code: 'INVALID_CODE',
            message: '驗證碼錯誤或已過期',
          },
        });
      }

      res.json({
        success: true,
        message: '驗證成功',
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
}

export const verificationController = new VerificationController();





