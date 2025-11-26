import { NextRequest, NextResponse } from 'next/server';

/**
 * 本地開發用的簡易登入 API
 * 不依賴後端 Express，直接在 Next.js 前端上處理登入邏輯。
 *
 * 帳號密碼（寫死）：
 * - Email: admin@example.com
 * - 密碼: admin123
 */
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (email === 'admin@example.com' && password === 'admin123') {
      const user = {
        id: 'local-admin',
        email,
        name: 'Admin',
        role: 'ADMIN',
        avatarUrl: null as string | null,
      };

      const tokens = {
        accessToken: 'mock-admin-access-token',
        refreshToken: 'mock-admin-refresh-token',
      };

      return NextResponse.json({
        success: true,
        message: '登入成功（本機模擬）',
        data: { user, tokens },
      });
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INVALID_CREDENTIALS',
          message: 'Email 或密碼錯誤',
        },
      },
      { status: 401 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '登入失敗（本機 API 發生錯誤）',
        },
      },
      { status: 500 },
    );
  }
}


