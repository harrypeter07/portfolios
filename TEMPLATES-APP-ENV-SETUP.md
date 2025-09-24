# 🔧 Templates App Environment Setup

## 📋 **Required Environment Variables**

### **MongoDB Connection**
```bash
# .env.local
MONGODB_URI=mongodb://localhost:27017/portfolios
# OR for MongoDB Atlas:
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolios?retryWrites=true&w=majority

# Optional: Database name (defaults to 'portfolios')
MONGODB_DATABASE=portfolios
```

### **API Authentication**
```bash
# .env.local
VALID_API_KEYS=85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02,eed0c172295f25a9eb99c7298fc5be2604d5db50ce5f49f729c7942ba50a2f3d
```

### **App Configuration**
```bash
# .env.local
NODE_ENV=development
PORT=3001
```

## 🗄️ **MongoDB Setup**

### **1. Local MongoDB**
```bash
# Install MongoDB locally
# Start MongoDB service
mongod

# Create database and collection
mongo
use portfolios
db.portfolios.createIndex({ "username": 1 }, { unique: true })
```

### **2. MongoDB Atlas (Cloud)**
1. Create account at [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a new cluster
3. Get connection string
4. Set `MONGODB_URI` environment variable

### **3. Sample Data Insertion**
```javascript
// Insert sample portfolio data
db.portfolios.insertOne({
  username: "johndoe",
  templateId: "modern-resume",
  portfolioData: {
    personal: {
      firstName: "John",
      lastName: "Doe",
      title: "Full Stack Developer",
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      location: {
        city: "San Francisco",
        state: "CA",
        country: "USA"
      },
      social: {
        linkedin: "https://linkedin.com/in/johndoe",
        github: "https://github.com/johndoe",
        portfolio: "https://johndoe.dev"
      }
    },
    about: {
      summary: "Experienced full-stack developer with 5+ years building web applications using modern technologies.",
      bio: "I'm a dedicated software engineer who loves solving complex problems and building products that make a difference.",
      interests: ["Open Source", "Machine Learning", "Web Performance"],
      personalValues: ["Quality", "Collaboration", "Continuous Learning"],
      funFacts: ["Coffee enthusiast", "Marathon runner", "Tech blogger"]
    },
    experience: {
      jobs: [
        {
          id: "1",
          company: "Tech Corp",
          position: "Senior Full Stack Developer",
          location: "San Francisco, CA",
          startDate: "Jan 2022",
          endDate: "",
          current: true,
          description: "Lead development of scalable web applications using React and Node.js.",
          responsibilities: [
            "Architected and built microservices handling 100k+ daily requests",
            "Led a team of 4 developers in building core platform features",
            "Implemented CI/CD pipelines reducing deployment time by 70%"
          ],
          achievements: [
            "Increased application performance by 40%",
            "Reduced bug reports by 60% through comprehensive testing"
          ],
          technologies: ["React", "Node.js", "TypeScript", "AWS", "Docker"]
        }
      ]
    },
    education: {
      degrees: [
        {
          id: "1",
          institution: "University of Technology",
          degree: "Bachelor of Science",
          field: "Computer Science",
          grade: "3.8 GPA",
          startDate: "2016",
          endDate: "2020",
          current: false,
          description: "Focused on software engineering and data structures",
          courses: ["Data Structures", "Algorithms", "Database Systems"],
          activities: ["Programming Club President", "Hackathon Winner"],
          honors: ["Dean's List", "Magna Cum Laude"]
        }
      ]
    },
    skills: {
      technical: [
        {
          category: "Frontend",
          skills: [
            {
              name: "React",
              level: "expert",
              years: 4,
              certified: false
            },
            {
              name: "JavaScript",
              level: "expert",
              years: 5,
              certified: false
            }
          ]
        },
        {
          category: "Backend",
          skills: [
            {
              name: "Node.js",
              level: "expert",
              years: 4,
              certified: false
            }
          ]
        }
      ],
      soft: [
        {
          name: "Leadership",
          description: "Led multiple development teams",
          examples: ["Team Lead at Tech Corp"]
        },
        {
          name: "Communication",
          description: "Excellent presentation and writing skills",
          examples: ["Tech talks", "Documentation"]
        }
      ],
      languages: [
        {
          name: "English",
          proficiency: "native",
          certification: ""
        },
        {
          name: "Spanish",
          proficiency: "conversational",
          certification: ""
        }
      ]
    },
    projects: {
      items: [
        {
          id: "1",
          title: "E-commerce Platform",
          description: "Full-stack e-commerce solution with payment integration",
          longDescription: "Built a complete e-commerce platform handling thousands of transactions daily. Implemented real-time inventory management, payment processing with Stripe, and comprehensive admin dashboard.",
          category: "Web Application",
          tags: ["E-commerce", "Full-stack", "Payments"],
          technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
          status: "completed",
          startDate: "2023-01",
          endDate: "2023-06",
          links: {
            live: "https://shop.example.com",
            github: "https://github.com/johndoe/ecommerce",
            demo: "https://demo.shop.example.com"
          },
          features: ["Payment Processing", "Inventory Management", "User Analytics", "Admin Dashboard"],
          challenges: ["Scaling to handle high traffic", "Real-time inventory updates", "Payment security"],
          learnings: ["Microservices architecture", "Payment security best practices", "Performance optimization"],
          teamSize: 3,
          role: "Lead Developer",
          client: "Retail Corp",
          metrics: {
            users: "10,000+ active users",
            performance: "99.9% uptime",
            impact: "$2M+ in processed transactions"
          },
          testimonial: {
            text: "John delivered an exceptional e-commerce platform that exceeded our expectations. The performance and user experience are outstanding.",
            author: "Sarah Johnson",
            title: "CTO, Retail Corp"
          }
        }
      ]
    },
    achievements: {
      awards: [
        {
          id: "1",
          title: "Developer of the Year",
          organization: "Tech Corp",
          date: "2023",
          description: "Recognized for outstanding contributions to platform development and team leadership",
          category: "recognition"
        }
      ],
      certifications: [
        {
          id: "1",
          name: "AWS Certified Solutions Architect",
          organization: "Amazon Web Services",
          issueDate: "2023-03",
          expiryDate: "2026-03",
          credentialId: "AWS-SAA-123456",
          verificationLink: "https://aws.amazon.com/verification/123456",
          skills: ["Cloud Architecture", "AWS Services", "Security"]
        }
      ],
      publications: [
        {
          id: "1",
          title: "Building Scalable React Applications",
          type: "article",
          publisher: "Medium",
          date: "2023-05",
          description: "Comprehensive guide on architecting large-scale React applications with best practices",
          link: "https://medium.com/@johndoe/building-scalable-react",
          citations: 150
        }
      ]
    },
    contact: {
      email: "john@example.com",
      phone: "+1 (555) 123-4567",
      preferredContact: "email",
      timezone: "PST",
      availability: "Available for freelance and full-time opportunities",
      rates: {
        hourly: "$75-100",
        project: "Varies by scope",
        retainer: "Available"
      },
      services: ["Web Development", "Technical Consulting", "Code Reviews"],
      workingHours: "9 AM - 5 PM PST",
      responseTime: "Within 24 hours"
    },
    metadata: {
      title: "John Doe - Full Stack Developer Portfolio",
      description: "Experienced full-stack developer specializing in React and Node.js",
      keywords: ["Full Stack Developer", "React", "Node.js", "JavaScript", "Web Development"],
      canonicalUrl: "https://johndoe.dev"
    },
    theme: {
      primaryColor: "#3B82F6",
      secondaryColor: "#1E40AF",
      accentColor: "#F59E0B",
      backgroundColor: "#FFFFFF",
      textColor: "#1F2937",
      font: "Inter",
      darkMode: false,
      animations: true,
      layout: "modern"
    },
    analytics: {
      googleAnalytics: "",
      googleTagManager: "",
      customEvents: []
    }
  },
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
});
```

## 🧪 **Testing Commands**

### **Test Database Connection**
```bash
curl -X GET http://localhost:3001/api/database/health
```

### **Test Portfolio Rendering**
```bash
curl -X POST http://localhost:3001/api/render \
  -H "Authorization: Bearer 85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02" \
  -H "Content-Type: application/json" \
  -d '{"username": "johndoe", "templateId": "modern-resume"}'
```

### **Test Portfolio Data Fetching**
```bash
curl -X GET http://localhost:3001/api/portfolio/johndoe \
  -H "Authorization: Bearer 85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02"
```

## 🚀 **Deployment**

### **Vercel Deployment**
1. Set environment variables in Vercel dashboard
2. Deploy to your templates domain
3. Test production endpoints

### **Environment Variables for Production**
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/portfolios?retryWrites=true&w=majority
VALID_API_KEYS=85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02,eed0c172295f25a9eb99c7298fc5be2604d5db50ce5f49f729c7942ba50a2f3d
NODE_ENV=production
```

This setup provides a complete MongoDB-integrated Templates App ready for production! 🎉

