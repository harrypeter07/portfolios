import { NextResponse } from "next/server";
import { getAllManifests } from "@/src/templates/registry";

export async function GET() {
	const startTime = Date.now();
	const requestId = Math.random().toString(36).substring(7);
	
	try {
		console.log(`[${requestId}] GET /api/status - Health check request`);
		
		// Get template registry info
		const manifests = getAllManifests();
		const templateCount = manifests.length;
		
		// Check environment variables
		const envStatus = {
			VALID_API_KEYS: !!process.env.VALID_API_KEYS,
			VALID_API_KEYS_COUNT: process.env.VALID_API_KEYS?.split(',').length || 0,
			MAIN_API_BASE: !!process.env.MAIN_API_BASE,
			ALLOWED_ORIGINS: !!process.env.ALLOWED_ORIGINS,
			PREVIEW_JWT_SECRET: !!process.env.PREVIEW_JWT_SECRET
		};
		
		// System info
		const systemInfo = {
			nodeVersion: process.version,
			platform: process.platform,
			uptime: process.uptime(),
			memoryUsage: process.memoryUsage(),
			environment: process.env.NODE_ENV || 'development'
		};
		
		const status = {
			status: 'healthy',
			service: 'Templates App',
			version: '1.0.0',
			timestamp: new Date().toISOString(),
			requestId,
			uptime: `${Math.floor(process.uptime())}s`,
			templates: {
				count: templateCount,
				available: manifests.map(m => ({
					id: m.id,
					name: m.name,
					version: m.version
				}))
			},
			environment: envStatus,
			system: systemInfo,
			endpoints: {
				render: 'POST /api/render',
				manifest: 'GET /api/templates/manifest',
				export: 'POST /api/render/export (501 - Not implemented)',
				preview: 'GET /preview/[username]',
				status: 'GET /api/status'
			}
		};
		
		const duration = Date.now() - startTime;
		console.log(`[${requestId}] Status check completed in ${duration}ms - ${templateCount} templates available`);
		
		return NextResponse.json(status, {
			headers: { 
				"Cache-Control": "no-cache",
				"X-Request-ID": requestId,
				"X-Response-Time": `${duration}ms`
			}
		});
	} catch (error: any) {
		const duration = Date.now() - startTime;
		console.error(`[${requestId}] Status check failed after ${duration}ms:`, {
			error: error.message,
			stack: error.stack
		});
		
		return NextResponse.json({ 
			status: 'unhealthy',
			error: error.message,
			requestId,
			timestamp: new Date().toISOString()
		}, { 
			status: 500,
			headers: { "X-Request-ID": requestId }
		});
	}
}
