import { validatePortfolio } from "shared/portfolioSchema";
import { getTemplateById } from "@/src/templates/registry";
import { renderToString } from "react-dom/server";

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
	const normalized = (parsed.data as any).portfolioData || (parsed.data as any);
	return { ok: true as const, parsed: parsed.data, normalized };
}

export function renderTemplateToHtml(templateId: string, normalizedData: any): { html: string; version: string } | null {
	const entry = getTemplateById(templateId) as any;
	if (!entry) return null;
	const { Component, manifest } = entry;
	const html = renderToString(<Component data={normalizedData} />);
	return { html, version: manifest.version };
}
