"use client";

import { useState } from "react";
import type { Application } from "../page";

interface Props {
  application: Application | null;
  advance: (data?: Record<string, unknown>) => Promise<void>;
}

export default function Step14FinalConfirmation({ application, advance }: Props) {
  const [loading, setLoading] = useState(false);
  const stage1 = (application?.stage1Data as Record<string, unknown>) ?? {};
  const stage2 = (application?.stage2Data as Record<string, unknown>) ?? {};
  const pmi = (application?.pmi as Record<string, unknown>) ?? {};

  async function onSubmit() {
    setLoading(true);
    await advance({ submittedAt: new Date().toISOString(), status: "UNDER_REVIEW" });
    setLoading(false);
  }

  const row = (label: string, value: unknown) => (
    <div key={label} className="flex justify-between py-1.5 text-sm border-b border-zinc-100 last:border-0">
      <span className="text-zinc-500">{label}</span>
      <span className="font-medium text-zinc-800 text-right max-w-[55%]">
        {value ? String(value) : "—"}
      </span>
    </div>
  );

  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-lg">
      <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#802B7D]">
        Step 9 of 10 — Claimant registration
      </div>
      <h2 className="text-2xl font-bold text-[#223645]">Review &amp; Confirm</h2>
      <p className="mt-2 text-sm text-zinc-500">
        Please review your details before submitting your claimant registration.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#802B7D] mb-2">
            Professional details
          </p>
          <div className="rounded-xl border border-zinc-200 p-4">
            {row("Specialty", stage1.specialty)}
            {row("GMC number", stage1.gmcNumber)}
            {row("Years in practice", stage1.yearsInPractice)}
            {row("% income from PMI", stage1.pmiPercentage ? `${stage1.pmiPercentage}%` : null)}
            {row("Annual PMI income", stage1.annualIncome ? `£${stage1.annualIncome}` : null)}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#802B7D] mb-2">
            Claim details
          </p>
          <div className="rounded-xl border border-zinc-200 p-4">
            {row("Estimated loss", stage2.estimatedLoss ? `£${stage2.estimatedLoss}` : null)}
            {row("Earliest incident", stage2.earliestIncident)}
            {row("Latest incident", stage2.latestIncident)}
            {row("Has evidence", stage2.hasEvidence ? "Yes" : "No")}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#802B7D] mb-2">
            PMI relationship
          </p>
          <div className="rounded-xl border border-zinc-200 p-4">
            {row("Has PMI relationship", pmi.hasInsurer ? "Yes" : "No")}
            {pmi.insurer ? row("Insurer", String(pmi.insurer)) : null}
            {pmi.memberNo ? row("Policy number", String(pmi.memberNo)) : null}
          </div>
        </div>
      </div>

      <button
        onClick={onSubmit}
        disabled={loading}
        className="mt-6 w-full rounded-lg py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: "#802B7D" }}
      >
        {loading ? "Submitting…" : "Submit claimant registration →"}
      </button>
    </div>
  );
}
