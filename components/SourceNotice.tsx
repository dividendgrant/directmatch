"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function SourceNotice() {
  const searchParams = useSearchParams();
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    const ref = searchParams.get("ref");
    if (ref) { setSource(ref); return; }
    try {
      const referrer = document.referrer;
      if (referrer) {
        const hostname = new URL(referrer).hostname.replace("www.", "");
        if (hostname && hostname !== "directmatch.com" && hostname !== "localhost") setSource(hostname);
      }
    } catch {}
  }, [searchParams]);

  if (!source) return null;

  return (
    <div className="bg-[#e8b44a] text-[#1a4c72] px-4 py-3 text-sm font-medium text-center">
      You were referred from <strong>{source}</strong> — you&apos;re in the right place! Fill out the form below to get started.
    </div>
  );
}
