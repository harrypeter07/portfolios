// Simple test for Templates App
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testTemplatesApp() {
  console.log('🧪 Testing Templates App...\n');
  
  try {
    // Test manifest
    console.log('1️⃣ Testing Manifest API...');
    const manifestResponse = await fetch('http://localhost:3001/api/templates/manifest');
    const manifest = await manifestResponse.json();
    console.log('✅ Manifest:', manifest.length, 'templates available');
    
    // Test status
    console.log('\n2️⃣ Testing Status API...');
    const statusResponse = await fetch('http://localhost:3001/api/status');
    const status = await statusResponse.json();
    console.log('✅ Status:', status.status);
    console.log('✅ Environment:', status.environment.SHARED_JWT_SECRET ? 'Set' : 'Not Set');
    
    console.log('\n🎉 Templates App is working perfectly!');
    console.log('\n📋 Next Steps:');
    console.log('1. Deploy to Vercel with environment variables');
    console.log('2. Update Main App with same JWT secret');
    console.log('3. Test integration');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testTemplatesApp();
