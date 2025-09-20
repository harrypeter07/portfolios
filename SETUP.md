# 🚀 Templates App Setup Guide

## 🔧 Environment Variables Required

Create a `.env.local` file in the project root with these variables:

```bash
# REQUIRED: JWT Secret - MUST match your Main App's JWT secret
SHARED_JWT_SECRET=your_main_app_jwt_secret_here

# REQUIRED: Main App API Base URL
MAIN_API_BASE=https://portume.vercel.app

# OPTIONAL: Allowed Origins (comma-separated)
ALLOWED_ORIGINS=https://portume.vercel.app,http://localhost:3000

# OPTIONAL: Preview JWT Secret (can use same as SHARED_JWT_SECRET)
PREVIEW_JWT_SECRET=your_main_app_jwt_secret_here
```

## 🧪 Testing the API

### 1. Set Environment Variables
```bash
# Windows PowerShell
$env:SHARED_JWT_SECRET="your_main_app_jwt_secret_here"
$env:MAIN_API_BASE="https://portume.vercel.app"

# Or create .env.local file
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```

### 4. Test the API
```bash
# Test manifest endpoint
curl http://localhost:3000/api/templates/manifest

# Test status endpoint
curl http://localhost:3000/api/status

# Test render endpoint (requires valid JWT)
node test-api.js
```

## 🔑 JWT Token Requirements

The JWT token must have:
- **Algorithm**: HS256
- **Scope**: "render"
- **Expiration**: ≤ 5 minutes
- **Secret**: Must match `SHARED_JWT_SECRET`

### Example JWT Payload:
```json
{
  "scope": "render",
  "exp": 1640995200,
  "iat": 1640994900,
  "sub": "user_id"
}
```

## 🐛 Common Issues

### 1. "signature verification failed"
- **Cause**: JWT secret mismatch
- **Fix**: Ensure `SHARED_JWT_SECRET` matches your Main App's JWT secret

### 2. "Server misconfigured: SHARED_JWT_SECRET missing"
- **Cause**: Environment variable not set
- **Fix**: Set `SHARED_JWT_SECRET` environment variable

### 3. "Forbidden"
- **Cause**: JWT token doesn't have `scope: "render"`
- **Fix**: Include `scope: "render"` in JWT payload

### 4. "Template not found"
- **Cause**: Invalid templateId
- **Fix**: Use valid template ID from `/api/templates/manifest`

## 📊 Monitoring

Check the console logs for detailed request tracking:
- Request IDs for tracing
- Performance metrics
- Error details with stack traces
- Template rendering status

## 🚀 Deployment

1. Set environment variables in Vercel dashboard
2. Deploy to `templates.portume.com`
3. Update Main App to use new Templates App URL
4. Test integration with real JWT tokens
