# Templates App - API Key Authentication Guide

**For Main App Agent**: Complete guide to integrate with the Templates App using simple API key authentication.

## 🏗️ Architecture Overview

**Templates App** is a stateless Next.js App Router service that server-renders portfolio templates and returns HTML/CSS to the Main App. It uses simple API key authentication for secure service-to-service communication.

### Key Principles
- **Stateless**: No database, all data provided by Main App
- **Secure**: API key authentication (simpler than JWT)
- **Fast**: ETag + Cache-Control headers with 304 support
- **Flexible**: Template registry with comprehensive data schema
- **Scalable**: Server-side rendering with Next.js App Router

## 🌐 Domains & Deployment

- **Main App**: `localhost:3000` (development) → `portume.vercel.app` (production)
- **Templates App**: `localhost:3001` (development) → `templates.portume.com` (production)
- **Co-location**: Deploy in same Vercel region for optimal performance

## 🔌 API Endpoints

### 1. POST `/api/render` (Primary Endpoint)
**Purpose**: Render portfolio data into HTML/CSS using specified template

**Authentication**: 
```http
Authorization: Bearer <api-key>
```

**Request Body**:
```json
{
  "templateId": "modern-resume",
  "data": {
    "username": "john_doe",
    "templateId": "modern-resume",
    "portfolioData": {
      "personal": {
        "firstName": "John",
        "lastName": "Doe",
        "email": "john@example.com",
        "title": "Full Stack Developer"
      },
      "projects": {
        "items": [
          {
            "title": "E-commerce Platform",
            "description": "Built with React and Node.js",
            "technologies": ["React", "Node.js", "MongoDB"]
          }
        ]
      }
    }
  },
  "options": {}
}
```

**Response**:
```json
{
  "html": "<div class=\"modern-resume\">...</div>",
  "css": ".modern-resume { font-family: Inter; }",
  "meta": {
    "templateId": "modern-resume",
    "version": "1.0.0",
    "renderedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

**Headers**:
- `ETag`: `"abc123..."` (for caching)
- `Cache-Control`: `public, s-maxage=300, stale-while-revalidate=600`

**304 Support**: Send `If-None-Match: "abc123..."` header to get 304 if content unchanged.

### 2. GET `/api/templates/manifest`
**Purpose**: Get list of available templates

**Response**:
```json
[
  {
    "id": "modern-resume",
    "name": "Modern Resume",
    "version": "1.0.0",
    "description": "Clean, professional resume template",
    "requiredSections": ["personal", "about", "experience"],
    "tags": ["developer", "clean", "professional"]
  }
]
```

### 3. GET `/api/status` (Health Check)
**Purpose**: Service health check and system information

**Response**:
```json
{
  "status": "healthy",
  "service": "Templates App",
  "version": "1.0.0",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "abc123",
  "uptime": "3600s",
  "templates": {
    "count": 2,
    "available": [
      {
        "id": "modern-resume",
        "name": "Modern Resume",
        "version": "1.0.0"
      }
    ]
  },
  "environment": {
    "VALID_API_KEYS": true,
    "VALID_API_KEYS_COUNT": 2,
    "MAIN_API_BASE": true,
    "ALLOWED_ORIGINS": true
  }
}
```

### 4. POST `/api/debug/api-key` (Debug Endpoint)
**Purpose**: Test API key authentication

**Request**:
```http
POST /api/debug/api-key
Authorization: Bearer <your-api-key>
Content-Type: application/json
```

**Response**:
```json
{
  "success": true,
  "message": "API key verification successful",
  "requestId": "abc123",
  "authResult": {
    "apiKey": "85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02",
    "type": "api-key"
  }
}
```

## 🔐 Security & Authentication

### API Key Configuration
**Simple API Key**: Use a shared API key for service-to-service communication

**API Key Requirements**:
- Must be included in `Authorization: Bearer <api-key>` header
- API key must be in the `VALID_API_KEYS` environment variable (comma-separated)

**Token Usage** (in Main App):
```javascript
// Simple API key authentication
const apiKey = process.env.TEMPLATES_API_KEY || 'your-shared-api-key';

const response = await fetch('https://templates.portume.com/api/render', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    templateId: 'modern-resume',
    data: portfolioData
  })
});
```

### Environment Variables
```bash
# Required
VALID_API_KEYS=your-shared-api-key,backup-api-key

# Optional
MAIN_API_BASE=https://portume.vercel.app
ALLOWED_ORIGINS=https://portume.vercel.app,http://localhost:3000
PREVIEW_JWT_SECRET=your-preview-secret
```

## 🔄 Integration Patterns

### Pattern 1: Server-Side Proxy (Recommended)
```javascript
// In your Main App: app/api/render-portfolio/route.js
export async function POST(request) {
  try {
    // 1. Get portfolio data from your database
    const portfolioData = await getPortfolioFromDB(request.body.username);
    
    // 2. Use API key for authentication
    const apiKey = process.env.TEMPLATES_API_KEY;
    
    // 3. Call Templates App
    const response = await fetch('https://templates.portume.com/api/render', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        templateId: portfolioData.templateId,
        data: portfolioData
      })
    });
    
    if (!response.ok) {
      throw new Error(`Templates App error: ${response.status}`);
    }
    
    const result = await response.json();
    
    // 4. Return HTML/CSS to client
    return new Response(result.html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, s-maxage=300',
        'ETag': response.headers.get('ETag')
      }
    });
    
  } catch (error) {
    return new Response('Render failed', { status: 500 });
  }
}
```

## 🚀 Quick Setup

### 1. Generate API Keys
```bash
node setup-env.js
```

### 2. Set Environment Variables

**Templates App (Vercel Environment Variables):**
```bash
VALID_API_KEYS=85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02,eed0c172295f25a9eb99c7298fc5be2604d5db50ce5f49f729c7942ba50a2f3d
MAIN_API_BASE=https://portume.vercel.app
ALLOWED_ORIGINS=https://portume.vercel.app,http://localhost:3000
```

**Main App (.env.local):**
```bash
TEMPLATES_API_KEY=85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02
TEMPLATES_APP_URL=https://templates.portume.com
```

### 3. Deploy and Test
```bash
# Deploy Templates App to Vercel
vercel --prod

# Test the connection
node test-api-key.js
```

## 🧪 Testing

### Test API Key Authentication
```bash
curl -X POST https://templates.portume.com/api/render \
  -H "Authorization: Bearer <your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "modern-resume",
    "data": {
      "username": "test_user",
      "templateId": "modern-resume",
      "portfolioData": {
        "personal": {
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        }
      }
    }
  }'
```

### Test Template Manifest
```bash
curl https://templates.portume.com/api/templates/manifest
```

### Test Health Check
```bash
curl https://templates.portume.com/api/status
```

### Test API Key Debug
```bash
curl -X POST https://templates.portume.com/api/debug/api-key \
  -H "Authorization: Bearer <your-api-key>" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## 📊 Available Templates

### 1. `modern-resume`
**Features**:
- Professional typography with Inter font
- Responsive design (mobile-friendly)
- Skills categorization (technical, frameworks, tools, soft skills)
- Technology tags with styling
- Social links integration
- Comprehensive sections: Personal, About, Skills, Experience, Projects, Education, Achievements

### 2. `minimal-card`
**Features**:
- Lightweight profile card
- Basic styling with border and padding
- Minimal data requirements

## 🔧 Local Development

```bash
# Set environment variables
$env:VALID_API_KEYS="your-api-key-here"
$env:MAIN_API_BASE="http://localhost:3000"

# Start development server (runs on port 3001)
npm run dev

# Test the API
node test-api-key.js
```

## 📁 File Structure

```
templates-app/
├── app/
│   ├── api/
│   │   ├── render/route.ts          # Main rendering endpoint
│   │   ├── templates/manifest/route.ts  # Template list
│   │   ├── render/export/route.ts   # Future PDF/PNG export
│   │   ├── status/route.ts          # Health check
│   │   └── debug/api-key/route.ts   # API key debug
│   └── preview/[username]/page.tsx  # Direct preview page
├── src/
│   ├── lib/
│   │   ├── auth.ts                  # API key verification
│   │   ├── cache.ts                 # ETag & cache headers
│   │   ├── renderer.ts              # Data validation & normalization
│   │   └── server-render.tsx        # SSR utilities
│   └── templates/
│       └── registry.ts              # Template registry
├── templates/
│   ├── modern-resume/               # Professional resume template
│   │   ├── index.tsx
│   │   ├── manifest.json
│   │   └── styles.css
│   └── minimal-card/                # Simple card template
│       ├── index.tsx
│       └── manifest.json
└── packages/shared/
    └── portfolioSchema.ts           # Comprehensive data schema
```

## 🔒 Security Benefits

- **Simple**: No complex JWT payload validation
- **Fast**: Direct string comparison for authentication
- **Flexible**: Multiple API keys supported (comma-separated)
- **Rotatable**: Easy to update API keys without code changes
- **Debuggable**: Clear error messages for authentication issues

## 🛠️ Troubleshooting

### Common Issues
1. **API Key Verification Failed**: Ensure API key is in `VALID_API_KEYS` environment variable
2. **Template Not Found**: Check template registration in `registry.ts`
3. **Data Validation Error**: Verify portfolio data matches schema
4. **Build Errors**: Ensure all imports use correct path aliases

### Debug Mode
Use `/api/debug/api-key` endpoint to test API key authentication.

---

## 🔗 Main App Integration (Quick Reference)

### **Environment Variables**
```bash
# Main App (.env.local)
TEMPLATES_API_KEY=85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02
TEMPLATES_APP_URL=https://templates.portume.com

# Templates App (Vercel Environment Variables)
VALID_API_KEYS=85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02,eed0c172295f25a9eb99c7298fc5be2604d5db50ce5f49f729c7942ba50a2f3d
MAIN_API_BASE=https://portume.vercel.app
ALLOWED_ORIGINS=https://portume.vercel.app,http://localhost:3000
```

### **API Usage**
```javascript
// Render portfolio template
const response = await fetch('https://templates.portume.com/api/render', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${process.env.TEMPLATES_API_KEY}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    templateId: 'modern-resume',
    data: { username: 'user123', portfolioData: {...} }
  })
});

const { html, css } = await response.json();
```

### **Available Templates**
- `modern-resume` - Professional resume template
- `minimal-card` - Simple profile card

### **Endpoints**
- `POST /api/render` - Render templates
- `GET /api/templates/manifest` - List templates
- `GET /api/status` - Health check
- `POST /api/debug/api-key` - Test API key

**Deploy and integrate!** 🚀