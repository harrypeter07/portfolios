import { NextResponse } from "next/server";
import { verifyApiKey } from "@/src/lib/auth";
import { validateAndNormalize } from "@/src/lib/renderer";
import { createPortfolio, getPortfolioFromDB } from "@/src/lib/database";

export async function POST(req: Request) {
	const startTime = Date.now();
	const requestId = Math.random().toString(36).substring(7);
	
	try {
		console.log(`[${requestId}] POST /api/templates/publish - Publishing portfolio`);
		
		// Verify API key authentication
		await verifyApiKey(req.headers.get("authorization"));
		console.log(`[${requestId}] API key verification successful`);

		const { 
			username, 
			templateId, 
			templateName, 
			templateType, 
			templateSource, 
			isRemoteTemplate, 
			portfolioData, 
			layout, 
			options 
		} = await req.json();
		
		console.log(`[${requestId}] Username: ${username}, Template: ${templateId}, Type: ${templateType}`);
		
		// Validate required fields
		if (!username) {
			return NextResponse.json({ error: "Username is required" }, { status: 400 });
		}

		if (!templateId) {
			return NextResponse.json({ error: "Template ID is required" }, { status: 400 });
		}

		if (!portfolioData) {
			return NextResponse.json({ error: "Portfolio data is required" }, { status: 400 });
		}

        // Upsert behavior: update if exists, else create
        const existingPortfolio = await getPortfolioFromDB(username);

		// Validate and normalize portfolio data
		const validation = validateAndNormalize(portfolioData);
		if (!validation.ok) {
			console.error(`[${requestId}] Data validation failed:`, validation.error);
			return NextResponse.json({ errors: validation.error }, { status: 400 });
		}
		console.log(`[${requestId}] Data validation successful`);

		// Create portfolio structure
		const portfolioStructure = {
			username,
			templateId,
			templateName: templateName || templateId,
			templateType: templateType || "component",
			templateSource: templateSource || "local",
			isRemoteTemplate: isRemoteTemplate || false,
			portfolioData: validation.parsed,
			layout: layout || {},
			options: options || {},
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		};

        let insertedId: any = null;
        if (existingPortfolio) {
            // Update existing
            const { updatePortfolio } = await import("@/src/lib/database");
            await updatePortfolio(username, portfolioStructure);
            insertedId = existingPortfolio._id || existingPortfolio.id || username;
            console.log(`[${requestId}] Portfolio updated for username: ${username}`);
        } else {
            // Create new
            const result = await createPortfolio(portfolioStructure);
            insertedId = result.insertedId;
            console.log(`[${requestId}] Portfolio created with ID: ${insertedId}`);
        }

		// Generate URLs
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001';
		const portfolioUrl = `${baseUrl}/portfolio/${username}`;
        const previewUrl = `${baseUrl}/preview/${insertedId}`;

		const response = {
			success: true,
            portfolioId: insertedId,
			username,
			portfolioUrl,
			previewUrl,
			templateId,
			templateName: portfolioStructure.templateName,
			templateType: portfolioStructure.templateType,
			createdAt: portfolioStructure.createdAt
		};

		const duration = Date.now() - startTime;
		console.log(`[${requestId}] Portfolio published successfully in ${duration}ms`);
		
		return NextResponse.json(response, {
			headers: { 
				"X-Request-ID": requestId,
				"X-Response-Time": `${duration}ms`
			}
		});
		
	} catch (error: any) {
		const duration = Date.now() - startTime;
		console.error(`[${requestId}] Portfolio publishing failed after ${duration}ms:`, {
			error: error.message,
			stack: error.stack
		});
		
		return NextResponse.json({ 
			error: "Failed to publish portfolio",
			requestId,
			timestamp: new Date().toISOString()
		}, { 
			status: 500,
			headers: { "X-Request-ID": requestId }
		});
	}
}
