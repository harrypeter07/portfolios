export const css = "";

export default function ModernResume({ data }: { data: any }) {
	const personal = data?.personal || {};
	const about = data?.about || {};
	const projects = data?.projects?.items || [];
	const jobs = data?.experience?.jobs || [];
	const degrees = data?.education?.degrees || [];

	return (
		<div style={{ fontFamily: "Inter, system-ui, sans-serif" }}>
			<section>
				<h1>{[personal.firstName, personal.lastName].filter(Boolean).join(" ") || personal.title || "Your Name"}</h1>
				<p>{personal.subtitle || personal.tagline || ""}</p>
				<p>{personal.email}</p>
			</section>
			{about?.summary && <section><p>{about.summary}</p></section>}
			{!!projects.length && (
				<section>
					<h2>Projects</h2>
					<ul>
						{projects.map((p: any, i: number) => (
							<li key={i}><strong>{p.title || p.name}</strong> — {p.description}</li>
						))}
					</ul>
				</section>
			)}
			{!!jobs.length && (
				<section>
					<h2>Experience</h2>
					<ul>
						{jobs.map((j: any, i: number) => (
							<li key={i}><strong>{j.position || j.title}</strong> @ {j.company} ({j.startDate}{j.endDate ? ` - ${j.endDate}` : " - Present"})</li>
						))}
					</ul>
				</section>
			)}
			{!!degrees.length && (
				<section>
					<h2>Education</h2>
					<ul>
						{degrees.map((d: any, i: number) => (
							<li key={i}><strong>{d.degree}</strong> in {d.field} — {d.institution}</li>
						))}
					</ul>
				</section>
			)}
		</div>
	);
}
