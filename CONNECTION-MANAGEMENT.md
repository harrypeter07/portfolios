# Connection Management Guide

**Templates App ↔ Main App Integration**

## 🔗 Overview

The Templates App and Main App communicate using **API Key Authentication** for secure service-to-service communication. This is simpler and more reliable than JWT tokens.

## 🏗️ Architecture

```
Main App (portume.vercel.app)     Templates App (templates.portume.com)
┌─────────────────────────┐     ┌──────────────────────────────┐
│ 1. User requests        │────▶│ 2. API Key Authentication    │
│    portfolio render     │     │    (Bearer token)             │
│                         │     │                               │
│ 3. Send portfolio data  │────▶│ 4. Validate & normalize data │
│    + template ID        │     │                               │
│                         │     │ 5. Render template to HTML    │
│ 6. Return HTML/CSS      │◀────│    + CSS                      │
│    to user              │     │                               │
└─────────────────────────┘     └──────────────────────────────┘
```

## 🔐 Authentication Flow

### 1. API Key Setup
```bash
# Generate API keys
node setup-env.js

# Templates App Environment Variables
VALID_API_KEYS=key1,key2,key3

# Main App Environment Variables  
TEMPLATES_API_KEY=key1
```

### 2. Request Authentication
```javascript
// Main App sends request
const response = await fetch('https://templates.portume.com/api/render', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.TEMPLATES_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    templateId: 'modern-resume',
    data: portfolioData
  })
});
```

### 3. Templates App Verification
```javascript
// Templates App verifies API key
const apiKey = authorization.slice(7); // Remove "Bearer "
const validKeys = process.env.VALID_API_KEYS.split(',');
if (!validKeys.includes(apiKey)) {
  throw new Error('Forbidden');
}
```

## 🌐 Environment Configuration

### Templates App (Vercel Environment Variables)
```bash
# Required - Comma-separated list of valid API keys
VALID_API_KEYS=85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02,eed0c172295f25a9eb99c7298fc5be2604d5db50ce5f49f729c7942ba50a2f3d

# Optional - Main App URL for preview functionality
MAIN_API_BASE=https://portume.vercel.app

# Optional - Allowed origins for CORS
ALLOWED_ORIGINS=https://portume.vercel.app,http://localhost:3000

# Optional - Preview token secret (for /preview routes)
PREVIEW_JWT_SECRET=55124ba78301a150e4e9ee3104b53879d949cc8c457d6dfd0f1be65f2bd84eb1
```

### Main App (.env.local)
```bash
# Required - API key for Templates App communication
TEMPLATES_API_KEY=85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02

# Required - Templates App URL
TEMPLATES_APP_URL=https://templates.portume.com
```

## 🔄 Data Flow

### 1. Portfolio Rendering Request
```javascript
// Main App receives user request
export async function POST(request) {
  // Get portfolio data from database
  const portfolioData = await getPortfolioFromDB(username);
  
  // Call Templates App
  const response = await fetch(`${process.env.TEMPLATES_APP_URL}/api/render`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.TEMPLATES_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      templateId: portfolioData.templateId,
      data: portfolioData
    })
  });
  
  const { html, css } = await response.json();
  
  // Return rendered HTML to user
  return new Response(html, {
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, s-maxage=300',
      'ETag': response.headers.get('ETag')
    }
  });
}
```

### 2. Template Discovery
```javascript
// Main App fetches available templates
const response = await fetch(`${process.env.TEMPLATES_APP_URL}/api/templates/manifest`);
const templates = await response.json();

// Display templates to user
templates.forEach(template => {
  console.log(`${template.name} v${template.version} - ${template.description}`);
});
```

## 🚀 Deployment Steps

### 1. Templates App Deployment
```bash
# Push to GitHub
git add .
git commit -m "Add API key authentication"
git push origin main

# Deploy to Vercel
vercel --prod

# Set environment variables in Vercel Dashboard
# Go to Project Settings → Environment Variables
# Add: VALID_API_KEYS, MAIN_API_BASE, ALLOWED_ORIGINS
```

### 2. Main App Integration
```bash
# Add environment variables to .env.local
echo "TEMPLATES_API_KEY=your-api-key" >> .env.local
echo "TEMPLATES_APP_URL=https://templates.portume.com" >> .env.local

# Create API route for portfolio rendering
# app/api/render-portfolio/route.js
```

### 3. Test Connection
```bash
# Test Templates App health
curl https://templates.portume.com/api/status

# Test API key authentication
curl -X POST https://templates.portume.com/api/debug/api-key \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## 🧪 Testing & Debugging

### Health Check
```bash
curl https://templates.portume.com/api/status
```

**Expected Response:**
```json
{
  "status": "healthy",
  "environment": {
    "VALID_API_KEYS": true,
    "VALID_API_KEYS_COUNT": 2
  }
}
```

### API Key Test
```bash
curl -X POST https://templates.portume.com/api/debug/api-key \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{}'
```

**Expected Response:**
```json
{
  "success": true,
  "message": "API key verification successful",
  "authResult": {
    "apiKey": "your-api-key",
    "type": "api-key"
  }
}
```

### Template Rendering Test
```bash
curl -X POST https://templates.portume.com/api/render \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "modern-resume",
    "data": {
      "username": "test",
      "portfolioData": {
        "personal": {
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    }
  }'
```

## 🔒 Security Features

### API Key Benefits
- **Simple**: No complex JWT payload validation
- **Fast**: Direct string comparison
- **Multiple Keys**: Support for multiple API keys (comma-separated)
- **Rotatable**: Easy to update without code changes
- **Debuggable**: Clear error messages

### Security Best Practices
1. **Rotate Keys**: Regularly update API keys
2. **Environment Variables**: Never hardcode API keys
3. **HTTPS Only**: Always use HTTPS in production
4. **Monitor Usage**: Track API key usage patterns
5. **Backup Keys**: Keep backup API keys for emergencies

## 🛠️ Troubleshooting

### Common Issues

#### 1. API Key Verification Failed
**Error**: `Forbidden`
**Solution**: 
- Check API key is in `VALID_API_KEYS` environment variable
- Verify API key format: `Bearer <api-key>`
- Ensure no extra spaces in environment variable

#### 2. Templates App Not Responding
**Error**: `Connection refused`
**Solution**:
- Check Templates App is deployed and running
- Verify `TEMPLATES_APP_URL` is correct
- Test health endpoint: `/api/status`

#### 3. Template Not Found
**Error**: `Template not found`
**Solution**:
- Check template ID is correct
- Verify template is registered in `registry.ts`
- Test manifest endpoint: `/api/templates/manifest`

#### 4. Data Validation Error
**Error**: `Data validation failed`
**Solution**:
- Check portfolio data structure matches schema
- Verify required fields are present
- Use `normalizePortfolioData` helper for fallbacks

### Debug Commands
```bash
# Check Templates App health
curl https://templates.portume.com/api/status

# Test API key
curl -X POST https://templates.portume.com/api/debug/api-key \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{}'

# List available templates
curl https://templates.portume.com/api/templates/manifest

# Test local development
node test-api-key.js
```

## 📊 Monitoring

### Key Metrics
- **Response Time**: Track API response times
- **Error Rate**: Monitor authentication failures
- **Template Usage**: Track which templates are used most
- **Cache Hit Rate**: Monitor ETag caching effectiveness

### Logs
All API endpoints include comprehensive logging:
- Request IDs for tracking
- Performance metrics
- Error details with stack traces
- Authentication status

## 🔄 Maintenance

### Regular Tasks
1. **Monitor Health**: Check `/api/status` regularly
2. **Rotate Keys**: Update API keys monthly
3. **Update Templates**: Add new portfolio templates
4. **Performance Review**: Monitor response times
5. **Security Audit**: Review access patterns

### Emergency Procedures
1. **API Key Compromise**: Immediately rotate all API keys
2. **Service Down**: Check Vercel deployment status
3. **High Error Rate**: Review logs and fix issues
4. **Performance Issues**: Check template complexity

---

## ✅ Quick Checklist

- [ ] Templates App deployed to Vercel
- [ ] Environment variables set in Vercel Dashboard
- [ ] Main App has `TEMPLATES_API_KEY` and `TEMPLATES_APP_URL`
- [ ] API key authentication working (`/api/debug/api-key`)
- [ ] Template rendering working (`/api/render`)
- [ ] Health check passing (`/api/status`)
- [ ] Templates manifest accessible (`/api/templates/manifest`)

**Connection established!** 🚀
