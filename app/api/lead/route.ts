import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

// Minimal shape of the D1 binding we use (avoids a workers-types dependency)
interface D1Like {
  prepare(q: string): { bind(...a: unknown[]): { run(): Promise<unknown> } };
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const formType = typeof body.formType === "string" ? body.formType : "";
  const honeypot = typeof body.honeypot === "string" ? body.honeypot : "";

  if (name.length < 2 || !email.includes("@") || !formType) {
    return NextResponse.json({ error: "Validation failed" }, { status: 400 });
  }
  if (honeypot.length > 0) {
    return NextResponse.json({ error: "Bot detected" }, { status: 400 });
  }

  const phone = typeof body.phone === "string" ? body.phone : "";
  const message = typeof body.message === "string" ? body.message : "";
  const domainInterest = typeof body.domainInterest === "string" ? body.domainInterest : "";
  const offer = typeof body.offer === "string" ? body.offer.trim() : "";

  // Domain must contain a dot (e.g. EmanuelVaz.com, not "Emanuel Vaz")
  const DOMAIN_FORMS = ["domain-inquiry", "buy-inquiry", "sell-inquiry"];
  const HAS_DOT = /^[^\s]+\.[^\s]+$/;
  if (DOMAIN_FORMS.includes(formType) && domainInterest && !HAS_DOT.test(domainInterest)) {
    return NextResponse.json({ error: "Invalid domain name" }, { status: 400 });
  }

  // Offer must be a dollar amount for all domain inquiry forms
  const OFFER_REQUIRED_FORMS = ["domain-inquiry", "buy-inquiry", "sell-inquiry"];
  const DOLLAR_AMOUNT = /^\$?[\d,]+(\.\d{1,2})?$/;
  if (OFFER_REQUIRED_FORMS.includes(formType) && !DOLLAR_AMOUNT.test(offer)) {
    return NextResponse.json({ error: "Invalid offer amount" }, { status: 400 });
  }
  const subject = typeof body.subject === "string" ? body.subject : "";
  const source = typeof body.source === "string" ? body.source : "";

  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const emailSubject = subject
      ? `Contact: ${subject} – ${name}`
      : `New INQ: ${name} — ${domainInterest || formType}`;

    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "DirectMatch INQs <noreply@hammerfinancial.com>",
          to: [process.env.NOTIFY_EMAIL ?? "domains@digitalnomads.com"],
          reply_to: email,
          subject: emailSubject,
          text: [
            `Name: ${name}`,
            `Email: ${email}`,
            `Phone: ${phone || "N/A"}`,
            `Domain: ${domainInterest || "N/A"}`,
            `Offer/Price: ${offer || "N/A"}`,
            `Subject: ${subject || "N/A"}`,
            `Source: ${source || "Direct"}`,
            `Form: ${formType}`,
            `\nMessage:\n${message || "N/A"}`,
          ].join("\n"),
        }),
      });
    } catch (err) {
      console.error("Resend error:", err);
    }
  }

  // Log the inquiry to D1 for per-domain tallying. Best-effort only — a
  // failure here must never affect the lead (email above is the system of record).
  try {
    const { env } = getCloudflareContext();
    const db = (env as unknown as { DB?: D1Like }).DB;
    if (db) {
      await db
        .prepare(
          "INSERT INTO inquiries (domain, name, email, offer, form_type, source) VALUES (?, ?, ?, ?, ?, ?)"
        )
        .bind(domainInterest || "", name, email, offer || "", formType, source || "")
        .run();
    }
  } catch (err) {
    console.error("D1 inquiry log error:", err);
  }

  return NextResponse.json({ ok: true });
}
