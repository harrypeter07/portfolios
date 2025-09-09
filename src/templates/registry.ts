import ModernResume from "@/templates/modern-resume";
import modernManifest from "@/templates/modern-resume/manifest.json";

const registry = {
	"modern-resume": { Component: ModernResume, manifest: modernManifest }
} as const;

export type TemplateId = keyof typeof registry;

export function getTemplateById(id: string) {
	return (registry as any)[id] || null;
}

export function getAllManifests() {
	return Object.values(registry).map(r => r.manifest);
}
