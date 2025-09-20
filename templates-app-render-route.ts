import { NextResponse } from "next/server";
import { verifyApiKey } from "@/src/lib/auth";
import { buildETag, applyCachingHeaders } from "@/src/lib/cache";
import { validateAndNormalize, getTemplateInfo } from "@/src/lib/renderer";
import { renderComponentToString } from "@/src/lib/server-render";

// Database connection (you'll need to implement this based on your DB)
async function getPortfolioFromDB(username: string) {
	// TODO: Implement database connection
	// This should connect to your shared database and fetch portfolio data
	// Example structure:
	/*
	const portfolio = await db.collection('portfolios').findOne({ username });
	return portfolio;
	*/
	
	// For now, return mock data
	return {
		username,
		templateId: "modern-resume",
		portfolioData: {
			personal: {
				firstName: "John",
				lastName: "Doe",
				title: "Full Stack Developer",
				email: "john@example.com"
			},
			about: {
				summary: "Experienced developer with 5+ years of experience"
			},
			experience: { jobs: [] },
			education: { degrees: [] },
			skills: { technical: [], soft: [], languages: [] },
			projects: { items: [] },
			achievements: { awards: [], certifications: [], publications: [], patents: [] },
			contact: { email: "john@example.com" }
		}
	};
}

export async function POST(req: Request) {
	const startTime = Date.now();
	const requestId = Math.random().toString(36).substring(7);
	
	try {
		console.log(`[${requestId}] POST /api/render - Starting render request`);
		
		// Verify API key authentication
		await verifyApiKey(req.headers.get("authorization"));
		console.log(`[${requestId}] API key verification successful`);

		const { username, templateId, options } = await req.json();
		console.log(`[${requestId}] Username: ${username}, Template ID: ${templateId}`);
		
		// Validate required fields
		if (!username) {
			return NextResponse.json({ error: "Username is required" }, { status: 400 });
		}

		// Fetch portfolio data from database
		const portfolioData = await getPortfolioFromDB(username);
		if (!portfolioData) {
			console.error(`[${requestId}] Portfolio not found for username: ${username}`);
			return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
		}
		console.log(`[${requestId}] Portfolio data fetched successfully`);

		// Use templateId from request or fallback to portfolio data
		const finalTemplateId = templateId || portfolioData.templateId;
		
		// Validate and normalize data
		const validation = validateAndNormalize(portfolioData);
		if (!validation.ok) {
			console.error(`[${requestId}] Data validation failed:`, validation.error);
			return NextResponse.json({ errors: validation.error }, { status: 400 });
		}
		console.log(`[${requestId}] Data validation successful`);

		// Get template info
		const templateInfo = getTemplateInfo(finalTemplateId);
		if (!templateInfo) {
			console.error(`[${requestId}] Template not found: ${finalTemplateId}`);
			return NextResponse.json({ error: "Template not found" }, { status: 404 });
		}
		console.log(`[${requestId}] Template found: ${templateInfo.manifest.name} v${templateInfo.manifest.version}`);

		// Render component to HTML
		const { Component, manifest, css } = templateInfo;
		const html = await renderComponentToString(Component, { data: validation.normalized });
		console.log(`[${requestId}] Component rendered successfully, HTML length: ${html.length}`);

		// Build ETag for caching
		const etag = buildETag({
			id: portfolioData._id || portfolioData.id || username,
			updatedAt: portfolioData.updatedAt || "",
			templateId: finalTemplateId,
			templateVersion: manifest.version,
			options
		});

		// Check for 304 Not Modified
		const ifNoneMatch = req.headers.get("if-none-match");
		if (ifNoneMatch && ifNoneMatch === etag) {
			console.log(`[${requestId}] 304 Not Modified - ETag match: ${etag}`);
			const res304 = new NextResponse(null, { status: 304 });
			res304.headers.set("ETag", etag);
			applyCachingHeaders(res304.headers);
			return res304;
		}

		// Return successful response
		const res = NextResponse.json({
			html,
			css,
			meta: {
				templateId: finalTemplateId,
				version: manifest.version,
				renderedAt: new Date().toISOString()
			}
		});
		applyCachingHeaders(res.headers);
		res.headers.set("ETag", etag);
		
		const duration = Date.now() - startTime;
		console.log(`[${requestId}] Render completed successfully in ${duration}ms`);
		return res;
		
	} catch (e: any) {
		const duration = Date.now() - startTime;
		const status = e?.statusCode || 500;
		console.error(`[${requestId}] Render failed after ${duration}ms:`, {
			error: e.message,
			status,
			stack: e.stack
		});
		return NextResponse.json({ 
			error: "Render failed",
			requestId,
			timestamp: new Date().toISOString()
		}, { status });
	}
}
