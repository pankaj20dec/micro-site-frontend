import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { brand } from "@/lib/brand";

export function HeaderBrand({
  variant = "header",
}: {
  variant?: "header" | "footer" | "auth";
}) {
  if (variant === "auth") {
    return (
      <div className="flex shrink-0 items-center gap-4 sm:gap-5 lg:gap-6">
        <Link href="/" className="shrink-0">
          <Image
            src="/header-fipo-logo.png"
            alt="FIPO – Federation of Independent Practitioner Organisations"
            width={124}
            height={73}
            className="h-[52px] w-auto sm:h-[65px] lg:h-[73px]"
            priority
          />
        </Link>
        <div
          className="hidden h-[73px] w-px shrink-0 sm:block"
          style={{ backgroundColor: brand.divider }}
          aria-hidden
        />
        <Link
          href="https://harcusparker.co.uk"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0"
        >
          <Image
            src="/header-harcus-parker-logo.png"
            alt="Harcus Parker"
            width={192}
            height={55}
            className="h-[36px] w-auto sm:h-[48px] lg:h-[55px]"
          />
        </Link>
      </div>
    );
  }

  if (variant === "footer") {
    return (
      <div className="flex max-w-full flex-col gap-5">
        <Link href="/">
          <Image
            src="/images/logo.png"
            alt="FIPO – Federation of Independent Practitioner Organisations"
            width={120}
            height={60}
            className="h-auto w-[120px] object-contain"
            priority
          />
        </Link>
        <Link href="https://harcusparker.co.uk" target="_blank" rel="noopener noreferrer">
          <Image
            src="/images/partner-logo.png"
            alt="Harcus Parker"
            width={110}
            height={40}
            className="h-auto w-[110px] object-contain"
          />
        </Link>
      </div>
    );
  }

  return (
    <div className="flex max-w-full shrink-0 items-center gap-3 sm:gap-5 lg:gap-6">
      <Link href="/" className="shrink-0">
        <Image
          src="/images/logo.png"
          alt="FIPO – Federation of Independent Practitioner Organisations"
          width={100}
          height={50}
          className="h-auto w-[60px] object-contain sm:w-[80px] lg:w-[100px]"
          priority
        />
      </Link>
      <div
        className="w-px shrink-0 self-stretch"
        style={{ backgroundColor: brand.divider }}
        aria-hidden
      />
      <Link href="https://harcusparker.co.uk" target="_blank" rel="noopener noreferrer" className="shrink-0">
        <Image
          src="/images/partner-logo.png"
          alt="Harcus Parker"
          width={95}
          height={36}
          className="h-auto w-[64px] object-contain sm:w-[80px] lg:w-[95px]"
        />
      </Link>
    </div>
  );
}
