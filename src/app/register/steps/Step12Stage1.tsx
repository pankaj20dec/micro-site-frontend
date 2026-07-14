"use client";

import { useState } from "react";
import type { Application } from "../page";

interface Props {
  application: Application | null;
  advance: (data?: Record<string, unknown>) => Promise<void>;
}

export default function Step12Stage1({ application, advance }: Props) {
  const existing = (application?.stage1Data as Record<string, unknown>) ?? {};
  const [specialty, setSpecialty] = useState(String(existing.specialty ?? ""));
  const [gmcNumber, setGmcNumber] = useState(String(existing.gmcNumber ?? ""));
  const [yearsInPractice, setYearsInPractice] = useState(String(existing.yearsInPractice ?? ""));
  const [annualIncome, setAnnualIncome] = useState(String(existing.annualIncome ?? ""));
  const [pmiPercentage, setPmiPercentage] = useState(String(existing.pmiPercentage ?? ""));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!specialty || !gmcNumber) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    await advance({
      stage1Data: { specialty, gmcNumber, yearsInPractice, annualIncome, pmiPercentage },
    });
    setLoading(false);
  }

  const field =
    "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-zinc-900 outline-none transition focus:border-[#802B7D] focus:ring-2 focus:ring-[#802B7D]/20";

  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-lg">
      <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#802B7D]">
        Step 7 of 10 — Claimant registration
      </div>
      <h2 className="text-2xl font-bold text-[#223645]">Stage 1 — Practice Details</h2>
      <p className="mt-2 text-sm text-zinc-500">
        Please provide your professional and practice details.
      </p>

      <form onSubmit={onContinue} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Medical specialty <span className="text-red-500">*</span>
          </label>
          <input
            required
            className={field}
            value={specialty}
            onChange={(e) => setSpecialty(e.target.value)}
            placeholder="e.g. Orthopaedic Surgery"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            GMC / registration number <span className="text-red-500">*</span>
          </label>
          <input
            required
            className={field}
            value={gmcNumber}
            onChange={(e) => setGmcNumber(e.target.value)}
            placeholder="e.g. 1234567"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">Years in practice</label>
            <input
              type="number"
              min="0"
              className={field}
              value={yearsInPractice}
              onChange={(e) => setYearsInPractice(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">% income from PMI</label>
            <input
              type="number"
              min="0"
              max="100"
              className={field}
              value={pmiPercentage}
              onChange={(e) => setPmiPercentage(e.target.value)}
              placeholder="e.g. 60"
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Approximate annual PMI income (£)
          </label>
          <input
            type="number"
            min="0"
            className={field}
            value={annualIncome}
            onChange={(e) => setAnnualIncome(e.target.value)}
            placeholder="e.g. 80000"
          />
        </div>

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
