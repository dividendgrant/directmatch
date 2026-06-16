import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const OWN_DOMAINS = ["directmatch.com", "localhost", "127.0.0.1"];

// These paths must work on external domains (form redirect, assets)
const PASS_THROUGH_PREFIXES = ["/thank-you", "/api/", "/_next/", "/favicon"];

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  const isOwnDomain = OWN_DOMAINS.some((d) => host.includes(d));

  if (isOwnDomain) return NextResponse.next();

  // External domain — check if path should pass through
  const { pathname } = request.nextUrl;
  if (PASS_THROUGH_PREFIXES.some((p) => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // Rewrite to lander, keeping the URL in the browser as the original domain
  const domain = host.replace(/^www\./i, "").toLowerCase();
  const url = request.nextUrl.clone();
  url.pathname = "/lander";
  url.search = `?d=${encodeURIComponent(domain)}`;

  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon\\.ico).*)"],
};
