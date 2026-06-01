import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

/** Magnifying-glass-with-FAQ illustration shown inside an open accordion item. */
export function FaqIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 180"
      role="img"
      aria-label="Frequently asked questions illustration"
      className={cn("h-auto w-full max-w-[180px]", className)}
    >
      <defs>
        <linearGradient id="faq-bubble" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F3EEF6" />
          <stop offset="100%" stopColor="#E5D6E7" />
        </linearGradient>
        <linearGradient id="faq-rim" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={brand.purple} />
          <stop offset="100%" stopColor={brand.purpleDark} />
        </linearGradient>
      </defs>

      <g opacity="0.7">
        <circle cx="22" cy="38" r="3" fill={brand.purple} />
        <circle cx="184" cy="28" r="2.5" fill={brand.purple} />
        <circle cx="172" cy="160" r="2.5" fill={brand.purple} />
        <path
          d="M168 60 l4 4 M168 64 l4 -4"
          stroke={brand.purple}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <path
          d="M14 110 l4 4 M14 114 l4 -4"
          stroke={brand.purple}
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </g>

      <rect
        x="118"
        y="118"
        width="14"
        height="46"
        rx="7"
        transform="rotate(45 125 141)"
        fill="url(#faq-rim)"
      />

      <circle cx="92" cy="80" r="62" fill="url(#faq-bubble)" />
      <circle
        cx="92"
        cy="80"
        r="62"
        fill="none"
        stroke="url(#faq-rim)"
        strokeWidth="6"
      />

      <circle cx="74" cy="64" r="10" fill="#fff" opacity="0.8" />

      <text
        x="92"
        y="92"
        textAnchor="middle"
        fontFamily="var(--font-poppins), system-ui, sans-serif"
        fontWeight="800"
        fontSize="32"
        fill={brand.purpleDark}
        letterSpacing="1"
      >
        FAQ
      </text>
      <text
        x="92"
        y="108"
        textAnchor="middle"
        fontFamily="var(--font-poppins), system-ui, sans-serif"
        fontWeight="600"
        fontSize="9"
        fill={brand.purple}
        letterSpacing="3"
      >
        ASK US
      </text>
    </svg>
  );
}
