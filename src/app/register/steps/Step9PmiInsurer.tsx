"use client";

import { useState } from "react";
import type { Application } from "../page";

interface Props {
  application: Application | null;
  advance: (data?: Record<string, unknown>) => Promise<void>;
}

const INSURERS = [
  { name: "AXA Health", logo: "🏥" },
  { name: "Bupa", logo: "🏥" },
  { name: "Aviva", logo: "🏥" },
  { name: "Vitality Health", logo: "🏥" },
  { name: "WPA", logo: "🏥" },
  { name: "Cigna", logo: "🏥" },
  { name: "Freedom Health", logo: "🏥" },
  { name: "Simply Health", logo: "🏥" },
];

export default function Step9PmiInsurer({ application, advance }: Props) {
  const pmi = (application?.pmi as Record<string, unknown>) ?? {};
  const [selected, setSelected] = useState<string[]>(
    Array.isArray(pmi.additionalInsurers)
      ? (pmi.additionalInsurers as string[])
      : []
  );
  const [loading, setLoading] = useState(false);

  function toggle(name: string) {
    setSelected((prev) =>
      prev.includes(name) ? prev.filter((n) => n !== name) : [...prev, name]
    );
  }

  async function onContinue() {
    setLoading(true);
    await advance({ pmi: { ...pmi, additionalInsurers: selected } });
    setLoading(false);
  }

  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-lg">
      <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#802B7D]">
        Step 4 of 10 — Claimant registration
      </div>
      <h2 className="text-2xl font-bold text-[#223645]">Private Medical Insurers</h2>
      <p className="mt-2 text-sm text-zinc-500">
        Select all the private medical insurers you have worked with. You can
        select more than one.
      </p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {INSURERS.map((ins) => (
          <button
            key={ins.name}
            type="button"
            onClick={() => toggle(ins.name)}
            className={`flex flex-col items-center rounded-xl border-2 p-4 transition-all ${
              selected.includes(ins.name)
                ? "border-[#802B7D] bg-[#f3eef6]"
                : "border-zinc-200 bg-white hover:border-purple-200"
            }`}
          >
            <span className="text-3xl">{ins.logo}</span>
            <span className="mt-2 text-xs font-medium text-center text-zinc-700">{ins.name}</span>
            {selected.includes(ins.name) && (
              <span className="mt-1 text-xs text-[#802B7D]">✓ Selected</span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={onContinue}
        disabled={loading}
        className="mt-8 w-full rounded-lg py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: "#802B7D" }}
      >
        {loading ? "Saving…" : "Continue →"}
      </button>

      <button
        onClick={() => advance()}
        className="mt-3 w-full rounded-lg py-2 text-sm text-zinc-400 hover:text-zinc-600"
      >
        Skip — I don&apos;t have additional insurers
      </button>
    </div>
  );
}
