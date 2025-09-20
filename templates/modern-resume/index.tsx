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
	.availability {
		color: #059669;
		font-weight: 500;
		margin-bottom: 15px;
	}
	.project-meta {
		margin: 8px 0;
	}
	.project-category, .project-status {
		display: inline-block;
		background: #f3f4f6;
		color: #374151;
		padding: 2px 8px;
		border-radius: 4px;
		font-size: 0.8rem;
		margin-right: 8px;
	}
	.project-metrics {
		background: #f9fafb;
		padding: 12px;
		border-radius: 6px;
		margin: 12px 0;
	}
	.project-testimonial {
		background: #f0f9ff;
		padding: 12px;
		border-left: 4px solid #3b82f6;
		margin: 12px 0;
	}
	.project-testimonial blockquote {
		margin: 0 0 8px 0;
		font-style: italic;
	}
	.project-testimonial cite {
		font-size: 0.9rem;
		color: #6b7280;
	}
	.achievement-item {
		margin-bottom: 20px;
		padding-bottom: 15px;
		border-bottom: 1px solid #f3f4f6;
	}
	.achievement-item:last-child {
		border-bottom: none;
	}
	.achievement-date {
		color: #6b7280;
		font-size: 0.9rem;
		margin: 4px 0;
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
							
							{job.responsibilities?.length > 0 && (
								<div>
									<h4>Key Responsibilities:</h4>
									<ul>
										{job.responsibilities.map((resp: string, j: number) => (
											<li key={j}>{resp}</li>
										))}
									</ul>
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
							
							{job.technologies?.length > 0 && (
								<div className="technologies">
									{job.technologies.map((tech: string, j: number) => (
										<span key={j} className="tech-tag">{tech}</span>
									))}
								</div>
							)}
							
							{job.projects?.length > 0 && (
								<div>
									<h4>Notable Projects:</h4>
									<p>{job.projects.join(", ")}</p>
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
							{project.longDescription && <p>{project.longDescription}</p>}
							
							{project.category && (
								<div className="project-meta">
									<span className="project-category">{project.category}</span>
									{project.status && <span className="project-status">{project.status}</span>}
								</div>
							)}
							
							{project.technologies?.length > 0 && (
								<div className="technologies">
									{project.technologies.map((tech: string, j: number) => (
										<span key={j} className="tech-tag">{tech}</span>
									))}
								</div>
							)}
							
							{project.features?.length > 0 && (
								<div>
									<h4>Key Features:</h4>
									<ul>
										{project.features.map((feature: string, j: number) => (
											<li key={j}>{feature}</li>
										))}
									</ul>
								</div>
							)}
							
							{project.metrics && (
								<div className="project-metrics">
									<h4>Impact:</h4>
									{Object.entries(project.metrics).map(([key, value]: [string, any]) => (
										<p key={key}><strong>{key}:</strong> {value}</p>
									))}
								</div>
							)}
							
							{(project.url || project.github || project.links) && (
								<div className="project-links">
									{project.url && <a href={project.url} target="_blank" rel="noopener">Live Demo</a>}
									{project.github && <a href={project.github} target="_blank" rel="noopener">GitHub</a>}
									{project.links?.live && <a href={project.links.live} target="_blank" rel="noopener">Live Demo</a>}
									{project.links?.github && <a href={project.links.github} target="_blank" rel="noopener">GitHub</a>}
									{project.links?.demo && <a href={project.links.demo} target="_blank" rel="noopener">Demo</a>}
									{project.links?.documentation && <a href={project.links.documentation} target="_blank" rel="noopener">Docs</a>}
								</div>
							)}
							
							{project.testimonial && (
								<div className="project-testimonial">
									<blockquote>"{project.testimonial.text}"</blockquote>
									<cite>— {project.testimonial.author}, {project.testimonial.title}</cite>
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
								{degree.year}
								{degree.grade && ` • ${degree.grade}`}
								{degree.current && " • Current"}
							</div>
							{degree.description && <p>{degree.description}</p>}
							
							{degree.courses?.length > 0 && (
								<div>
									<h4>Relevant Coursework:</h4>
									<p>{degree.courses.join(", ")}</p>
								</div>
							)}
							
							{degree.activities?.length > 0 && (
								<div>
									<h4>Activities:</h4>
									<p>{degree.activities.join(", ")}</p>
								</div>
							)}
							
							{degree.honors?.length > 0 && (
								<div>
									<h4>Honors:</h4>
									<p>{degree.honors.join(", ")}</p>
								</div>
							)}
							
							{degree.thesis && (
								<div>
									<h4>Thesis:</h4>
									<p>{degree.thesis}</p>
								</div>
							)}
						</div>
					))}
				</section>
			)}

			{/* Achievements Section */}
			{(achievements.awards?.length > 0 || achievements.certifications?.length > 0 || achievements.publications?.length > 0 || achievements.patents?.length > 0) && (
				<section className="section">
					<h2>Achievements</h2>
					
					{/* Awards */}
					{achievements.awards?.length > 0 && (
						<div>
							<h3>Awards</h3>
							{achievements.awards.map((award: any, i: number) => (
								<div key={i} className="achievement-item">
									<h4>{award.title}</h4>
									<p><strong>{award.organization}</strong></p>
									{award.date && <p className="achievement-date">{award.date}</p>}
									{award.description && <p>{award.description}</p>}
									{award.link && <a href={award.link} target="_blank" rel="noopener">View Award</a>}
								</div>
							))}
						</div>
					)}
					
					{/* Certifications */}
					{achievements.certifications?.length > 0 && (
						<div>
							<h3>Certifications</h3>
							{achievements.certifications.map((cert: any, i: number) => (
								<div key={i} className="achievement-item">
									<h4>{cert.name}</h4>
									<p><strong>{cert.organization}</strong></p>
									{cert.issueDate && <p className="achievement-date">Issued: {cert.issueDate}</p>}
									{cert.expiryDate && <p className="achievement-date">Expires: {cert.expiryDate}</p>}
									{cert.credentialId && <p>Credential ID: {cert.credentialId}</p>}
									{cert.verificationLink && <a href={cert.verificationLink} target="_blank" rel="noopener">Verify</a>}
									{cert.skills?.length > 0 && (
										<div className="technologies">
											{cert.skills.map((skill: string, j: number) => (
												<span key={j} className="tech-tag">{skill}</span>
											))}
										</div>
									)}
								</div>
							))}
						</div>
					)}
					
					{/* Publications */}
					{achievements.publications?.length > 0 && (
						<div>
							<h3>Publications</h3>
							{achievements.publications.map((pub: any, i: number) => (
								<div key={i} className="achievement-item">
									<h4>{pub.title}</h4>
									<p><strong>{pub.publisher}</strong> • {pub.type}</p>
									{pub.date && <p className="achievement-date">{pub.date}</p>}
									{pub.description && <p>{pub.description}</p>}
									{pub.citations && <p>Citations: {pub.citations}</p>}
									{pub.link && <a href={pub.link} target="_blank" rel="noopener">Read</a>}
									{pub.coAuthors?.length > 0 && <p>Co-authors: {pub.coAuthors.join(", ")}</p>}
								</div>
							))}
						</div>
					)}
					
					{/* Patents */}
					{achievements.patents?.length > 0 && (
						<div>
							<h3>Patents</h3>
							{achievements.patents.map((patent: any, i: number) => (
								<div key={i} className="achievement-item">
									<h4>{patent.title}</h4>
									<p>Patent #{patent.number} • Status: {patent.status}</p>
									{patent.date && <p className="achievement-date">{patent.date}</p>}
									{patent.description && <p>{patent.description}</p>}
									{patent.inventors?.length > 0 && <p>Inventors: {patent.inventors.join(", ")}</p>}
									{patent.assignee && <p>Assignee: {patent.assignee}</p>}
								</div>
							))}
						</div>
					)}
				</section>
			)}
		</div>
	);
}
