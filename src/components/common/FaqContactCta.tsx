import type { ReactNode } from "react";
import { Container, Section } from "@/components/ui";
import { brand } from "@/lib/brand";
import { faqContact } from "@/lib/faq-content";

export function FaqContactCta() {
  return (
    <Section className="bg-white pb-14 sm:pb-20" id="faq-contact">
      <Container max="5xl">
        <p
          className="text-[30px] font-bold text-[#22313F]"
        >
          {faqContact.eyebrow}
        </p>

        <div className="mt-3 grid gap-4 sm:grid-cols-2 sm:gap-5">
          <ContactCard title={faqContact.legal.title}>
            <p>{faqContact.legal.description}</p>
            <a
              href={`mailto:${faqContact.legal.email}`}
              className="inline-block break-all font-semibold underline-offset-2 hover:underline"
              style={{ color: brand.purple }}
            >
              {faqContact.legal.email}
            </a>
          </ContactCard>

          <ContactCard title={faqContact.admin.title}>
            <p>{faqContact.admin.description}</p>
            <a
              href={`mailto:${faqContact.admin.email}`}
              className="inline-block break-all font-semibold underline-offset-2 hover:underline"
              style={{ color: brand.purple }}
            >
              {faqContact.admin.email}
            </a>
          </ContactCard>
        </div>

        <div
          className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900 sm:px-5 sm:py-4 sm:text-sm"
          role="note"
        >
          <WarningIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 sm:h-[18px] sm:w-[18px]" />
          <p>{faqContact.disclaimer}</p>
        </div>
      </Container>
    </Section>
  );
}

function ContactCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-[0_2px_6px_rgba(15,23,42,0.04)] sm:gap-4 sm:p-5">
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md sm:h-11 sm:w-11"
        style={{ backgroundColor: brand.lavender, color: brand.purple }}
        aria-hidden
      >
        <EnvelopeIcon className="h-5 w-5 sm:h-[22px] sm:w-[22px]" />
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-[#22313F] sm:text-base">{title}</h3>
        <div className="mt-1 space-y-0.5 text-xs leading-relaxed text-neutral-700 sm:text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="3.5"
        y="5.5"
        width="17"
        height="13"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M4 7l8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.5 22 20H2L12 3.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path
        d="M12 10v4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" />
    </svg>
  );
}
