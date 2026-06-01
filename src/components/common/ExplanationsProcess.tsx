import { brand } from "@/lib/brand";
import { explanationsProcess } from "@/lib/explanations-content";
import { SectionTitle } from "./ExplanationsSectionTitle";

export function ExplanationsProcess() {
  return (
    <section id={explanationsProcess.id} className="scroll-mt-24">
      <SectionTitle>{explanationsProcess.title}</SectionTitle>

      <ol className="mt-7 flex flex-col gap-4">
        {explanationsProcess.steps.map((step, index) => (
          <li
            key={step.title}
            className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_2px_6px_rgba(15,23,42,0.04)] sm:gap-5 sm:p-5"
          >
            <span
              aria-hidden
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white sm:h-10 sm:w-10 sm:text-sm"
              style={{ backgroundColor: brand.purpleDark }}
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0 flex-1">
              <h3 className="text-sm font-bold text-[#22313F] sm:text-base">
                {step.title}
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <aside
        className="mt-6 rounded-2xl px-5 py-5 sm:px-6 sm:py-6"
        style={{ backgroundColor: brand.lavender }}
      >
        <h3
          className="text-sm font-bold sm:text-base"
          style={{ color: brand.purple }}
        >
          {explanationsProcess.facts.title}
        </h3>
        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
          {explanationsProcess.facts.bullets.map((bullet) => (
            <li key={bullet} className="flex gap-2.5">
              <span
                aria-hidden
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ backgroundColor: brand.purple }}
              />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      </aside>

      <div
        className="mt-5 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-relaxed text-amber-900 sm:px-5 sm:py-4 sm:text-sm"
        role="note"
      >
        <WarningIcon className="mt-0.5 h-4 w-4 shrink-0 text-amber-600 sm:h-[18px] sm:w-[18px]" />
        <p>{explanationsProcess.warning}</p>
      </div>
    </section>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3.5 22 20H2L12 3.5z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
        fill="currentColor"
        fillOpacity="0.12"
      />
      <path
        d="M12 10v4.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="12" cy="17" r="0.9" fill="currentColor" />
    </svg>
  );
}
