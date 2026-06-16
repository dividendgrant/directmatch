import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Client-side fallback endpoint — lander pages log server-side directly,
// but this stays available for any future client-side tracking needs.
export async function POST(req: NextRequest) {
  let slug: string;
  try {
    const body = await req.json();
    slug = typeof body.slug === "string" ? body.slug.trim() : "";
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (!slug) return NextResponse.json({ ok: true });

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
