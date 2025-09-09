export const css = ".card{border:1px solid #e5e7eb;padding:16px;border-radius:12px}.name{font-weight:600;font-size:20px}";

export default function MinimalCard({ data }: { data: any }) {
	const personal = data?.personal || {};
	const projects = data?.projects?.items || [];
	return (
		<div className="card" style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
			<div className="name">{[personal.firstName, personal.lastName].filter(Boolean).join(" ") || personal.title || "Your Name"}</div>
			{personal.subtitle && <div>{personal.subtitle}</div>}
			{personal.email && <div>{personal.email}</div>}
			{projects?.[0]?.description && <p style={{ marginTop: 8 }}>{projects[0].description}</p>}
		</div>
	);
}
