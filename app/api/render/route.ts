import { NextResponse } from "next/server";
import { verifyServiceJwt } from "@/src/lib/auth";
import { buildETag, applyCachingHeaders } from "@/src/lib/cache";
import { validateAndNormalize, renderTemplateToHtml } from "@/src/lib/renderer";

export async function POST(req: Request) {
	try {
		await verifyServiceJwt(req.headers.get("authorization"));

		const { templateId, data, options } = await req.json();
		const validation = validateAndNormalize(data);
		if (!validation.ok) {
			return NextResponse.json({ errors: validation.error }, { status: 400 });
		}

		const rendered = renderTemplateToHtml(templateId, validation.normalized);
		if (!rendered) {
			return NextResponse.json({ error: "Template not found" }, { status: 404 });
		}

		const etag = buildETag({
			id: (validation.parsed as any)._id || (validation.parsed as any).id,
			updatedAt: (validation.parsed as any).updatedAt || "",
			templateId,
			templateVersion: rendered.version,
			options
		});

		const ifNoneMatch = req.headers.get("if-none-match");
		if (ifNoneMatch && ifNoneMatch === etag) {
			const res304 = new NextResponse(null, { status: 304 });
			res304.headers.set("ETag", etag);
			applyCachingHeaders(res304.headers);
			return res304;
		}

		const css = "";
		const res = NextResponse.json({
			html: rendered.html,
			css,
			meta: {
				templateId,
				version: rendered.version,
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
