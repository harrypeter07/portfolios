// Test script to verify schema fixes
const testData = {
  templateId: "modern-resume",
  data: {
    personal: {
      firstName: "John",
      lastName: "Doe",
      title: "Full Stack Developer",
      email: "john@example.com"
    },
    about: {
      summary: "Experienced developer with 5+ years of experience"
    },
    experience: {
      jobs: []
    },
    education: {
      degrees: []
    },
    skills: {
      technical: [],
      soft: [],
      languages: []
    },
    projects: {
      items: []
    },
    achievements: {
      awards: [],
      certifications: [],
      publications: [],
      patents: []
    },
    contact: {
      email: "john@example.com"
    }
  }
};

// Test the API endpoint
async function testAPI() {
  try {
    const response = await fetch('http://localhost:3001/api/render', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer 85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ API test successful!');
      console.log('HTML length:', result.html?.length || 0);
      console.log('Template ID:', result.meta?.templateId);
    } else {
      const error = await response.text();
      console.log('❌ API test failed:', response.status, error);
    }
  } catch (error) {
    console.log('❌ Test error:', error.message);
  }
}

console.log('🧪 Testing schema fixes...');
testAPI();
