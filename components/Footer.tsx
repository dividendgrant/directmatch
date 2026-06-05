import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-4 text-center text-sm text-gray-500 space-y-2">
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1 md:hidden">
          <Link href="/" className="hover:underline">Home</Link>
          <Link href="/buy-a-domain-name/" className="hover:underline">Buy a Domain</Link>
          <Link href="/management/" className="hover:underline">Management</Link>
          <Link href="/contact/" className="hover:underline">Contact</Link>
        </nav>
        <div>
          Copyright 2026 – DirectMatch – DirectMatch.com &nbsp;|&nbsp;{" "}
          <Link href="/privacy-policy/" className="hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
