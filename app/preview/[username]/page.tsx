import { verifyPreviewToken } from "@/src/lib/auth";
import { validateAndNormalize, getTemplateInfo } from "@/src/lib/renderer";
import { renderComponentToString } from "@/src/lib/server-render";

export const dynamic = "force-dynamic";

async function fetchPortfolio(username: string, token: string) {
	const base = process.env.MAIN_API_BASE;
	if (!base) throw new Error("MAIN_API_BASE not configured");
	const res = await fetch(`${base}/api/portfolio/${encodeURIComponent(username)}?token=${encodeURIComponent(token)}`, {
		next: { revalidate: 0 }
	});
	if (!res.ok) throw new Error("Failed to load portfolio");
	return res.json();
}

export default async function PreviewPage({ params, searchParams }: { params: { username: string }, searchParams: { token?: string, templateId?: string } }) {
	const token = searchParams.token;
	if (!token) {
		return (
			<html><body><p>Missing token</p></body></html>
		);
	}
	await verifyPreviewToken(token);

	const payload = await fetchPortfolio(params.username, token);
	const validation = validateAndNormalize(payload);
	if (!validation.ok) {
		return (
			<html><body><pre>{JSON.stringify(validation.error, null, 2)}</pre></body></html>
		);
	}
	const templateId = (payload?.templateId as string) || searchParams.templateId || "modern-resume";
	const templateInfo = getTemplateInfo(templateId);
	if (!templateInfo) {
		return (
			<html><body><p>Template not found</p></body></html>
		);
	}
	const { Component, css } = templateInfo;
	const html = await renderComponentToString(Component, { data: validation.normalized });
	return (
		<html>
			<head>
				<meta charSet="utf-8" />
				<title>Preview - {params.username}</title>
				<style dangerouslySetInnerHTML={{ __html: css }} />
			</head>
			<body dangerouslySetInnerHTML={{ __html: html }} />
		</html>
	);
}
