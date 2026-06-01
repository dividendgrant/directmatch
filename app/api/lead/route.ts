import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
  domainInterest: z.string().optional(),
  offer: z.string().optional(),
  subject: z.string().optional(),
  source: z.string().optional(),
  formType: z.string(),
  honeypot: z.string().max(0, "Bot detected"),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
  }
  const { honeypot: _, ...data } = parsed.data;

  // Fire-and-forget email — never let email errors fail the form submission
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    const emailSubject = data.subject
      ? `Contact: ${data.subject} – ${data.name}`
      : `New Lead: ${data.name} — ${data.domainInterest ?? data.formType}`;

    fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: "DirectMatch Leads <noreply@hammerfinancial.com>",
        to: [process.env.NOTIFY_EMAIL ?? "domains@digitalnomads.com"],
        reply_to: data.email,
        subject: emailSubject,
        text: [
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          `Phone: ${data.phone ?? "N/A"}`,
          `Domain: ${data.domainInterest ?? "N/A"}`,
          `Offer/Price: ${data.offer ?? "N/A"}`,
          `Subject: ${data.subject ?? "N/A"}`,
          `Source: ${data.source ?? "Direct"}`,
          `Form: ${data.formType}`,
          `\nMessage:\n${data.message ?? "N/A"}`,
        ].join("\n"),
      }),
    }).catch((err) => console.error("Resend error:", err));
  }

  return NextResponse.json({ ok: true });
}
