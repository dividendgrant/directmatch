import type { Metadata } from "next";

// Absolute base so buttons work when this renders on a parked domain
const SITE = "https://directmatch.com";

export const metadata: Metadata = {
  title: "Thank You — Inquiry Received",
  description: "Thank you for contacting DirectMatch.com. We've received your inquiry and will be in touch shortly.",
};

export default function ThankYouPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="text-5xl mb-6">✅</div>
      <h1 className="text-3xl font-bold text-[#1a4c72] mb-4">Thank You!</h1>
      <p className="text-lg text-gray-600 mb-3 leading-relaxed">
        We&apos;ve received your inquiry and will be in touch within 24 hours.
      </p>
      <p className="text-gray-500 mb-10">
        In the meantime, feel free to browse more domains in our portfolio.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <a
          href={`${SITE}/domain-for-sale/`}
          className="bg-[#e8b44a] text-[#1a4c72] px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
        >
          Browse Domains For Sale
        </a>
        <a
          href={SITE}
          className="border-2 border-[#1a4c72] text-[#1a4c72] px-6 py-3 rounded-lg font-semibold hover:bg-[#1a4c72] hover:text-white transition-colors"
        >
          Back to Homepage
        </a>
      </div>
    </div>
  );
}
