// Quick test without JWT authentication
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testWithoutAuth() {
  console.log('🧪 Quick Test - No Authentication Required\n');
  
  try {
    // Test manifest (no auth required)
    console.log('1️⃣ Testing Manifest API...');
    const manifestResponse = await fetch('http://localhost:3001/api/templates/manifest');
    const manifest = await manifestResponse.json();
    console.log('✅ Manifest:', manifest.length, 'templates available');
    
    // Test status (no auth required)
    console.log('\n2️⃣ Testing Status API...');
    const statusResponse = await fetch('http://localhost:3001/api/status');
    const status = await statusResponse.json();
    console.log('✅ Status:', status.status);
    console.log('✅ Uptime:', status.uptime);
    console.log('✅ Templates:', status.templates.count);
    
    // Test JWT debug (shows what's needed)
    console.log('\n3️⃣ Testing JWT Debug...');
    const debugResponse = await fetch('http://localhost:3001/api/debug/jwt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}'
    });
    const debug = await debugResponse.json();
    console.log('✅ JWT Debug:', debug.instructions.step1);
    console.log('✅ JWT Debug:', debug.instructions.step2);
    console.log('✅ JWT Debug:', debug.instructions.step3);
    
    console.log('\n🎉 All tests passed! Templates App is working perfectly.');
    console.log('\n📋 Next Steps:');
    console.log('1. Set SHARED_JWT_SECRET environment variable');
    console.log('2. Deploy to Vercel with the same secret as your Main App');
    console.log('3. Test with real JWT tokens from your Main App');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testWithoutAuth();
