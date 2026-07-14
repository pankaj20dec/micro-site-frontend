"use client";

import { useEffect } from "react";
import { brand } from "@/lib/brand";

interface Props {
  open: boolean;
  onClose: () => void;
  onSaveExit: () => void | Promise<void>;
  saving?: boolean;
}

export function SaveResumeModal({ open, onClose, onSaveExit, saving }: Props) {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-resume-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"
        aria-hidden
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-[520px] rounded-xl bg-white px-6 py-6 shadow-2xl sm:px-8 sm:py-7">
        <div className="flex items-start justify-between gap-4">
          <h2
            id="save-resume-title"
            className="text-lg font-bold sm:text-xl"
            style={{ color: brand.purple }}
          >
            Save And Resume
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M18 6 6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <p className="mt-6 text-base font-bold text-[#263238]">Need more time?</p>
        <p className="mt-2 text-sm leading-relaxed text-[#263238]">
          You can save your progress and return to complete registration later.
        </p>

        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onSaveExit}
            disabled={saving}
            className="rounded-lg border border-zinc-300 bg-white px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save & Exit"}
          </button>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-lg px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: brand.purple }}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
