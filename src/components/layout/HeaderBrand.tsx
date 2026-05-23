import Link from "next/link";
import { brand } from "@/lib/brand";

function FipoLetterO() {
  return (
    <span
      className="relative mx-px inline-flex aspect-square h-[0.92em] w-[0.92em] shrink-0 items-center justify-center self-end rounded-full leading-none"
      style={{ backgroundColor: brand.purple }}
      aria-hidden
    >
      <svg viewBox="0 0 12 12" className="h-[42%] w-[42%] text-white" fill="none">
        <path d="M6 1.2v9.6M1.2 6h9.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

function FipoWordmark({ size = "header" }: { size?: "header" | "footer" }) {
  const isFooter = size === "footer";
  return (
    <div className="flex min-w-0 flex-col gap-2">
      <div
        className={
          isFooter
            ? "flex items-end gap-0 text-[2rem] font-bold leading-none tracking-tight sm:text-[2.25rem]"
            : "flex items-end gap-0 text-[1.35rem] font-bold leading-none tracking-tight sm:text-[1.65rem]"
        }
        style={{ color: brand.purple }}
      >
        <span>F</span>
        <span>I</span>
        <span>P</span>
        <FipoLetterO />
      </div>
      <p
        className={
          isFooter
            ? "max-w-[16rem] text-[0.8rem] font-normal leading-snug text-neutral-500 sm:max-w-[18rem] sm:text-[0.85rem]"
            : "max-w-[12.5rem] text-[0.5rem] font-normal uppercase leading-snug tracking-wide text-neutral-500 sm:max-w-[14rem] sm:text-[0.58rem]"
        }
      >
        {isFooter
          ? "Federation of Independent practitioner organisations"
          : "federation of independent practitioner organisations"}
      </p>
      {!isFooter && (
        <div className="flex flex-col gap-1">
          <div className="h-0.5 max-w-[7.5rem]" style={{ backgroundColor: brand.purple }} />
          <div className="h-0.5 max-w-[7.5rem]" style={{ backgroundColor: brand.purple }} />
        </div>
      )}
    </div>
  );
}

function HarcusParkerWordmark({ compact }: { compact?: boolean }) {
  const textClass = compact
    ? "text-[0.65rem] sm:text-[0.7rem] tracking-[0.16em] sm:tracking-[0.22em]"
    : "text-[0.58rem] sm:text-[0.68rem] tracking-[0.12em] sm:tracking-[0.18em]";

  return (
    <div className={`flex flex-col gap-1 font-normal uppercase leading-tight ${textClass}`}>
      <div className="text-neutral-900">{"HARCUS".split("").join(" ")}</div>
      <div style={{ color: brand.accentBlue }}>{"PARKER".split("").join(" ")}</div>
    </div>
  );
}

export function HeaderBrand({ variant = "header" }: { variant?: "header" | "footer" }) {
  if (variant === "footer") {
    return (
      <Link href="/" className="group flex max-w-full flex-col gap-5">
        <FipoWordmark size="footer" />
        <HarcusParkerWordmark compact />
      </Link>
    );
  }

  return (
    <Link href="/" className="group flex max-w-full shrink-0 items-stretch gap-5 sm:gap-6">
      <FipoWordmark />
      <div
        className="hidden w-px shrink-0 self-stretch sm:block"
        style={{ backgroundColor: brand.divider }}
        aria-hidden
      />
      <div className="flex min-w-0 flex-col justify-center">
        <HarcusParkerWordmark />
      </div>
    </Link>
  );
}
