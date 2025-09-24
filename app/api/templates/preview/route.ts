import { NextResponse } from "next/server";
import { verifyApiKey } from "@/src/lib/auth";
import { validateAndNormalize, getTemplateInfo } from "@/src/lib/renderer";
import { renderComponentToString } from "@/src/lib/server-render";
import { createPortfolio } from "@/src/lib/database";

export async function POST(req: Request) {
	const startTime = Date.now();
	const requestId = Math.random().toString(36).substring(7);
	
	try {
		console.log(`[${requestId}] POST /api/templates/preview - Creating template preview`);
		
		// Verify API key authentication
		await verifyApiKey(req.headers.get("authorization"));
		console.log(`[${requestId}] API key verification successful`);

		const { templateId, portfolioData, options } = await req.json();
		console.log(`[${requestId}] Template ID: ${templateId}, Preview mode: ${options?.preview}`);
		
		// Validate required fields
		if (!templateId) {
			return NextResponse.json({ error: "Template ID is required" }, { status: 400 });
		}

		if (!portfolioData) {
			return NextResponse.json({ error: "Portfolio data is required" }, { status: 400 });
		}

		// Validate and normalize data
		const validation = validateAndNormalize(portfolioData);
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
		console.log(`[${requestId}] Template found: ${templateInfo.manifest.name} v${templateInfo.manifest.version}`);

		// Render component to HTML
		const { Component, manifest, css } = templateInfo;
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
		console.log(`[${requestId}] Preview created successfully in ${duration}ms`);
		
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

