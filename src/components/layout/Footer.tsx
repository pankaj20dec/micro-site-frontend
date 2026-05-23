import type { ReactNode } from "react";
import Link from "next/link";
import { HeaderBrand } from "@/components/layout/HeaderBrand";
import { mainNavLinks } from "@/components/layout/nav-links";
import { brand } from "@/lib/brand";
import { Container } from "@/components/ui";

const quickLinks = mainNavLinks;

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

function IconFacebook({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M14 8h2.5V5h-2.8c-2.7 0-4.2 1.6-4.2 4v1.5H7v3h1.5V19h3.5v-6.5H16V9h-2z" />
    </svg>
  );
}

function IconTwitter({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M18.9 7.5h-1.4l-3.2 3.7-3.8-3.7H5.1l5.4 6.2-5.6 6.5h1.4l3.5-4 4 4h5.4l-5.7-6.5 6.4-6.2z" />
    </svg>
  );
}

function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M6.5 8.5h3v9h-3v-9zm1.5-4.5a1.75 1.75 0 1 1 0 3.5 1.75 1.75 0 0 1 0-3.5zM10 8.5h2.9v1.2h.1c.4-.8 1.4-1.6 2.9-1.6 3.1 0 3.7 2 3.7 4.6v5.3H16v-4.7c0-1.1 0-2.6-1.6-2.6s-1.8 1.2-1.8 2.5v4.8H10V8.5z" />
    </svg>
  );
}

function SocialIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white transition hover:opacity-75"
      aria-label={label}
    >
      {children}
    </a>
  );
}

function FooterBrandCard() {
  return (
    <div className="relative z-10 -mt-14 w-full max-w-[19rem] rounded-xl bg-white px-6 py-6 shadow-[0_10px_40px_rgba(0,0,0,0.15)] sm:-mt-24 sm:max-w-[20rem] sm:px-7 sm:py-7">
      <div className="flex items-start gap-3 border-b border-neutral-200 pb-4">
        <span className="mt-0.5 shrink-0 text-[#E91E8C]">
          <IconEnvelope className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-neutral-500 sm:text-xs">Contact Us</p>
          <a
            href="mailto:office@fipo.uk"
            className="mt-0.5 block text-[15px] font-bold leading-tight text-neutral-900 hover:underline sm:text-base"
          >
            office@fipo.uk
          </a>
        </div>
      </div>
      <div className="mt-5">
        <HeaderBrand variant="footer" />
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer
      id="contact"
      className="relative scroll-mt-20 overflow-visible font-sans text-white mt-10"
      style={{ backgroundColor: brand.purple }}
    >
      <Container className="pb-10">
        <div className="grid items-start gap-10 lg:grid-cols-[20rem_1fr_1.15fr] lg:gap-x-12 xl:gap-x-16">
          <div>
            <FooterBrandCard />
          </div>

          <div className="lg:pt-10">
            <h2 className="text-[17px] font-bold leading-tight sm:text-lg">Quick Links</h2>
            <ul className="mt-4 space-y-2.5 text-sm font-normal leading-normal">
              {quickLinks.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="transition hover:underline">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:pt-10">
            <h2 className="text-[17px] font-bold leading-tight sm:text-lg">Contact Info</h2>
            <ul className="mt-4 space-y-3.5 text-sm font-normal leading-relaxed">
              <li className="flex gap-3">
                <IconEnvelope className="mt-0.5 h-[17px] w-[17px] shrink-0" />
                <a href="mailto:fipo@harcusparker.co.uk" className="hover:underline">
                  fipo@harcusparker.co.uk
                </a>
              </li>
              <li className="flex gap-3">
                <IconPhone className="mt-0.5 h-[17px] w-[17px] shrink-0" />
                <a href="tel:+442072054166" className="hover:underline">
                  020 7205 4166
                </a>
              </li>
              <li className="flex gap-3">
                <IconPin className="mt-0.5 h-[17px] w-[17px] shrink-0" />
                <address className="not-italic">
                  The Harley Building
                  <br />
                  77-79 New Cavendish Street
                  <br />
                  London
                  <br />
                  W1W 6XB
                </address>
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-5">
              <SocialIcon href="https://www.facebook.com/" label="Facebook">
                <IconFacebook className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </SocialIcon>
              <SocialIcon href="https://twitter.com/" label="X (Twitter)">
                <IconTwitter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </SocialIcon>
              <SocialIcon href="https://www.linkedin.com/" label="LinkedIn">
                <IconLinkedIn className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </SocialIcon>
            </div>
          </div>
        </div>

        <div className="mt-11 border-t border-white/20 pt-6 text-center text-[11px] font-normal leading-relaxed text-white sm:mt-14 sm:text-xs">
          <p>
            The Federation of Independent Practitioner Organizations is a company limited by guarantee, registered in
            England number 4148752.
          </p>
          <p className="mt-1.5">
            Registered office: The Harley Building, 77-79 New Cavendish Street, London, W1W 6XB.
          </p>
        </div>
      </Container>
    </footer>
  );
}
