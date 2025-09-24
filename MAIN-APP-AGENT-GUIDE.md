# 🚀 Main App Agent Guide - Templates App Integration

## 📋 **Overview**

This guide provides the **Main App agent** with all the necessary information to integrate with the **Templates App** for load-balanced portfolio rendering.

## 🏗️ **Architecture**

```
User Request → Main App → Templates App (localhost:3001) → MongoDB → HTML Response
```

## 🔗 **Templates App Connection Details**

### **Base URL**
- **Development**: `http://localhost:3001`
- **Production**: `https://your-templates-app-domain.com`

### **API Key Authentication**
```bash
Authorization: Bearer 85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02
```

## 📡 **API Endpoints**

### **1. Render Portfolio**
```bash
POST /api/render
```

**Request Body:**
```json
{
  "username": "johndoe",
  "templateId": "modern-resume",
  "options": {
    "draft": false,
    "version": "v1"
  }
}
```

**Response:**
```json
{
  "html": "<!DOCTYPE html>...",
  "css": "body { font-family: Inter; }...",
  "meta": {
    "templateId": "modern-resume",
    "version": "v1.0.0",
    "renderedAt": "2024-01-15T10:30:00Z"
  }
}
```

### **2. Get Portfolio Data**
```bash
GET /api/portfolio/{username}
```

**Response:**
```json
{
  "username": "johndoe",
  "templateId": "modern-resume",
  "portfolioData": {
    "personal": { ... },
    "about": { ... },
    "experience": { ... },
    // ... all portfolio data
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

### **3. Update Portfolio**
```bash
PUT /api/portfolio/{username}
```

**Request Body:**
```json
{
  "templateId": "modern-resume",
  "portfolioData": {
    "personal": { ... },
    "about": { ... },
    // ... updated portfolio data
  }
}
```

### **4. Create Portfolio**
```bash
POST /api/portfolios
```

**Request Body:**
```json
{
  "username": "johndoe",
  "templateId": "modern-resume",
  "portfolioData": {
    "personal": { ... },
    "about": { ... },
    // ... portfolio data
  }
}
```

### **5. Delete Portfolio**
```bash
DELETE /api/portfolio/{username}
```

### **6. Database Health Check**
```bash
GET /api/database/health
```

## 🔧 **Main App Implementation**

### **Environment Variables**
```bash
# .env.local
TEMPLATES_API_KEY=85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02
TEMPLATES_APP_URL=http://localhost:3001
```

### **API Route Implementation**
```javascript
// app/api/render-portfolio/route.js
export async function POST(request) {
  try {
    const { username, templateId, options } = await request.json();
    
    // Forward request to Templates App
    const response = await fetch(`${process.env.TEMPLATES_APP_URL}/api/render`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TEMPLATES_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        templateId,
        options
      })
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error: `Templates App error: ${response.status}` }, { status: response.status });
    }

    const result = await response.json();
    
    // Return HTML directly
    return new Response(result.html, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 'public, s-maxage=300'
      }
    });

  } catch (error) {
    console.error("Render portfolio error:", error);
    return NextResponse.json({ error: "Render failed" }, { status: 500 });
  }
}
```

### **Portfolio Route Implementation**
```javascript
// app/portfolio/[username]/page.js
export default async function PortfolioPage({ params }) {
  const { username } = params;
  
  try {
    const response = await fetch(`${process.env.TEMPLATES_APP_URL}/api/render`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.TEMPLATES_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        templateId: "modern-resume" // or get from user preferences
      })
    });

    if (!response.ok) {
      return <div>Error loading portfolio</div>;
    }

    const result = await response.json();
    
    return (
      <div dangerouslySetInnerHTML={{ __html: result.html }} />
    );
  } catch (error) {
    return <div>Error loading portfolio</div>;
  }
}
```

## 🧪 **Testing Commands**

### **Test Templates App Connection**
```bash
curl -X GET http://localhost:3001/api/status \
  -H "Authorization: Bearer 85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02"
```

### **Test Portfolio Rendering**
```bash
curl -X POST http://localhost:3001/api/render \
  -H "Authorization: Bearer 85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02" \
  -H "Content-Type: application/json" \
  -d '{"username": "johndoe", "templateId": "modern-resume"}'
```

### **Test Database Health**
```bash
curl -X GET http://localhost:3001/api/database/health
```

## 📊 **Database Schema**

### **Portfolio Document Structure**
```javascript
{
  "_id": ObjectId("..."),
  "username": "johndoe",
  "templateId": "modern-resume",
  "portfolioData": {
    "personal": {
      "firstName": "John",
      "lastName": "Doe",
      "title": "Full Stack Developer",
      "email": "john@example.com",
      "phone": "+1 (555) 123-4567",
      "location": {
        "city": "San Francisco",
        "state": "CA",
        "country": "USA"
      },
      "social": {
        "linkedin": "https://linkedin.com/in/johndoe",
        "github": "https://github.com/johndoe",
        "portfolio": "https://johndoe.dev"
      }
    },
    "about": {
      "summary": "Experienced developer...",
      "bio": "I'm a dedicated software engineer...",
      "interests": ["Open Source", "Machine Learning"],
      "personalValues": ["Quality", "Collaboration"],
      "funFacts": ["Coffee enthusiast", "Marathon runner"]
    },
    "experience": {
      "jobs": [
        {
          "id": "1",
          "company": "Tech Corp",
          "position": "Senior Full Stack Developer",
          "location": "San Francisco, CA",
          "startDate": "Jan 2022",
          "endDate": "",
          "current": true,
          "description": "Lead development of scalable web applications...",
          "responsibilities": [
            "Architected and built microservices handling 100k+ daily requests",
            "Led a team of 4 developers in building core platform features"
          ],
          "achievements": [
            "Increased application performance by 40%",
            "Reduced bug reports by 60% through comprehensive testing"
          ],
          "technologies": ["React", "Node.js", "TypeScript", "AWS", "Docker"]
        }
      ]
    },
    "education": {
      "degrees": [
        {
          "id": "1",
          "institution": "University of Technology",
          "degree": "Bachelor of Science",
          "field": "Computer Science",
          "grade": "3.8 GPA",
          "startDate": "2016",
          "endDate": "2020",
          "current": false,
          "description": "Focused on software engineering and data structures",
          "courses": ["Data Structures", "Algorithms", "Database Systems"],
          "activities": ["Programming Club President", "Hackathon Winner"],
          "honors": ["Dean's List", "Magna Cum Laude"]
        }
      ]
    },
    "skills": {
      "technical": [
        {
          "category": "Frontend",
          "skills": [
            {
              "name": "React",
              "level": "expert",
              "years": 4,
              "certified": false
            }
          ]
        }
      ],
      "soft": [
        {
          "name": "Leadership",
          "description": "Led multiple development teams",
          "examples": ["Team Lead at Tech Corp"]
        }
      ],
      "languages": [
        {
          "name": "English",
          "proficiency": "native",
          "certification": ""
        }
      ]
    },
    "projects": {
      "items": [
        {
          "id": "1",
          "title": "E-commerce Platform",
          "description": "Full-stack e-commerce solution with payment integration",
          "category": "Web Application",
          "technologies": ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
          "status": "completed",
          "startDate": "2023-01",
          "endDate": "2023-06",
          "links": {
            "live": "https://shop.example.com",
            "github": "https://github.com/johndoe/ecommerce"
          },
          "features": ["Payment Processing", "Inventory Management", "User Analytics"],
          "metrics": {
            "users": "10,000+ active users",
            "performance": "99.9% uptime",
            "impact": "$2M+ in processed transactions"
          }
        }
      ]
    },
    "achievements": {
      "awards": [
        {
          "id": "1",
          "title": "Developer of the Year",
          "organization": "Tech Corp",
          "date": "2023",
          "description": "Recognized for outstanding contributions to platform development"
        }
      ],
      "certifications": [
        {
          "id": "1",
          "name": "AWS Certified Solutions Architect",
          "organization": "Amazon Web Services",
          "issueDate": "2023-03",
          "expiryDate": "2026-03",
          "credentialId": "AWS-SAA-123456",
          "verificationLink": "https://aws.amazon.com/verification/123456"
        }
      ]
    },
    "contact": {
      "email": "john@example.com",
      "phone": "+1 (555) 123-4567",
      "preferredContact": "email",
      "timezone": "PST",
      "availability": "Available for freelance and full-time opportunities"
    },
    "metadata": {
      "title": "John Doe - Full Stack Developer Portfolio",
      "description": "Experienced full-stack developer specializing in React and Node.js",
      "keywords": ["Full Stack Developer", "React", "Node.js", "JavaScript", "Web Development"]
    },
    "theme": {
      "primaryColor": "#3B82F6",
      "secondaryColor": "#1E40AF",
      "accentColor": "#F59E0B",
      "font": "Inter",
      "darkMode": false,
      "animations": true
    }
  },
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

## 🚀 **Deployment Checklist**

### **For Main App:**
- [ ] Set `TEMPLATES_APP_URL` environment variable
- [ ] Set `TEMPLATES_API_KEY` environment variable
- [ ] Implement API proxy routes
- [ ] Test connection to Templates App
- [ ] Test portfolio rendering

### **For Templates App:**
- [x] MongoDB connection configured
- [x] Database API routes implemented
- [x] Portfolio rendering with database integration
- [x] Health check endpoints
- [ ] Test with real portfolio data
- [ ] Deploy to production domain

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **"Portfolio not found"**
   - Check if username exists in database
   - Verify database connection
   - Check API key authentication

2. **"Template not found"**
   - Verify templateId is correct
   - Check template registry
   - Ensure template files exist

3. **"Database connection failed"**
   - Check MONGODB_URI environment variable
   - Verify database permissions
   - Check network connectivity

4. **"API Key verification failed"**
   - Verify API key format
   - Check environment variables
   - Ensure both apps have matching keys

## 📈 **Performance Benefits**

- **Load Balancing**: Templates App handles all rendering
- **Database Efficiency**: Direct MongoDB access
- **Scalability**: Independent scaling of Templates App
- **Caching**: Templates App can implement its own caching
- **Reduced Latency**: Minimal data transfer between apps

This setup provides optimal performance and true load balancing for your portfolio rendering system! 🎉
