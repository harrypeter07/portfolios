import { notFound } from 'next/navigation';
import { getPortfolioFromDB } from '@/src/lib/database';
import { validateAndNormalize, getTemplateInfo } from '@/src/lib/renderer';
import { renderComponentToString } from '@/src/lib/server-render';

interface PortfolioPageProps {
	params: {
		username: string;
	};
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
	const { username } = params;
	
	try {
		// Fetch portfolio data from database
		const portfolioData = await getPortfolioFromDB(username);
		
		if (!portfolioData) {
			notFound();
		}

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

		// Return the rendered HTML
		return (
			<div dangerouslySetInnerHTML={{ __html: html }} />
		);
		
	} catch (error) {
		console.error('Portfolio page error:', error);
		notFound();
	}
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PortfolioPageProps) {
	const { username } = params;
	
	try {
		const portfolioData = await getPortfolioFromDB(username);
		
		if (!portfolioData) {
			return {
				title: 'Portfolio Not Found',
				description: 'The requested portfolio could not be found.'
			};
		}

		const personal = portfolioData.portfolioData?.personal;
		const metadata = portfolioData.portfolioData?.metadata;

		return {
			title: metadata?.title || `${personal?.firstName || ''} ${personal?.lastName || ''} - Portfolio`.trim(),
			description: metadata?.description || personal?.title || 'Portfolio',
			keywords: metadata?.keywords || [],
			openGraph: {
				title: metadata?.title || `${personal?.firstName || ''} ${personal?.lastName || ''} - Portfolio`.trim(),
				description: metadata?.description || personal?.title || 'Portfolio',
				url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/portfolio/${username}`,
				siteName: 'Portfolio',
				images: metadata?.ogImage ? [metadata.ogImage] : [],
				locale: 'en_US',
				type: 'website',
			},
			twitter: {
				card: 'summary_large_image',
				title: metadata?.title || `${personal?.firstName || ''} ${personal?.lastName || ''} - Portfolio`.trim(),
				description: metadata?.description || personal?.title || 'Portfolio',
				images: metadata?.ogImage ? [metadata.ogImage] : [],
			},
		};
	} catch (error) {
		return {
			title: 'Portfolio',
			description: 'Portfolio page'
		};
	}
}



