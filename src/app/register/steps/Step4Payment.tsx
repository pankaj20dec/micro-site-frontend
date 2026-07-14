"use client";

import { useState } from "react";
import type { Application } from "../page";
import { createStripeIntent, createPaypalOrder, capturePaypalOrder } from "@/lib/application-api";

interface Props {
  application: Application | null;
  advance: (data?: Record<string, unknown>) => Promise<void>;
}

type PayMethod = "stripe" | "paypal" | null;

const FEES: { label: string; type: string; amount: number }[] = [
  { label: "Individual membership", type: "INDIVIDUAL", amount: 250 },
  { label: "Organisation membership", type: "ORGANISATION", amount: 500 },
];

export default function Step4Payment({ application, advance }: Props) {
  const [membershipType, setMembershipType] = useState<string>(
    (application?.membershipType as string) ?? "INDIVIDUAL"
  );
  const [payMethod, setPayMethod] = useState<PayMethod>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fee = FEES.find((f) => f.type === membershipType)?.amount ?? 250;

  async function handlePay() {
    setError(null);
    setLoading(true);
    try {
      if (payMethod === "stripe") {
        const result = await createStripeIntent(fee);
        if (result.stub) {
          // Dev stub — auto-paid
          await advance({ membershipType, membershipFee: fee });
        } else {
          // TODO: show Stripe Elements for real payment
          await advance({ membershipType, membershipFee: fee });
        }
      } else if (payMethod === "paypal") {
        const result = await createPaypalOrder(fee);
        if (result.stub) {
          await advance({ membershipType, membershipFee: fee });
        } else {
          // The PayPal SDK opens a popup and returns the orderId
          await capturePaypalOrder(result.orderId);
          await advance({ membershipType, membershipFee: fee });
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
    } finally {
      setLoading(false);
    }
  }

  const btnBase =
    "flex w-full items-center gap-3 rounded-xl border-2 p-4 text-left transition-all";
  const btnActive = "border-[#802B7D] bg-[#f3eef6]";
  const btnInactive = "border-zinc-200 bg-white hover:border-purple-200";

  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-[#223645]">Membership &amp; Payment</h2>
      <p className="mt-2 text-sm text-zinc-500">
        Choose your membership tier and how you&apos;d like to pay.
      </p>

      {/* Membership tier */}
      <div className="mt-6">
        <p className="text-sm font-medium text-zinc-700">Membership type</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          {FEES.map((f) => (
            <button
              key={f.type}
              type="button"
              onClick={() => setMembershipType(f.type)}
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                membershipType === f.type ? btnActive : btnInactive
              }`}
            >
              <div className="font-semibold text-[#223645]">{f.label}</div>
              <div className="mt-1 text-xl font-bold text-[#802B7D]">£{f.amount}/yr</div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment method */}
      <div className="mt-6">
        <p className="text-sm font-medium text-zinc-700">Payment method</p>
        <div className="mt-2 space-y-3">
          <button
            type="button"
            onClick={() => setPayMethod("stripe")}
            className={`${btnBase} ${payMethod === "stripe" ? btnActive : btnInactive}`}
          >
            <span className="text-2xl">💳</span>
            <div>
              <div className="font-medium text-[#223645]">Pay by card</div>
              <div className="text-xs text-zinc-500">Visa, Mastercard, Amex — secured by Stripe</div>
            </div>
          </button>
          <button
            type="button"
            onClick={() => setPayMethod("paypal")}
            className={`${btnBase} ${payMethod === "paypal" ? btnActive : btnInactive}`}
          >
            <span className="text-2xl">🅿️</span>
            <div>
              <div className="font-medium text-[#223645]">Pay with PayPal</div>
              <div className="text-xs text-zinc-500">Use your PayPal balance or linked card</div>
            </div>
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="mt-6 rounded-xl bg-[#f3eef6] p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-600">Total due today</span>
          <span className="text-xl font-bold text-[#802B7D]">£{fee}.00</span>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <button
        onClick={handlePay}
        disabled={!payMethod || loading}
        className="mt-6 w-full rounded-lg py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: "#802B7D" }}
      >
        {loading ? "Processing…" : `Pay £${fee}.00 →`}
      </button>
    </div>
  );
}
