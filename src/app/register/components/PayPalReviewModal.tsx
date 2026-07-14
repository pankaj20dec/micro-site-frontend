"use client";

import { useEffect } from "react";
import { brand } from "@/lib/brand";

interface Props {
  open: boolean;
  amount: number;
  currency?: string;
  paying?: boolean;
  onClose: () => void;
  onPayNow: () => void | Promise<void>;
}

function PayPalMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#003087"
        d="M8.3 19.5h3.1c2.1 0 3.5-1.3 3.8-3.2l1.6-10.2c.1-.6-.4-1.1-1-1.1H9.1c-.5 0-.9.3-1 1L5.2 18.4c-.1.6.3 1.1.9 1.1h2.2z"
      />
      <path
        fill="#009CDE"
        d="M18.2 5.5c-.3-.1-.6-.1-1-.1H11c-.5 0-.9.3-1 1l-1.2 7.6h3.1c2.1 0 3.5-1.3 3.8-3.2l1.5-4.3z"
      />
    </svg>
  );
}

export function PayPalReviewModal({
  open,
  amount,
  currency = "GBP",
  paying,
  onClose,
  onPayNow,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const formatted = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency,
  }).format(amount);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="paypal-review-title"
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60" aria-hidden onClick={onClose} />

      <div className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <PayPalMark />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition hover:bg-zinc-100 hover:text-zinc-700"
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

        <div className="px-5 py-5">
          <h2
            id="paypal-review-title"
            className="text-xl font-bold"
            style={{ color: brand.purple }}
          >
            Review your payment
          </h2>

          <div className="mt-5 flex items-center justify-between text-sm text-zinc-700">
            <span>Pay to Fipo</span>
            <span className="font-medium">{formatted}</span>
          </div>

          <div className="mt-4 flex items-center justify-between gap-3 text-sm">
            <span className="text-zinc-700">Pay with</span>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-left transition hover:bg-zinc-50"
            >
              <span className="rounded bg-[#1a1f71] px-1.5 py-0.5 text-[10px] font-bold text-white">
                VISA
              </span>
              <span className="text-zinc-800">Visa **** 8957</span>
              <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
                Preferred
              </span>
              <span className="text-zinc-400">›</span>
            </button>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-4">
            <span className="text-sm font-semibold text-zinc-800">Total</span>
            <span className="text-base font-bold text-zinc-900">{formatted}</span>
          </div>

          <p className="mt-4 text-[11px] leading-relaxed text-zinc-500">
            By clicking Pay Now, you agree to PayPal&apos;s{" "}
            <span className="text-[#0070ba]">User Agreement</span> and{" "}
            <span className="text-[#0070ba]">Privacy Policy</span>.
          </p>

          <button
            type="button"
            onClick={onPayNow}
            disabled={paying}
            className="mt-5 w-full rounded-full py-3.5 text-sm font-bold uppercase tracking-wide text-white transition hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: brand.purple }}
          >
            {paying ? "Processing…" : "Pay Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
