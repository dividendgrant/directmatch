import { Suspense } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import LeadFormA from "@/components/LeadFormA";
import SourceNotice from "@/components/SourceNotice";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}): Promise<Metadata> {
  const { d } = await searchParams;
  const domain = d || "this domain";
  const display = formatDisplay(domain);
  return {
    title: `${display} is For Sale – DirectMatch.com`,
    description: `${display} is available for purchase. Submit an offer to get started.`,
  };
}

function formatDisplay(domain: string): string {
  if (!domain) return "This Domain";
  // "aifin.com" → "Aifin.com"
  return domain.charAt(0).toUpperCase() + domain.slice(1);
}

export default async function LanderPage({
  searchParams,
}: {
  searchParams: Promise<{ d?: string }>;
}) {
  const { d } = await searchParams;
  const domain = (d || "").toLowerCase().trim();

  // Safety net: if domain is missing or looks invalid, send to buy page
  const looksValid = domain.length > 0 && domain.includes(".");
  if (!looksValid) {
    redirect("/buy-a-domain-name/");
  }

  const display = formatDisplay(domain);

  // Server-side visit logging — Cloudflare injects CF-IPCountry on every request
  if (domain) {
    try {
      const headersList = await headers();
      const country =
        headersList.get("cf-ipcountry") ||
        headersList.get("CF-IPCountry") ||
        "Unknown";
      await prisma.pageView.create({ data: { slug: domain, country } });
    } catch (err) {
      console.error("pageview log error:", err);
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <Suspense fallback={null}>
        <SourceNotice />
      </Suspense>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {display} is For Sale
      </h1>

      <p className="text-gray-500 mb-8">
        Complete this form to submit an offer on {display}:
      </p>

      <Suspense fallback={null}>
        <LeadFormA prefilledDomain={domain} />
      </Suspense>
    </div>
  );
}
