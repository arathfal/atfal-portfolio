import { NextRequest } from "next/server";

import { guardAdminApi, privateJson } from "@/lib/admin-api";
import { createUploadSignature } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;

  try {
    let target: "projects" | "career" = "projects";
    const contentType = request.headers.get("content-type");

    if (contentType?.includes("application/json")) {
      const body = (await request.json()) as { target?: unknown };
      if (body.target === "career") target = "career";
    }

    return privateJson(createUploadSignature(target));
  } catch (error) {
    console.error("Failed to create Cloudinary signature:", error);
    return privateJson(
      { error: "Image upload is not configured." },
      { status: 503 },
    );
  }
}
