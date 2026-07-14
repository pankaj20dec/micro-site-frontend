"use client";

import Image from "next/image";
import Link from "next/link";
import { brand } from "@/lib/brand";
import { phoneTelHref } from "@/lib/phone-tel";
import { Container } from "@/components/ui";
import { useSiteLayout } from "./SiteLayoutProvider";

function IconEnvelope({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16v12H4V6zm0 0 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPhone({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.5 4h3l1.5 4-2 1.5a11 11 0 0 0 5 5L17.5 12.5 21.5 14v3a2 2 0 0 1-2 2A15.5 15.5 0 0 1 4 6.5a2 2 0 0 1 2-2.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPin({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 21s6-5.2 6-10a6 6 0 1 0-12 0c0 4.8 6 10 6 10z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="11" r="2" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function FooterBrandCard({
  contactCardLabel,
  contactCardEmail,
  partnerUrl,
}: {
  contactCardLabel: string;
  contactCardEmail: string;
  partnerUrl: string;
}) {
  return (
    <div className="relative z-10 -mt-14 w-full md:max-w-[20rem] rounded-xl bg-white px-6 py-6 shadow-[0_10px_40px_rgba(0,0,0,0.15)] sm:-mt-24 sm:max-w-[20rem] sm:px-6 sm:py-6">
      <div className="flex items-start gap-3 border-b-[2px] border-neutral-200 pb-4">
        <span className="mt-0.5 shrink-0">
          <Image
            src="/mail-icon.svg"
            alt=""
            width={24}
            height={24}
            className="h-5 w-5"
            aria-hidden
          />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-[#8F8F8F]">{contactCardLabel}</p>
          <a
            href={`mailto:${contactCardEmail}`}
            className="mt-0.5 block text-[18px] font-medium leading-tight text-[#223645] hover:underline"
          >
            {contactCardEmail}
          </a>
        </div>
      </div>
      <div className="mb-4 flex max-w-full flex-col items-center">
        <Link href="/" className="mx-auto mt-4">
          <Image
            src="/images/bottom-logo.png"
            alt="FIPO – Federation of Independent Practitioner Organisations"
            width={315}
            height={80}
            className="h-auto object-contain"
          />
        </Link>
        <Link href={partnerUrl} target="_blank" rel="noopener noreferrer" className="mt-5">
          <Image
            src="/images/footer-logo.png"
            alt="Harcus Parker"
            width={270}
            height={40}
            className="h-auto w-[270px] object-contain"
          />
        </Link>
      </div>
    </div>
  );
}

export function Footer({ compact = false }: { compact?: boolean }) {
  const { siteFooter } = useSiteLayout();

  return (
    <footer
      id="contact"
      className={`relative scroll-mt-20 overflow-visible font-sans text-white ${compact ? "mt-0" : "mt-10"}`}
      style={{ backgroundColor: brand.purple }}
    >
      <Container className="pb-10" max="5xl">
        <div className="grid items-start gap-10 lg:grid-cols-[20rem_1fr_1.15fr] lg:gap-x-12 xl:gap-x-16">
          <div>
            <FooterBrandCard
              contactCardLabel={siteFooter.contactCardLabel}
              contactCardEmail={siteFooter.contactCardEmail}
              partnerUrl={siteFooter.partnerUrl}
            />
          </div>

          <div className="lg:pt-10">
            <h2 className="text-[17px] font-bold leading-tight sm:text-lg">
              {siteFooter.quickLinksTitle}
            </h2>
            <ul className="mt-4 space-y-2.5 text-sm font-normal leading-normal">
              {siteFooter.quickLinks.map(({ label, href }) => (
                <li key={`${href}-${label}`}>
                  <Link href={href} className="transition hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:pt-10">
            <h2 className="text-[17px] font-bold leading-tight sm:text-lg">
              {siteFooter.contactInfoTitle}
            </h2>
            <ul className="mt-4 space-y-3.5 text-sm font-normal leading-relaxed">
              <li className="flex gap-3">
                <IconEnvelope className="mt-0.5 h-[17px] w-[17px] shrink-0" />
                <a href={`mailto:${siteFooter.contactEmail}`} className="hover:underline">
                  {siteFooter.contactEmail}
                </a>
              </li>
              <li className="flex gap-3">
                <IconPhone className="mt-0.5 h-[17px] w-[17px] shrink-0" />
                <a href={phoneTelHref(siteFooter.contactPhone)} className="hover:underline">
                  {siteFooter.contactPhone}
                </a>
              </li>
              <li className="flex gap-3">
                <IconPin className="mt-0.5 h-[17px] w-[17px] shrink-0" />
                <address className="not-italic">
                  {siteFooter.addressLines.map((line, index) => (
                    <span key={line}>
                      {line}
                      {index < siteFooter.addressLines.length - 1 && <br />}
                    </span>
                  ))}
                </address>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-11 border-t border-white/20 pt-6 text-center text-[11px] font-normal leading-relaxed text-white sm:mt-14 sm:text-xs">
          <p>{siteFooter.legalLine1}</p>
          <p className="mt-1.5">{siteFooter.legalLine2}</p>
        </div>
      </Container>
    </footer>
  );
}
