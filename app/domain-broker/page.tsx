import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Domain Broker – DirectMatch.com",
  description: "As a versatile brokerage firm, we excel at serving both sellers and buyers. Contact us today.",
};

export default function DomainBrokerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-[#1a4c72] mb-4">Domain Broker</h1>
      <p className="text-gray-600 mb-4 leading-relaxed">
        As a versatile brokerage firm, we excel at serving both sellers and buyers. For sellers, our seller&apos;s brokers
        are dedicated to maximizing your return on investment. They employ strategic marketing techniques and leverage
        our extensive network to attract the right buyers and secure the best possible price for your domain.
      </p>
      <p className="text-gray-600 mb-8 leading-relaxed">
        For buyers, our buyer&apos;s brokers work tirelessly to ensure you secure your desired domain at the most
        favorable terms. They conduct thorough market research, negotiate on your behalf, and guide you through
        every step of the acquisition process.
      </p>
      <p className="text-gray-600">
        <Link href="/contact/" className="text-[#1a4c72] font-semibold hover:underline">
          Contact us today
        </Link>{" "}
        to learn more about our brokerage services.
      </p>
    </div>
  );
}
