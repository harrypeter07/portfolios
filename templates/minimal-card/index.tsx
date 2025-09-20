export const css = ".card{border:1px solid #e5e7eb;padding:16px;border-radius:12px}.name{font-weight:600;font-size:20px}";

import { normalizePortfolioData } from "shared/portfolioSchema";

export default function MinimalCard({ data }: { data: any }) {
	const normalized = normalizePortfolioData(data);
	const { personal, projects } = normalized;
	
	return (
		<div className="card" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
			<div className="name">{personal.fullName}</div>
			{personal.subtitle && <div>{personal.subtitle}</div>}
			{personal.email && <div>{personal.email}</div>}
			{personal.phone && <div>{personal.phone}</div>}
			{personal.location && (
				<div style={{ color: "#6b7280", fontSize: "0.9rem" }}>
					{[personal.location.city, personal.location.state, personal.location.country].filter(Boolean).join(", ")}
				</div>
			)}
			{projects?.[0]?.description && <p style={{ marginTop: 8 }}>{projects[0].description}</p>}
			{personal.social && (
				<div style={{ marginTop: 8, display: "flex", gap: "8px", flexWrap: "wrap" }}>
					{personal.social.linkedin && <a href={personal.social.linkedin} target="_blank" rel="noopener" style={{ color: "#3b82f6", textDecoration: "none", fontSize: "0.9rem" }}>LinkedIn</a>}
					{personal.social.github && <a href={personal.social.github} target="_blank" rel="noopener" style={{ color: "#3b82f6", textDecoration: "none", fontSize: "0.9rem" }}>GitHub</a>}
					{personal.social.portfolio && <a href={personal.social.portfolio} target="_blank" rel="noopener" style={{ color: "#3b82f6", textDecoration: "none", fontSize: "0.9rem" }}>Portfolio</a>}
				</div>
			)}
		</div>
	);
}
