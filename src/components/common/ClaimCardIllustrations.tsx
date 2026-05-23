import { brand } from "@/lib/brand";

const stroke = brand.purple;
const muted = "#9ca3af";
const dark = "#374151";

/** Scales + document — Competition Law */
export function IllustrationCompetitionLaw({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 140" fill="none" aria-hidden>
      <rect x="118" y="28" width="52" height="68" rx="4" fill="#f3eef6" stroke={stroke} strokeWidth="1.5" />
      <path d="M128 42h32M128 52h24M128 62h28" stroke={muted} strokeWidth="2" strokeLinecap="round" />
      <path d="M72 98V52" stroke={dark} strokeWidth="2" strokeLinecap="round" />
      <path d="M52 72h40" stroke={dark} strokeWidth="2" strokeLinecap="round" />
      <path d="M62 52 72 42l10 10" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M82 52 72 42l-10 10" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse cx="52" cy="72" rx="14" ry="16" fill="#f3eef6" stroke={stroke} strokeWidth="2" />
      <ellipse cx="92" cy="72" rx="14" ry="16" fill="#f3eef6" stroke={stroke} strokeWidth="2" />
    </svg>
  );
}

/** Handshake + globe — Restraint Of Trade */
export function IllustrationRestraintOfTrade({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 140" fill="none" aria-hidden>
      <circle cx="100" cy="52" r="32" fill="#f3eef6" stroke={muted} strokeWidth="1.5" />
      <path
        d="M76 48c8-12 40-12 48 0M82 56c6 8 30 8 36 0"
        stroke={muted}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M78 88c6-4 10-6 16-6s10 2 16 6M86 94h28"
        stroke={dark}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M88 82l8 6 16-14"
        stroke={stroke}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="70" y="100" width="14" height="22" rx="3" fill={stroke} opacity="0.85" />
      <rect x="116" y="100" width="14" height="22" rx="3" fill={stroke} opacity="0.85" />
    </svg>
  );
}

/** Stressed figure + economic icons — Economic Torts */
export function IllustrationEconomicTorts({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 140" fill="none" aria-hidden>
      <circle cx="100" cy="48" r="18" fill="#f3eef6" stroke={stroke} strokeWidth="2" />
      <path d="M82 78c4-10 32-10 36 0v28H82V78z" fill={stroke} opacity="0.2" stroke={stroke} strokeWidth="1.5" />
      <path d="M92 44h16M94 40h12" stroke={dark} strokeWidth="1.5" strokeLinecap="round" />
      <rect x="36" y="56" width="22" height="18" rx="3" fill="#f3eef6" stroke={muted} strokeWidth="1.5" />
      <path d="M42 68h10" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <circle cx="158" cy="60" r="12" fill="#f3eef6" stroke={muted} strokeWidth="1.5" />
      <path d="M154 60h8M158 56v8" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M44 108h18l-4-8h-10l-4 8z" stroke={muted} strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="148" y="96" width="20" height="14" rx="2" fill="#f3eef6" stroke={muted} strokeWidth="1.5" />
    </svg>
  );
}
