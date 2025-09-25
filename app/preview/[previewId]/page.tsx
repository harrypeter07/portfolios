import { notFound } from 'next/navigation';
import { getPreviewPortfolio } from '@/src/lib/database';
import { validateAndNormalize, getTemplateInfo } from '@/src/lib/renderer';
import { renderComponentToString } from '@/src/lib/server-render';

interface PreviewPageProps {
	params: {
		previewId: string;
	};
}

export default async function PreviewPage({ params }: PreviewPageProps) {
	const { previewId } = await params;
	
	try {
        // Fetch portfolio data from database
        const portfolioData = await getPreviewPortfolio(previewId);

        // Basic received data logging (privacy-safe)
        console.log('[preview] page load', {
            previewId,
            hasPortfolio: Boolean(portfolioData),
            templateId: portfolioData?.templateId,
            expiresAt: portfolioData?.expiresAt,
        });
		
		if (!portfolioData) {
			notFound();
		}

		// Expiration check is handled in getPreviewPortfolio

		// Validate and normalize data
        const validation = validateAndNormalize(portfolioData);
        if (!validation) {
            console.error('[preview] validation function returned null/undefined');
            notFound();
        }
		if (!validation.ok) {
			console.error('Data validation failed:', validation.error);
			notFound();
		}

		// Get template info
        const templateInfo = getTemplateInfo(portfolioData.templateId);
		if (!templateInfo) {
			console.error('Template not found:', portfolioData.templateId);
			notFound();
		}

		// Render component to HTML
        const { Component, css } = templateInfo as any;
        if (!Component) {
            console.error('[preview] template missing Component for', portfolioData.templateId);
            notFound();
        }

        // Detailed data logging (sizes and top-level keys only)
        try {
            const topLevelKeys = Object.keys(validation.normalized || {});
            const counts = {
                experience: Array.isArray((validation.normalized as any)?.experience) ? (validation.normalized as any).experience.length : 0,
                projects: Array.isArray((validation.normalized as any)?.projects) ? (validation.normalized as any).projects.length : 0,
                skills: Array.isArray((validation.normalized as any)?.skills?.technical) ? (validation.normalized as any).skills.technical.length : 0,
            };
            console.log('[preview] normalized stats', { topLevelKeys, counts });
        } catch (e) {
            console.warn('[preview] could not compute normalized stats');
        }

        const html = await renderComponentToString(Component, { data: validation.normalized });
        if (!html) {
            console.error('[preview] render returned empty HTML');
            notFound();
        }

		// Return the rendered HTML with preview styling
		return (
			<>
				<style dangerouslySetInnerHTML={{
					__html: `
						.preview-container {
							position: relative;
						}
						.preview-banner {
							position: fixed;
							top: 0;
							left: 0;
							right: 0;
							background: #3B82F6;
							color: white;
							padding: 8px 16px;
							font-size: 14px;
							font-weight: 500;
							z-index: 1000;
							display: flex;
							gap: 16px;
							align-items: center;
							box-shadow: 0 2px 4px rgba(0,0,0,0.1);
						}
						.preview-banner span {
							background: rgba(255,255,255,0.2);
							padding: 4px 8px;
							border-radius: 4px;
							font-size: 12px;
						}
					`
				}} />
                {/* Inject template-specific CSS if available */}
                {css ? (
                    <style dangerouslySetInnerHTML={{ __html: String(css) }} />
                ) : null}
				<div className="preview-container">
					<div className="preview-banner">
						<span>🔍 Preview Mode</span>
						<span>Template: {portfolioData.templateId}</span>
						{portfolioData.expiresAt && (
							<span>Expires: {new Date(portfolioData.expiresAt).toLocaleString()}</span>
						)}
					</div>
					<div dangerouslySetInnerHTML={{ __html: html }} />
				</div>
			</>
		);
		
	} catch (error) {
		console.error('Preview page error:', error);
		notFound();
	}
}

// Generate metadata for preview
export async function generateMetadata({ params }: PreviewPageProps) {
	const { previewId } = await params;
	return {
		title: 'Portfolio Preview',
		description: 'Preview of portfolio template',
		robots: 'noindex, nofollow', // Prevent indexing of preview pages
	};
}
