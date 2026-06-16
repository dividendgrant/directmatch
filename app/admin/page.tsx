import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type TrafficRow = {
  slug: string;
  total: number;
  us: number;
  foreign: number;
  topForeign: [string, number][];
};

async function getTrafficData(): Promise<TrafficRow[]> {
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const rows = await prisma.pageView.groupBy({
    by: ["slug", "country"],
    _count: { id: true },
    where: { createdAt: { gte: since } },
    orderBy: { _count: { id: "desc" } },
  });

  const map: Record<string, Record<string, number>> = {};
  for (const row of rows) {
    if (!map[row.slug]) map[row.slug] = {};
    map[row.slug][row.country] = row._count.id;
  }

  const summary = Object.entries(map).map(([slug, countries]) => {
    const total = Object.values(countries).reduce((a, b) => a + b, 0);
    const us = countries["US"] ?? 0;
    const foreign = total - us;
    const topForeign = Object.entries(countries)
      .filter(([c]) => c !== "US" && c !== "Unknown")
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
    return { slug, total, us, foreign, topForeign };
  });

  summary.sort((a, b) => b.foreign - a.foreign);
  return summary;
}

function flag(code: string) {
  if (code.length !== 2) return "";
  return String.fromCodePoint(
    ...code.toUpperCase().split("").map((c) => 0x1f1e6 - 65 + c.charCodeAt(0))
  );
}

export default async function AdminPage() {
  let traffic: TrafficRow[] = [];
  let dbAvailable = true;
  try {
    traffic = await getTrafficData();
  } catch {
    dbAvailable = false;
  }

  const totalViews = traffic.reduce((a, b) => a + b.total, 0);
  const totalForeign = traffic.reduce((a, b) => a + b.foreign, 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-[#1a4c72] mb-1">Domain Traffic — Last 30 Days</h1>
      <p className="text-sm text-gray-500 mb-8">
        Sorted by foreign (non-US) requests. Use this to identify domains driving high overseas
        traffic that you may want to remove from Cloudflare.
      </p>

      {!dbAvailable ? (
        <div className="border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
          Traffic data is only available when running locally.
          Run <code className="bg-gray-100 px-1 rounded">npm run dev</code> and visit{" "}
          <code className="bg-gray-100 px-1 rounded">localhost:3000/admin</code> to view analytics.
        </div>
      ) : totalViews === 0 ? (
        <div className="border border-gray-200 rounded-xl p-8 text-center text-gray-400 text-sm">
          No page views recorded yet. Traffic will appear here once visitors start hitting domain pages.
        </div>
      ) : (
        <>
          <div className="flex gap-4 mb-6 flex-wrap">
            <div className="bg-[#eef4fa] rounded-lg px-4 py-2 text-sm">
              <span className="font-semibold text-[#1a4c72]">{totalViews.toLocaleString()}</span>
              <span className="text-gray-500 ml-1">total visits</span>
            </div>
            <div className="bg-[#fff8ec] rounded-lg px-4 py-2 text-sm">
              <span className="font-semibold text-amber-600">{totalForeign.toLocaleString()}</span>
              <span className="text-gray-500 ml-1">
                foreign ({totalViews > 0 ? Math.round((totalForeign / totalViews) * 100) : 0}%)
              </span>
            </div>
            <div className="bg-gray-50 rounded-lg px-4 py-2 text-sm">
              <span className="font-semibold text-gray-700">{traffic.length}</span>
              <span className="text-gray-500 ml-1">domains with traffic</span>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                  <th className="px-4 py-3 font-semibold">Domain</th>
                  <th className="px-4 py-3 font-semibold text-right">Total</th>
                  <th className="px-4 py-3 font-semibold text-right">🇺🇸 US</th>
                  <th className="px-4 py-3 font-semibold text-right">Foreign</th>
                  <th className="px-4 py-3 font-semibold text-right">Foreign %</th>
                  <th className="px-4 py-3 font-semibold">Top Countries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {traffic.map((row) => {
                  const pct = row.total > 0 ? Math.round((row.foreign / row.total) * 100) : 0;
                  const high = pct >= 50;
                  return (
                    <tr key={row.slug} className={high ? "bg-amber-50" : "bg-white hover:bg-gray-50"}>
                      <td className="px-4 py-3 font-medium text-[#1a4c72]">
                        <a
                          href={row.slug.includes(".") ? `https://${row.slug}` : `/${row.slug}/`}
                          className="hover:underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {row.slug}
                        </a>
                        {high && (
                          <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                            high foreign
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">{row.total.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right text-gray-500">{row.us.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right font-medium text-gray-800">{row.foreign.toLocaleString()}</td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-semibold ${high ? "text-amber-600" : "text-gray-500"}`}>
                          {pct}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {row.topForeign.map(([code, count]) => (
                          <span key={code} className="mr-3">
                            {flag(code)} {code}{" "}
                            <span className="text-gray-400">({count})</span>
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
            Amber rows = ≥ 50% foreign traffic. Country via Cloudflare CF-IPCountry header.
          </p>
        </>
      )}
    </div>
  );
}
