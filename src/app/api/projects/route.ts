import { NextRequest, NextResponse } from "next/server";

import { listProjects } from "@/lib/projects";

export async function GET(request: NextRequest) {
  try {
    const featuredParam = request.nextUrl.searchParams.get("featured");

    if (featuredParam !== null && featuredParam !== "true") {
      return NextResponse.json(
        {
          error: "Invalid featured query parameter. Use featured=true.",
        },
        { status: 400 },
      );
    }

    const projects = await listProjects(featuredParam === "true");
    return NextResponse.json(projects, {
      headers: { "Cache-Control": "public, max-age=0, must-revalidate" },
    });
  } catch (error) {
    console.error("GET /api/projects failed:", error);

    return NextResponse.json(
      { error: "Failed to fetch projects." },
      { status: 500 },
    );
  }
}
