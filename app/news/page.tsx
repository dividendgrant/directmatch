import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Domain Name News & Insights",
  description: "Stay current with the latest domain name industry news, market trends, and expert insights from DirectMatch.com.",
};

const articles = [
  {
    title: "Premium .com Domains Continue to Appreciate in 2026",
    date: "May 15, 2026",
    teaser: "The market for short, memorable .com domains remains strong as businesses recognize the long-term value of premium web addresses. Industry reports show that top-tier domains have outperformed many traditional asset classes over the past decade.",
    category: "Market Trends",
  },
  {
    title: "Why Your Domain Name Is Your Most Valuable Digital Asset",
    date: "April 28, 2026",
    teaser: "As digital-first businesses become the norm, the domain name you choose can make or break your brand's online presence. A premium domain instantly signals credibility, improves SEO, and reduces customer acquisition costs across every channel.",
    category: "Strategy",
  },
  {
    title: "Crypto and Web3 Domain Demand Surges Among Startups",
    date: "April 10, 2026",
    teaser: "Blockchain startups and DeFi platforms are driving unprecedented demand for crypto-related domain names. Savvy investors are acquiring category-defining domains before the next wave of Web3 adoption arrives.",
    category: "Crypto",
  },
];

export default function NewsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#1a4c72] mb-3">Domain Name News &amp; Insights</h1>
        <p className="text-gray-600 text-lg">
          Stay current with the latest trends, transactions, and strategies in the domain name industry.
        </p>
      </div>

      <div className="space-y-8">
        {articles.map((article) => (
          <article key={article.title} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#e8b44a]">{article.category}</span>
              <span className="text-xs text-gray-400">{article.date}</span>
            </div>
            <h2 className="text-xl font-bold text-[#1a4c72] mb-3">{article.title}</h2>
            <p className="text-gray-600 leading-relaxed">{article.teaser}</p>
          </article>
        ))}
      </div>

      <div className="mt-12 bg-[#1a4c72] text-white rounded-xl p-8 text-center">
        <h2 className="text-xl font-bold mb-3">Interested in a Premium Domain?</h2>
        <p className="text-gray-300 mb-6">Browse our full portfolio or contact us to discuss your domain needs.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href="/domain-for-sale/" className="bg-[#e8b44a] text-[#1a4c72] px-6 py-2.5 rounded-lg font-semibold hover:bg-yellow-400 transition-colors">
            Browse Domains
          </a>
          <a href="/contact/" className="border border-white text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-white hover:text-[#1a4c72] transition-colors">
            Contact Us
          </a>
        </div>
      </div>
    </div>
  );
}
