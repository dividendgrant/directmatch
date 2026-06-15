import { notFound } from "next/navigation";
import { Suspense } from "react";
import type { Metadata } from "next";
import domains from "@/data/domains.json";
import LeadFormA from "@/components/LeadFormA";
import SourceNotice from "@/components/SourceNotice";
import PageViewTracker from "@/components/PageViewTracker";

export async function generateStaticParams() {
  return domains.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const domain = domains.find((d) => d.slug === slug);
  if (!domain) return {};
  return {
    title: `${domain.domainName} is For Sale – DirectMatch.com`,
    description: `${domain.domainName} is available for purchase. Complete the form to get a free quote.`,
  };
}

export default async function DomainPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const domain = domains.find((d) => d.slug === slug);
  if (!domain) notFound();

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <PageViewTracker slug={domain.slug} />
      <Suspense fallback={null}><SourceNotice /></Suspense>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        {domain.domainName} is For Sale
      </h1>

      <p className="text-gray-500 mb-8">
        Complete this form to get a free quote on {domain.domainName}:
      </p>

      <Suspense fallback={null}>
        <LeadFormA prefilledDomain={domain.domainName} />
      </Suspense>
    </div>
  );
}
