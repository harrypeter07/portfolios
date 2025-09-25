import ModernResume, { css as modernCss } from "@/templates/modern-resume";
import modernManifest from "@/templates/modern-resume/manifest.json";
import MinimalCard, { css as minimalCss } from "@/templates/minimal-card";
import minimalManifest from "@/templates/minimal-card/manifest.json";

const registry = {
	"modern-resume": { Component: ModernResume, manifest: modernManifest, css: modernCss || "" },
	"minimal-card": { Component: MinimalCard, manifest: minimalManifest, css: minimalCss || "" },
	// Alias to support legacy IDs from the main app
	"cleanfolio": { Component: ModernResume, manifest: modernManifest, css: modernCss || "" }
} as const;

export type TemplateId = keyof typeof registry;

export function getTemplateById(id: string) {
	return (registry as any)[id] || null;
}

export function getAllManifests() {
	return Object.values(registry).map(r => r.manifest);
}
