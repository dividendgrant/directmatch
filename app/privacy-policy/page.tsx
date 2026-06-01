import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy – DirectMatch.com",
  description: "Privacy Policy for DirectMatch.com domain brokerage services.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-10">Effective Date: January 1, 2026</p>

      <div className="space-y-8 text-gray-600 leading-relaxed">
        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">1. Information We Collect</h2>
          <p>
            When you submit an inquiry through DirectMatch.com, we collect the information you provide,
            including your name, email address, phone number, and any domain-related details you share
            (such as the domain name you are interested in and your offer). We may also collect your
            IP address and referral source automatically.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">2. How We Use Your Information</h2>
          <p>We use the information we collect to:</p>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Respond to your domain inquiries and facilitate transactions</li>
            <li>Connect buyers and sellers of domain names</li>
            <li>Send you relevant communications about your inquiry</li>
            <li>Improve our website and services</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">3. Sharing of Information</h2>
          <p>
            We do not sell, trade, or rent your personal information to third parties. We may share
            your information with trusted service providers who assist in operating our website and
            conducting our business, provided they agree to keep your information confidential.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">4. Cookies</h2>
          <p>
            DirectMatch.com may use cookies to enhance your browsing experience. Cookies are small
            files stored on your device that help us understand how visitors use our site. You may
            choose to disable cookies through your browser settings; however, some features of the
            site may not function properly as a result.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">5. Data Security</h2>
          <p>
            We take reasonable measures to protect your personal information from unauthorized access,
            use, or disclosure. However, no method of transmission over the internet is 100% secure,
            and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">6. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party sites. We are not responsible for the privacy
            practices or content of those sites and encourage you to review their privacy policies
            independently.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">7. Your Rights</h2>
          <p>
            You may request access to, correction of, or deletion of any personal information we hold
            about you by contacting us through our <a href="/contact/" className="text-[#1a4c72] hover:underline">contact page</a>.
            We will respond to your request within a reasonable timeframe.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">8. Changes to This Policy</h2>
          <p>
            We reserve the right to update this Privacy Policy at any time. Changes will be posted on
            this page with an updated effective date. Continued use of DirectMatch.com after changes
            are posted constitutes your acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-gray-900 mb-2">9. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please{" "}
            <a href="/contact/" className="text-[#1a4c72] hover:underline">contact us</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
