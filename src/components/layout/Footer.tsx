import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
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
    <svg width="13" height="24" viewBox="0 0 13 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M8.81982 24.0058V13.2032H12.3528L12.9298 8.40206H8.81982V6.0636C8.81982 4.82755 8.85382 3.60088 10.7148 3.60088H12.5997V0.168205C12.5997 0.11663 10.9807 0 9.34268 0C5.92189 0 3.77991 1.98916 3.77991 5.64162V8.40206H0V13.2032H3.77991V24.0058H8.81982Z" fill="white"/>
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
    <svg width="26" height="22" viewBox="0 0 26 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M0.839763 21.9276H4.20167C4.66548 21.9276 5.04142 21.5786 5.04142 21.148V7.50662C5.04142 7.07601 4.66548 6.72705 4.20167 6.72705H0.839763C0.375905 6.72705 0 7.076 0 7.50662V21.148C0 21.5785 0.375905 21.9276 0.839763 21.9276ZM0.839763 4.33049H4.20167C4.66548 4.33049 5.04142 3.9815 5.04142 3.55094V0.779562C5.04142 0.349 4.66548 0 4.20167 0H0.839763C0.375905 0 0 0.349 0 0.779562V3.55094C0 3.9815 0.375905 4.33049 0.839763 4.33049ZM24.5937 8.30914C24.1213 7.73188 23.4247 7.25715 22.5036 6.88504C21.5825 6.5132 20.5658 6.32715 19.4535 6.32715C17.1953 6.32715 15.2819 7.12717 13.7132 8.7275C13.4011 9.04593 13.1741 8.97631 13.1741 8.5457V7.50648C13.1741 7.07588 12.7981 6.72692 12.3343 6.72692H9.3312C8.86734 6.72692 8.49144 7.07588 8.49144 7.50648V21.1479C8.49144 21.5784 8.8674 21.9275 9.3312 21.9275H12.6931C13.157 21.9275 13.5329 21.5784 13.5329 21.1479V16.4038C13.5329 14.4273 13.6614 13.0726 13.9186 12.3399C14.1756 11.607 14.6512 11.0186 15.3449 10.5745C16.0387 10.1303 16.822 9.90814 17.6953 9.90814C18.377 9.90814 18.9601 10.0636 19.4446 10.3746C19.9291 10.6856 20.279 11.1212 20.4943 11.682C20.7097 12.2428 20.8173 13.478 20.8173 15.3879V21.1478C20.8173 21.5784 21.1932 21.9274 21.657 21.9274H25.0189C25.4827 21.9274 25.8586 21.5784 25.8586 21.1478V13.4225C25.8586 12.0568 25.7659 11.0075 25.5807 10.2747C25.3954 9.54189 25.0664 8.88672 24.5937 8.30914Z" fill="white"/>
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
          <p className="text-[13px] font-medium text-[#8F8F8F]">Contact Us</p>
          <a
            href="mailto:office@fipo.uk"
            className="mt-0.5 block text-[18px] font-medium leading-tight text-[#223645] hover:underline"
          >
            office@fipo.uk
          </a>
        </div>
      </div>
      <div className="flex max-w-full flex-col items-center mb-4">
        <Link href="/" className="mx-auto mt-4">
          <Image
            src="/images/bottom-logo.png"
            alt="FIPO – Federation of Independent Practitioner Organisations"
            width={315}
            height={80}
            className="h-auto object-contain"
          />
        </Link>
        <Link href="https://harcusparker.co.uk" target="_blank" rel="noopener noreferrer" className="mt-5">
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

export function Footer() {
  return (
    <footer
      id="contact"
      className="relative scroll-mt-20 overflow-visible font-sans text-white mt-10"
      style={{ backgroundColor: brand.purple }}
    >
      <Container className="pb-10" max="5xl">
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
            {/* <div className="mt-5 flex items-center gap-5">
              <SocialIcon href="https://www.facebook.com/" label="Facebook">
                <IconFacebook className="h-4 w-4 sm:h-4 sm:w-4" />
              </SocialIcon>
              <SocialIcon href="https://twitter.com/" label="X (Twitter)">
                <IconTwitter className="h-6 w-6 sm:h-8 sm:w-8" />
              </SocialIcon>
              <SocialIcon href="https://www.linkedin.com/" label="LinkedIn">
                <IconLinkedIn className="h-4 w-4 sm:h-4 sm:w-4" />
              </SocialIcon>
            </div> */}
          </div>
        </div>

        <div className="mt-11 border-t border-white/20 pt-6 text-center text-[11px] font-normal leading-relaxed text-white sm:mt-14 sm:text-xs">
          <p>
            The Federation of Independent Practitioner Organisations is a company limited by guarantee, registered in
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
