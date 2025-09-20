// Environment Setup Helper for Templates App with API Key Authentication
const crypto = require('crypto');

console.log('🔧 Templates App Environment Setup (API Key Authentication)\n');

// Generate secure API keys
const generateApiKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

const mainApiKey = generateApiKey();
const backupApiKey = generateApiKey();

console.log('📋 Required Environment Variables:\n');

console.log('🔑 For Templates App (Vercel Environment Variables):');
console.log('VALID_API_KEYS=' + mainApiKey + ',' + backupApiKey);
console.log('MAIN_API_BASE=https://portume.vercel.app');
console.log('ALLOWED_ORIGINS=https://portume.vercel.app,http://localhost:3000');
console.log('PREVIEW_JWT_SECRET=' + generateApiKey());

console.log('\n🔑 For Main App (.env.local):');
console.log('TEMPLATES_API_KEY=' + mainApiKey);
console.log('TEMPLATES_APP_URL=https://templates.portume.com');

console.log('\n📝 Setup Instructions:');
console.log('1. Copy the environment variables above');
console.log('2. Set them in Vercel Dashboard (Templates App)');
console.log('3. Set them in your Main App (.env.local)');
console.log('4. Deploy both apps');
console.log('5. Test integration with: node test-api-key.js');

console.log('\n✅ Both apps will use the same API key for secure communication!');
console.log('\n🔒 Security Notes:');
console.log('- API keys are simpler than JWT tokens');
console.log('- No expiration or complex payload validation');
console.log('- Easy to rotate by updating VALID_API_KEYS');
console.log('- Multiple API keys supported (comma-separated)');
