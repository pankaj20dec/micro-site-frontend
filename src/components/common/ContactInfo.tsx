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
                <p className="font-semibold">{block.description}</p>
                <a
                  href={`mailto:${block.address}`}
                  className="break-all font-medium underline"
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
        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full"
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
    <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18.7497 27.0833H22.9163V21.3542H27.083V27.0833H31.2497V17.1875L24.9997 13.0208L18.7497 17.1875V27.0833ZM24.9997 45.8333C19.4094 41.0764 15.234 36.658 12.4736 32.5781C9.71322 28.4983 8.33301 24.7222 8.33301 21.25C8.33301 16.0417 10.0084 11.8924 13.359 8.80207C16.7097 5.7118 20.59 4.16666 24.9997 4.16666C29.4094 4.16666 33.2896 5.7118 36.6403 8.80207C39.991 11.8924 41.6663 16.0417 41.6663 21.25C41.6663 24.7222 40.2861 28.4983 37.5257 32.5781C34.7653 36.658 30.59 41.0764 24.9997 45.8333Z" fill="#7F2A7F"/>
    </svg>    
  );
}

function EnvelopeIcon({ className }: { className?: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.33366 41.6666C7.18783 41.6666 6.20692 41.2587 5.39095 40.4427C4.57498 39.6267 4.16699 38.6458 4.16699 37.5V12.5C4.16699 11.3541 4.57498 10.3732 5.39095 9.55727C6.20692 8.7413 7.18783 8.33331 8.33366 8.33331H41.667C42.8128 8.33331 43.7937 8.7413 44.6097 9.55727C45.4257 10.3732 45.8337 11.3541 45.8337 12.5V37.5C45.8337 38.6458 45.4257 39.6267 44.6097 40.4427C43.7937 41.2587 42.8128 41.6666 41.667 41.6666H8.33366ZM25.0003 27.0833L41.667 16.6666V12.5L25.0003 22.9166L8.33366 12.5V16.6666L25.0003 27.0833Z" fill="#7F2A7F"/>
  </svg>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M41.5625 43.75C37.2222 43.75 32.934 42.8038 28.6979 40.9115C24.4618 39.0191 20.6076 36.3368 17.1354 32.8646C13.6632 29.3924 10.9809 25.5382 9.08854 21.3021C7.19618 17.066 6.25 12.7778 6.25 8.4375C6.25 7.8125 6.45833 7.29167 6.875 6.875C7.29167 6.45833 7.8125 6.25 8.4375 6.25H16.875C17.3611 6.25 17.7951 6.41493 18.1771 6.74479C18.559 7.07465 18.7847 7.46528 18.8542 7.91667L20.2083 15.2083C20.2778 15.7639 20.2604 16.2326 20.1562 16.6146C20.0521 16.9965 19.8611 17.3264 19.5833 17.6042L14.5312 22.7083C15.2257 23.9931 16.0503 25.2344 17.0052 26.4323C17.9601 27.6302 19.0104 28.7847 20.1562 29.8958C21.2326 30.9722 22.3611 31.9705 23.5417 32.8906C24.7222 33.8108 25.9722 34.6528 27.2917 35.4167L32.1875 30.5208C32.5 30.2083 32.908 29.974 33.4115 29.8177C33.9149 29.6615 34.4097 29.6181 34.8958 29.6875L42.0833 31.1458C42.5694 31.2847 42.9688 31.5365 43.2812 31.901C43.5938 32.2656 43.75 32.6736 43.75 33.125V41.5625C43.75 42.1875 43.5417 42.7083 43.125 43.125C42.7083 43.5417 42.1875 43.75 41.5625 43.75Z" fill="#7F2A7F"/>
    </svg>
  );
}
