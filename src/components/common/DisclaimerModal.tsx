"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/brand";
import { fetchSiteDisclaimerContent } from "@/lib/modal-content-api";
import {
  defaultSiteDisclaimer,
  type SiteDisclaimerContent,
} from "@/lib/modal-content-defaults";
import { useMounted } from "@/hooks/use-mounted";

const STORAGE_KEY = "fipo-disclaimer-accepted";

function isRegisterPath(pathname: string | null) {
  if (!pathname) return false;
  return pathname === "/register" || pathname.startsWith("/register/");
}

function isAdminPath(pathname: string | null) {
  if (!pathname) return false;
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

export function DisclaimerModal() {
  const pathname = usePathname();
  const mounted = useMounted();
  const [open, setOpen] = useState(false);
  const [content, setContent] = useState<SiteDisclaimerContent>(defaultSiteDisclaimer);

  useEffect(() => {
    let cancelled = false;
    fetchSiteDisclaimerContent().then((data) => {
      if (!cancelled) setContent(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (isRegisterPath(pathname) || isAdminPath(pathname)) {
      setOpen(false);
      document.body.style.removeProperty("overflow");
      document.documentElement.style.removeProperty("overflow");
      return;
    }
    if (sessionStorage.getItem(STORAGE_KEY) !== "true") {
      setOpen(true);
    }
  }, [mounted, pathname]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  function handleConfirm() {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setOpen(false);
  }

  function handleExit() {
    window.location.href = content.exitUrl || defaultSiteDisclaimer.exitUrl;
  }

  if (!mounted || !open || isRegisterPath(pathname)) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="disclaimer-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden />

      <div className="relative z-10 w-full max-w-[610px] rounded-2xl bg-white p-4 text-center shadow-2xl sm:p-10">
        <h2
          id="disclaimer-title"
          className="font-top-heading text-xl font-bold leading-snug sm:text-2xl"
          style={{ color: brand.headingText }}
        >
          {content.title}
        </h2>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#263238]">
          {content.paragraphs.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>

        <div className="mt-4 md:mt-8 flex flex-col-reverse items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleExit}
            className="inline-flex w-full items-center justify-center rounded-full border-2 px-8 py-3 text-xs font-bold uppercase tracking-widest transition hover:bg-violet-50/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto"
            style={{ borderColor: brand.divider, color: brand.text }}
          >
            {content.exitButtonLabel}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex w-full items-center justify-center rounded-full px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto"
            style={{ backgroundColor: brand.purple }}
          >
            {content.confirmButtonLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
