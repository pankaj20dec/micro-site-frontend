import type { ReactNode } from "react";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { contactInfo } from "@/lib/contact-content";

export function ContactInfo({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-7 sm:gap-8", className)}>
      <h2 className="text-base font-bold text-[#22313F] sm:text-lg">
        {contactInfo.heading}
      </h2>

      <InfoRow icon={<PinIcon className="h-5 w-5" />} title={contactInfo.address.title}>
        <address className="not-italic">
          {contactInfo.address.lines.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </address>
      </InfoRow>

      <div className="grid gap-7 sm:grid-cols-2 sm:gap-8">
        <InfoRow
          icon={<EnvelopeIcon className="h-5 w-5" />}
          title={contactInfo.email.title}
        >
          <div className="space-y-3">
            {contactInfo.email.blocks.map((block) => (
              <div key={block.address}>
                <p>{block.description}</p>
                <a
                  href={`mailto:${block.address}`}
                  className="break-all font-medium underline-offset-2 hover:underline"
                  style={{ color: brand.purple }}
                >
                  {block.address}
                </a>
              </div>
            ))}
          </div>
        </InfoRow>

        <InfoRow
          icon={<PhoneIcon className="h-5 w-5" />}
          title={contactInfo.telephone.title}
        >
          <a
            href={`tel:${contactInfo.telephone.tel}`}
            className="font-medium text-[#22313F] hover:underline"
          >
            {contactInfo.telephone.number}
          </a>
        </InfoRow>
      </div>
    </div>
  );
}

function InfoRow({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex gap-4">
      <span
        aria-hidden
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: brand.lavender, color: brand.purple }}
      >
        {icon}
      </span>
      <div className="min-w-0 flex-1">
        <h3 className="text-sm font-bold text-[#22313F] sm:text-base">{title}</h3>
        <div className="mt-1.5 space-y-1 text-xs leading-relaxed text-neutral-700 sm:text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

function PinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s6-5.4 6-10.5a6 6 0 1 0-12 0C6 15.6 12 21 12 21z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10.5" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
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

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.6 3.8h2.7l1.4 3.6-1.9 1.4a11.2 11.2 0 0 0 5 5l1.4-1.9 3.6 1.4v2.7a2 2 0 0 1-2 2A15.6 15.6 0 0 1 4.6 5.8a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
