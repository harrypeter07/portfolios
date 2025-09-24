import { NextResponse } from "next/server";
import { verifyApiKey } from "@/src/lib/auth";
import { getPortfolioFromDB, updatePortfolio, deletePortfolio } from "@/src/lib/database";

export async function GET(
	req: Request,
	{ params }: { params: { username: string } }
) {
	try {
		// Verify API key authentication
		await verifyApiKey(req.headers.get("authorization"));
		
		const { username } = params;
		
		// Fetch portfolio data from database
		const portfolioData = await getPortfolioFromDB(username);
		
		if (!portfolioData) {
			return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
		}
		
		return NextResponse.json(portfolioData);
		
	} catch (error: any) {
		console.error("Get portfolio error:", error);
		return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
	}
}

export async function PUT(
	req: Request,
	{ params }: { params: { username: string } }
) {
	try {
		// Verify API key authentication
		await verifyApiKey(req.headers.get("authorization"));
		
		const { username } = params;
		const portfolioData = await req.json();
		
		// Update portfolio data in database
		const result = await updatePortfolio(username, portfolioData);
		
		if (result.matchedCount === 0) {
			return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
		}
		
		return NextResponse.json({ 
			message: "Portfolio updated successfully",
			modifiedCount: result.modifiedCount 
		});
		
	} catch (error: any) {
		console.error("Update portfolio error:", error);
		return NextResponse.json({ error: "Failed to update portfolio" }, { status: 500 });
	}
}

export async function DELETE(
	req: Request,
	{ params }: { params: { username: string } }
) {
	try {
		// Verify API key authentication
		await verifyApiKey(req.headers.get("authorization"));
		
		const { username } = params;
		
		// Delete portfolio from database
		const result = await deletePortfolio(username);
		
		if (result.deletedCount === 0) {
			return NextResponse.json({ error: "Portfolio not found" }, { status: 404 });
		}
		
		return NextResponse.json({ 
			message: "Portfolio deleted successfully",
			deletedCount: result.deletedCount 
		});
		
	} catch (error: any) {
		console.error("Delete portfolio error:", error);
		return NextResponse.json({ error: "Failed to delete portfolio" }, { status: 500 });
	}
}
