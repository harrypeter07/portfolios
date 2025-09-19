import { NextResponse } from "next/server";
import { verifyServiceJwt } from "@/src/lib/auth";
import { buildETag, applyCachingHeaders } from "@/src/lib/cache";
import { validateAndNormalize, getTemplateInfo } from "@/src/lib/renderer";
import { renderComponentToString } from "@/src/lib/server-render";

export async function POST(req: Request) {
	try {
		await verifyServiceJwt(req.headers.get("authorization"));

		const { templateId, data, options } = await req.json();
		const validation = validateAndNormalize(data);
		if (!validation.ok) {
			return NextResponse.json({ errors: validation.error }, { status: 400 });
		}

		const templateInfo = getTemplateInfo(templateId);
		if (!templateInfo) {
			return NextResponse.json({ error: "Template not found" }, { status: 404 });
		}

		const { Component, manifest, css } = templateInfo;
		const html = renderComponentToString(Component, { data: validation.normalized });

		const etag = buildETag({
			id: (validation.parsed as any)._id || (validation.parsed as any).id,
			updatedAt: (validation.parsed as any).updatedAt || "",
			templateId,
			templateVersion: manifest.version,
			options
		});

		const ifNoneMatch = req.headers.get("if-none-match");
		if (ifNoneMatch && ifNoneMatch === etag) {
			const res304 = new NextResponse(null, { status: 304 });
			res304.headers.set("ETag", etag);
			applyCachingHeaders(res304.headers);
			return res304;
		}

		const res = NextResponse.json({
			html,
			css,
			meta: {
				templateId,
				version: manifest.version,
				renderedAt: new Date().toISOString()
			}
		});
		applyCachingHeaders(res.headers);
		res.headers.set("ETag", etag);
		return res;
	} catch (e: any) {
		const status = e?.statusCode || 500;
		return NextResponse.json({ error: "Render failed" }, { status });
	}
}
