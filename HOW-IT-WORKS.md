# 🔧 How Environment Variables Work

## 📋 **Simple Explanation**

### **The Problem:**
- Main App needs to send requests to Templates App
- Templates App needs to verify these requests are legitimate
- Both apps need to use the same secret for JWT authentication

### **The Solution:**
Both apps read the **same JWT secret** from their own environment variables.

## 🔄 **How It Works:**

### **1. Main App (portume.vercel.app)**
```javascript
// Main App creates JWT token
const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET; // From .env.local

const token = jwt.sign(
  { scope: 'render', exp: Date.now() + 300000 }, // 5 minutes
  secret,
  { algorithm: 'HS256' }
);

// Send request to Templates App
fetch('https://templates.portume.com/api/render', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

### **2. Templates App (templates.portume.com)**
```javascript
// Templates App verifies JWT token
const secret = process.env.SHARED_JWT_SECRET; // From Vercel Environment Variables

const { payload } = await jwtVerify(token, secret);
if (payload.scope !== 'render') throw new Error('Forbidden');
```

### **3. Both Apps Use Same Secret**
```bash
# Main App (.env.local) - runs on localhost:3000
JWT_SECRET=331c5e6ffa9f43ddc90044901c2559a47327052985024d1624b2bc98fd0c1e3a
TEMPLATES_APP_URL=http://localhost:3001  # Local development

# Templates App (Vercel Environment Variables) - runs on localhost:3001
SHARED_JWT_SECRET=331c5e6ffa9f43ddc90044901c2559a47327052985024d1624b2bc98fd0c1e3a
MAIN_API_BASE=http://localhost:3000  # Local development
ALLOWED_ORIGINS=http://localhost:3000
```

## ✅ **Why This Works:**

1. **Same Secret**: Both apps use identical JWT secret
2. **Secure**: Secret is not in code, only in environment
3. **Flexible**: Different secrets for dev/staging/prod
4. **Standard**: Industry best practice for microservices

## 🚀 **Setup Steps:**

1. **Copy the JWT secret** from `setup-env.js`
2. **Set in Main App** `.env.local` file
3. **Set in Templates App** Vercel Environment Variables
4. **Deploy both apps**
5. **Test integration**

## 🔒 **Security:**

- JWT tokens expire in 5 minutes
- Only requests with valid tokens are processed
- All requests are logged with unique IDs
- Environment variables are encrypted in production

**That's it!** Both apps share the same secret through environment variables. 🎉
