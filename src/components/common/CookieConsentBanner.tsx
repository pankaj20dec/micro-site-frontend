"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/brand";
import { useMounted } from "@/hooks/use-mounted";
import { Container } from "@/components/ui";

export const COOKIE_CONSENT_KEY = "fipo-cookie-consent";
export const COOKIE_CONSENT_EVENT = "fipo-open-cookie-consent";

export type CookieConsentChoice = "all" | "essential";

export function openCookieConsent() {
  window.dispatchEvent(new Event(COOKIE_CONSENT_EVENT));
}

function isAdminPath(pathname: string | null) {
  if (!pathname) return false;
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isRegisterPath(pathname: string | null) {
  if (!pathname) return false;
  return pathname === "/register" || pathname.startsWith("/register/");
}

function hideConsentBanner(pathname: string | null) {
  return isAdminPath(pathname) || isRegisterPath(pathname);
}

function readChoice(): CookieConsentChoice | null {
  const value = window.localStorage.getItem(COOKIE_CONSENT_KEY);
  if (value === "all" || value === "essential") return value;
  return null;
}

export function CookieConsentBanner() {
  const pathname = usePathname();
  const mounted = useMounted();
  const [open, setOpen] = useState(false);
  const [manage, setManage] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    if (!mounted) return;
    if (hideConsentBanner(pathname)) {
      setOpen(false);
      return;
    }
    setOpen(readChoice() === null);
  }, [mounted, pathname]);

  useEffect(() => {
    function handleOpen() {
      if (hideConsentBanner(pathname)) return;
      const existing = readChoice();
      setAnalytics(existing === "all");
      setManage(true);
      setOpen(true);
    }
    window.addEventListener(COOKIE_CONSENT_EVENT, handleOpen);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handleOpen);
  }, [pathname]);

  function save(choice: CookieConsentChoice) {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, choice);
    setOpen(false);
    setManage(false);
  }

  if (!mounted || !open || hideConsentBanner(pathname)) return null;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[90] p-4 sm:p-6">
      <Container>
        <div
          role="dialog"
          aria-modal="false"
          aria-labelledby="gdpr-consent-title"
          className="pointer-events-auto ml-auto max-w-xl rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_16px_48px_-16px_rgba(15,23,42,0.35)] sm:p-6"
        >
          <h2
            id="gdpr-consent-title"
            className="text-base font-bold sm:text-lg"
            style={{ color: brand.headingText }}
          >
            Cookies and your data
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[#627489]">
            We use essential cookies to run this site, keep you signed in, and remember
            your progress. Optional cookies help us understand how the site is used.
            Read our{" "}
            <Link href="/privacy" className="font-semibold underline-offset-2 hover:underline" style={{ color: brand.purple }}>
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="font-semibold underline-offset-2 hover:underline" style={{ color: brand.purple }}>
              Terms of Use
            </Link>
            .
          </p>

          {manage ? (
            <div className="mt-4 space-y-3 rounded-xl border border-neutral-200 bg-[#fafafa] p-4">
              <label className="flex items-start justify-between gap-4">
                <span>
                  <span className="block text-sm font-semibold text-[#22313F]">
                    Essential
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-[#627489]">
                    Required for login, security and form progress. Always on.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked
                  disabled
                  className="mt-1 h-4 w-4 accent-[#802B7D]"
                />
              </label>
              <label className="flex cursor-pointer items-start justify-between gap-4">
                <span>
                  <span className="block text-sm font-semibold text-[#22313F]">
                    Analytics
                  </span>
                  <span className="mt-0.5 block text-xs leading-relaxed text-[#627489]">
                    Optional. Helps us see how the site is used. Off unless you accept.
                  </span>
                </span>
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="mt-1 h-4 w-4 accent-[#802B7D]"
                />
              </label>
              <button
                type="button"
                onClick={() => save(analytics ? "all" : "essential")}
                className="inline-flex w-full items-center justify-center rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:opacity-95"
                style={{ backgroundColor: brand.purple }}
              >
                Save preferences
              </button>
            </div>
          ) : (
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={() => save("all")}
                className="inline-flex items-center justify-center rounded-full px-6 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition hover:opacity-95"
                style={{ backgroundColor: brand.purple }}
              >
                Accept all
              </button>
              <button
                type="button"
                onClick={() => save("essential")}
                className="inline-flex items-center justify-center rounded-full border-2 px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition hover:bg-violet-50/80"
                style={{ borderColor: brand.divider, color: brand.text }}
              >
                Reject non-essential
              </button>
              <button
                type="button"
                onClick={() => setManage(true)}
                className="inline-flex items-center justify-center rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-widest underline-offset-2 hover:underline"
                style={{ color: brand.purple }}
              >
                Manage cookies
              </button>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
