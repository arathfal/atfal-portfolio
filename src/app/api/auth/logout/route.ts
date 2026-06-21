import { NextRequest } from "next/server";

import { clearAdminSessionCookie } from "@/lib/auth";
import { privateJson } from "@/lib/admin-api";
import { hasValidMutationOrigin } from "@/lib/request";

export async function POST(request: NextRequest) {
  if (!hasValidMutationOrigin(request)) {
    return privateJson({ error: "Invalid request origin." }, { status: 403 });
  }

  const response = privateJson({ success: true });
  clearAdminSessionCookie(response);
  return response;
}
