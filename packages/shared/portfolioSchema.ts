import { z } from "zod";

const socialSchema = z.object({
	linkedin: z.string().optional(),
	github: z.string().optional(),
	twitter: z.string().optional(),
	website: z.string().optional(),
	instagram: z.string().optional(),
	facebook: z.string().optional()
}).optional();

const locationSchema = z.object({
	city: z.string().optional(),
	state: z.string().optional(),
	country: z.string().optional()
}).optional();

const personalSchema = z.object({
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	title: z.string().optional(),
	subtitle: z.string().optional(),
	tagline: z.string().optional(),
	email: z.string().optional(),
	phone: z.string().optional(),
	location: locationSchema,
	social: socialSchema
}).optional();

const projectItemSchema = z.object({
	title: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	image: z.string().optional(),
	technologies: z.array(z.string()).optional(),
	links: z.object({
		live: z.string().optional(),
		github: z.string().optional(),
		demo: z.string().optional()
	}).optional(),
	url: z.string().optional(),
	github: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	status: z.enum(["completed", "in-progress", "planned"]).optional()
});

const projectsSchema = z.object({
	items: z.array(projectItemSchema).optional()
});

const jobItemSchema = z.object({
	position: z.string().optional(),
	title: z.string().optional(),
	company: z.string().optional(),
	location: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	duration: z.string().optional(),
	description: z.string().optional(),
	technologies: z.array(z.string()).optional(),
	achievements: z.array(z.string()).optional(),
	current: z.boolean().optional()
});

const experienceSchema = z.object({
	jobs: z.array(jobItemSchema).optional()
});

const degreeItemSchema = z.object({
	degree: z.string().optional(),
	field: z.string().optional(),
	institution: z.string().optional(),
	location: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
	year: z.string().optional(),
	grade: z.string().optional(),
	gpa: z.string().optional(),
	honors: z.array(z.string()).optional(),
	relevantCoursework: z.array(z.string()).optional()
});

const educationSchema = z.object({
	degrees: z.array(degreeItemSchema).optional()
});

const achievementsSchema = z.object({
	awards: z.array(z.string()).optional(),
	certifications: z.array(z.string()).optional(),
	publications: z.array(z.string()).optional(),
	recognitions: z.array(z.string()).optional()
});

const skillsSchema = z.object({
	technical: z.array(z.string()).optional(),
	soft: z.array(z.string()).optional(),
	languages: z.array(z.string()).optional(),
	tools: z.array(z.string()).optional(),
	frameworks: z.array(z.string()).optional(),
	databases: z.array(z.string()).optional()
});

const contactSchema = z.object({
	email: z.string().optional(),
	phone: z.string().optional(),
	location: z.string().optional(),
	linkedin: z.string().optional(),
	github: z.string().optional(),
	website: z.string().optional()
});

const aboutSchema = z.object({
	summary: z.string().optional(),
	interests: z.array(z.string()).optional(),
	values: z.array(z.string()).optional(),
	funFacts: z.array(z.string()).optional()
});

export const portfolioSchema = z.object({
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
	return portfolioSchema.safeParse(input);
}

// Helper to normalize data (handle fallbacks)
export function normalizePortfolioData(data: any) {
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
