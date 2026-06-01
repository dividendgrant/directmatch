import type { Metadata } from "next";
import { Suspense } from "react";
import SourceNotice from "@/components/SourceNotice";
import LeadFormA from "@/components/LeadFormA";

export const metadata: Metadata = {
  title: "Sell Your Domain – DirectMatch.com",
  description: "Sell your domain name quickly through our private buyers network. Lightning-fast closings within 12–24 hours.",
};

export default function SellDomainPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Suspense fallback={null}><SourceNotice /></Suspense>

      <h1 className="text-3xl font-bold text-[#1a4c72] mb-4">Sell Your Domain</h1>
      <p className="text-gray-600 mb-4 leading-relaxed">
        We offer rapid acquisitions through our in-house buyer network, ensuring lightning-fast closings within 12–24 hours.
        Multiple payout methods including escrow, crypto, and wire transfers.
      </p>
      <p className="text-gray-600 mb-8 leading-relaxed">
        Submit your domain along with your desired pricing and our team will evaluate it within 12 hours.
      </p>

      <Suspense fallback={null}><LeadFormA showDomainField lastFieldLabel="Price" lastFieldPlaceholder="$100" /></Suspense>
    </div>
  );
}
