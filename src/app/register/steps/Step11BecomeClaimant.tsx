"use client";

import { useState } from "react";
import type { Application } from "../page";

interface Props {
  application: Application | null;
  advance: (data?: Record<string, unknown>) => Promise<void>;
}

export default function Step11BecomeClaimant({ advance }: Props) {
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onContinue() {
    if (!agreed) return;
    setLoading(true);
    await advance({ claimantConfirmedAt: new Date().toISOString() });
    setLoading(false);
  }

  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-lg">
      <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#802B7D]">
        Step 6 of 10 — Claimant registration
      </div>
      <h2 className="text-2xl font-bold text-[#223645]">Become a Claimant</h2>
      <p className="mt-2 text-sm text-zinc-500">
        By proceeding you confirm your eligibility and intent to join the
        collective claim brought by FIPO.
      </p>

      <div className="mt-6 rounded-xl bg-[#f3eef6] p-5 text-sm text-zinc-700 space-y-3 leading-relaxed">
        <p>
          <strong>Eligibility criteria</strong> — To become a claimant you must:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-zinc-600">
          <li>Be a registered healthcare professional in the UK</li>
          <li>Have provided services through at least one private medical insurer</li>
          <li>Have received payment rates below the agreed schedule</li>
          <li>Hold a valid FIPO membership</li>
        </ul>
        <p className="mt-2">
          The claim is being brought on a conditional fee basis. You will only
          be liable for fees if the claim succeeds.
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
          I confirm that I meet the eligibility criteria above and wish to
          register as a claimant in the FIPO Fair Pay Action.
        </span>
      </label>

      <button
        onClick={onContinue}
        disabled={!agreed || loading}
        className="mt-6 w-full rounded-lg py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: "#802B7D" }}
      >
        {loading ? "Saving…" : "I confirm — Continue →"}
      </button>
    </div>
  );
}
