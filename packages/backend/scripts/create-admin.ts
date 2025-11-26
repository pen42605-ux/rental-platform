/**
 * 建立或重置 Admin 帳號
 * 使用方法: npx tsx scripts/create-admin.ts
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import readline from 'readline';

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log('🔧 Admin 帳號管理工具\n');

  const email = await question('請輸入 Admin Email (預設: admin@example.com): ') || 'admin@example.com';
  const password = await question('請輸入 Admin 密碼 (預設: admin123): ') || 'admin123';
  const name = await question('請輸入 Admin 名稱 (預設: Admin): ') || 'Admin';

  console.log('\n正在建立/更新 Admin 帳號...');

  try {
    // Hash 密碼
    const passwordHash = await bcrypt.hash(password, 12);

    // 檢查是否已存在
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      // 更新現有帳號
      const updated = await prisma.user.update({
        where: { email },
        data: {
          passwordHash,
          name,
          role: 'ADMIN',
          isVerified: true,
          isBlocked: false,
          blockedAt: null,
          blockedReason: null,
        },
      });

      console.log('✅ Admin 帳號已更新！');
      console.log(`   Email: ${updated.email}`);
      console.log(`   名稱: ${updated.name}`);
      console.log(`   角色: ${updated.role}`);
      console.log(`   密碼: ${password}`);
    } else {
      // 建立新帳號
      const created = await prisma.user.create({
        data: {
          email,
          passwordHash,
          name,
          role: 'ADMIN',
          isVerified: true,
        },
      });

      console.log('✅ Admin 帳號已建立！');
      console.log(`   Email: ${created.email}`);
      console.log(`   名稱: ${created.name}`);
      console.log(`   角色: ${created.role}`);
      console.log(`   密碼: ${password}`);
    }

    console.log('\n🎉 完成！您現在可以使用此帳號登入。');
  } catch (error: any) {
    console.error('❌ 錯誤:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await prisma.$disconnect();
  }
}

main();



