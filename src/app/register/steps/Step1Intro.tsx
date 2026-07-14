"use client";

interface Props {
  onNext: () => void;
}

export default function Step1Intro({ onNext }: Props) {
  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-lg">
      <span
        className="inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white"
        style={{ backgroundColor: "#802B7D" }}
      >
        FIPO
      </span>
      <h1 className="mt-4 text-3xl font-bold text-[#223645]">
        The FIPO Fair Pay Action Group
      </h1>
      <p className="mt-4 text-zinc-600 leading-relaxed">
        FIPO (Federation of Independent Practitioner Organisations) is
        fighting for fair pay for healthcare professionals across the UK.
        By joining, you become part of a collective legal action to recover
        money owed to you.
      </p>

      <ul className="mt-6 space-y-3">
        {[
          "Join thousands of practitioners already registered",
          "No win, no fee — you only pay if the claim succeeds",
          "Fully guided registration — takes around 15 minutes",
          "Your data is secure and never shared without consent",
        ].map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span
              className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs text-white"
              style={{ backgroundColor: "#802B7D" }}
            >
              ✓
            </span>
            <span className="text-sm text-zinc-700">{item}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onNext}
        className="mt-8 w-full rounded-lg py-3 text-sm font-semibold text-white transition hover:opacity-90"
        style={{ backgroundColor: "#802B7D" }}
      >
        Get started →
      </button>
    </div>
  );
}
