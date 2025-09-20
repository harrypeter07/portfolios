// Environment Setup Helper for Templates App
const crypto = require('crypto');

console.log('🔧 Templates App Environment Setup\n');

// Generate a secure JWT secret
const generateSecret = () => {
  return crypto.randomBytes(32).toString('hex');
};

const secret = generateSecret();

console.log('📋 Required Environment Variables:\n');

console.log('🔑 For Templates App (Vercel Environment Variables):');
console.log('SHARED_JWT_SECRET=' + secret);
console.log('MAIN_API_BASE=https://portume.vercel.app');
console.log('ALLOWED_ORIGINS=https://portume.vercel.app,http://localhost:3001');
console.log('PREVIEW_JWT_SECRET=' + secret);

console.log('\n🔑 For Main App (.env.local):');
console.log('JWT_SECRET=' + secret);
console.log('TEMPLATES_APP_URL=https://templates.portume.com');

console.log('\n📝 Setup Instructions:');
console.log('1. Copy the environment variables above');
console.log('2. Set them in Vercel Dashboard (Templates App)');
console.log('3. Set them in your Main App (.env.local)');
console.log('4. Deploy both apps');
console.log('5. Test integration with: node test-quick.js');

console.log('\n✅ Both apps will use the same JWT secret for secure communication!');
