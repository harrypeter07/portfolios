import { validatePortfolio, normalizePortfolioData } from "shared/portfolioSchema";
import { getTemplateById } from "@/src/templates/registry";

export type RenderInput = {
	templateId: string;
	data: unknown;
	options?: Record<string, unknown>;
};

export function validateAndNormalize(data: unknown) {
	// First try to validate with the new schema
	const newParsed = validatePortfolio(data);
	if (newParsed.success) {
		// Handle new schema format (data.data) or legacy format (portfolioData)
		const portfolioData = (newParsed.data as any).data || (newParsed.data as any).portfolioData || (newParsed.data as any);
		const normalized = normalizePortfolioData(portfolioData);
		return { ok: true as const, parsed: newParsed.data, normalized };
	}
	
	// If new schema fails, try to handle as raw portfolio data
	if (typeof data === 'object' && data !== null) {
		const dataObj = data as any;
		
		// Check if it has the structure we expect (personal, about, etc.)
		if (dataObj.personal || dataObj.about || dataObj.experience || dataObj.projects) {
			const normalized = normalizePortfolioData(dataObj);
			return { ok: true as const, parsed: dataObj, normalized };
		}
		
		// Check if it's wrapped in a data property
		if (dataObj.data && (dataObj.data.personal || dataObj.data.about || dataObj.data.experience || dataObj.data.projects)) {
			const normalized = normalizePortfolioData(dataObj.data);
			return { ok: true as const, parsed: dataObj, normalized };
		}
	}
	
	// If all else fails, return the validation error
	return { ok: false as const, error: newParsed.error.flatten() };
}

export function getTemplateInfo(templateId: string): { Component: any; manifest: any; css: string } | null {
	const entry = getTemplateById(templateId) as any;
	if (!entry) return null;
	const { Component, manifest, css } = entry;
	return { Component, manifest, css: css || "" };
}
