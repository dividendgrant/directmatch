import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

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
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed", details: parsed.error.flatten() }, { status: 400 });
    }
    const { honeypot: _, ...data } = parsed.data;

    const lead = await prisma.lead.create({ data });

    const apiKey = process.env.RESEND_API_KEY;
    if (apiKey) {
      const emailSubject = data.subject
        ? `Contact: ${data.subject} – ${data.name}`
        : `New Lead: ${data.name} — ${data.domainInterest ?? data.formType}`;

      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: "DirectMatch Leads <noreply@directmatch.com>",
          to: [process.env.NOTIFY_EMAIL ?? "directmatch@gmail.com"],
          reply_to: data.email,
          subject: emailSubject,
          text: [
            `Name: ${data.name}`,
            `Email: ${data.email}`,
            `Phone: ${data.phone ?? "N/A"}`,
            `Domain: ${data.domainInterest ?? "N/A"}`,
            `Offer: ${data.offer ?? "N/A"}`,
            `Subject: ${data.subject ?? "N/A"}`,
            `Source: ${data.source ?? "Direct"}`,
            `Form: ${data.formType}`,
            `\nMessage:\n${data.message ?? "N/A"}`,
          ].join("\n"),
        }),
      });
    }

    return NextResponse.json({ ok: true, id: lead.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
