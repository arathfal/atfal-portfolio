import { NextRequest, NextResponse } from "next/server";

import { hasAdminSession } from "@/lib/auth";
import {
  getRequestHostname,
  isAdminHostname,
  isLocalHostname,
  normalizeHostname,
} from "@/lib/request";
import { siteUrl } from "@/lib/site";

const PUBLIC_FILE = /\.[^/]+$/;

function noStore(response: NextResponse): NextResponse {
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hostname = getRequestHostname(request);
  const onAdminHost = isAdminHostname(hostname);
  const isAdminApi = pathname.startsWith("/api/admin");
  const isAuthApi = pathname.startsWith("/api/auth");
  const vercelProductionHostname = normalizeHostname(
    process.env.VERCEL_PROJECT_PRODUCTION_URL ?? null,
  );

  if (
    process.env.NODE_ENV === "production" &&
    vercelProductionHostname &&
    hostname === vercelProductionHostname
  ) {
    const canonicalUrl = new URL(
      `${request.nextUrl.pathname}${request.nextUrl.search}`,
      siteUrl,
    );

    return NextResponse.redirect(canonicalUrl, 308);
  }

  if (isAdminApi || isAuthApi) {
    if (!onAdminHost && !isLocalHostname(hostname)) {
      return noStore(
        NextResponse.json({ error: "Not found." }, { status: 404 }),
      );
    }

    if (isAdminApi && !(await hasAdminSession(request))) {
      return noStore(
        NextResponse.json({ error: "Unauthorized." }, { status: 401 }),
      );
    }

    return noStore(NextResponse.next());
  }

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (!onAdminHost) {
    if (
      process.env.NODE_ENV === "production" &&
      pathname.startsWith("/admin")
    ) {
      return new NextResponse("Not found.", { status: 404 });
    }

    return NextResponse.next();
  }

  const isLogin = pathname === "/login";
  const hasSession = await hasAdminSession(request);

  if (!hasSession && !isLogin) {
    return noStore(NextResponse.redirect(new URL("/login", request.url)));
  }

  if (hasSession && isLogin) {
    return noStore(NextResponse.redirect(new URL("/", request.url)));
  }

  const url = request.nextUrl.clone();
  url.pathname =
    pathname === "/" ? "/admin" : `/admin${pathname.replace(/\/$/, "")}`;

  return noStore(NextResponse.rewrite(url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
