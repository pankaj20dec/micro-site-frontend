"use client";

import { useId, useState, type FormEvent } from "react";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { contactForm } from "@/lib/contact-content";

type FieldKey = "name" | "email" | "subject" | "message";

type Status = "idle" | "submitting" | "success" | "error";

/** Contact API base URL. Override with NEXT_PUBLIC_API_URL in your env. */
const CONTACT_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000";

const initialValues: Record<FieldKey, string> = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export function ContactForm({ className }: { className?: string }) {
  const ids = {
    name: useId(),
    email: useId(),
    subject: useId(),
    message: useId(),
  };
  const [values, setValues] = useState<Record<FieldKey, string>>(initialValues);
  const [status, setStatus] = useState<Status>("idle");

  const update = (key: FieldKey) => (value: string) =>
    setValues((prev) => ({ ...prev, [key]: value }));

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    try {
      const res = await fetch(`${CONTACT_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          subject: values.subject,
          message: values.message,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.success) {
        throw new Error(data?.message ?? "Request failed");
      }

      setStatus("success");
      setValues(initialValues);
    } catch {
      setStatus("error");
    }
  }

  const disabled = status === "submitting";

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn(
        "relative overflow-hidden rounded-2xl bg-[#F4F4F5] px-5 pt-8 pb-8 shadow-[0_8px_28px_-18px_rgba(15,23,42,0.25)] sm:px-8 sm:pt-10 sm:pb-10",
        className
      )}
    >
      <span
        aria-hidden
        className="absolute inset-x-0 top-0 h-1"
        style={{ backgroundColor: brand.purple }}
      />

      <h2 className="text-center text-base font-bold text-[#22313F] sm:text-lg">
        {contactForm.heading}
      </h2>

      <div className="mt-6 flex flex-col gap-5">
        <Field
          id={ids.name}
          label={contactForm.fields.name.label}
          placeholder={contactForm.fields.name.placeholder}
          required
          autoComplete="name"
          value={values.name}
          onChange={update("name")}
          disabled={disabled}
        />
        <Field
          id={ids.email}
          type="email"
          label={contactForm.fields.email.label}
          placeholder={contactForm.fields.email.placeholder}
          required
          autoComplete="email"
          value={values.email}
          onChange={update("email")}
          disabled={disabled}
        />
        <Field
          id={ids.subject}
          label={contactForm.fields.subject.label}
          placeholder={contactForm.fields.subject.placeholder}
          required
          value={values.subject}
          onChange={update("subject")}
          disabled={disabled}
        />
        <Field
          id={ids.message}
          label={contactForm.fields.message.label}
          placeholder={contactForm.fields.message.placeholder}
          required
          multiline
          value={values.message}
          onChange={update("message")}
          disabled={disabled}
        />
      </div>

      <div className="mt-7 flex flex-col items-center gap-3">
        <button
          type="submit"
          disabled={disabled}
          className={cn(
            "inline-flex items-center justify-center rounded-full px-9 py-3 text-xs font-bold uppercase tracking-widest text-white transition",
            "hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-70"
          )}
          style={{ backgroundColor: brand.purple }}
        >
          {status === "submitting" ? "Sending…" : contactForm.submitLabel}
        </button>

        {status === "success" ? (
          <p
            role="status"
            className="text-center text-xs text-emerald-700 sm:text-sm"
          >
            {contactForm.successMessage}
          </p>
        ) : null}
        {status === "error" ? (
          <p
            role="alert"
            className="text-center text-xs text-red-700 sm:text-sm"
          >
            {contactForm.errorMessage}
          </p>
        ) : null}
      </div>
    </form>
  );
}

type FieldProps = {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (next: string) => void;
  required?: boolean;
  multiline?: boolean;
  type?: "text" | "email";
  autoComplete?: string;
  disabled?: boolean;
};

function Field({
  id,
  label,
  placeholder,
  value,
  onChange,
  required,
  multiline,
  type = "text",
  autoComplete,
  disabled,
}: FieldProps) {
  const sharedClass = cn(
    "w-full rounded-md border border-neutral-300 bg-white px-3.5 py-2.5 text-sm text-[#22313F] shadow-sm",
    "placeholder:text-neutral-400",
    "focus:outline-none focus:ring-2 focus:ring-offset-0",
    "disabled:cursor-not-allowed disabled:opacity-70"
  );

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-[#22313F] sm:text-sm"
      >
        {label}
        {required ? (
          <span
            aria-hidden
            className="ml-1 font-bold"
            style={{ color: brand.purple }}
          >
            *
          </span>
        ) : null}
        {required ? <span className="sr-only"> (required)</span> : null}
      </label>
      {multiline ? (
        <textarea
          id={id}
          required={required}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          disabled={disabled}
          className={cn(sharedClass, "min-h-[120px] resize-y")}
          style={{ ["--tw-ring-color" as string]: brand.purple }}
        />
      ) : (
        <input
          id={id}
          type={type}
          required={required}
          placeholder={placeholder}
          autoComplete={autoComplete}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          disabled={disabled}
          className={sharedClass}
          style={{ ["--tw-ring-color" as string]: brand.purple }}
        />
      )}
    </div>
  );
}
