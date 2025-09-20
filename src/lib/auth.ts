import { jwtVerify } from "jose";

// API Key Authentication for service-to-service communication
export function verifyApiKey(authorization: string | null) {
	console.log("🔑 API Key Verification - Starting");
	console.log("📋 Authorization header:", authorization ? `${authorization.substring(0, 20)}...` : "null");
	
	if (!authorization?.startsWith("Bearer ")) {
		console.error("❌ API Key Verification - Invalid authorization format");
		throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
	}
	
	const apiKey = authorization.slice(7);
	console.log("🔑 API Key (first 10 chars):", apiKey.substring(0, 10) + "...");
	
	const validApiKeys = process.env.VALID_API_KEYS?.split(',') || [];
	console.log("🔑 Valid API Keys count:", validApiKeys.length);
	
	if (!validApiKeys.includes(apiKey)) {
		console.error("❌ API Key Verification - Invalid API key");
		throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
	}
	
	console.log("✅ API Key Verification - Success");
	return { apiKey, type: 'api-key' };
}

// Legacy JWT verification (kept for backward compatibility)
export async function verifyServiceJwt(authorization: string | null) {
	console.log("🔐 JWT Verification - Starting");
	console.log("📋 Authorization header:", authorization ? `${authorization.substring(0, 20)}...` : "null");
	
	if (!authorization?.startsWith("Bearer ")) {
		console.error("❌ JWT Verification - Invalid authorization format");
		throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
	}
	
	const token = authorization.slice(7);
	console.log("🎫 JWT Token (first 50 chars):", token.substring(0, 50) + "...");
	
	const secretValue = process.env.SHARED_JWT_SECRET || "";
	console.log("🔑 Secret available:", !!secretValue);
	console.log("🔑 Secret length:", secretValue.length);
	console.log("🔑 Secret (first 10 chars):", secretValue.substring(0, 10) + "...");
	
	if (!secretValue) {
		console.error("❌ JWT Verification - SHARED_JWT_SECRET missing");
		throw Object.assign(new Error("Server misconfigured: SHARED_JWT_SECRET missing"), { statusCode: 500 });
	}
	
	try {
		const secret = new TextEncoder().encode(secretValue);
		console.log("🔐 JWT Verification - Attempting to verify token");
		
		const { payload } = await jwtVerify(token, secret);
		console.log("✅ JWT Verification - Token verified successfully");
		console.log("📋 JWT Payload:", {
			scope: (payload as any).scope,
			exp: (payload as any).exp,
			iat: (payload as any).iat,
			sub: (payload as any).sub
		});
		
		if ((payload as any).scope !== "render") {
			console.error("❌ JWT Verification - Invalid scope:", (payload as any).scope);
			throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
		}
		
		console.log("✅ JWT Verification - Complete");
		return payload;
	} catch (error: any) {
		console.error("❌ JWT Verification - Failed:", {
			error: error.message,
			name: error.name,
			code: error.code
		});
		
		// Add more specific error handling
		if (error.name === 'JWSSignatureVerificationFailed') {
			console.error("🔍 JWT Signature Issue - Possible causes:");
			console.error("  1. Wrong JWT secret");
			console.error("  2. Token was signed with different secret");
			console.error("  3. Token is corrupted or invalid");
			console.error("  4. Token was signed with different algorithm");
		}
		
		throw error;
	}
}

export async function verifyPreviewToken(token: string) {
	const secretValue = process.env.PREVIEW_JWT_SECRET || process.env.SHARED_JWT_SECRET || "";
	if (!secretValue) throw Object.assign(new Error("Server misconfigured: PREVIEW_JWT_SECRET/SHARED_JWT_SECRET missing"), { statusCode: 500 });
	const secret = new TextEncoder().encode(secretValue);
	const { payload } = await jwtVerify(token, secret);
	return payload as any;
}
