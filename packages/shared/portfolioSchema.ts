import { z } from "zod";

// Social links schema with comprehensive platform support
const socialSchema = z.object({
	linkedin: z.string().optional(),
	github: z.string().optional(),
	portfolio: z.string().optional(),
	twitter: z.string().optional(),
	instagram: z.string().optional(),
	behance: z.string().optional(),
	dribbble: z.string().optional(),
	medium: z.string().optional(),
	youtube: z.string().optional()
}).optional();

// Location schema
const locationSchema = z.object({
	city: z.string().optional(),
	state: z.string().optional(),
	country: z.string().optional()
}).optional();

// Personal information schema
const personalSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	title: z.string().optional(),
	subtitle: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	location: locationSchema,
	social: socialSchema,
	avatar: z.string().optional(),
	tagline: z.string().optional(),
	availability: z.string().optional()
}).optional();

// About section schema
const aboutSchema = z.object({
	summary: z.string().optional(),
	bio: z.string().optional(),
	interests: z.array(z.string()).optional(),
	personalValues: z.array(z.string()).optional(),
	funFacts: z.array(z.string()).optional()
}).optional();

// Job experience schema
const jobItemSchema = z.object({
	id: z.string().optional(),
	company: z.string().optional(),
	position: z.string().optional(),
	title: z.string().optional(),
	location: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	current: z.boolean().optional(),
	description: z.string().optional(),
	responsibilities: z.array(z.string()).optional(),
	achievements: z.array(z.string()).optional(),
	technologies: z.array(z.string()).optional(),
	projects: z.array(z.string()).optional(),
	companyLogo: z.string().optional(),
	companyWebsite: z.string().optional()
});

const experienceSchema = z.object({
	jobs: z.array(jobItemSchema).optional()
});

// Education schema
const degreeItemSchema = z.object({
	id: z.string().optional(),
	institution: z.string().optional(),
	degree: z.string().optional(),
	field: z.string().optional(),
	grade: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	current: z.boolean().optional(),
	description: z.string().optional(),
	courses: z.array(z.string()).optional(),
	activities: z.array(z.string()).optional(),
	honors: z.array(z.string()).optional(),
	thesis: z.string().optional(),
	logo: z.string().optional()
});

const educationSchema = z.object({
	degrees: z.array(degreeItemSchema).optional()
});

// Skills schema with detailed structure
const skillItemSchema = z.object({
	name: z.string().optional(),
	level: z.enum(["beginner", "intermediate", "advanced", "expert"]).optional(),
	years: z.number().optional(),
	icon: z.string().optional(),
	certified: z.boolean().optional()
});

const skillCategorySchema = z.object({
	category: z.string().optional(),
	skills: z.array(skillItemSchema).optional()
});

const softSkillSchema = z.object({
	name: z.string().optional(),
	description: z.string().optional(),
	examples: z.array(z.string()).optional()
});

const languageSchema = z.object({
	name: z.string().optional(),
	proficiency: z.enum(["native", "fluent", "conversational", "basic"]).optional(),
	certification: z.string().optional()
});

const skillsSchema = z.object({
	technical: z.array(skillCategorySchema).optional(),
	soft: z.array(softSkillSchema).optional(),
	languages: z.array(languageSchema).optional()
});

// Projects schema
const projectItemSchema = z.object({
	id: z.string().optional(),
	title: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	longDescription: z.string().optional(),
	category: z.string().optional(),
	tags: z.array(z.string()).optional(),
	technologies: z.array(z.string()).optional(),
	status: z.enum(["completed", "in-progress", "planned"]).optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	images: z.array(z.string()).optional(),
	videos: z.array(z.string()).optional(),
	links: z.object({
		live: z.string().optional(),
		github: z.string().optional(),
		demo: z.string().optional(),
		documentation: z.string().optional()
	}).optional(),
	features: z.array(z.string()).optional(),
	challenges: z.array(z.string()).optional(),
	learnings: z.array(z.string()).optional(),
	teamSize: z.number().optional(),
	role: z.string().optional(),
	client: z.string().optional(),
	metrics: z.object({
		users: z.string().optional(),
		performance: z.string().optional(),
		impact: z.string().optional()
	}).optional(),
	testimonial: z.object({
		text: z.string().optional(),
		author: z.string().optional(),
		title: z.string().optional(),
		avatar: z.string().optional()
	}).optional()
});

const projectsSchema = z.object({
	items: z.array(projectItemSchema).optional()
});

// Achievements schema
const awardSchema = z.object({
	id: z.string().optional(),
	title: z.string().optional(),
	organization: z.string().optional(),
	date: z.string().optional(),
	description: z.string().optional(),
	image: z.string().optional(),
	link: z.string().optional(),
	category: z.string().optional()
});

const certificationSchema = z.object({
	id: z.string().optional(),
	name: z.string().optional(),
	organization: z.string().optional(),
	issueDate: z.string().optional(),
	expiryDate: z.string().optional(),
	credentialId: z.string().optional(),
	verificationLink: z.string().optional(),
	image: z.string().optional(),
	skills: z.array(z.string()).optional()
});

const publicationSchema = z.object({
	id: z.string().optional(),
	title: z.string().optional(),
	type: z.enum(["article", "book", "research", "blog"]).optional(),
	publisher: z.string().optional(),
	date: z.string().optional(),
	description: z.string().optional(),
	link: z.string().optional(),
	coAuthors: z.array(z.string()).optional(),
	citations: z.number().optional()
});

const patentSchema = z.object({
	id: z.string().optional(),
	title: z.string().optional(),
	number: z.string().optional(),
	status: z.string().optional(),
	date: z.string().optional(),
	description: z.string().optional(),
	inventors: z.array(z.string()).optional(),
	assignee: z.string().optional()
});

const achievementsSchema = z.object({
	awards: z.array(awardSchema).optional(),
	certifications: z.array(certificationSchema).optional(),
	publications: z.array(publicationSchema).optional(),
	patents: z.array(patentSchema).optional()
});

// Contact schema
const contactSchema = z.object({
	email: z.string().optional(),
	phone: z.string().optional(),
	preferredContact: z.enum(["email", "phone", "linkedin"]).optional(),
	timezone: z.string().optional(),
	availability: z.string().optional(),
	rates: z.object({
		hourly: z.string().optional(),
		project: z.string().optional(),
		retainer: z.string().optional()
	}).optional(),
	services: z.array(z.string()).optional(),
	workingHours: z.string().optional(),
	responseTime: z.string().optional()
});

// Metadata schema
const metadataSchema = z.object({
	title: z.string().optional(),
	description: z.string().optional(),
	keywords: z.array(z.string()).optional(),
	ogImage: z.string().optional(),
	canonicalUrl: z.string().optional(),
	schema: z.record(z.any()).optional()
}).optional();

// Theme schema
const themeSchema = z.object({
	primaryColor: z.string().optional(),
	secondaryColor: z.string().optional(),
	accentColor: z.string().optional(),
	backgroundColor: z.string().optional(),
	textColor: z.string().optional(),
	font: z.string().optional(),
	darkMode: z.boolean().optional(),
	animations: z.boolean().optional(),
	layout: z.string().optional()
}).optional();

// Analytics schema
const analyticsSchema = z.object({
	googleAnalytics: z.string().optional(),
	googleTagManager: z.string().optional(),
	hotjar: z.string().optional(),
	mixpanel: z.string().optional(),
	customEvents: z.array(z.string()).optional()
}).optional();

// Database portfolio schema (what's stored in DB)
export const databasePortfolioSchema = z.object({
	_id: z.any().optional(),
	id: z.string().optional(),
	username: z.string(),
	templateId: z.string(),
	portfolioData: z.object({
		personal: personalSchema,
		about: aboutSchema,
		experience: experienceSchema,
		education: educationSchema,
		skills: skillsSchema,
		projects: projectsSchema,
		achievements: achievementsSchema,
		contact: contactSchema,
		metadata: metadataSchema,
		theme: themeSchema,
		analytics: analyticsSchema
	}),
	createdAt: z.string().optional(),
	updatedAt: z.string().optional()
});

// API request schema (what Main App sends to Templates App)
export const renderRequestSchema = z.object({
	username: z.string(),
	templateId: z.string().optional(),
	options: z.object({
		draft: z.boolean().optional(),
		version: z.string().optional(),
		format: z.enum(["html", "pdf", "png"]).optional()
	}).optional()
});

// Main portfolio schema (for backward compatibility)
export const portfolioSchema = z.object({
	// Template identification
	templateId: z.string().optional(),
	
	// Complete portfolio data
	data: z.object({
		personal: personalSchema,
		about: aboutSchema,
		experience: experienceSchema,
		education: educationSchema,
		skills: skillsSchema,
		projects: projectsSchema,
		achievements: achievementsSchema,
		contact: contactSchema,
		metadata: metadataSchema,
		theme: themeSchema,
		analytics: analyticsSchema
	}).optional(),
	
	// Optional rendering options
	options: z.object({
		draft: z.boolean().optional(),
		version: z.string().optional(),
		format: z.enum(["html", "pdf", "png"]).optional()
	}).optional()
});

// Legacy schema for backward compatibility
export const legacyPortfolioSchema = z.object({
	id: z.string().optional(),
	_id: z.any().optional(),
	username: z.string(),
	templateId: z.string(),
	templateName: z.string().optional(),
	templateType: z.enum(["component", "full"]).optional(),
	theme: z.object({
		color: z.string().optional(),
		font: z.string().optional()
	}).optional(),
	portfolioData: z.object({
		personal: personalSchema,
		about: aboutSchema,
		projects: projectsSchema,
		skills: skillsSchema,
		experience: experienceSchema,
		education: educationSchema,
		achievements: achievementsSchema,
		contact: contactSchema
	}).optional(),
	content: z.record(z.string(), z.any()).optional(),
	layout: z.record(z.string(), z.string()).optional(),
	currentTemplate: z.any().optional(),
	updatedAt: z.string().optional()
});

export function validatePortfolio(input: unknown) {
	// Try new schema first
	const newResult = portfolioSchema.safeParse(input);
	if (newResult.success) {
		return newResult;
	}
	
	// Fall back to legacy schema
	return legacyPortfolioSchema.safeParse(input);
}

// Helper to normalize data (handle fallbacks and legacy formats)
export function normalizePortfolioData(data: any) {
	// Handle new schema format
	if (data?.data) {
		const portfolioData = data.data;
		const personal = portfolioData?.personal || {};
		const projects = portfolioData?.projects?.items || [];
		const jobs = portfolioData?.experience?.jobs || [];
		const degrees = portfolioData?.education?.degrees || [];
		
		return {
			personal: {
				...personal,
				fullName: [personal.firstName, personal.lastName].filter(Boolean).join(" ") || personal.title || "Your Name"
			},
			about: portfolioData?.about || {},
			projects: projects.map((p: any) => ({
				...p,
				name: p.title || p.name,
				url: p.links?.live || p.url,
				github: p.links?.github || p.github
			})),
			skills: portfolioData?.skills || {},
			experience: jobs.map((j: any) => ({
				...j,
				title: j.position || j.title,
				duration: j.duration || (j.startDate && j.endDate ? `${j.startDate} - ${j.endDate}` : 
							j.startDate ? `${j.startDate} - Present` : "")
			})),
			education: degrees.map((d: any) => ({
				...d,
				year: d.year || (d.startDate && d.endDate ? `${d.startDate} - ${d.endDate}` : 
						d.startDate ? `${d.startDate} - Present` : "")
			})),
			achievements: portfolioData?.achievements || {},
			contact: portfolioData?.contact || {},
			metadata: portfolioData?.metadata || {},
			theme: portfolioData?.theme || {},
			analytics: portfolioData?.analytics || {}
		};
	}
	
	// Handle legacy schema format
	const personal = data?.personal || {};
	const projects = data?.projects?.items || [];
	const jobs = data?.experience?.jobs || [];
	const degrees = data?.education?.degrees || [];
	
	return {
		personal: {
			...personal,
			fullName: [personal.firstName, personal.lastName].filter(Boolean).join(" ") || personal.title || "Your Name"
		},
		about: data?.about || {},
		projects: projects.map((p: any) => ({
			...p,
			name: p.title || p.name,
			url: p.links?.live || p.url,
			github: p.links?.github || p.github
		})),
		skills: data?.skills || {},
		experience: jobs.map((j: any) => ({
			...j,
			title: j.position || j.title,
			duration: j.duration || (j.startDate && j.endDate ? `${j.startDate} - ${j.endDate}` : 
						j.startDate ? `${j.startDate} - Present` : "")
		})),
		education: degrees.map((d: any) => ({
			...d,
			year: d.year || (d.startDate && d.endDate ? `${d.startDate} - ${d.endDate}` : 
					d.startDate ? `${d.startDate} - Present` : "")
		})),
		achievements: data?.achievements || {},
		contact: data?.contact || {}
	};
}
