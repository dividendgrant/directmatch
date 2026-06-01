"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
  honeypot: z.string().max(0),
});

type FormValues = z.infer<typeof schema>;

const inputClass =
  "w-full border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:border-[#1a4c72]";

export default function ContactForm() {
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
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          subject: data.subject,
          message: data.message,
          formType: "contact",
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

      <div>
        <label className="block text-sm mb-1">First Name</label>
        <input type="text" className={inputClass} {...register("firstName")} />
        {errors.firstName && <p className="text-red-600 text-xs mt-1">{errors.firstName.message}</p>}
      </div>

      <div>
        <label className="block text-sm mb-1">Last Name</label>
        <input type="text" className={inputClass} {...register("lastName")} />
        {errors.lastName && <p className="text-red-600 text-xs mt-1">{errors.lastName.message}</p>}
      </div>

      <div>
        <label className="block text-sm mb-1">Email</label>
        <input type="email" className={inputClass} {...register("email")} />
        {errors.email && <p className="text-red-600 text-xs mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm mb-1">Subject</label>
        <input type="text" className={inputClass} {...register("subject")} />
        {errors.subject && <p className="text-red-600 text-xs mt-1">{errors.subject.message}</p>}
      </div>

      <div>
        <label className="block text-sm mb-1">Your Message</label>
        <textarea rows={5} className={inputClass} {...register("message")} />
        {errors.message && <p className="text-red-600 text-xs mt-1">{errors.message.message}</p>}
      </div>

      {errors.root && (
        <p className="text-red-600 text-sm">{errors.root.message}</p>
      )}

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
