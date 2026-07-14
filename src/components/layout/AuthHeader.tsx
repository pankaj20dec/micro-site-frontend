"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Container } from "@/components/ui";
import { HeaderBrand } from "./HeaderBrand";
import { useSiteLayout } from "./SiteLayoutProvider";

const AUTH_PURPLE = "#660066";
const AUTH_MUTED = "#627489";

function HeaderDivider() {
  return (
    <div
      className="hidden h-[73px] w-px shrink-0 lg:block"
      style={{ backgroundColor: "#D1D1D1" }}
      aria-hidden
    />
  );
}

function ContactBlock({
  icon,
  label,
  children,
  className = "",
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-[10px] ${className}`}>
      {icon}
      <div className="min-w-0">
        <p
          className="text-[14px] font-normal leading-normal"
          style={{ color: AUTH_MUTED }}
        >
          {label}
        </p>
        {children}
      </div>
    </div>
  );
}

export function AuthHeader() {
  const { authHeader } = useSiteLayout();

  return (
    <header className="sticky top-0 z-50 border-b border-[#D1D1D1] bg-white">
      <Container
        max="6xl"
        className="flex h-[98px] items-center justify-between gap-4 px-4 sm:px-6"
      >
        <HeaderBrand variant="auth" />

        <nav
          className="flex items-center gap-3 sm:gap-5 lg:gap-[20px]"
          aria-label="Contact"
        >
          <ContactBlock
            icon={
              <Image
                src="/header-email-icon.svg"
                alt=""
                width={50}
                height={50}
                className="h-10 w-10 shrink-0 sm:h-[50px] sm:w-[50px]"
              />
            }
            label="Email"
          >
            <a
              href={`mailto:${authHeader.email}`}
              className="text-[16px] font-semibold leading-normal hover:underline sm:text-[18px]"
              style={{ color: AUTH_PURPLE }}
            >
              {authHeader.email}
            </a>
          </ContactBlock>

          <HeaderDivider />

          <ContactBlock
            className="hidden md:flex"
            icon={
              <Image
                src="/header-helpline-icon.svg"
                alt=""
                width={50}
                height={50}
                className="h-[50px] w-[50px] shrink-0"
              />
            }
            label="Helpline"
          >
            <p
              className="text-[16px] font-semibold leading-normal sm:text-[18px]"
              style={{ color: AUTH_PURPLE }}
            >
              {authHeader.helpline}
            </p>
            <p
              className="text-[13px] font-normal leading-normal"
              style={{ color: AUTH_MUTED }}
            >
              {authHeader.helplineHours}
            </p>
          </ContactBlock>

          <HeaderDivider />

          <ContactBlock
            className="hidden md:flex"
            icon={
              <span className="relative h-[50px] w-[50px] shrink-0">
                <Image
                  src="/header-faqs-bg.svg"
                  alt=""
                  width={50}
                  height={50}
                  className="absolute inset-0"
                />
                <Image
                  src="/header-faqs-icon.svg"
                  alt=""
                  width={28}
                  height={28}
                  className="absolute left-[11px] top-[11px]"
                />
              </span>
            }
            label="FAQs"
          >
            <Link
              href={authHeader.faqHref}
              className="text-[16px] font-semibold leading-normal hover:underline sm:text-[18px]"
              style={{ color: AUTH_PURPLE }}
            >
              {authHeader.faqLabel}
            </Link>
          </ContactBlock>
        </nav>
      </Container>
    </header>
  );
}
