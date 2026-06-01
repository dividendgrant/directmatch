import { Suspense } from "react";
import type { Metadata } from "next";
import SourceNotice from "@/components/SourceNotice";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact – DirectMatch.com",
  description: "Need assistance with domain acquisition, sales, or any related inquiries? Simply reach out to us through our contact page.",
};

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Suspense fallback={null}><SourceNotice /></Suspense>

      <h1 className="text-3xl font-bold text-[#1a4c72] mb-4">Contact</h1>
      <p className="text-gray-600 mb-8">
        Need assistance with domain acquisition, sales, or any related inquiries? Simply reach out to us
        through our contact page. Our team of domain brokers is dedicated to delivering exceptional service,
        ensuring a prompt response within 24 hours or less.
      </p>

      <ContactForm />
    </div>
  );
}
