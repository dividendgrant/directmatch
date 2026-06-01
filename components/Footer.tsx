import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
        Copyright 2026 – DirectMatch – DirectMatch.com &nbsp;|&nbsp;{" "}
        <Link href="/privacy-policy/" className="hover:underline">Privacy Policy</Link>
      </div>
    </footer>
  );
}
