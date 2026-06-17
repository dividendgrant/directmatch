// Absolute base so links work on parked domains (see Header.tsx)
const SITE = "https://directmatch.com";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-4 text-center text-sm text-gray-500 space-y-2">
        <nav className="flex flex-wrap justify-center gap-x-5 gap-y-1 md:hidden">
          <a href={SITE} className="hover:underline">Home</a>
          <a href={`${SITE}/buy-a-domain-name/`} className="hover:underline">Buy a Domain</a>
          <a href={`${SITE}/management/`} className="hover:underline">Management</a>
          <a href={`${SITE}/contact/`} className="hover:underline">Contact</a>
        </nav>
        <div>
          Copyright 2026 – DirectMatch – DirectMatch.com &nbsp;|&nbsp;{" "}
          <a href={`${SITE}/privacy-policy/`} className="hover:underline">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
}
