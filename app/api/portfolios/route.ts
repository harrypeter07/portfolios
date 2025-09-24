import { NextResponse } from "next/server";
import { verifyApiKey } from "@/src/lib/auth";
import { getAllPortfolios, createPortfolio } from "@/src/lib/database";

export async function GET(req: Request) {
	try {
		// Verify API key authentication
		await verifyApiKey(req.headers.get("authorization"));
		
		// Get all portfolios from database
		const portfolios = await getAllPortfolios();
		
		return NextResponse.json({
			portfolios,
			count: portfolios.length
		});
		
	} catch (error: any) {
		console.error("Get all portfolios error:", error);
		return NextResponse.json({ error: "Failed to fetch portfolios" }, { status: 500 });
	}
}

export async function POST(req: Request) {
	try {
		// Verify API key authentication
		await verifyApiKey(req.headers.get("authorization"));
		
		const portfolioData = await req.json();
		
		// Validate required fields
		if (!portfolioData.username) {
			return NextResponse.json({ error: "Username is required" }, { status: 400 });
		}
		
		if (!portfolioData.templateId) {
			return NextResponse.json({ error: "Template ID is required" }, { status: 400 });
		}
		
		// Create portfolio in database
		const result = await createPortfolio(portfolioData);
		
		return NextResponse.json({
			message: "Portfolio created successfully",
			id: result.insertedId,
			username: portfolioData.username
		}, { status: 201 });
		
	} catch (error: any) {
		console.error("Create portfolio error:", error);
		return NextResponse.json({ error: "Failed to create portfolio" }, { status: 500 });
	}
}

