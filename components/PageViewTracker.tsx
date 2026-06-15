"use client";
import { useEffect } from "react";

export default function PageViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    fetch("/api/pageview/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
      keepalive: true,
    }).catch(() => {});
  }, [slug]);

  return null;
}
