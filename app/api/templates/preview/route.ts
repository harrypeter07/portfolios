import { NextResponse } from "next/server";
import { verifyApiKey } from "@/src/lib/auth";
import { validateAndNormalize, getTemplateInfo } from "@/src/lib/renderer";
import { renderComponentToString } from "@/src/lib/server-render";
import { createPortfolio } from "@/src/lib/database";

// Coerce incoming payloads from the Main App into the Templates App expected shape
function coerceIncomingPortfolio(input: any): { transformed: any; changed: boolean; notes: string[] } {
	let changed = false;
	const notes: string[] = [];
	if (!input || typeof input !== 'object') {
		return { transformed: input, changed, notes };
	}

	// Work on a shallow clone to avoid mutating caller's object
	const data: any = { ...input };

	// Example: experience.jobs[] -> experience[]
	if (data.experience && Array.isArray(data.experience.jobs)) {
		data.experience = data.experience.jobs;
		changed = true;
		notes.push('experience.jobs[] -> experience[]');
	}

	// Example: projects.items[] -> projects[]
	if (data.projects && Array.isArray(data.projects.items)) {
		data.projects = data.projects.items;
		changed = true;
		notes.push('projects.items[] -> projects[]');
	}

	// Example: skills.categories[] -> skills.technical[] (flatten names)
	if (data.skills && Array.isArray(data.skills.categories) && !Array.isArray(data.skills.technical)) {
		const categories = data.skills.categories;
		data.skills = {
			...data.skills,
			technical: categories.map((c: any) => ({ category: c?.name || c?.category || 'General', skills: c?.skills || c?.items || [] }))
		};
		changed = true;
		notes.push('skills.categories[] -> skills.technical[]');
	}

	// Example: wrap top-level when payload is { data: {...} }
	if (!data.personal && data.data && typeof data.data === 'object') {
		const inner = data.data;
		if (inner.personal || inner.about || inner.projects || inner.experience) {
			changed = true;
			notes.push('unwrapped data.data');
			return { transformed: inner, changed, notes };
		}
	}

	return { transformed: data, changed, notes };
}

export async function POST(req: Request) {
	const startTime = Date.now();
	const requestId = Math.random().toString(36).substring(7);
	
	try {
		console.log(`[${requestId}] POST /api/templates/preview - Creating template preview`);
		
		// Verify API key authentication
        const authHeader = req.headers.get("authorization");
        await verifyApiKey(authHeader);
		console.log(`[${requestId}] API key verification successful`);

        // Safe parse request body
        let body: any = null;
        try {
            body = await req.json();
        } catch (e: any) {
            console.error(`[${requestId}] Invalid JSON body`, e?.message || e);
            return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
        }

        const { templateId, portfolioData: rawPortfolioData, options } = body || {};
        // Coerce common alternate shapes into the expected portfolio format
        const { transformed, changed, notes } = coerceIncomingPortfolio(rawPortfolioData);
        const portfolioData = transformed;
        console.log(`[${requestId}] Incoming preview request`, {
            hasAuth: Boolean(authHeader),
            templateId,
            preview: Boolean(options?.preview),
            hasData: Boolean(portfolioData),
            dataKeys: portfolioData && typeof portfolioData === 'object' ? Object.keys(portfolioData) : undefined,
            transformed: changed ? notes : undefined,
        });
		
		// Validate required fields
		if (!templateId) {
			return NextResponse.json({ error: "Template ID is required" }, { status: 400 });
		}

		if (!portfolioData) {
			return NextResponse.json({ error: "Portfolio data is required" }, { status: 400 });
		}

		// Validate and normalize data
		const validation = validateAndNormalize(portfolioData);
        if (!validation) {
            console.error(`[${requestId}] validateAndNormalize returned null/undefined`);
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }
		if (!validation.ok) {
			console.error(`[${requestId}] Data validation failed:`, validation.error);
			return NextResponse.json({ errors: validation.error }, { status: 400 });
		}
		console.log(`[${requestId}] Data validation successful`);

		// Get template info
		const templateInfo = getTemplateInfo(templateId);
		if (!templateInfo) {
			console.error(`[${requestId}] Template not found: ${templateId}`);
			return NextResponse.json({ error: "Template not found" }, { status: 404 });
		}
        console.log(`[${requestId}] Template found: ${templateInfo.manifest?.name} v${templateInfo.manifest?.version}`);

		// Render component to HTML
        const { Component, manifest, css } = templateInfo;
        if (!Component) {
            console.error(`[${requestId}] Template is missing Component`);
            return NextResponse.json({ error: "Template misconfigured" }, { status: 500 });
        }

        const html = await renderComponentToString(Component, { data: validation.normalized });
		console.log(`[${requestId}] Component rendered successfully, HTML length: ${html.length}`);

		// Generate preview ID
		const previewId = Math.random().toString(36).substring(2, 15);
		const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours

		// Store preview in database (optional - for persistent previews)
		try {
			await createPortfolio({
				username: `preview_${previewId}`,
				templateId,
				portfolioData: validation.parsed,
				preview: true,
				expiresAt
			});
		} catch (error) {
			console.warn(`[${requestId}] Could not store preview in database:`, error);
		}

        const response = {
			success: true,
			previewUrl: `/preview/${previewId}`,
			html,
			templateId,
			expiresAt,
			fullPreviewUrl: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/preview/${previewId}`
		};

		const duration = Date.now() - startTime;
        console.log(`[${requestId}] Preview created successfully in ${duration}ms`, {
            previewId,
            template: templateId,
            htmlLength: html.length,
            manifestName: manifest?.name,
            cssPresent: Boolean(css),
        });
		
		return NextResponse.json(response, {
			headers: { 
				"X-Request-ID": requestId,
				"X-Response-Time": `${duration}ms`
			}
		});
		
	} catch (error: any) {
		const duration = Date.now() - startTime;
		console.error(`[${requestId}] Preview creation failed after ${duration}ms:`, {
			error: error.message,
			stack: error.stack
		});
		
		return NextResponse.json({ 
			error: "Failed to create preview",
			requestId,
			timestamp: new Date().toISOString()
		}, { 
			status: 500,
			headers: { "X-Request-ID": requestId }
		});
	}
}



