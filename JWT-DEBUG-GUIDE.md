# 🔍 JWT Debug Guide

## 🚨 Current Issue: JWT Signature Verification Failed

The error `JWSSignatureVerificationFailed: signature verification failed` means the JWT token being sent doesn't match the expected signature.

## 🔧 Step-by-Step Debugging

### 1. Check Environment Variables
```bash
# Check if SHARED_JWT_SECRET is set
echo $env:SHARED_JWT_SECRET

# If empty, set it (replace with your actual secret)
$env:SHARED_JWT_SECRET="your_actual_jwt_secret_here"
```

### 2. Test JWT Debug Endpoint
```bash
# Test without token (should show environment status)
curl -X POST http://localhost:3000/api/debug/jwt

# Test with invalid token (should show detailed error)
curl -X POST http://localhost:3000/api/debug/jwt \
  -H "Authorization: Bearer invalid-token-123"

# Test with valid token (if you have the correct secret)
curl -X POST http://localhost:3000/api/debug/jwt \
  -H "Authorization: Bearer <your-valid-jwt-token>"
```

### 3. Use the Test Script
```bash
# Update JWT_SECRET in test-api.js first
node test-api.js
```

## 🔍 What the Enhanced Logs Will Show

### JWT Verification Logs:
```
🔐 JWT Verification - Starting
📋 Authorization header: Bearer eyJhbGciOiJIUzI1NiIs...
🎫 JWT Token (first 50 chars): eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
🔑 Secret available: true
🔑 Secret length: 32
🔑 Secret (first 10 chars): mysecret123...
🔐 JWT Verification - Attempting to verify token
❌ JWT Verification - Failed: {
  error: 'signature verification failed',
  name: 'JWSSignatureVerificationFailed',
  code: undefined
}
🔍 JWT Signature Issue - Possible causes:
  1. Wrong JWT secret
  2. Token was signed with different secret
  3. Token is corrupted or invalid
  4. Token was signed with different algorithm
```

### Debug Endpoint Response:
```json
{
  "success": false,
  "error": "signature verification failed",
  "errorName": "JWSSignatureVerificationFailed",
  "statusCode": 500,
  "requestId": "abc123",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "duration": "3ms",
  "environment": {
    "SHARED_JWT_SECRET_SET": true,
    "SHARED_JWT_SECRET_LENGTH": 32,
    "SHARED_JWT_SECRET_PREFIX": "mysecret123"
  },
  "troubleshooting": {
    "commonIssues": [
      "JWT secret mismatch - check SHARED_JWT_SECRET",
      "Token expired - check exp claim",
      "Wrong algorithm - must be HS256",
      "Missing scope - must have scope: 'render'",
      "Invalid token format - check token structure"
    ],
    "nextSteps": [
      "Verify SHARED_JWT_SECRET matches your Main App",
      "Check token expiration time",
      "Ensure token has correct payload structure",
      "Test with a fresh token"
    ]
  }
}
```

## 🛠️ Common Solutions

### 1. **Wrong JWT Secret**
- **Problem**: `SHARED_JWT_SECRET` doesn't match the secret used to sign the token
- **Solution**: Set the correct secret from your Main App

### 2. **Token Expired**
- **Problem**: JWT token has expired (`exp` claim is in the past)
- **Solution**: Generate a new token with future expiration

### 3. **Wrong Algorithm**
- **Problem**: Token was signed with different algorithm (not HS256)
- **Solution**: Ensure your Main App uses HS256 algorithm

### 4. **Missing Scope**
- **Problem**: JWT payload doesn't have `scope: "render"`
- **Solution**: Include `scope: "render"` in JWT payload

### 5. **Corrupted Token**
- **Problem**: Token is malformed or corrupted
- **Solution**: Generate a fresh token

## 🧪 Test Commands

```bash
# 1. Check environment
curl http://localhost:3000/api/status

# 2. Test JWT debug
curl -X POST http://localhost:3000/api/debug/jwt

# 3. Test with your token
curl -X POST http://localhost:3000/api/debug/jwt \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"

# 4. Test full render (after JWT is fixed)
curl -X POST http://localhost:3000/api/render \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"templateId":"modern-resume","data":{"username":"test"}}'
```

## 📋 Next Steps

1. **Set the correct JWT secret** in your environment
2. **Test the debug endpoint** to verify JWT verification works
3. **Generate a valid JWT token** with the correct secret
4. **Test the render endpoint** with the valid token
5. **Check the detailed logs** for any remaining issues

The enhanced logging will show you exactly what's wrong with the JWT verification process! 🚀
