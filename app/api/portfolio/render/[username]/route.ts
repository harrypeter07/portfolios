import { NextResponse } from "next/server";
import { getPortfolioFromDB } from "@/src/lib/database";
import { validateAndNormalize, getTemplateInfo } from "@/src/lib/renderer";
import { renderComponentToString } from "@/src/lib/server-render";

export async function GET(
	req: Request,
	{ params }: { params: { username: string } }
) {
	const startTime = Date.now();
	const requestId = Math.random().toString(36).substring(7);
	
	try {
		console.log(`[${requestId}] GET /api/portfolio/render/${params.username} - Direct portfolio render`);
		
		const { username } = params;
		
		// Fetch portfolio data from database
		const portfolioData = await getPortfolioFromDB(username);
		if (!portfolioData) {
			console.error(`[${requestId}] Portfolio not found for username: ${username}`);
			return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
		}
		console.log(`[${requestId}] Portfolio data fetched successfully`);

		// Validate and normalize data
		const validation = validateAndNormalize(portfolioData);
		if (!validation.ok) {
			console.error(`[${requestId}] Data validation failed:`, validation.error);
			return NextResponse.json({ errors: validation.error }, { status: 400 });
		}
		console.log(`[${requestId}] Data validation successful`);

		// Get template info
		const templateInfo = getTemplateInfo(portfolioData.templateId);
		if (!templateInfo) {
			console.error(`[${requestId}] Template not found: ${portfolioData.templateId}`);
			return NextResponse.json({ error: "Template not found" }, { status: 404 });
		}
		console.log(`[${requestId}] Template found: ${templateInfo.manifest.name} v${templateInfo.manifest.version}`);

		// Render component to HTML
		const { Component, manifest, css } = templateInfo;
		const html = await renderComponentToString(Component, { data: validation.normalized });
		console.log(`[${requestId}] Component rendered successfully, HTML length: ${html.length}`);

		// Return HTML directly
		const response = new Response(html, {
			headers: {
				'Content-Type': 'text/html',
				'Cache-Control': 'public, s-maxage=300',
				'X-Request-ID': requestId,
				'X-Template-ID': portfolioData.templateId,
				'X-Template-Version': manifest.version
			}
		});

		const duration = Date.now() - startTime;
		console.log(`[${requestId}] Direct portfolio render completed in ${duration}ms`);
		
		return response;
		
	} catch (error: any) {
		const duration = Date.now() - startTime;
		console.error(`[${requestId}] Direct portfolio render failed after ${duration}ms:`, {
			error: error.message,
			stack: error.stack
		});
		
		return NextResponse.json({ 
			error: "Failed to render portfolio",
			requestId,
			timestamp: new Date().toISOString()
		}, { 
			status: 500,
			headers: { "X-Request-ID": requestId }
		});
	}
}


