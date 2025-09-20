# Templates App - Architecture & Integration Guide

**For Main App Agent**: Complete guide to integrate with the Templates App for portfolio rendering.

## 🏗️ Architecture Overview

**Templates App** is a stateless Next.js App Router service that server-renders portfolio templates and returns HTML/CSS to the Main App. It's designed for high performance with JWT security, ETag caching, and comprehensive portfolio data handling.

### Key Principles
- **Stateless**: No database, all data provided by Main App
- **Secure**: Service-to-service JWT authentication
- **Fast**: ETag + Cache-Control headers with 304 support
- **Flexible**: Template registry with comprehensive data schema
- **Scalable**: Server-side rendering with Next.js App Router

## 🌐 Domains & Deployment

- **Main App**: `portume.vercel.app`
- **Templates App**: `templates.portume.com` (deploy on Vercel)
- **Co-location**: Deploy in same Vercel region for optimal performance

## 🔌 API Endpoints

### 1. POST `/api/render` (Primary Endpoint)
**Purpose**: Render portfolio data into HTML/CSS using specified template

**Authentication**: 
```http
Authorization: Bearer <jwt>
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

**Logging**: Comprehensive request tracking with unique request IDs, timing, and error details.

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

**Headers**:
- `Cache-Control`: `public, s-maxage=86400`
- `X-Request-ID`: Unique request identifier
- `X-Response-Time`: Response time in milliseconds

**Logging**: Template count and list logging with performance metrics.

### 3. POST `/api/render/export` (Future Feature)
**Purpose**: Export rendered portfolios to PDF/PNG (not yet implemented)

**Response**:
```json
{
  "error": "Export functionality not implemented",
  "message": "PDF/PNG export will be available in a future update",
  "requestId": "abc123",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Status**: 501 Not Implemented

**Logging**: Request details logged for future implementation planning.

### 4. GET `/api/status` (Health Check)
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
    "SHARED_JWT_SECRET": true,
    "MAIN_API_BASE": true,
    "ALLOWED_ORIGINS": true,
    "PREVIEW_JWT_SECRET": false
  },
  "system": {
    "nodeVersion": "v18.17.0",
    "platform": "linux",
    "uptime": 3600,
    "memoryUsage": {...},
    "environment": "production"
  },
  "endpoints": {
    "render": "POST /api/render",
    "manifest": "GET /api/templates/manifest",
    "export": "POST /api/render/export (501 - Not implemented)",
    "preview": "GET /preview/[username]",
    "status": "GET /api/status"
  }
}
```

**Logging**: System health monitoring with environment and performance metrics.

### 5. GET `/preview/[username]` (Optional)
**Purpose**: Direct preview with signed token (for edge rewrites)

**URL**: `https://templates.portume.com/preview/john_doe?token=<signed_jwt>`

**Returns**: Full HTML page with embedded CSS

**Logging**: Complete preview request tracking with error handling and performance metrics.

## 🔐 Security & Authentication

### JWT Configuration
**Shared Secret**: Use your Main App's existing JWT secret for `SHARED_JWT_SECRET`

**JWT Payload Requirements**:
```json
{
  "scope": "render",
  "exp": 1642234567,
  "iat": 1642234267
}
```

**Token Creation** (in Main App):
```javascript
import { SignJWT } from 'jose';

const jwt = await new SignJWT({ scope: "render" })
  .setProtectedHeader({ alg: "HS256" })
  .setIssuedAt()
  .setExpirationTime("5m")
  .sign(new TextEncoder().encode(process.env.JWT_SECRET));
```

### Environment Variables
```bash
# Required
SHARED_JWT_SECRET=your-main-app-jwt-secret

# Optional
MAIN_API_BASE=https://portume.vercel.app
ALLOWED_ORIGINS=https://portume.vercel.app
PREVIEW_JWT_SECRET=your-preview-secret  # can reuse SHARED_JWT_SECRET
```

## 📊 Data Schema & Validation

### Portfolio Data Structure
The Templates App uses a comprehensive Zod schema that handles all portfolio sections with smart fallbacks:

```typescript
interface PortfolioData {
  personal?: {
    firstName?: string;
    lastName?: string;
    title?: string;
    subtitle?: string;
    tagline?: string;
    email?: string;
    phone?: string;
    location?: { city?: string; state?: string; country?: string };
    social?: {
      linkedin?: string;
      github?: string;
      twitter?: string;
      website?: string;
      instagram?: string;
      facebook?: string;
    };
  };
  about?: {
    summary?: string;
    interests?: string[];
    values?: string[];
    funFacts?: string[];
  };
  projects?: {
    items?: Array<{
      title?: string;
      name?: string;  // fallback for title
      description?: string;
      technologies?: string[];
      links?: {
        live?: string;
        github?: string;
        demo?: string;
      };
      url?: string;  // fallback for links.live
      github?: string;  // fallback for links.github
    }>;
  };
  skills?: {
    technical?: string[];
    soft?: string[];
    languages?: string[];
    tools?: string[];
    frameworks?: string[];
    databases?: string[];
  };
  experience?: {
    jobs?: Array<{
      position?: string;
      title?: string;  // fallback for position
      company?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      duration?: string;  // auto-computed if not provided
      description?: string;
      technologies?: string[];
      achievements?: string[];
      current?: boolean;
    }>;
  };
  education?: {
    degrees?: Array<{
      degree?: string;
      field?: string;
      institution?: string;
      location?: string;
      startDate?: string;
      endDate?: string;
      year?: string;  // auto-computed if not provided
      grade?: string;
      gpa?: string;
      honors?: string[];
      relevantCoursework?: string[];
    }>;
  };
  achievements?: {
    awards?: string[];
    certifications?: string[];
    publications?: string[];
    recognitions?: string[];
  };
  contact?: {
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
}
```

### Data Normalization
The app automatically handles fallbacks:
- `title` OR `name` for project names
- `position` OR `title` for job titles
- `links.live` OR `url` for project URLs
- Auto-computes `duration` from `startDate`/`endDate`
- Combines `firstName` + `lastName` into `fullName`

## 🎨 Available Templates

### 1. `modern-resume`
**Features**:
- Professional typography with Inter font
- Responsive design (mobile-friendly)
- Skills categorization (technical, frameworks, tools, soft skills)
- Technology tags with styling
- Social links integration
- Comprehensive sections: Personal, About, Skills, Experience, Projects, Education, Achievements

**CSS**: Embedded critical CSS for optimal performance

### 2. `minimal-card`
**Features**:
- Lightweight profile card
- Basic styling with border and padding
- Minimal data requirements

## 🔄 Integration Patterns

### Pattern 1: Server-Side Proxy (Recommended)
```javascript
// In your Main App: app/api/render-portfolio/route.js
export async function POST(request) {
  try {
    // 1. Get portfolio data from your database
    const portfolioData = await getPortfolioFromDB(request.body.username);
    
    // 2. Create JWT token
    const jwt = await new SignJWT({ scope: "render" })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("5m")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET));
    
    // 3. Call Templates App
    const response = await fetch('https://templates.portume.com/api/render', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${jwt}`,
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

### Pattern 2: Edge Rewrite (Alternative)
```javascript
// In your Main App: middleware.js
export function middleware(request) {
  if (request.nextUrl.pathname.startsWith('/portfolio/')) {
    const username = request.nextUrl.pathname.split('/')[2];
    
    // Create signed preview URL
    const token = createPreviewToken(username);
    const previewUrl = `https://templates.portume.com/preview/${username}?token=${token}`;
    
    return NextResponse.rewrite(previewUrl);
  }
}
```

## 🚀 Deployment Checklist

### Templates App Deployment
1. **Push to GitHub**: Ensure all code is committed
2. **Deploy on Vercel**: 
   - Connect GitHub repository
   - Set domain as `templates.portume.com`
   - Configure environment variables
3. **Environment Variables**:
   ```bash
   SHARED_JWT_SECRET=your-main-app-jwt-secret
   MAIN_API_BASE=https://portume.vercel.app
   ALLOWED_ORIGINS=https://portume.vercel.app
   ```

### Main App Integration
1. **Add API Route**: Create `/api/render-portfolio/route.js`
2. **Update Portfolio Pages**: Use the new API route
3. **Test Integration**: Verify JWT creation and Templates App communication
4. **Monitor Performance**: Check ETag caching and response times

## 🧪 Testing

### Test Template Rendering
```bash
curl -X POST https://templates.portume.com/api/render \
  -H "Authorization: Bearer <your-jwt>" \
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

### Test Export Endpoint (Future Feature)
```bash
curl -X POST https://templates.portume.com/api/render/export \
  -H "Authorization: Bearer <your-jwt>" \
  -H "Content-Type: application/json" \
  -d '{
    "templateId": "modern-resume",
    "format": "pdf",
    "data": {...}
  }'
```

## 📊 Monitoring & Logging

### Request Tracking
All API endpoints include comprehensive logging with:
- **Unique Request IDs**: Each request gets a unique identifier for tracking
- **Performance Metrics**: Response times and duration logging
- **Error Tracking**: Detailed error logging with stack traces
- **Request Details**: Template IDs, usernames, and operation types

### Log Format
```
[abc123] POST /api/render - Starting render request
[abc123] JWT verification successful
[abc123] Template ID: modern-resume, Username: john_doe
[abc123] Data validation successful
[abc123] Template found: Modern Resume v1.0.0
[abc123] Component rendered successfully, HTML length: 15420
[abc123] Render completed successfully in 245ms
```

### Health Monitoring
Use `/api/status` endpoint for:
- Service health checks
- Environment variable validation
- Template availability
- System performance metrics
- Memory usage monitoring

### Error Handling
All endpoints return structured error responses:
```json
{
  "error": "Template not found",
  "requestId": "abc123",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## 🔧 Environment Variables Setup

### Required Environment Variables
```bash
# JWT Secret (MUST match your Main App's JWT secret)
SHARED_JWT_SECRET=331c5e6ffa9f43ddc90044901c2559a47327052985024d1624b2bc98fd0c1e3a

# Main App API Base URL
MAIN_API_BASE=https://portume.vercel.app

# Allowed Origins (comma-separated)
ALLOWED_ORIGINS=https://portume.vercel.app,http://localhost:3001

# Preview JWT Secret (can use same as SHARED_JWT_SECRET)
PREVIEW_JWT_SECRET=331c5e6ffa9f43ddc90044901c2559a47327052985024d1624b2bc98fd0c1e3a
```

### Quick Setup
```bash
# Generate new JWT secret
node setup-env.js

# Copy the generated environment variables
# Set them in Vercel Dashboard (Templates App)
# Set them in your Main App (.env.local)
```

### Vercel Deployment
1. **Set Environment Variables** in Vercel Dashboard:
   - Go to your project settings
   - Navigate to Environment Variables
   - Add all required variables above

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Verify Deployment**:
   ```bash
   curl https://templates.portume.com/api/status
   ```

### Local Development
```bash
# Set environment variables
$env:SHARED_JWT_SECRET="your_shared_jwt_secret_here"
$env:MAIN_API_BASE="https://portume.vercel.app"

# Start development server
npm run dev

# Test the API
node test-quick.js
```

## 📁 File Structure

```
templates-app/
├── app/
│   ├── api/
│   │   ├── render/route.ts          # Main rendering endpoint
│   │   ├── templates/manifest/route.ts  # Template list
│   │   └── render/export/route.ts   # Future PDF/PNG export
│   └── preview/[username]/page.tsx  # Direct preview page
├── src/
│   ├── lib/
│   │   ├── auth.ts                  # JWT verification
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

## 🔧 Adding New Templates

1. **Create Template Folder**: `templates/<template-id>/`
2. **Add Component**: `index.tsx` with default export and optional `css`
3. **Add Manifest**: `manifest.json` with metadata
4. **Register Template**: Update `src/templates/registry.ts`
5. **Test**: Use `/api/render` endpoint

## 📈 Performance Features

- **ETag Caching**: Automatic cache invalidation on data changes
- **304 Responses**: Efficient handling of unchanged content
- **CDN Ready**: Cache-Control headers for edge caching
- **Server-Side Rendering**: No client JavaScript required
- **Dynamic Imports**: Optimized bundle splitting

## 🛠️ Troubleshooting

### Common Issues
1. **JWT Verification Failed**: Ensure `SHARED_JWT_SECRET` matches Main App
2. **Template Not Found**: Check template registration in `registry.ts`
3. **Data Validation Error**: Verify portfolio data matches schema
4. **Build Errors**: Ensure all imports use correct path aliases

### Debug Mode
Set `NODE_ENV=development` for detailed error messages.

## 🔗 Integration Status

**✅ INTEGRATION COMPLETE**: The Main App has been successfully integrated with the Templates App for seamless template sharing and rendering.

### Main App Integration Features:
- **Template Discovery**: Automatically fetches and displays remote templates
- **Enhanced API Routes**: 
  - `GET /api/templates/manifest` - Fetches available templates from Templates App
  - `POST /api/render-portfolio` - Renders portfolios using Templates App
  - `GET /api/render-portfolio?username=<username>` - Alternative render endpoint
- **Templates Demo Page**: Enhanced with remote templates section
- **Error Handling**: Graceful fallback when Templates App is unavailable
- **Visual Indicators**: Version numbers, tags, and source identification
- **Preview Links**: Direct access to template previews

### Current Setup:
- **Main App**: `localhost:3000` (portfolio app)
- **Templates App**: `localhost:3001` (templates service)
- **Production URLs**: 
  - Main App: `portume.vercel.app`
  - Templates App: `templates.portume.com`

### Environment Variables (Both Apps):
```bash
# Main App
JWT_SECRET=your-super-secret-jwt-key-here
SHARED_JWT_SECRET=your-super-secret-jwt-key-here
TEMPLATES_BASE_URL=https://templates.portume.com  # Production
# TEMPLATES_BASE_URL=http://localhost:3001  # Local testing

# Templates App
SHARED_JWT_SECRET=your-super-secret-jwt-key-here  # Must match Main App
MAIN_API_BASE=https://portume.vercel.app
ALLOWED_ORIGINS=https://portume.vercel.app
```

### Available Templates:
- **`modern-resume`**: Professional resume with comprehensive sections
- **`minimal-card`**: Lightweight profile card template

---

**🚀 READY FOR PRODUCTION**: The Templates App is fully implemented, tested, and integrated. Both apps are working together seamlessly with template discovery, rendering, and preview functionality.

---

## 🔗 Main App Integration (Quick Reference)

### **Environment Variables**
```bash
# Main App (.env.local)
JWT_SECRET=331c5e6ffa9f43ddc90044901c2559a47327052985024d1624b2bc98fd0c1e3a
TEMPLATES_APP_URL=https://templates.portume.com

# Templates App (Vercel Environment Variables)
SHARED_JWT_SECRET=331c5e6ffa9f43ddc90044901c2559a47327052985024d1624b2bc98fd0c1e3a
MAIN_API_BASE=https://portume.vercel.app
ALLOWED_ORIGINS=https://portume.vercel.app
```

### **API Usage**
```javascript
// Render portfolio template
const response = await fetch('https://templates.portume.com/api/render', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${jwt.sign({scope: 'render'}, JWT_SECRET)}`,
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

**Deploy and integrate!** 🚀
