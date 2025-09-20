import { NextResponse } from "next/server";
import { verifyApiKey } from "@/src/lib/auth";

export async function POST(req: Request) {
	const startTime = Date.now();
	const requestId = Math.random().toString(36).substring(7);
	
	try {
		console.log(`[${requestId}] POST /api/debug/api-key - API Key Debug request`);
		
		const authorization = req.headers.get("authorization");
		console.log(`[${requestId}] Authorization header:`, authorization ? `${authorization.substring(0, 30)}...` : "null");
		
		// Check environment variables
		const envStatus = {
			VALID_API_KEYS: !!process.env.VALID_API_KEYS,
			VALID_API_KEYS_COUNT: process.env.VALID_API_KEYS?.split(',').length || 0,
			VALID_API_KEYS_PREFIX: process.env.VALID_API_KEYS?.substring(0, 20) || "not set"
		};
		
		console.log(`[${requestId}] Environment status:`, envStatus);
		
		if (!authorization) {
			return NextResponse.json({
				error: "No authorization header provided",
				requestId,
				timestamp: new Date().toISOString(),
				environment: envStatus,
				instructions: {
					step1: "Set VALID_API_KEYS environment variable",
					step2: "Send POST request with Authorization: Bearer <your-api-key>",
					step3: "API key must be in the comma-separated VALID_API_KEYS list"
				}
			}, { status: 400 });
		}
		
		// Try to verify the API key
		try {
			const result = await verifyApiKey(authorization);
			const duration = Date.now() - startTime;
			
			console.log(`[${requestId}] API key verification successful in ${duration}ms`);
			
			return NextResponse.json({
				success: true,
				message: "API key verification successful",
				requestId,
				timestamp: new Date().toISOString(),
				duration: `${duration}ms`,
				authResult: result,
				environment: envStatus
			});
			
		} catch (authError: any) {
			const duration = Date.now() - startTime;
			
			console.error(`[${requestId}] API key verification failed after ${duration}ms:`, {
				error: authError.message,
				name: authError.name,
				statusCode: authError.statusCode
			});
			
			return NextResponse.json({
				success: false,
				error: authError.message,
				errorName: authError.name,
				statusCode: authError.statusCode || 500,
				requestId,
				timestamp: new Date().toISOString(),
				duration: `${duration}ms`,
				environment: envStatus,
				troubleshooting: {
					commonIssues: [
						"API key not in VALID_API_KEYS list",
						"Invalid authorization header format",
						"Missing VALID_API_KEYS environment variable",
						"API key is empty or malformed"
					],
					nextSteps: [
						"Verify API key is in VALID_API_KEYS environment variable",
						"Check authorization header format: Bearer <api-key>",
						"Ensure VALID_API_KEYS is comma-separated",
						"Test with a valid API key"
					]
				}
			}, { status: authError.statusCode || 500 });
		}
		
	} catch (error: any) {
		const duration = Date.now() - startTime;
		console.error(`[${requestId}] Debug request failed after ${duration}ms:`, {
			error: error.message,
			stack: error.stack
		});
		
		return NextResponse.json({
			success: false,
			error: "Debug request failed",
			details: error.message,
			requestId,
			timestamp: new Date().toISOString(),
			duration: `${duration}ms`
		}, { status: 500 });
	}
}

export async function GET() {
	return NextResponse.json({
		message: "API Key Debug Endpoint",
		description: "Use POST to test API keys",
		usage: {
			method: "POST",
			headers: {
				"Authorization": "Bearer <your-api-key>",
				"Content-Type": "application/json"
			},
			body: "{}"
		},
		environment: {
			VALID_API_KEYS_SET: !!process.env.VALID_API_KEYS,
			VALID_API_KEYS_COUNT: process.env.VALID_API_KEYS?.split(',').length || 0
		}
	});
}
