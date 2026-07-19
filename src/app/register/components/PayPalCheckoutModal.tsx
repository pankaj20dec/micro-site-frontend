"use client";

import { useEffect, useState } from "react";
import { createPaypalOrder, getPaymentReturnBaseUrl } from "@/lib/application-api";

const PAYPAL_CURRENCY = process.env.NEXT_PUBLIC_PAYPAL_CURRENCY?.trim() || "GBP";

function formatMoney(amount: number) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: PAYPAL_CURRENCY,
  }).format(amount);
}

interface Props {
  open: boolean;
  amount: number;
  onClose: () => void;
  onError: (message: string) => void;
}

export function PayPalCheckoutModal({ open, amount, onClose, onError }: Props) {
  const [approveUrl, setApproveUrl] = useState<string | null>(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setApproveUrl(null);
      setOrderError(null);
      setOrderLoading(false);
      return;
    }

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    let cancelled = false;
    setOrderLoading(true);
    setOrderError(null);
    setApproveUrl(null);

    createPaypalOrder(amount, { returnBaseUrl: getPaymentReturnBaseUrl() })
      .then((result) => {
        if (cancelled) return;
        if (result.stub) {
          throw new Error(
            "PayPal is not configured on the server. Add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET to backend .env, then restart the API."
          );
        }
        if (!result.approveUrl) {
          throw new Error("PayPal did not return a checkout URL.");
        }
        setApproveUrl(result.approveUrl);
      })
      .catch((err) => {
        if (!cancelled) {
          const message =
            err instanceof Error ? err.message : "Could not start PayPal checkout.";
          setOrderError(message);
        }
      })
      .finally(() => {
        if (!cancelled) setOrderLoading(false);
      });

    return () => {
      cancelled = true;
      document.body.style.overflow = original;
    };
  }, [open, amount]);

  function continueToPayPal() {
    if (!approveUrl) return;
    sessionStorage.setItem("paypal_checkout_pending", "1");
    window.location.href = approveUrl;
  }

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[110] flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60" aria-hidden onClick={onClose} />

      <div
        className="relative z-10 w-full max-w-sm rounded-xl bg-white p-6 pb-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700"
        >
          ✕
        </button>

        <h2 className="pr-8 text-lg font-bold text-[#802B7D]">Review your payment</h2>

        <div className="mt-4 flex items-center justify-between border-b border-zinc-100 pb-3 text-sm">
          <span className="text-zinc-600">Total</span>
          <span className="font-bold text-zinc-900">{formatMoney(amount)}</span>
        </div>

        {orderLoading && (
          <p className="mt-4 text-center text-sm text-zinc-500">Preparing PayPal checkout…</p>
        )}

        {orderError && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{orderError}</p>
        )}

        {!orderLoading && !orderError && approveUrl && (
          <>
            <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-3 text-xs leading-relaxed text-amber-950">
              <p className="font-semibold">Sandbox test account required</p>
              <p className="mt-1">
                On PayPal&apos;s page, sign in with the <strong>Personal</strong> sandbox
                buyer account from{" "}
                <a
                  href="https://developer.paypal.com/dashboard/accounts"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0070ba] underline"
                >
                  developer.paypal.com → Sandbox → Accounts
                </a>
                . Do not use your real PayPal email or the Business merchant account.
              </p>
              {PAYPAL_CURRENCY === "USD" ? (
                <p className="mt-2">
                  Currency is <strong>USD</strong> — use a <strong>United States</strong>{" "}
                  sandbox Personal account.
                </p>
              ) : (
                <p className="mt-2">
                  Currency is <strong>GBP</strong> — use a <strong>United Kingdom</strong>{" "}
                  sandbox Personal account (not US/INR).
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={continueToPayPal}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-[#ffc439] px-4 py-3 text-sm font-bold text-[#003087] transition hover:brightness-95"
            >
              Continue to PayPal
            </button>
          </>
        )}
      </div>
    </div>
  );
}
