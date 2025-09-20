import { normalizePortfolioData } from "shared/portfolioSchema";

export const css = `
	.modern-resume {
		font-family: 'Inter', system-ui, -apple-system, sans-serif;
		max-width: 800px;
		margin: 0 auto;
		padding: 20px;
		line-height: 1.6;
		color: #333;
	}
	.header {
		text-align: center;
		margin-bottom: 40px;
		border-bottom: 2px solid #e5e7eb;
		padding-bottom: 20px;
	}
	.name {
		font-size: 2.5rem;
		font-weight: 700;
		margin-bottom: 10px;
		color: #1f2937;
	}
	.subtitle {
		font-size: 1.25rem;
		color: #6b7280;
		margin-bottom: 8px;
		font-weight: 500;
	}
	.tagline {
		font-style: italic;
		color: #4b5563;
		margin-bottom: 20px;
	}
	.contact-info {
		display: flex;
		justify-content: center;
		gap: 20px;
		flex-wrap: wrap;
		margin-bottom: 10px;
	}
	.location {
		color: #6b7280;
		margin-bottom: 15px;
	}
	.social-links {
		display: flex;
		justify-content: center;
		gap: 15px;
		margin-top: 15px;
	}
	.social-links a {
		color: #3b82f6;
		text-decoration: none;
		font-weight: 500;
	}
	.social-links a:hover {
		text-decoration: underline;
	}
	.section {
		margin-bottom: 30px;
	}
	.section h2 {
		font-size: 1.5rem;
		font-weight: 600;
		color: #1f2937;
		margin-bottom: 15px;
		border-bottom: 1px solid #e5e7eb;
		padding-bottom: 5px;
	}
	.section h3 {
		font-size: 1.125rem;
		font-weight: 600;
		color: #374151;
		margin-bottom: 5px;
	}
	.section p {
		margin-bottom: 10px;
		color: #4b5563;
	}
	.job-item, .project-item, .degree-item {
		margin-bottom: 20px;
		padding-bottom: 15px;
		border-bottom: 1px solid #f3f4f6;
	}
	.job-item:last-child, .project-item:last-child, .degree-item:last-child {
		border-bottom: none;
	}
	.job-meta, .degree-meta {
		color: #6b7280;
		font-size: 0.9rem;
		margin-bottom: 8px;
	}
	.technologies {
		margin-top: 8px;
	}
	.tech-tag {
		display: inline-block;
		background: #f3f4f6;
		color: #374151;
		padding: 2px 8px;
		border-radius: 4px;
		font-size: 0.8rem;
		margin-right: 6px;
		margin-bottom: 4px;
	}
	.project-links {
		margin-top: 8px;
	}
	.project-links a {
		color: #3b82f6;
		text-decoration: none;
		margin-right: 15px;
		font-weight: 500;
	}
	.project-links a:hover {
		text-decoration: underline;
	}
	.skills-grid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 20px;
		margin-top: 10px;
	}
	.skill-category h3 {
		font-size: 1rem;
		margin-bottom: 8px;
		color: #374151;
	}
	.achievement-list {
		list-style: none;
		padding: 0;
	}
	.achievement-list li {
		padding: 4px 0;
		color: #4b5563;
	}
	@media (max-width: 600px) {
		.modern-resume {
			padding: 15px;
		}
		.name {
			font-size: 2rem;
		}
		.contact-info {
			flex-direction: column;
			gap: 8px;
		}
		.social-links {
			flex-wrap: wrap;
		}
	}
`;

export default function ModernResume({ data }: { data: any }) {
	const normalized = normalizePortfolioData(data);
	const { personal, about, projects, skills, experience, education, achievements, contact, metadata, theme } = normalized;

	return (
		<div className="modern-resume">
			{/* Personal Section */}
			<section className="header">
				<h1 className="name">{personal.fullName}</h1>
				{personal.subtitle && <h2 className="subtitle">{personal.subtitle}</h2>}
				{personal.tagline && <p className="tagline">{personal.tagline}</p>}
				{personal.availability && <p className="availability">{personal.availability}</p>}
				
				<div className="contact-info">
					{personal.email && <span>{personal.email}</span>}
					{personal.phone && <span>{personal.phone}</span>}
				</div>
				
				{personal.location && (
					<p className="location">
						{[personal.location.city, personal.location.state, personal.location.country].filter(Boolean).join(", ")}
					</p>
				)}
				
				{personal.social && (
					<div className="social-links">
						{personal.social.linkedin && <a href={personal.social.linkedin} target="_blank" rel="noopener">LinkedIn</a>}
						{personal.social.github && <a href={personal.social.github} target="_blank" rel="noopener">GitHub</a>}
						{personal.social.portfolio && <a href={personal.social.portfolio} target="_blank" rel="noopener">Portfolio</a>}
						{personal.social.twitter && <a href={personal.social.twitter} target="_blank" rel="noopener">Twitter</a>}
						{personal.social.medium && <a href={personal.social.medium} target="_blank" rel="noopener">Medium</a>}
						{personal.social.youtube && <a href={personal.social.youtube} target="_blank" rel="noopener">YouTube</a>}
					</div>
				)}
			</section>

			{/* About Section */}
			{(about.summary || about.bio) && (
				<section className="section">
					<h2>About</h2>
					{about.summary && <p>{about.summary}</p>}
					{about.bio && <p>{about.bio}</p>}
					{about.interests?.length > 0 && (
						<div>
							<h3>Interests</h3>
							<p>{about.interests.join(", ")}</p>
						</div>
					)}
					{about.personalValues?.length > 0 && (
						<div>
							<h3>Values</h3>
							<p>{about.personalValues.join(", ")}</p>
						</div>
					)}
					{about.funFacts?.length > 0 && (
						<div>
							<h3>Fun Facts</h3>
							<p>{about.funFacts.join(", ")}</p>
						</div>
					)}
				</section>
			)}

			{/* Skills Section */}
			{(skills.technical?.length > 0 || skills.soft?.length > 0 || skills.languages?.length > 0) && (
				<section className="section">
					<h2>Skills</h2>
					<div className="skills-grid">
						{/* Technical Skills */}
						{skills.technical?.length > 0 && (
							<div className="skill-category">
								<h3>Technical Skills</h3>
								{skills.technical.map((category: any, i: number) => (
									<div key={i}>
										<h4>{category.category}</h4>
										<div className="technologies">
											{category.skills?.map((skill: any, j: number) => (
												<span key={j} className="tech-tag" title={`${skill.level} - ${skill.years} years`}>
													{skill.name}
													{skill.certified && " ✓"}
												</span>
											))}
										</div>
									</div>
								))}
							</div>
						)}
						
						{/* Soft Skills */}
						{skills.soft?.length > 0 && (
							<div className="skill-category">
								<h3>Soft Skills</h3>
								<div className="technologies">
									{skills.soft.map((skill: any, i: number) => (
										<span key={i} className="tech-tag" title={skill.description}>
											{skill.name}
										</span>
									))}
								</div>
							</div>
						)}
						
						{/* Languages */}
						{skills.languages?.length > 0 && (
							<div className="skill-category">
								<h3>Languages</h3>
								<div className="technologies">
									{skills.languages.map((lang: any, i: number) => (
										<span key={i} className="tech-tag" title={lang.proficiency}>
											{lang.name} ({lang.proficiency})
										</span>
									))}
								</div>
							</div>
						)}
					</div>
				</section>
			)}

			{/* Experience Section */}
			{experience.length > 0 && (
				<section className="section">
					<h2>Experience</h2>
					{experience.map((job: any, i: number) => (
						<div key={i} className="job-item">
							<h3>{job.title} at {job.company}</h3>
							<div className="job-meta">
								{job.location && `${job.location} • `}
								{job.duration}
								{job.current && " • Current"}
							</div>
							{job.description && <p>{job.description}</p>}
							{job.technologies?.length > 0 && (
								<div className="technologies">
									{job.technologies.map((tech: string, j: number) => (
										<span key={j} className="tech-tag">{tech}</span>
									))}
								</div>
							)}
							{job.achievements?.length > 0 && (
								<div>
									<h4>Key Achievements:</h4>
									<ul>
										{job.achievements.map((achievement: string, j: number) => (
											<li key={j}>{achievement}</li>
										))}
									</ul>
								</div>
							)}
						</div>
					))}
				</section>
			)}

			{/* Projects Section */}
			{projects.length > 0 && (
				<section className="section">
					<h2>Projects</h2>
					{projects.map((project: any, i: number) => (
						<div key={i} className="project-item">
							<h3>{project.name}</h3>
							{project.description && <p>{project.description}</p>}
							{project.technologies?.length > 0 && (
								<div className="technologies">
									{project.technologies.map((tech: string, j: number) => (
										<span key={j} className="tech-tag">{tech}</span>
									))}
								</div>
							)}
							{(project.url || project.github) && (
								<div className="project-links">
									{project.url && <a href={project.url} target="_blank" rel="noopener">Live Demo</a>}
									{project.github && <a href={project.github} target="_blank" rel="noopener">GitHub</a>}
								</div>
							)}
						</div>
					))}
				</section>
			)}

			{/* Education Section */}
			{education.length > 0 && (
				<section className="section">
					<h2>Education</h2>
					{education.map((degree: any, i: number) => (
						<div key={i} className="degree-item">
							<h3>{degree.degree} in {degree.field}</h3>
							<p><strong>{degree.institution}</strong></p>
							<div className="degree-meta">
								{degree.location && `${degree.location} • `}
								{degree.year}
								{degree.gpa && ` • GPA: ${degree.gpa}`}
							</div>
							{degree.honors?.length > 0 && (
								<div>
									<h4>Honors:</h4>
									<p>{degree.honors.join(", ")}</p>
								</div>
							)}
						</div>
					))}
				</section>
			)}

			{/* Achievements Section */}
			{(achievements.awards?.length > 0 || achievements.certifications?.length > 0 || achievements.publications?.length > 0) && (
				<section className="section">
					<h2>Achievements</h2>
					{achievements.awards?.length > 0 && (
						<div>
							<h3>Awards</h3>
							<ul className="achievement-list">
								{achievements.awards.map((award: string, i: number) => (
									<li key={i}>{award}</li>
								))}
							</ul>
						</div>
					)}
					{achievements.certifications?.length > 0 && (
						<div>
							<h3>Certifications</h3>
							<ul className="achievement-list">
								{achievements.certifications.map((cert: string, i: number) => (
									<li key={i}>{cert}</li>
								))}
							</ul>
						</div>
					)}
					{achievements.publications?.length > 0 && (
						<div>
							<h3>Publications</h3>
							<ul className="achievement-list">
								{achievements.publications.map((pub: string, i: number) => (
									<li key={i}>{pub}</li>
								))}
							</ul>
						</div>
					)}
				</section>
			)}
		</div>
	);
}
