import { NextRequest } from "next/server";

import {
  createAdminSession,
  setAdminSessionCookie,
  verifyAdminCredentials,
} from "@/lib/auth";
import { privateJson } from "@/lib/admin-api";
import {
  getRequestHostname,
  hasValidMutationOrigin,
  isAdminHostname,
  isLocalHostname,
} from "@/lib/request";

export async function POST(request: NextRequest) {
  const hostname = getRequestHostname(request);

  if (
    (!isAdminHostname(hostname) && !isLocalHostname(hostname)) ||
    !hasValidMutationOrigin(request)
  ) {
    return privateJson({ error: "Invalid request." }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return privateJson({ error: "Invalid credentials." }, { status: 401 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    !("username" in body) ||
    !("password" in body) ||
    typeof body.username !== "string" ||
    typeof body.password !== "string" ||
    !verifyAdminCredentials(body.username, body.password)
  ) {
    return privateJson({ error: "Invalid credentials." }, { status: 401 });
  }

  const token = await createAdminSession(body.username);
  const response = privateJson({ success: true });
  setAdminSessionCookie(response, token);
  return response;
}
