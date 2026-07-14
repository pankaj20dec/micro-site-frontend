"use client";

import { useState } from "react";
import type { Application } from "../page";

interface Props {
  application: Application | null;
  advance: (data?: Record<string, unknown>) => Promise<void>;
}

export default function Step13Stage2({ application, advance }: Props) {
  const existing = (application?.stage2Data as Record<string, unknown>) ?? {};
  const [claimDescription, setClaimDescription] = useState(String(existing.claimDescription ?? ""));
  const [estimatedLoss, setEstimatedLoss] = useState(String(existing.estimatedLoss ?? ""));
  const [earliestIncident, setEarliestIncident] = useState(String(existing.earliestIncident ?? ""));
  const [latestIncident, setLatestIncident] = useState(String(existing.latestIncident ?? ""));
  const [hasEvidence, setHasEvidence] = useState<boolean>(Boolean(existing.hasEvidence ?? true));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!claimDescription || !estimatedLoss) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    await advance({
      stage2Data: {
        claimDescription,
        estimatedLoss,
        earliestIncident,
        latestIncident,
        hasEvidence,
      },
    });
    setLoading(false);
  }

  const field =
    "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-zinc-900 outline-none transition focus:border-[#802B7D] focus:ring-2 focus:ring-[#802B7D]/20";

  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-lg">
      <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#802B7D]">
        Step 8 of 10 — Claimant registration
      </div>
      <h2 className="text-2xl font-bold text-[#223645]">Stage 2 — Claim Details</h2>
      <p className="mt-2 text-sm text-zinc-500">
        Provide details about the basis and extent of your claim.
      </p>

      <form onSubmit={onContinue} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Describe your claim <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            className={`${field} resize-none`}
            value={claimDescription}
            onChange={(e) => setClaimDescription(e.target.value)}
            placeholder="Briefly describe the loss or underpayment you believe you have suffered…"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Estimated total loss (£) <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            required
            min="0"
            className={field}
            value={estimatedLoss}
            onChange={(e) => setEstimatedLoss(e.target.value)}
            placeholder="e.g. 25000"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">Earliest incident</label>
            <input
              type="date"
              className={field}
              value={earliestIncident}
              onChange={(e) => setEarliestIncident(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Latest incident</label>
            <input
              type="date"
              className={field}
              value={latestIncident}
              onChange={(e) => setLatestIncident(e.target.value)}
            />
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={hasEvidence}
            onChange={(e) => setHasEvidence(e.target.checked)}
            className="h-4 w-4 accent-[#802B7D]"
          />
          <span className="text-sm text-zinc-700">
            I have documentary evidence to support my claim
          </span>
        </label>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
          style={{ backgroundColor: "#802B7D" }}
        >
          {loading ? "Saving…" : "Continue →"}
        </button>
      </form>
    </div>
  );
}
