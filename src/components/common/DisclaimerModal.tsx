"use client";

import { useEffect, useState } from "react";
import { brand } from "@/lib/brand";

const STORAGE_KEY = "fipo-disclaimer-accepted";

const paragraphs = [
  "This website provides information about collective legal action against private medical insurers. It is intended only for medical practitioners who may be eligible to participate.",
  "By proceeding, you confirm that you are a registered medical practitioner who has provided services under private medical insurance arrangements.",
  "The information on this site is provided for potential claimants only. If you are employed by or represent either of the defendant Insurance companies BUPA Insurance Limited or AXA PPP, you should not proceed beyond this page.",
  "Detailed legal documents and case materials available to registered members are legally privileged and confidential to the litigation.",
];

export function DisclaimerModal() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY) !== "true") {
      setOpen(true);
    }
  }, []);

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
    window.location.href = "https://www.google.com";
  }

  if (!open) return null;

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
          Welcome To The FIPO Fair Pay Action Group Case Site
        </h2>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-[#263238]">
          {paragraphs.map((text) => (
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
            Exit
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            className="inline-flex w-full items-center justify-center rounded-full px-8 py-3 text-xs font-bold uppercase tracking-widest text-white transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:w-auto"
            style={{ backgroundColor: brand.purple }}
          >
            I Confirm &amp; Proceed
          </button>
        </div>
      </div>
    </div>
  );
}
