import { z } from "zod";

export const socialSchema = z.object({
	linkedin: z.string().optional(),
	github: z.string().optional(),
	twitter: z.string().optional(),
	website: z.string().optional()
}).optional();

export const locationSchema = z.object({
	city: z.string().optional(),
	state: z.string().optional(),
	country: z.string().optional()
}).optional();

export const personalSchema = z.object({
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

export const projectsSchema = z.object({
	items: z.array(z.object({
		title: z.string().optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		links: z.object({
			live: z.string().optional(),
			github: z.string().optional()
		}).optional(),
		url: z.string().optional(),
		technologies: z.array(z.string()).optional()
	})).optional()
}).optional();

export const experienceSchema = z.object({
	jobs: z.array(z.object({
		position: z.string().optional(),
		title: z.string().optional(),
		company: z.string().optional(),
		location: z.string().optional(),
		startDate: z.string().optional(),
		endDate: z.string().optional(),
		duration: z.string().optional(),
		description: z.string().optional(),
		technologies: z.array(z.string()).optional()
	})).optional()
}).optional();

export const educationSchema = z.object({
	degrees: z.array(z.object({
		degree: z.string().optional(),
		field: z.string().optional(),
		institution: z.string().optional(),
		startDate: z.string().optional(),
		endDate: z.string().optional(),
		year: z.string().optional(),
		location: z.string().optional(),
		grade: z.string().optional(),
		gpa: z.string().optional()
	})).optional()
}).optional();

export const achievementsSchema = z.object({
	awards: z.array(z.string()).optional(),
	certifications: z.array(z.string()).optional(),
	publications: z.array(z.string()).optional()
}).optional();

export const portfolioSchema = z.object({
	id: z.string().optional(),
	_id: z.any().optional(),
	username: z.string(),
	templateId: z.string(),
	theme: z.object({
		color: z.string().optional(),
		font: z.string().optional()
	}).optional(),
	portfolioData: z.object({
		personal: personalSchema.optional(),
		about: z.object({ summary: z.string().optional() }).optional(),
		projects: projectsSchema,
		skills: z.object({
			technical: z.array(z.string()).optional(),
			soft: z.array(z.string()).optional(),
			languages: z.array(z.string()).optional()
		}).optional(),
		experience: experienceSchema,
		education: educationSchema,
		achievements: achievementsSchema
	}).optional(),
	content: z.record(z.any()).optional(),
	layout: z.record(z.string()).optional(),
	updatedAt: z.string().optional()
});

export function validatePortfolio(input: unknown) {
	return portfolioSchema.safeParse(input);
}
