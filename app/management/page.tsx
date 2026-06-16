import type { Metadata } from "next";
import Link from "next/link";

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

export default function ManagementPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
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
