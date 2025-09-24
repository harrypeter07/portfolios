#!/usr/bin/env node

const API_BASE = process.env.API_BASE || 'http://localhost:3001';
const API_KEY = process.env.API_KEY || '85af0b404444140bc4573c07a30ca9e6537125fce1b89ffb721aed3e94a24e02';

const headers = {
	'Authorization': `Bearer ${API_KEY}`,
	'Content-Type': 'application/json'
};

// Sample portfolio data
const samplePortfolioData = {
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
			}
		],
		soft: [
			{
				name: "Leadership",
				description: "Led multiple development teams",
				examples: ["Team Lead at Tech Corp"]
			}
		],
		languages: [
			{
				name: "English",
				proficiency: "native",
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
				category: "Web Application",
				technologies: ["React", "Node.js", "MongoDB", "Stripe", "AWS"],
				status: "completed",
				startDate: "2023-01",
				endDate: "2023-06",
				links: {
					live: "https://shop.example.com",
					github: "https://github.com/johndoe/ecommerce"
				},
				features: ["Payment Processing", "Inventory Management", "User Analytics"],
				metrics: {
					users: "10,000+ active users",
					performance: "99.9% uptime",
					impact: "$2M+ in processed transactions"
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
				description: "Recognized for outstanding contributions to platform development"
			}
		],
		certifications: [
			{
				id: "1",
				name: "AWS Certified Solutions Architect",
				organization: "Amazon Web Services",
				issueDate: "2023-03",
				expiryDate: "2026-03",
				credentialId: "AWS-SAA-123456"
			}
		]
	},
	contact: {
		email: "john@example.com",
		phone: "+1 (555) 123-4567",
		preferredContact: "email",
		timezone: "PST",
		availability: "Available for freelance and full-time opportunities"
	},
	metadata: {
		title: "John Doe - Full Stack Developer Portfolio",
		description: "Experienced full-stack developer specializing in React and Node.js",
		keywords: ["Full Stack Developer", "React", "Node.js", "JavaScript", "Web Development"]
	},
	theme: {
		primaryColor: "#3B82F6",
		secondaryColor: "#1E40AF",
		accentColor: "#F59E0B",
		font: "Inter",
		darkMode: false,
		animations: true
	}
};

async function testEndpoint(url, method = 'GET', body = null) {
	try {
		const options = {
			method,
			headers,
			...(body && { body: JSON.stringify(body) })
		};

		console.log(`\n🧪 Testing ${method} ${url}`);
		const response = await fetch(`${API_BASE}${url}`, options);
		const contentType = response.headers.get('content-type') || '';
		let data;
		if (contentType.includes('application/json')) {
			data = await response.json();
		} else {
			const text = await response.text();
			console.log(`⚠ Non-JSON response (status ${response.status}):`);
			console.log(text.slice(0, 400));
			return null;
		}

		if (response.ok) {
			console.log(`✅ Success (${response.status}):`, {
				success: data.success,
				count: data.count,
				templateId: data.templateId,
				username: data.username,
				previewUrl: data.previewUrl,
				portfolioUrl: data.portfolioUrl
			});
			return data;
		} else {
			console.log(`❌ Error (${response.status}):`, data);
			return null;
		}
	} catch (error) {
		console.log(`❌ Network Error:`, error.message);
		return null;
	}
}

async function runTests() {
	console.log('🚀 Starting Template Flow Tests');
	console.log(`📡 API Base: ${API_BASE}`);
	console.log(`🔑 API Key: ${API_KEY.substring(0, 10)}...`);

	// Pre-flight: Status check (helps surface server/env errors)
	console.log('\n🩺 Pre-flight: Status endpoint');
	await testEndpoint('/api/status');

	// Test 1: Get Templates
	console.log('\n📋 Test 1: Fetching Templates');
	const templates = await testEndpoint('/api/templates');
	if (!templates) return;

	// Test 2: Create Preview
	console.log('\n🔍 Test 2: Creating Template Preview');
	const preview = await testEndpoint('/api/templates/preview', 'POST', {
		templateId: 'modern-resume',
		portfolioData: samplePortfolioData,
		options: { preview: true, version: 'v1' }
	});
	if (!preview) return;

	// Test 3: Publish Portfolio
	console.log('\n📤 Test 3: Publishing Portfolio');
	const publish = await testEndpoint('/api/templates/publish', 'POST', {
		username: 'testuser',
		templateId: 'modern-resume',
		templateName: 'Modern Resume',
		templateType: 'component',
		templateSource: 'local',
		isRemoteTemplate: false,
		portfolioData: samplePortfolioData,
		layout: {},
		options: { publish: true, version: 'v1' }
	});
	if (!publish) return;

	// Test 4: Direct Portfolio Access
	console.log('\n👤 Test 4: Direct Portfolio Access');
	console.log(`🌐 Portfolio URL: ${API_BASE}/portfolio/testuser`);
	console.log(`🔗 Preview URL: ${preview.fullPreviewUrl}`);

	// Test 5: API Portfolio Render
	console.log('\n⚙️ Test 5: API Portfolio Render');
	const render = await testEndpoint('/api/portfolio/render/testuser');
	if (render) {
		console.log('✅ Portfolio rendered successfully via API');
	}

	console.log('\n🎉 All tests completed!');
	console.log('\n📊 Summary:');
	console.log(`- Templates available: ${templates.count}`);
	console.log(`- Preview created: ${preview.previewUrl}`);
	console.log(`- Portfolio published: ${publish.portfolioUrl}`);
	console.log(`- Direct access: ${API_BASE}/portfolio/testuser`);
}

// Run tests
runTests().catch(console.error);
