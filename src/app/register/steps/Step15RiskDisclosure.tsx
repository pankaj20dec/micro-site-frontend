"use client";

import Link from "next/link";
import type { Application } from "../page";
import { saveStep } from "@/lib/application-api";
import { useState } from "react";

interface Props {
  application: Application | null;
  advance: (data?: Record<string, unknown>) => Promise<void>;
}

export default function Step15RiskDisclosure({ application, advance }: Props) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  const isComplete = (application?.status as string) === "COMPLETE";

  async function onConfirm() {
    if (!agreed) return;
    setLoading(true);
    await saveStep({ riskAcceptedAt: new Date().toISOString(), status: "COMPLETE" });
    await advance({ status: "COMPLETE" });
    setLoading(false);
  }

  if (isComplete) {
    return (
      <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-lg text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
          style={{ backgroundColor: "#f3eef6" }}>
          ✅
        </div>
        <h2 className="text-2xl font-bold text-[#223645]">
          Claimant Registration Complete!
        </h2>
        <p className="mt-3 text-zinc-600">
          Your application has been submitted and is now under review by the
          FIPO legal team. You will receive an email with next steps.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block w-full rounded-lg py-3 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: "#802B7D" }}
        >
          Go to my dashboard →
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-lg">
      <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#802B7D]">
        Step 10 of 10 — Claimant registration
      </div>
      <h2 className="text-2xl font-bold text-[#223645]">Final Risk Disclosure</h2>
      <p className="mt-2 text-sm text-zinc-500">
        Please read and acknowledge the risk disclosure statement before completing
        your registration.
      </p>

      <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900 space-y-3 leading-relaxed">
        <p className="font-semibold">Risk disclosure statement</p>
        <p>
          Participation in any legal action involves risk. While FIPO's legal
          advisors believe there are strong grounds for the claim, there is no
          guarantee of success.
        </p>
        <p>
          In the event the claim is unsuccessful, you will not be liable for the
          other side's legal costs, as this is a conditional fee arrangement.
          You may, however, lose any disbursements already paid.
        </p>
        <p>
          The final outcome and any compensation received is subject to court
          proceedings and may take a number of years to resolve.
        </p>
        <p>
          You have the right to withdraw from the claim at any point before a
          settlement is reached, subject to the terms of the Conditional Fee
          Agreement you have signed.
        </p>
      </div>

      <label className="mt-6 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 accent-[#802B7D]"
        />
        <span className="text-sm text-zinc-700">
          I have read and understood the risk disclosure statement and wish to
          proceed with my claimant registration.
        </span>
      </label>

      <button
        onClick={onConfirm}
        disabled={!agreed || loading}
        className="mt-6 w-full rounded-lg py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: "#802B7D" }}
      >
        {loading ? "Completing…" : "Complete registration →"}
      </button>
    </div>
  );
}
