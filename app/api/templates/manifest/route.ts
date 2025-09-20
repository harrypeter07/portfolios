import { NextResponse } from "next/server";
import { getAllManifests } from "@/src/templates/registry";

export async function GET() {
	const startTime = Date.now();
	const requestId = Math.random().toString(36).substring(7);
	
	try {
		console.log(`[${requestId}] GET /api/templates/manifest - Fetching template manifests`);
		
		const manifests = getAllManifests();
		console.log(`[${requestId}] Found ${manifests.length} templates:`, manifests.map(m => `${m.id} v${m.version}`));
		
		const duration = Date.now() - startTime;
		console.log(`[${requestId}] Manifest request completed in ${duration}ms`);
		
		return NextResponse.json(manifests, {
			headers: { 
				"Cache-Control": "public, s-maxage=86400",
				"X-Request-ID": requestId,
				"X-Response-Time": `${duration}ms`
			}
		});
	} catch (error: any) {
		const duration = Date.now() - startTime;
		console.error(`[${requestId}] Manifest request failed after ${duration}ms:`, {
			error: error.message,
			stack: error.stack
		});
		
		return NextResponse.json({ 
			error: "Failed to fetch manifests",
			requestId,
			timestamp: new Date().toISOString()
		}, { 
			status: 500,
			headers: { "X-Request-ID": requestId }
		});
	}
}
