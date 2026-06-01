import type { Metadata } from "next";
import { Suspense } from "react";
import SourceNotice from "@/components/SourceNotice";
import LeadFormB from "@/components/LeadFormB";

export const metadata: Metadata = {
  title: "Buy a Domain Name – DirectMatch.com",
  description: "Looking to buy a premium domain name? Submit your request and our brokers will get back to you.",
};

export default function BuyDomainPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Suspense fallback={null}><SourceNotice /></Suspense>

      <h1 className="text-3xl font-bold text-[#1a4c72] mb-4">Buy a Domain Name</h1>
      <p className="text-gray-600 mb-8 leading-relaxed">
        Submit the domain you&apos;re interested in along with your offer and our team will get back to you promptly.
      </p>

      <Suspense fallback={null}><LeadFormB /></Suspense>
    </div>
  );
}
