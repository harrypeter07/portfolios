import { NextResponse } from "next/server";
import { getAllManifests } from "@/src/templates/registry";

export async function GET() {
	return NextResponse.json(getAllManifests(), {
		headers: { "Cache-Control": "public, s-maxage=86400" }
	});
}
