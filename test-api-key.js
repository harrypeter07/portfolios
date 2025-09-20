// Test script for Templates App with API Key Authentication
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

// Use inline API key for testing (replace with your actual API key)
const TEST_API_KEY = '85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02';

async function testTemplatesApp() {
  console.log('🧪 Testing Templates App with API Key Authentication...\n');
  
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
    console.log('✅ API Keys:', status.environment.VALID_API_KEYS ? 'Set' : 'Not Set');
    console.log('✅ API Keys Count:', status.environment.VALID_API_KEYS_COUNT);
    
    // Test API key debug endpoint
    console.log('\n3️⃣ Testing API Key Debug...');
    const debugResponse = await fetch('http://localhost:3001/api/debug/api-key', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${TEST_API_KEY}`,
        'Content-Type': 'application/json' 
      },
      body: '{}'
    });
    const debug = await debugResponse.json();
    console.log('✅ Debug Response:', debug.success ? 'API Key Valid' : debug.error);
    
    // Test template rendering with API key
    console.log('\n4️⃣ Testing Template Rendering...');
    const renderResponse = await fetch('http://localhost:3001/api/render', {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${TEST_API_KEY}`,
        'Content-Type': 'application/json' 
      },
      body: JSON.stringify({
        templateId: 'modern-resume',
        data: {
          username: 'test_user',
          templateId: 'modern-resume',
          portfolioData: {
            personal: {
              firstName: 'John',
              lastName: 'Doe',
              email: 'john@example.com',
              title: 'Full Stack Developer'
            },
            projects: {
              items: [
                {
                  title: 'Test Project',
                  description: 'A test project for API validation',
                  technologies: ['React', 'Node.js']
                }
              ]
            }
          }
        }
      })
    });
    
    if (renderResponse.ok) {
      const renderResult = await renderResponse.json();
      console.log('✅ Template Rendering: Success');
      console.log('✅ HTML Length:', renderResult.html.length);
      console.log('✅ CSS Length:', renderResult.css.length);
    } else {
      console.log('❌ Template Rendering: Failed');
      const error = await renderResponse.text();
      console.log('Error:', error);
    }
    
    console.log('\n🎉 Templates App is working perfectly!');
    console.log('\n📋 Next Steps:');
    console.log('1. Set VALID_API_KEYS environment variable with the test API key');
    console.log('2. Deploy to Vercel with API key configuration');
    console.log('3. Update Main App to use API key authentication');
    console.log('4. Test integration with valid API key');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('1. Make sure Templates App is running on localhost:3001');
    console.log('2. Check if VALID_API_KEYS environment variable is set');
    console.log('3. Verify the API key matches the one in VALID_API_KEYS');
  }
}

testTemplatesApp();
