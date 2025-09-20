import { verifyPreviewToken } from "@/src/lib/auth";
import { validateAndNormalize, getTemplateInfo } from "@/src/lib/renderer";
import { renderComponentToString } from "@/src/lib/server-render";

export const dynamic = "force-dynamic";

async function fetchPortfolio(username: string, token: string) {
	const base = process.env.MAIN_API_BASE;
	if (!base) throw new Error("MAIN_API_BASE not configured");
	
	console.log(`Fetching portfolio for username: ${username} from ${base}`);
	const res = await fetch(`${base}/api/portfolio/${encodeURIComponent(username)}?token=${encodeURIComponent(token)}`, {
		next: { revalidate: 0 }
	});
	
	if (!res.ok) {
		console.error(`Failed to fetch portfolio: ${res.status} ${res.statusText}`);
		throw new Error(`Failed to load portfolio: ${res.status}`);
	}
	
	console.log(`Portfolio fetched successfully for ${username}`);
	return res.json();
}

export default async function PreviewPage({ params, searchParams }: { params: { username: string }, searchParams: { token?: string, templateId?: string } }) {
	const startTime = Date.now();
	const requestId = Math.random().toString(36).substring(7);
	
	try {
		console.log(`[${requestId}] GET /preview/${params.username} - Starting preview request`);
		
		const token = searchParams.token;
		if (!token) {
			console.error(`[${requestId}] Missing token for preview request`);
			return (
				<html>
					<head><title>Preview Error</title></head>
					<body>
						<h1>Preview Error</h1>
						<p>Missing authentication token</p>
						<p>Request ID: {requestId}</p>
					</body>
				</html>
			);
		}
		
		console.log(`[${requestId}] Verifying preview token`);
		await verifyPreviewToken(token);
		console.log(`[${requestId}] Token verification successful`);

		console.log(`[${requestId}] Fetching portfolio data for ${params.username}`);
		const payload = await fetchPortfolio(params.username, token);
		
		console.log(`[${requestId}] Validating portfolio data`);
		const validation = validateAndNormalize(payload);
		if (!validation.ok) {
			console.error(`[${requestId}] Portfolio validation failed:`, validation.error);
			return (
				<html>
					<head><title>Preview Error</title></head>
					<body>
						<h1>Portfolio Validation Error</h1>
						<pre>{JSON.stringify(validation.error, null, 2)}</pre>
						<p>Request ID: {requestId}</p>
					</body>
				</html>
			);
		}
		
		const templateId = (payload?.templateId as string) || searchParams.templateId || "modern-resume";
		console.log(`[${requestId}] Using template: ${templateId}`);
		
		const templateInfo = getTemplateInfo(templateId);
		if (!templateInfo) {
			console.error(`[${requestId}] Template not found: ${templateId}`);
			return (
				<html>
					<head><title>Preview Error</title></head>
					<body>
						<h1>Template Not Found</h1>
						<p>Template &quot;{templateId}&quot; is not available</p>
						<p>Request ID: {requestId}</p>
					</body>
				</html>
			);
		}
		
		console.log(`[${requestId}] Rendering template: ${templateInfo.manifest.name} v${templateInfo.manifest.version}`);
		const { Component, css } = templateInfo;
		const html = await renderComponentToString(Component, { data: validation.normalized });
		
		const duration = Date.now() - startTime;
		console.log(`[${requestId}] Preview rendered successfully in ${duration}ms`);
		
		return (
			<html>
				<head>
					<meta charSet="utf-8" />
					<title>Preview - {params.username}</title>
					<style dangerouslySetInnerHTML={{ __html: css }} />
					<meta name="request-id" content={requestId} />
					<meta name="render-time" content={`${duration}ms`} />
				</head>
				<body dangerouslySetInnerHTML={{ __html: html }} />
			</html>
		);
	} catch (error: any) {
		const duration = Date.now() - startTime;
		console.error(`[${requestId}] Preview failed after ${duration}ms:`, {
			error: error.message,
			stack: error.stack,
			username: params.username
		});
		
		return (
			<html>
				<head><title>Preview Error</title></head>
				<body>
					<h1>Preview Error</h1>
					<p>An error occurred while rendering the preview</p>
					<p>Error: {error.message}</p>
					<p>Request ID: {requestId}</p>
					<p>Duration: {duration}ms</p>
				</body>
			</html>
		);
	}
}
