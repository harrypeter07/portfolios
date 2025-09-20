import { validatePortfolio, normalizePortfolioData } from "shared/portfolioSchema";
import { getTemplateById } from "@/src/templates/registry";

export type RenderInput = {
	templateId: string;
	data: unknown;
	options?: Record<string, unknown>;
};

export function validateAndNormalize(data: unknown) {
	const parsed = validatePortfolio(data);
	if (!parsed.success) {
		return { ok: false as const, error: parsed.error.flatten() };
	}
	
	// Handle new schema format (data.data) or legacy format (portfolioData)
	const portfolioData = (parsed.data as any).data || (parsed.data as any).portfolioData || (parsed.data as any);
	const normalized = normalizePortfolioData(portfolioData);
	return { ok: true as const, parsed: parsed.data, normalized };
}

export function getTemplateInfo(templateId: string): { Component: any; manifest: any; css: string } | null {
	const entry = getTemplateById(templateId) as any;
	if (!entry) return null;
	const { Component, manifest, css } = entry;
	return { Component, manifest, css: css || "" };
}
