import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import domains from "@/data/domains.json";

const VALID_SLUGS = new Set(domains.map((d) => d.slug));

export async function POST(req: NextRequest) {
  let slug: string;
  try {
    const body = await req.json();
    slug = typeof body.slug === "string" ? body.slug.trim() : "";
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!slug || !VALID_SLUGS.has(slug)) {
    return NextResponse.json({ ok: true }); // silently ignore unknown slugs
  }

  // Cloudflare injects CF-IPCountry on every request automatically (free tier)
  const country =
    req.headers.get("CF-IPCountry") ||
    req.headers.get("cf-ipcountry") ||
    "Unknown";

  try {
    await prisma.pageView.create({ data: { slug, country } });
  } catch (err) {
    console.error("pageview insert error:", err);
  }

  return NextResponse.json({ ok: true });
}
