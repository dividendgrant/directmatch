"use client";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";

const schema = z.object({
  domainInterest: z
    .string()
    .min(1, "Please enter the domain name you want")
    .regex(/^[^\s]+\.[^\s]+$/, "Please include the extension (e.g. MyBrand.com)"),
  name: z.string().min(2, "Name is required"),
  phone: z.string().optional(),
  email: z.string().email("Please enter a valid email"),
  offer: z
    .string()
    .min(1, "Offer amount is required")
    .regex(/^\$?[\d,]+(\.\d{1,2})?$/, "Must be a dollar amount (e.g. $5,000)"),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  "w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#1a4c72]";

export default function LeadFormB() {
  const searchParams = useSearchParams();
  const source = searchParams.get("ref") ?? "";
  const honeypotRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch("/api/lead/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone ?? "",
          domainInterest: data.domainInterest,
          offer: data.offer ?? "",
          source: source ?? "",
          formType: "buy-inquiry",
          honeypot: honeypotRef.current?.value ?? "",
        }),
      });

      if (!res.ok) {
        setError("root", { message: "Something went wrong. Please try again." });
        return;
      }

      window.location.href = "/thank-you/";
    } catch {
      setError("root", { message: "Network error. Please try again." });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-lg">
      {/* Honeypot — hidden from users, catches bots */}
      <div style={{ position: "absolute", left: "-9999px", height: 0, overflow: "hidden" }}>
        <label htmlFor="b-website">Website</label>
        <input id="b-website" name="website" type="text" ref={honeypotRef} tabIndex={-1} autoComplete="off" />
      </div>

      <div>
        <label htmlFor="b-domain" className="block text-sm mb-1">Domain name you want</label>
        <input id="b-domain" type="text" placeholder="e.g. MyBrand.com" autoComplete="off" className={inputClass} {...register("domainInterest")} />
        {errors.domainInterest && <p className="text-red-600 text-xs mt-1">{errors.domainInterest.message}</p>}
      </div>

      <div>
        <label htmlFor="b-name" className="block text-sm mb-1">Name</label>
        <input id="b-name" type="text" autoComplete="name" className={inputClass} {...register("name")} />
        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label htmlFor="b-phone" className="block text-sm mb-1">Phone / Mobile</label>
        <input id="b-phone" type="tel" autoComplete="tel" className={inputClass} {...register("phone")} />
      </div>

      <div>
        <label htmlFor="b-email" className="block text-sm mb-1">Email</label>
        <input id="b-email" type="email" autoComplete="email" className={inputClass} {...register("email")} />
        {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label htmlFor="b-offer" className="block text-sm mb-1">Your Offer <span className="text-red-500">*</span></label>
        <input id="b-offer" type="text" placeholder="e.g. $5,000" autoComplete="off" className={inputClass} {...register("offer")} />
        {errors.offer && <p className="text-red-600 text-xs mt-1">{errors.offer.message}</p>}
      </div>

      {errors.root && <p className="text-red-600 text-sm">{errors.root.message}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-[#1a4c72] text-white px-6 py-2 text-sm font-semibold hover:bg-[#163f5e] transition-colors disabled:opacity-60"
      >
        {isSubmitting ? "Submitting…" : "Submit Form"}
      </button>
    </form>
  );
}
