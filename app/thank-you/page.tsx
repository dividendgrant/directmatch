import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Thank You — Inquiry Received",
  description: "Thank you for contacting DirectMatch.com. We've received your inquiry and will be in touch shortly.",
};

export default function ThankYouPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-24 text-center">
      <div className="flex justify-center mb-6">
        <div className="relative">
          <Image src="/logo.png" alt="DirectMatch" width={120} height={120} className="rounded-full" />
          <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full w-10 h-10 flex items-center justify-center border-2 border-white">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>
      <h1 className="text-3xl font-bold text-[#1a4c72] mb-4">Thank You!</h1>
      <p className="text-lg text-gray-600 mb-3 leading-relaxed">
        We&apos;ve received your inquiry and will be in touch within 24 hours.
      </p>
      <p className="text-gray-500 mb-10">
        In the meantime, feel free to browse more domains in our portfolio.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/domain-for-sale/"
          className="bg-[#e8b44a] text-[#1a4c72] px-6 py-3 rounded-lg font-semibold hover:bg-yellow-400 transition-colors"
        >
          Browse Domains For Sale
        </Link>
        <Link
          href="/"
          className="border-2 border-[#1a4c72] text-[#1a4c72] px-6 py-3 rounded-lg font-semibold hover:bg-[#1a4c72] hover:text-white transition-colors"
        >
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
