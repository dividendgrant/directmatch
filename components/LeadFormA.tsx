"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSearchParams } from "next/navigation";

const schema = z.object({
  domainName: z.string().optional(),
  name: z.string().min(2, "Name is required"),
  phone: z.string().optional(),
  email: z.string().email("Please enter a valid email"),
  offer: z.string().optional(),
  honeypot: z.string().max(0),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  prefilledDomain?: string;
  source?: string;
  showDomainField?: boolean;
  lastFieldLabel?: string;
  lastFieldPlaceholder?: string;
}

const inputClass =
  "w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#1a4c72]";

export default function LeadFormA({
  prefilledDomain,
  source,
  showDomainField = false,
  lastFieldLabel = "Offer",
  lastFieldPlaceholder = "e.g. $5,000",
}: Props) {
  const searchParams = useSearchParams();
  const resolvedSource = source ?? searchParams.get("ref") ?? "";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    if (showDomainField && !data.domainName?.trim()) {
      setError("domainName", { message: "Domain name is required" });
      return;
    }

    try {
      const res = await fetch("/api/lead/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone ?? "",
          domainInterest: showDomainField ? (data.domainName ?? "") : (prefilledDomain ?? ""),
          offer: data.offer ?? "",
          source: resolvedSource,
          formType: showDomainField ? "sell-inquiry" : "domain-inquiry",
          honeypot: data.honeypot,
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
      {/* Honeypot */}
      <div aria-hidden="true" style={{ position: "absolute", left: "-9999px" }}>
        <input type="text" tabIndex={-1} autoComplete="off" {...register("honeypot")} />
      </div>

      {/* Hidden domain tracker (for individual domain pages) */}
      {!showDomainField && (
        <input type="hidden" name="domainInterest" value={prefilledDomain ?? ""} />
      )}

      {/* Visible domain field (for sell-your-domain) */}
      {showDomainField && (
        <div>
          <label className="block text-sm mb-1">Domain Name <span className="text-red-500">*</span></label>
          <input type="text" placeholder="e.g. MyDomain.com" className={inputClass} {...register("domainName")} />
          {errors.domainName && <p className="text-red-600 text-xs mt-1">{errors.domainName.message}</p>}
        </div>
      )}

      <div>
        <label className="block text-sm mb-1">Name</label>
        <input type="text" className={inputClass} {...register("name")} />
        {errors.name && <p className="text-red-600 text-xs mt-1">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm mb-1">Phone / Mobile</label>
        <input type="tel" className={inputClass} {...register("phone")} />
      </div>

      <div>
        <label className="block text-sm mb-1">Email</label>
        <input type="email" className={inputClass} {...register("email")} />
        {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm mb-1">{lastFieldLabel}</label>
        <input type="text" placeholder={lastFieldPlaceholder} className={inputClass} {...register("offer")} />
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
