# 🚀 Templates App Implementation Guide - Load Balanced Portfolio Architecture

## 📋 **Overview**

This guide provides the complete implementation for the **Templates App** in a load-balanced portfolio rendering system. The **Templates App handles all rendering and database operations**, while the **Main App acts as a lightweight proxy**.

## 🏗️ **New Architecture**

```
User Request → Main App → Templates App → Database → Templates App → HTML Response
```

### **Benefits:**
- ✅ **True Load Balancing**: Templates App handles all heavy rendering
- ✅ **Database Efficiency**: Direct DB access from Templates App
- ✅ **Scalability**: Templates App can be scaled independently
- ✅ **Performance**: Reduced data transfer between apps

## 📁 **File Structure Changes**

### **Files Removed:**
- ❌ `test-schema-fix.js`
- ❌ `sample-portfolio-data.json`
- ❌ `test-api-key.js`
- ❌ `test-quick.js`
- ❌ `test.js`

### **Files Modified:**
- ✅ `app/api/render/route.ts` - Now acts as proxy to Templates App
- ✅ `packages/shared/portfolioSchema.ts` - Added database and API schemas
- ✅ `SCHEMA-INTEGRATION-GUIDE.md` - Updated for localhost

### **Files Created:**
- ✅ `app/api/portfolio/[username]/route.ts` - Database portfolio endpoint

## 🔧 **Implementation Steps**

### **Step 1: Templates App Database Integration**

The Templates App now:
1. **Receives username** from Main App
2. **Fetches portfolio data** directly from shared database
3. **Renders HTML** using the fetched data
4. **Returns HTML** to Main App

### **Step 2: API Request Format**

The Templates App receives **minimal data** from Main App:

```javascript
// API Request to Templates App
{
  "username": "johndoe",
  "templateId": "modern-resume", // optional
  "options": {
    "draft": false,
    "version": "v1"
  }
}
```

### **Step 3: Database Schema**

```javascript
// Database Portfolio Document
{
  "_id": "portfolio_id",
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

## 🗄️ **Database Implementation**

### **Required Database Connection**

You need to implement the `getPortfolioFromDB` function in both:
- `app/api/portfolio/[username]/route.ts`
- `templates-app-render-route.ts`

```javascript
async function getPortfolioFromDB(username: string) {
  // TODO: Implement your database connection
  // Examples:
  
  // MongoDB
  const portfolio = await db.collection('portfolios').findOne({ username });
  
  // PostgreSQL
  const portfolio = await db.query('SELECT * FROM portfolios WHERE username = $1', [username]);
  
  // MySQL
  const portfolio = await db.query('SELECT * FROM portfolios WHERE username = ?', [username]);
  
  return portfolio;
}
```

### **Database Schema**

```sql
-- Example PostgreSQL Schema
CREATE TABLE portfolios (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  template_id VARCHAR(255) NOT NULL,
  portfolio_data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_portfolios_username ON portfolios(username);
```

## 🔄 **API Flow**

### **1. Main App Request**
```bash
POST /api/render
Authorization: Bearer <api_key>
Content-Type: application/json

{
  "username": "johndoe",
  "templateId": "modern-resume"
}
```

### **2. Templates App Processing**
```javascript
// Templates App receives request
const { username, templateId, options } = await req.json();

// Fetch from database
const portfolioData = await getPortfolioFromDB(username);

// Render HTML
const html = await renderComponentToString(Component, { data: portfolioData });

// Return HTML
return new Response(html, { headers: { 'Content-Type': 'text/html' } });
```

### **3. Response**
```html
<!DOCTYPE html>
<html>
<head>
  <title>John Doe - Portfolio</title>
  <style>/* CSS from template */</style>
</head>
<body>
  <!-- Rendered portfolio HTML -->
</body>
</html>
```

## 🛠️ **Environment Variables**

### **Main App (.env.local)**
```bash
TEMPLATES_API_KEY=85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02
TEMPLATES_APP_URL=http://localhost:3001
```

### **Templates App (.env.local)**
```bash
VALID_API_KEYS=85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02,eed0c172295f25a9eb99c7298fc5be2604d5db50ce5f49f729c7942ba50a2f3d
DATABASE_URL=your_database_connection_string
```

## 📋 **Implementation Checklist**

### **For Templates App (This App):**
- [x] Update `app/api/render/route.ts` with database integration
- [ ] Implement `getPortfolioFromDB` function
- [ ] Set up database connection
- [ ] Test portfolio data fetching
- [ ] Test HTML rendering

### **For Database:**
- [ ] Create portfolios table/collection
- [ ] Set up indexes for username
- [ ] Insert sample portfolio data
- [ ] Test database queries

## 🧪 **Testing**

### **Test Main App Proxy**
```bash
curl -X POST http://localhost:3000/api/render \
  -H "Authorization: Bearer 85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02" \
  -H "Content-Type: application/json" \
  -d '{"username": "johndoe", "templateId": "modern-resume"}'
```

### **Test Templates App (This App)**
```bash
curl -X POST http://localhost:3001/api/render \
  -H "Authorization: Bearer 85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02" \
  -H "Content-Type: application/json" \
  -d '{"username": "johndoe", "templateId": "modern-resume"}'
```

## 🚀 **Deployment**

### **Main App Deployment**
- Deploy to your main domain (e.g., `portume.vercel.app`)
- Set `TEMPLATES_APP_URL` to your Templates App URL

### **Templates App Deployment (This App)**
- Deploy to your templates domain (e.g., `templates.portume.com`)
- Set up database connection
- Configure environment variables

## 📊 **Performance Benefits**

- **Reduced Data Transfer**: Only username sent between apps
- **Direct Database Access**: No data serialization/deserialization
- **Independent Scaling**: Templates App can be scaled separately
- **Caching**: Templates App can implement its own caching strategy
- **Load Distribution**: Rendering load is completely offloaded

## 🔍 **Troubleshooting**

### **Common Issues:**

1. **"Portfolio not found"**
   - Check database connection
   - Verify username exists in database
   - Check database query implementation

2. **"Template not found"**
   - Verify templateId is correct
   - Check template registry
   - Ensure template files exist

3. **"API Key verification failed"**
   - Check environment variables
   - Verify API key format
   - Ensure both apps have matching keys

## 📝 **Next Steps**

1. **Implement Database Connection**: Replace mock data with real DB queries
2. **Add Error Handling**: Implement proper error responses
3. **Add Caching**: Implement Redis or similar for performance
4. **Add Monitoring**: Set up logging and metrics
5. **Add Testing**: Create comprehensive test suite

This architecture provides true load balancing and optimal performance for your portfolio rendering system! 🎉
