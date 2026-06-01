import { NextRequest, NextResponse } from "next/server";

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
  const offer = typeof body.offer === "string" ? body.offer : "";
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

  return NextResponse.json({ ok: true });
}
