"use client";

import { useState } from "react";
import type { Application } from "../page";

interface Props {
  application: Application | null;
  advance: (data?: Record<string, unknown>) => Promise<void>;
}

const PMI_OPTIONS = [
  "AXA Health",
  "Bupa",
  "Aviva",
  "Vitality Health",
  "WPA (Western Provident Association)",
  "Cigna",
  "Freedom Health",
  "Simply Health",
  "Other",
];

export default function Step8PmiRelationship({ application, advance }: Props) {
  const existing = (application?.pmi as Record<string, unknown>) ?? {};
  const [hasInsurer, setHasInsurer] = useState<boolean | null>(
    existing.insurer ? true : null
  );
  const [loading, setLoading] = useState(false);
  const [insurer, setInsurer] = useState(String(existing.insurer ?? ""));
  const [memberNo, setMemberNo] = useState(String(existing.memberNo ?? ""));
  const [yearsActive, setYearsActive] = useState(String(existing.yearsActive ?? ""));

  async function onContinue() {
    setLoading(true);
    const pmiData =
      hasInsurer === false
        ? { hasInsurer: false }
        : { hasInsurer: true, insurer, memberNo, yearsActive };
    await advance({ pmi: pmiData });
    setLoading(false);
  }

  const field =
    "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-zinc-900 outline-none transition focus:border-[#802B7D] focus:ring-2 focus:ring-[#802B7D]/20";

  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-lg">
      <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#802B7D]">
        Step 3 of 10 — Claimant registration
      </div>
      <h2 className="text-2xl font-bold text-[#223645]">PMI Relationship</h2>
      <p className="mt-2 text-sm text-zinc-500">
        Do you have or have you had a relationship with a Private Medical Insurer?
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {[
          { value: true, label: "Yes — I have / had a PMI relationship" },
          { value: false, label: "No — I do not have a PMI relationship" },
        ].map((opt) => (
          <button
            key={String(opt.value)}
            type="button"
            onClick={() => setHasInsurer(opt.value)}
            className={`rounded-xl border-2 p-4 text-left transition-all ${
              hasInsurer === opt.value
                ? "border-[#802B7D] bg-[#f3eef6]"
                : "border-zinc-200 bg-white hover:border-purple-200"
            }`}
          >
            <span className="text-sm font-medium text-[#223645]">{opt.label}</span>
          </button>
        ))}
      </div>

      {hasInsurer === true && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700">Insurer name</label>
            <select
              value={insurer}
              onChange={(e) => setInsurer(e.target.value)}
              className={field}
            >
              <option value="">Select insurer…</option>
              {PMI_OPTIONS.map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Membership / policy number</label>
            <input
              className={field}
              value={memberNo}
              onChange={(e) => setMemberNo(e.target.value)}
              placeholder="e.g. AXA-12345678"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700">Years active with insurer</label>
            <input
              type="number"
              min="0"
              className={field}
              value={yearsActive}
              onChange={(e) => setYearsActive(e.target.value)}
              placeholder="e.g. 5"
            />
          </div>
        </div>
      )}

      <button
        onClick={onContinue}
        disabled={hasInsurer === null || loading}
        className="mt-8 w-full rounded-lg py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: "#802B7D" }}
      >
        {loading ? "Saving…" : "Continue →"}
      </button>
    </div>
  );
}
