import { NextResponse } from "next/server";
import { verifyServiceJwt } from "@/src/lib/auth";

export async function POST(req: Request) {
	const startTime = Date.now();
	const requestId = Math.random().toString(36).substring(7);
	
	try {
		console.log(`[${requestId}] POST /api/debug/jwt - JWT Debug request`);
		
		const authorization = req.headers.get("authorization");
		console.log(`[${requestId}] Authorization header:`, authorization ? `${authorization.substring(0, 30)}...` : "null");
		
		// Check environment variables
		const envStatus = {
			SHARED_JWT_SECRET: !!process.env.SHARED_JWT_SECRET,
			SHARED_JWT_SECRET_LENGTH: process.env.SHARED_JWT_SECRET?.length || 0,
			SHARED_JWT_SECRET_PREFIX: process.env.SHARED_JWT_SECRET?.substring(0, 10) || "not set"
		};
		
		console.log(`[${requestId}] Environment status:`, envStatus);
		
		if (!authorization) {
			return NextResponse.json({
				error: "No authorization header provided",
				requestId,
				timestamp: new Date().toISOString(),
				environment: envStatus,
				instructions: {
					step1: "Set SHARED_JWT_SECRET environment variable",
					step2: "Send POST request with Authorization: Bearer <your-jwt-token>",
					step3: "JWT must have scope: 'render' and be signed with HS256"
				}
			}, { status: 400 });
		}
		
		// Try to verify the JWT
		try {
			const payload = await verifyServiceJwt(authorization);
			const duration = Date.now() - startTime;
			
			console.log(`[${requestId}] JWT verification successful in ${duration}ms`);
			
			return NextResponse.json({
				success: true,
				message: "JWT verification successful",
				requestId,
				timestamp: new Date().toISOString(),
				duration: `${duration}ms`,
				payload: {
					scope: (payload as any).scope,
					exp: (payload as any).exp,
					iat: (payload as any).iat,
					sub: (payload as any).sub,
					expiresAt: new Date((payload as any).exp * 1000).toISOString(),
					issuedAt: new Date((payload as any).iat * 1000).toISOString()
				},
				environment: envStatus
			});
			
		} catch (jwtError: any) {
			const duration = Date.now() - startTime;
			
			console.error(`[${requestId}] JWT verification failed after ${duration}ms:`, {
				error: jwtError.message,
				name: jwtError.name,
				statusCode: jwtError.statusCode
			});
			
			return NextResponse.json({
				success: false,
				error: jwtError.message,
				errorName: jwtError.name,
				statusCode: jwtError.statusCode || 500,
				requestId,
				timestamp: new Date().toISOString(),
				duration: `${duration}ms`,
				environment: envStatus,
				troubleshooting: {
					commonIssues: [
						"JWT secret mismatch - check SHARED_JWT_SECRET",
						"Token expired - check exp claim",
						"Wrong algorithm - must be HS256",
						"Missing scope - must have scope: 'render'",
						"Invalid token format - check token structure"
					],
					nextSteps: [
						"Verify SHARED_JWT_SECRET matches your Main App",
						"Check token expiration time",
						"Ensure token has correct payload structure",
						"Test with a fresh token"
					]
				}
			}, { status: jwtError.statusCode || 500 });
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
		message: "JWT Debug Endpoint",
		description: "Use POST to test JWT tokens",
		usage: {
			method: "POST",
			headers: {
				"Authorization": "Bearer <your-jwt-token>",
				"Content-Type": "application/json"
			},
			body: "{}"
		},
		environment: {
			SHARED_JWT_SECRET_SET: !!process.env.SHARED_JWT_SECRET,
			SHARED_JWT_SECRET_LENGTH: process.env.SHARED_JWT_SECRET?.length || 0
		}
	});
}
