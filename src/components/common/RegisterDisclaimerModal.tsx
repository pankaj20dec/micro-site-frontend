"use client";

import { useEffect, useState } from "react";
import { fetchRegisterDisclaimerContent } from "@/lib/modal-content-api";
import {
  defaultRegisterDisclaimer,
  type RegisterDisclaimerContent,
} from "@/lib/modal-content-defaults";
import { renderParagraphWithLinks } from "@/lib/render-paragraph-links";

const STORAGE_KEY = "fipo-register-disclaimer-accepted";
const REGISTER_PURPLE = "#660066";

export function getRegisterDisclaimerAccepted() {
  if (typeof window === "undefined") return false;
  return sessionStorage.getItem(STORAGE_KEY) === "true";
}

function unlockPageScroll() {
  document.body.style.overflow = "";
  document.documentElement.style.overflow = "";
}

export function RegisterDisclaimerModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [content, setContent] = useState<RegisterDisclaimerContent>(defaultRegisterDisclaimer);

  useEffect(() => {
    let cancelled = false;
    fetchRegisterDisclaimerContent().then((data) => {
      if (!cancelled) setContent(data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!open) {
      unlockPageScroll();
      return;
    }

    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = bodyOverflow;
      document.documentElement.style.overflow = htmlOverflow;
      if (!bodyOverflow) document.body.style.removeProperty("overflow");
      if (!htmlOverflow) document.documentElement.style.removeProperty("overflow");
    };
  }, [open]);

  function handleConfirm() {
    sessionStorage.setItem(STORAGE_KEY, "true");
    unlockPageScroll();
    onClose();
  }

  function handleExit() {
    window.location.href = content.exitUrl || defaultRegisterDisclaimer.exitUrl;
  }

  if (!open) return null;

  const { title, paragraphs, competitionLaw } = content;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-disclaimer-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-[800px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={handleExit}
          className="absolute right-5 top-5 z-10 flex h-6 w-6 items-center justify-center text-[#627489] transition hover:text-[#263238]"
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18.3 5.71a1 1 0 0 0-1.41 0L12 10.59 7.11 5.7A1 1 0 0 0 5.7 7.11L10.59 12l-4.89 4.89a1 1 0 1 0 1.41 1.41L12 13.41l4.89 4.89a1 1 0 0 0 1.41-1.41L13.41 12l4.89-4.89a1 1 0 0 0 0-1.4z" />
          </svg>
        </button>

        <div className="overflow-y-auto px-8 pb-6 pt-10 sm:px-12 sm:pt-12">
          <h2
            id="register-disclaimer-title"
            className="pr-8 text-xl font-bold leading-snug sm:text-2xl"
            style={{ color: REGISTER_PURPLE }}
          >
            {title}
          </h2>

          <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#263238]">
            {paragraphs.map((text) => (
              <p key={text}>{renderParagraphWithLinks(text)}</p>
            ))}
          </div>

          <h3
            className="mt-8 text-xl font-bold leading-snug sm:text-2xl"
            style={{ color: REGISTER_PURPLE }}
          >
            {competitionLaw.title}
          </h3>

          <div className="mt-5 space-y-4 text-sm leading-relaxed text-[#263238]">
            {competitionLaw.paragraphs.map((text) => (
              <p key={text}>{text}</p>
            ))}
          </div>
        </div>

        <div className="border-t border-[#D1D1D1] px-8 py-6 sm:px-12">
          <div className="flex flex-col-reverse items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleExit}
              className="inline-flex items-center justify-center rounded-full border border-[#D1D1D1] bg-white px-8 py-3 text-xs font-bold uppercase tracking-widest text-[#263238] transition hover:bg-zinc-50"
            >
              {content.exitButtonLabel}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="inline-flex items-center justify-center rounded-full px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:opacity-95"
              style={{ backgroundColor: "#7F2A7F" }}
            >
              {content.confirmButtonLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
