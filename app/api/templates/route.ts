import { NextResponse } from "next/server";
import { verifyApiKey } from "@/src/lib/auth";
import { getAllManifests } from "@/src/templates/registry";

export async function GET(req: Request) {
	const startTime = Date.now();
	const requestId = Math.random().toString(36).substring(7);
	
	try {
		console.log(`[${requestId}] GET /api/templates - Fetching templates`);
		
		// Verify API key authentication
		await verifyApiKey(req.headers.get("authorization"));
		console.log(`[${requestId}] API key verification successful`);

		const manifests = getAllManifests();
		const templates = manifests.map(manifest => ({
			id: manifest.id,
			name: manifest.name,
			description: manifest.description || `${manifest.name} portfolio template`,
			category: manifest.category || "developer",
			preview: `/templates/${manifest.id}-preview.jpg`,
			version: manifest.version,
			author: manifest.author || "Portfolio Team",
			remote: false,
			source: "local"
		}));

		const response = {
			success: true,
			templates,
			count: templates.length
		};

		const duration = Date.now() - startTime;
		console.log(`[${requestId}] Templates request completed in ${duration}ms - ${templates.length} templates found`);
		
		return NextResponse.json(response, {
			headers: { 
				"Cache-Control": "public, s-maxage=3600",
				"X-Request-ID": requestId,
				"X-Response-Time": `${duration}ms`
			}
		});
		
	} catch (error: any) {
		const duration = Date.now() - startTime;
		console.error(`[${requestId}] Templates request failed after ${duration}ms:`, {
			error: error.message,
			stack: error.stack
		});
		
		return NextResponse.json({ 
			error: "Failed to fetch templates",
			requestId,
			timestamp: new Date().toISOString()
		}, { 
			status: 500,
			headers: { "X-Request-ID": requestId }
		});
	}
}

