import { NextResponse } from "next/server";
import { connectToDatabase } from "@/src/lib/database";

export async function GET(req: Request) {
	try {
		// Test database connection
		const { client, db } = await connectToDatabase();
		
		// Test a simple query
		const collections = await db.listCollections().toArray();
		
		return NextResponse.json({
			status: "healthy",
			database: "connected",
			collections: collections.map(c => c.name),
			timestamp: new Date().toISOString()
		});
		
	} catch (error: any) {
		console.error("Database health check error:", error);
		return NextResponse.json({
			status: "unhealthy",
			database: "disconnected",
			error: error.message,
			timestamp: new Date().toISOString()
		}, { status: 500 });
	}
}

