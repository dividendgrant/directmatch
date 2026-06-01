import type { Metadata } from "next";
import Link from "next/link";
import domains from "@/data/domains.json";

export const metadata: Metadata = {
  title: "Premium Domains For Sale",
  description: "Browse DirectMatch.com's portfolio of premium domain names. Finance, Crypto, Real Estate, Tech, and more. Price on request.",
};

const categories = ["All", "Finance", "Crypto", "Real Estate", "Lifestyle", "Marketing", "Health", "Tech", "Media"];

export default function DomainsForSalePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#1a4c72] mb-3">Premium Domains For Sale</h1>
        <p className="text-gray-600 text-lg">
          Browse our curated portfolio of {domains.length} premium domain names across every major industry.
        </p>
      </div>

      {/* Category filters (static display) */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <span
            key={cat}
            className="px-3 py-1.5 text-xs font-medium rounded-full bg-white border border-gray-200 text-gray-600"
          >
            {cat}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((domain) => (
          <div key={domain.slug} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">{domain.category}</span>
              <span className="text-xs bg-green-50 text-green-700 px-2 py-0.5 rounded font-medium">Available</span>
            </div>
            <h2 className="text-lg font-bold text-[#1a4c72] mb-2">{domain.domainName}</h2>
            <p className="text-sm text-gray-500 leading-relaxed flex-1 mb-4 line-clamp-2">{domain.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500">Price on Request</span>
              <Link
                href={`/${domain.slug}/`}
                className="bg-[#e8b44a] text-[#1a4c72] px-4 py-1.5 rounded-md text-sm font-semibold hover:bg-yellow-400 transition-colors"
              >
                Inquire
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 bg-[#f8f9fa] rounded-xl p-8 text-center border border-gray-200">
        <h2 className="text-xl font-bold text-[#1a4c72] mb-2">Don&apos;t See What You&apos;re Looking For?</h2>
        <p className="text-gray-600 mb-5">Our brokers can source virtually any domain. Tell us what you need.</p>
        <Link
          href="/buy-a-domain-name/"
          className="bg-[#1a4c72] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#163f5e] transition-colors"
        >
          Request a Domain
        </Link>
      </div>
    </div>
  );
}
