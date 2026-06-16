import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Domain Portfolio Management",
  description: "Professional domain portfolio management services for investors and enterprises. DirectMatch.com handles renewals, valuations, and strategic sales.",
};

const features = [
  {
    title: "Portfolio Audits",
    description: "We evaluate your entire domain portfolio to identify underperformers, hidden gems, and opportunities for consolidation or expansion.",
  },
  {
    title: "Renewal Management",
    description: "Never let a valuable domain expire. We track and manage all renewal dates, alerting you to upcoming expirations and handling auto-renewals.",
  },
  {
    title: "Valuation Reports",
    description: "Receive periodic market valuation reports for your portfolio, based on comparable sales data and current market conditions.",
  },
  {
    title: "Monetization Strategy",
    description: "Turn parked domains into revenue with parking programs, mini-sites, or strategic leasing while you wait for the right buyer.",
  },
  {
    title: "Strategic Acquisition",
    description: "We identify and acquire complementary domains to strengthen your portfolio and protect your brand across extensions and variations.",
  },
  {
    title: "Exit Planning",
    description: "When you're ready to sell, we develop and execute a strategic liquidation plan to maximize the value of your domain portfolio.",
  },
];

async function getTrafficData() {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const rows = await prisma.pageView.groupBy({
    by: ["slug", "country"],
    _count: { id: true },
    where: { createdAt: { gte: since } },
    orderBy: { _count: { id: "desc" } },
  });

  // Build per-slug map: { slug -> { country -> count } }
  const map: Record<string, Record<string, number>> = {};
  for (const row of rows) {
    if (!map[row.slug]) map[row.slug] = {};
    map[row.slug][row.country] = row._count.id;
  }

  // Summarise each slug
  const summary = Object.entries(map).map(([slug, countries]) => {
    const total = Object.values(countries).reduce((a, b) => a + b, 0);
    const us = countries["US"] ?? 0;
    const foreign = total - us;

    // Top 3 foreign countries sorted by count
    const topForeign = Object.entries(countries)
      .filter(([c]) => c !== "US" && c !== "Unknown")
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return { slug, total, us, foreign, topForeign };
  });

  // Sort by foreign traffic descending
  summary.sort((a, b) => b.foreign - a.foreign);
  return summary;
}

// Country code → flag emoji
function flag(code: string) {
  if (code.length !== 2) return "";
  return String.fromCodePoint(
    ...code.toUpperCase().split("").map((c) => 0x1f1e6 - 65 + c.charCodeAt(0))
  );
}

export default async function ManagementPage() {
  const traffic = await getTrafficData();
  const totalViews = traffic.reduce((a, b) => a + b.total, 0);
  const totalForeign = traffic.reduce((a, b) => a + b.foreign, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">

      {/* ── Traffic Tracker ────────────────────────────────────────────── */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-[#1a4c72] mb-1">Domain Traffic — Last 30 Days</h2>
        <p className="text-sm text-gray-500 mb-6">
          Sorted by foreign (non-US) requests. Use this to identify domains driving high overseas
          traffic that you may want to redirect or remove.
        </p>

        {totalViews === 0 ? (
          <div className="border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
            No page views recorded yet. Traffic will appear here once visitors start hitting domain pages.
          </div>
        ) : (
          <>
            {/* Summary pills */}
            <div className="flex gap-4 mb-6 flex-wrap">
              <div className="bg-[#eef4fa] rounded-lg px-4 py-2 text-sm">
                <span className="font-semibold text-[#1a4c72]">{totalViews.toLocaleString()}</span>
                <span className="text-gray-500 ml-1">total visits</span>
              </div>
              <div className="bg-[#fff8ec] rounded-lg px-4 py-2 text-sm">
                <span className="font-semibold text-amber-600">{totalForeign.toLocaleString()}</span>
                <span className="text-gray-500 ml-1">foreign visits
                  ({totalViews > 0 ? Math.round(totalForeign / totalViews * 100) : 0}%)</span>
              </div>
              <div className="bg-gray-50 rounded-lg px-4 py-2 text-sm">
                <span className="font-semibold text-gray-700">{traffic.length}</span>
                <span className="text-gray-500 ml-1">domains with traffic</span>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-gray-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                    <th className="px-4 py-3 font-semibold">Domain Slug</th>
                    <th className="px-4 py-3 font-semibold text-right">Total</th>
                    <th className="px-4 py-3 font-semibold text-right">🇺🇸 US</th>
                    <th className="px-4 py-3 font-semibold text-right">Foreign</th>
                    <th className="px-4 py-3 font-semibold text-right">Foreign %</th>
                    <th className="px-4 py-3 font-semibold">Top Foreign Countries</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {traffic.map((row) => {
                    const foreignPct = row.total > 0 ? Math.round(row.foreign / row.total * 100) : 0;
                    const isHighForeign = foreignPct >= 50;
                    return (
                      <tr key={row.slug} className={isHighForeign ? "bg-amber-50" : "bg-white hover:bg-gray-50"}>
                        <td className="px-4 py-3 font-medium text-[#1a4c72]">
                          <a
                            href={row.slug.includes(".") ? `https://${row.slug}` : `/${row.slug}/`}
                            className="hover:underline"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {row.slug}
                          </a>
                          {isHighForeign && (
                            <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                              high foreign
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-right text-gray-700">{row.total.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right text-gray-500">{row.us.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-medium text-gray-800">{row.foreign.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right">
                          <span className={`font-semibold ${isHighForeign ? "text-amber-600" : "text-gray-500"}`}>
                            {foreignPct}%
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {row.topForeign.map(([code, count]) => (
                            <span key={code} className="mr-3">
                              {flag(code)} {code} <span className="text-gray-400">({count})</span>
                            </span>
                          ))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Rows highlighted in amber have ≥ 50% foreign traffic. Country detected via Cloudflare CF-IPCountry header.
            </p>
          </>
        )}
      </div>

      {/* ── Existing management content ────────────────────────────────── */}
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-[#1a4c72] mb-4">Domain Portfolio Management</h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Managing a portfolio of premium domain names requires expertise, market knowledge, and consistent attention. DirectMatch.com provides full-service portfolio management for individual investors and enterprise clients.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
        {features.map((feature) => (
          <div key={feature.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-[#1a4c72] mb-2">{feature.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-[#1a4c72] text-white rounded-xl p-10 text-center">
        <h2 className="text-2xl font-bold mb-3">Ready to Optimize Your Domain Portfolio?</h2>
        <p className="text-gray-300 mb-6 max-w-xl mx-auto">
          Whether you own 5 domains or 500, our management services scale to your needs. Let&apos;s talk about how we can help.
        </p>
        <Link
          href="/contact/"
          className="bg-[#e8b44a] text-[#1a4c72] px-8 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
        >
          Contact Us to Get Started
        </Link>
      </div>
    </div>
  );
}
