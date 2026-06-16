import { redirect } from "next/navigation";

// Catches any unknown path on directmatch.com (e.g. /aifin, /old-slug, /services.html)
// and sends visitors to the buy page rather than showing a 404.
export default function CatchAll() {
  redirect("/buy-a-domain-name/");
}
