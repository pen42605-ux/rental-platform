/**
 * PostgreSQL 備份腳本 (Node.js)
 * 使用方式: node backup-postgres.js [AM|PM]
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { createGzip } = require('zlib');
const { pipeline } = require('stream/promises');

(async () => {

// 設定變數
const BACKUP_DIR = process.env.BACKUP_DIR || path.join(process.cwd(), 'backups', 'postgresql');
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/rental_platform';
const RETENTION_DAYS = parseInt(process.env.RETENTION_DAYS || '30', 10);

// 取得參數
const period = process.argv[2] || 'AM'; // AM 或 PM

// 建立備份目錄
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// 取得時間戳記
const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
const backupFile = path.join(BACKUP_DIR, `rental_platform_${period}_${timestamp}.sql.gz`);

// 從 DATABASE_URL 解析連線資訊
const urlMatch = DATABASE_URL.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):([^/]+)\/(.+)/);
if (!urlMatch) {
  console.error('❌ 錯誤: 無法解析 DATABASE_URL');
  process.exit(1);
}

const [, dbUser, dbPass, dbHost, dbPort, dbName] = urlMatch;

// 設定環境變數
process.env.PGPASSWORD = dbPass;

console.log('開始備份資料庫:', dbName);
console.log('時間:', new Date().toISOString());
console.log('備份檔:', backupFile);

try {
  // 執行 pg_dump
  const dumpCommand = `pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} --no-owner --no-acl --clean --if-exists`;
  const dumpOutput = execSync(dumpCommand, { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });

  // 壓縮備份
  const input = Buffer.from(dumpOutput, 'utf8');
  const output = fs.createWriteStream(backupFile);
  const gzip = createGzip();

  const { Readable } = require('stream');
  await pipeline(
    Readable.from(input),
    gzip,
    output
  );

  // 檢查備份檔大小
  const stats = fs.statSync(backupFile);
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
  console.log(`✅ 備份成功: ${backupFile} (${sizeMB} MB)`);

  // 驗證備份檔
  try {
    const zlib = require('zlib');
    const fileContent = fs.readFileSync(backupFile);
    zlib.gunzipSync(fileContent);
    console.log('✅ 備份檔驗證通過');
  } catch (error) {
    console.error('❌ 備份檔驗證失敗:', error.message);
    process.exit(1);
  }

  // 清理舊備份
  console.log(`清理 ${RETENTION_DAYS} 天前的備份...`);
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - RETENTION_DAYS);

  const files = fs.readdirSync(BACKUP_DIR);
  let deletedCount = 0;

  for (const file of files) {
    if (file.startsWith('rental_platform_') && file.endsWith('.sql.gz')) {
      const filePath = path.join(BACKUP_DIR, file);
      const fileStats = fs.statSync(filePath);
      
      if (fileStats.mtime < cutoffDate) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    }
  }

  console.log(`✅ 清理完成，刪除 ${deletedCount} 個舊備份`);

  // 清除密碼
  delete process.env.PGPASSWORD;

  console.log('備份完成:', new Date().toISOString());
} catch (error) {
  console.error('❌ 備份失敗:', error.message);
  delete process.env.PGPASSWORD;
  process.exit(1);
}
})();

