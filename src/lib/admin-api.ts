import { NextRequest, NextResponse } from "next/server";

import { hasAdminSession } from "@/lib/auth";
import {
  getRequestHostname,
  hasValidMutationOrigin,
  isAdminHostname,
  isLocalHostname,
} from "@/lib/request";

export function privateJson(body: unknown, init?: ResponseInit): NextResponse {
  const response = NextResponse.json(body, init);
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function guardAdminApi(
  request: NextRequest,
): Promise<NextResponse | null> {
  const hostname = getRequestHostname(request);

  if (!isAdminHostname(hostname) && !isLocalHostname(hostname)) {
    return privateJson({ error: "Not found." }, { status: 404 });
  }

  if (!(await hasAdminSession(request))) {
    return privateJson({ error: "Unauthorized." }, { status: 401 });
  }

  if (
    request.method !== "GET" &&
    request.method !== "HEAD" &&
    !hasValidMutationOrigin(request)
  ) {
    return privateJson({ error: "Invalid request origin." }, { status: 403 });
  }

  return null;
}
