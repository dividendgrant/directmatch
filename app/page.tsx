import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DirectMatch.com – Domain Name Sales Made Simple",
  description: "DirectMatch is a domain brokerage connecting buyers and sellers of premium domain names. Domain Brokerage, Sell Your Domain, Portfolio Management.",
};

const services = [
  {
    title: "Domain Brokerage",
    description: "Our experienced brokers specialize in buying and selling domain names. Whether you're looking to acquire a premium domain or sell one, we handle every aspect of the transaction.",
    href: "/domain-broker/",
    icon: "/icon-brokerage.png",
    iconAlt: "Domain Brokerage",
  },
  {
    title: "Sell Your Domain",
    description: "Leverage our private buyers network to sell your domain quickly and at the right price. We connect you with qualified buyers and handle the entire sales process.",
    href: "/sell-your-domain/",
    icon: "/icon-sell.png",
    iconAlt: "Sell Your Domain",
  },
  {
    title: "Management",
    description: "We provide comprehensive portfolio handling services, from lead generation to finalizing transactions, ensuring your domain investments are managed effectively.",
    href: "/management/",
    icon: "/icon-management.png",
    iconAlt: "Domain Management",
  },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="py-16 px-4 text-center bg-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Domain name sales made simple
          </h1>
          <p className="text-lg text-gray-500 mb-8">
            DirectMatch is a domain brokerage that connects buyers and sellers of premium domain names.
          </p>
          <Link
            href="/domain-broker/"
            className="inline-block bg-[#1a4c72] text-white px-8 py-3 font-semibold hover:bg-[#163f5e] transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* Hero Banner */}
      <section className="px-4 pb-10 bg-white">
        <div className="max-w-4xl mx-auto">
          <Image
            src="/hero-banner.png"
            alt="Domain name sales"
            width={1024}
            height={406}
            className="w-full h-auto"
            priority
          />
        </div>
      </section>

      {/* Services */}
      <section className="py-14 px-4 bg-gray-50 border-t border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.title} className="bg-white border border-gray-200 p-6 text-center">
              <div className="flex justify-center mb-4">
                <Link href={service.href}>
                  <Image
                    src={service.icon}
                    alt={service.iconAlt}
                    width={80}
                    height={80}
                    className="h-20 w-20 object-contain hover:opacity-80 transition-opacity"
                  />
                </Link>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{service.description}</p>
              <Link href={service.href} className="text-sm text-[#1a4c72] font-semibold hover:underline">
                Learn More →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 px-4 text-center bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Make an offer today</h2>
          <p className="text-gray-500 mb-6">
            Browse our portfolio of premium domains available for purchase.
          </p>
          <Link
            href="/buy-a-domain-name/"
            className="inline-block bg-[#1a4c72] text-white px-8 py-3 font-semibold hover:bg-[#163f5e] transition-colors"
          >
            Submit Now
          </Link>
        </div>
      </section>
    </div>
  );
}
