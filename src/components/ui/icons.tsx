export function IconRegister({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect x="10" y="8" width="28" height="32" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M16 18h16M16 24h10M16 30h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconSign({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path d="M14 24h20M24 14v20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M10 38h28V12a2 2 0 0 0-2-2H12a2 2 0 0 0-2 2v26z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

export function IconUpload({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path d="M24 32V12M16 20l8-8 8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 36h28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconShield({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M24 6L10 12v12c0 8 6 14 14 18 8-4 14-10 14-18V12L24 6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M18 24l4 4 8-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconScale({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path d="M8 38h32M24 8v22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 30h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="16" cy="30" r="4" stroke="currentColor" strokeWidth="2" />
      <circle cx="32" cy="30" r="4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function IconBriefcase({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect x="10" y="16" width="28" height="22" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M18 16V12a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v4" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

/** Person with plus — join flow */
export function IconUserPlus({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <circle cx="20" cy="17" r="6" stroke="currentColor" strokeWidth="2" />
      <path
        d="M10 38c0-6 5.5-10 12-10s12 4 12 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M34 10v8M30 14h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/** Document with checkmark */
export function IconDocumentCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M12 8h18l6 6v26a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M30 8v6h6" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M17 26l5 5 10-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/** Two overlapping documents */
export function IconDocumentsStack({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect x="8" y="10" width="22" height="28" rx="2" stroke="currentColor" strokeWidth="2" opacity="0.45" />
      <path
        d="M16 14h16l4 4v22a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V16a2 2 0 0 1 2-2z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M32 14v4h4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

/** Seal / badge with check — sign documents step */
export function IconSealCheck({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M24 8.5 31.2 11.1 33.8 18.3 33.8 26.7 31.2 33.9 24 36.5 16.8 33.9 14.2 26.7 14.2 18.3 16.8 11.1 24 8.5Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M17 23.5l5 5 10-10"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Hand supporting a card — we take it from here */
export function IconHandCard({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <rect x="12" y="9" width="24" height="16" rx="2.5" stroke="currentColor" strokeWidth="2" />
      <path d="M16 16h16M16 20h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M14 41V35c0-1.1.9-2 2-2h1.4c.8 0 1.5.5 1.8 1.2.3-.7 1-1.2 1.8-1.2H23c.7 0 1.3.4 1.6 1 .3-.6.9-1 1.6-1h1.8c1.1 0 2 .9 2 2v6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M17 41h17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function IconLinkedIn({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.25 6.5 1.75 1.75 0 0 1 6.5 8.25zM19 19h-3v-4.6c0-1.1-.02-2.5-1.52-2.5-1.52 0-1.75 1.19-1.75 2.42V19h-3v-9h2.9v1.2h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59V19z" />
    </svg>
  );
}

/** Card / delegation — simplified hand-off */
export function IconCardDelegate({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden>
      <path
        d="M8 22c0-2 1.5-3.5 3.5-3.5h4c1 0 2 .6 2.5 1.5L22 26"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <rect x="18" y="18" width="22" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M22 24h14M22 28h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M36 36l4 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
