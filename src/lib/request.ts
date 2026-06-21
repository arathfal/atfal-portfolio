import type { NextRequest } from "next/server";

export const ADMIN_HOSTNAME =
  process.env.ADMIN_HOSTNAME ?? "admin.aradea-atfal.my.id";

export function normalizeHostname(value: string | null): string {
  return (value ?? "").split(",")[0].trim().replace(/:\d+$/, "").toLowerCase();
}

export function getRequestHostname(request: NextRequest): string {
  return normalizeHostname(
    request.headers.get("x-forwarded-host") ?? request.headers.get("host"),
  );
}

export function isAdminHostname(hostname: string): boolean {
  return (
    hostname === ADMIN_HOSTNAME ||
    hostname === "admin.localhost" ||
    hostname.endsWith(".admin.localhost")
  );
}

export function isLocalHostname(hostname: string): boolean {
  return hostname === "localhost" || hostname.endsWith(".localhost");
}

export function hasValidMutationOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");

  if (!origin) {
    return false;
  }

  try {
    return (
      normalizeHostname(new URL(origin).host) === getRequestHostname(request)
    );
  } catch {
    return false;
  }
}
