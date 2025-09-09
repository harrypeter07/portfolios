import crypto from "crypto";

export function buildETag(parts: Record<string, unknown>) {
	const raw = JSON.stringify(parts);
	return `"${crypto.createHash("sha1").update(raw).digest("hex")}"`;
}

export function applyCachingHeaders(headers: Headers, sMaxAgeSeconds = 300, swrSeconds = 600) {
	headers.set("Cache-Control", `public, s-maxage=${sMaxAgeSeconds}, stale-while-revalidate=${swrSeconds}`);
}
