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
	const { previewId } = params;
	
	try {
		// Fetch portfolio data from database
		const portfolioData = await getPreviewPortfolio(previewId);
		
		if (!portfolioData) {
			notFound();
		}

		// Expiration check is handled in getPreviewPortfolio

		// Validate and normalize data
		const validation = validateAndNormalize(portfolioData);
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
		const { Component } = templateInfo;
		const html = await renderComponentToString(Component, { data: validation.normalized });

		// Return the rendered HTML with preview styling
		return (
			<div className="preview-container">
				<div className="preview-banner">
					<span>🔍 Preview Mode</span>
					<span>Template: {portfolioData.templateId}</span>
					{portfolioData.expiresAt && (
						<span>Expires: {new Date(portfolioData.expiresAt).toLocaleString()}</span>
					)}
				</div>
				<div dangerouslySetInnerHTML={{ __html: html }} />
				<style jsx>{`
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
				`}</style>
			</div>
		);
		
	} catch (error) {
		console.error('Preview page error:', error);
		notFound();
	}
}

// Generate metadata for preview
export async function generateMetadata({ params }: PreviewPageProps) {
	return {
		title: 'Portfolio Preview',
		description: 'Preview of portfolio template',
		robots: 'noindex, nofollow', // Prevent indexing of preview pages
	};
}
