import { NextResponse } from "next/server";
import { verifyApiKey } from "@/src/lib/auth";

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

		// Forward request to Templates App for rendering
		const templatesAppUrl = process.env.TEMPLATES_APP_URL || "http://localhost:3001";
		const response = await fetch(`${templatesAppUrl}/api/render`, {
			method: 'POST',
			headers: {
				'Authorization': req.headers.get("authorization") || "",
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				username,
				templateId,
				options
			})
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error(`[${requestId}] Templates App error: ${response.status}`, errorText);
			return NextResponse.json({ 
				error: `Templates App error: ${response.status}`,
				details: errorText
			}, { status: response.status });
		}

		const result = await response.json();
		
		const duration = Date.now() - startTime;
		console.log(`[${requestId}] Render completed successfully in ${duration}ms`);
		
		// Return the HTML directly from Templates App
		return new Response(result.html, {
			headers: {
				'Content-Type': 'text/html',
				'Cache-Control': 'public, s-maxage=300',
				'ETag': response.headers.get('ETag') || `"${Date.now()}"`
			}
		});
		
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
