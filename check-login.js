/**
 * 快速診斷登入問題的腳本
 * 使用方法: node check-login.js
 */

const http = require('http');
const https = require('https');

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

console.log('🔍 開始診斷登入問題...\n');

// 檢查後端健康狀態
function checkBackendHealth() {
  return new Promise((resolve) => {
    const url = new URL(`${API_URL}/health`);
    const client = url.protocol === 'https:' ? https : http;
    
    const req = client.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const health = JSON.parse(data);
          console.log('✅ 後端服務運行正常');
          console.log(`   狀態: ${health.status}`);
          console.log(`   資料庫: ${health.database || '未檢查'}`);
          resolve(true);
        } catch (e) {
          console.log('⚠️  後端回應異常');
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log('❌ 無法連接到後端服務');
      console.log(`   錯誤: ${err.message}`);
      console.log(`   URL: ${API_URL}`);
      console.log('   請確認後端服務是否運行 (npm run dev)');
      resolve(false);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.log('❌ 後端服務回應超時');
      console.log(`   URL: ${API_URL}`);
      resolve(false);
    });
  });
}

// 檢查 API 端點
function checkAuthEndpoint() {
  return new Promise((resolve) => {
    const url = new URL(`${API_URL}/api/auth/login`);
    const client = url.protocol === 'https:' ? https : http;
    
    const postData = JSON.stringify({
      email: 'test@example.com',
      password: 'test1234',
    });

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
    };

    const req = client.request(url, options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        if (res.statusCode === 401) {
          console.log('✅ 登入 API 端點正常 (401 是預期的，因為測試帳號不存在)');
          resolve(true);
        } else if (res.statusCode === 200) {
          console.log('✅ 登入 API 端點正常');
          resolve(true);
        } else {
          console.log(`⚠️  登入 API 端點回應異常: ${res.statusCode}`);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log('❌ 無法連接到登入 API');
      console.log(`   錯誤: ${err.message}`);
      resolve(false);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.log('❌ 登入 API 回應超時');
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

// 檢查環境變數
function checkEnvVars() {
  console.log('\n📋 環境變數檢查:');
  console.log(`   NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL || '未設定 (使用預設: http://localhost:4000)'}`);
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '已設定' : '❌ 未設定'}`);
  console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '已設定' : '❌ 未設定'}`);
}

// 主函數
async function main() {
  console.log(`後端 URL: ${API_URL}`);
  console.log(`前端 URL: ${FRONTEND_URL}\n`);

  const backendOk = await checkBackendHealth();
  console.log('');
  
  if (backendOk) {
    await checkAuthEndpoint();
  }

  checkEnvVars();

  console.log('\n📝 建議:');
  if (!backendOk) {
    console.log('   1. 確認後端服務是否運行: cd packages/backend && npm run dev');
    console.log('   2. 檢查端口是否被占用');
    console.log('   3. 確認 .env 文件中的 BACKEND_PORT 設定');
  }
  console.log('   4. 查看詳細診斷指南: DIAGNOSE_LOGIN.md');
  console.log('   5. 檢查瀏覽器控制台的錯誤訊息');
}

main().catch(console.error);


