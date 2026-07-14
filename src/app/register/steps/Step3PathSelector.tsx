"use client";

import { useState } from "react";
import type { Application } from "../page";

interface Props {
  application: Application | null;
  advance: (data?: Record<string, unknown>) => Promise<void>;
}

export default function Step3PathSelector({ advance }: Props) {
  const [selected, setSelected] = useState<"SUPPORTER" | "CLAIMANT" | null>(null);
  const [loading, setLoading] = useState(false);

  async function onContinue() {
    if (!selected) return;
    setLoading(true);
    await advance({ applicationType: selected });
    setLoading(false);
  }

  const card =
    "cursor-pointer rounded-xl border-2 p-6 transition-all";
  const active = "border-[#802B7D] bg-[#f3eef6]";
  const inactive = "border-zinc-200 bg-white hover:border-purple-200";

  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-[#223645]">How would you like to join?</h2>
      <p className="mt-2 text-sm text-zinc-500">
        Choose the option that best describes your situation.
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          onClick={() => setSelected("SUPPORTER")}
          className={`${card} ${selected === "SUPPORTER" ? active : inactive} text-left`}
        >
          <div className="mb-3 text-3xl">🤝</div>
          <h3 className="font-semibold text-[#223645]">Become a Supporter</h3>
          <p className="mt-2 text-sm text-zinc-500">
            Support the FIPO Fair Pay Action Group with a membership
            subscription. Quick sign-up — just membership &amp; payment.
          </p>
          <div className="mt-3 text-sm font-medium text-[#802B7D]">
            From £250 / year
          </div>
        </button>

        <button
          type="button"
          onClick={() => setSelected("CLAIMANT")}
          className={`${card} ${selected === "CLAIMANT" ? active : inactive} text-left`}
        >
          <div className="mb-3 text-3xl">⚖️</div>
          <h3 className="font-semibold text-[#223645]">Become a Claimant</h3>
          <p className="mt-2 text-sm text-zinc-500">
            Join the collective legal action. You will need to provide
            identity verification, legal document signing, PMI details and
            supporting evidence.
          </p>
          <div className="mt-3 text-sm font-medium text-[#802B7D]">
            From £250 / year + claim registration
          </div>
        </button>
      </div>

      <button
        onClick={onContinue}
        disabled={!selected || loading}
        className="mt-8 w-full rounded-lg py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: "#802B7D" }}
      >
        {loading ? "Saving…" : "Continue →"}
      </button>
    </div>
  );
}
