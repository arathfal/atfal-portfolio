import { NextResponse } from "next/server";

import { listExperiences } from "@/lib/experiences";

export async function GET() {
  try {
    const experiences = await listExperiences();
    return NextResponse.json(experiences, {
      headers: { "Cache-Control": "public, max-age=0, must-revalidate" },
    });
  } catch (error) {
    console.error("GET /api/career failed:", error);

    return NextResponse.json(
      { error: "Failed to fetch career experiences." },
      { status: 500 },
    );
  }
}
