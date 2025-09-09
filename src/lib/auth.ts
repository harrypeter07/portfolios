import { jwtVerify } from "jose";

export async function verifyServiceJwt(authorization: string | null) {
	if (!authorization?.startsWith("Bearer ")) throw Object.assign(new Error("Unauthorized"), { statusCode: 401 });
	const token = authorization.slice(7);
	const secretValue = process.env.SHARED_JWT_SECRET || "";
	if (!secretValue) throw Object.assign(new Error("Server misconfigured: SHARED_JWT_SECRET missing"), { statusCode: 500 });
	const secret = new TextEncoder().encode(secretValue);
	const { payload } = await jwtVerify(token, secret);
	if ((payload as any).scope !== "render") throw Object.assign(new Error("Forbidden"), { statusCode: 403 });
	return payload;
}

export async function verifyPreviewToken(token: string) {
	const secretValue = process.env.PREVIEW_JWT_SECRET || process.env.SHARED_JWT_SECRET || "";
	if (!secretValue) throw Object.assign(new Error("Server misconfigured: PREVIEW_JWT_SECRET/SHARED_JWT_SECRET missing"), { statusCode: 500 });
	const secret = new TextEncoder().encode(secretValue);
	const { payload } = await jwtVerify(token, secret);
	return payload as any;
}
