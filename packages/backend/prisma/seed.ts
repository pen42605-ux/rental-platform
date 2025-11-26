import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 建立 Admin 帳號
  const adminPassword = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      passwordHash: adminPassword,
      role: 'ADMIN',
      isVerified: true,
    },
  });

  console.log('✅ Admin 帳號已建立：');
  console.log('   Email: admin@example.com');
  console.log('   密碼: admin123');

  // 建立測試房東帳號
  const landlordPassword = await bcrypt.hash('landlord123', 10);
  
  const landlord = await prisma.user.upsert({
    where: { email: 'landlord@example.com' },
    update: {},
    create: {
      email: 'landlord@example.com',
      name: '房東小明',
      passwordHash: landlordPassword,
      role: 'LANDLORD',
      isVerified: true,
    },
  });

  // 建立測試房源
  const listing = await prisma.listing.upsert({
    where: { id: 'test-listing-1' },
    update: {},
    create: {
      id: 'test-listing-1',
      userId: landlord.id,
      title: '台北信義區豪華套房',
      description: '近捷運站，生活機能佳，採光良好',
      price: 15000,
      currency: 'TWD',
      propertyType: 'STUDIO',
      beds: 1,
      baths: 1,
      area: 12,
      address: '台北市信義區信義路五段7號',
      city: '台北市',
      district: '信義區',
      latitude: 25.0330,
      longitude: 121.5654,
      amenities: '["冷氣", "網路", "洗衣機"]',
      status: 'PENDING_REVIEW',
    },
  });

  const listing2 = await prisma.listing.upsert({
    where: { id: 'test-listing-2' },
    update: {},
    create: {
      id: 'test-listing-2',
      userId: landlord.id,
      title: '新北板橋溫馨雅房',
      description: '近板橋車站，適合上班族',
      price: 8000,
      currency: 'TWD',
      propertyType: 'ROOM',
      beds: 1,
      baths: 1,
      area: 8,
      address: '新北市板橋區中山路一段1號',
      city: '新北市',
      district: '板橋區',
      latitude: 25.0146,
      longitude: 121.4591,
      amenities: '["冷氣", "網路"]',
      status: 'PUBLISHED',
    },
  });

  console.log('✅ 測試房源已建立');
  console.log('');
  console.log('🎉 資料初始化完成！');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });





