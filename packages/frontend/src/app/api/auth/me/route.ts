import { NextRequest, NextResponse } from 'next/server';

/**
 * 本地開發用的簡易「取得目前使用者」 API
 * 搭配 login/route.ts 一起使用，不依賴後端 Express。
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');

  // 簡單判斷：只要是我們在 login 時發出的 mock token，就當作已登入
  if (authHeader === 'Bearer mock-admin-access-token') {
    return NextResponse.json({
      success: true,
      data: {
        id: 'local-admin',
        email: 'admin@example.com',
        name: 'Admin',
        role: 'ADMIN',
        avatarUrl: null as string | null,
      },
    });
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        code: 'INVALID_TOKEN',
        message: '未登入或 Token 無效（本機模擬）',
      },
    },
    { status: 401 },
  );
}


