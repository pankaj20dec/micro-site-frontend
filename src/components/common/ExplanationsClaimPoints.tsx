import { explanationsClaimPoints } from "@/lib/explanations-content";
import { SectionTitle } from "./ExplanationsSectionTitle";

const toneStyles: Record<
  "purple" | "blue" | "amber",
  { bg: string; ring: string }
> = {
  purple: { bg: "#802B7D", ring: "rgba(128,43,125,0.18)" },
  blue: { bg: "#2563EB", ring: "rgba(37,99,235,0.18)" },
  amber: { bg: "#D97706", ring: "rgba(217,119,6,0.18)" },
};

export function ExplanationsClaimPoints() {
  return (
    <section id={explanationsClaimPoints.id} className="scroll-mt-24">
      <SectionTitle>{explanationsClaimPoints.title}</SectionTitle>
      <p className="mt-5 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
        {explanationsClaimPoints.intro}
      </p>

      <ol className="mt-7 flex flex-col gap-5 sm:gap-6">
        {explanationsClaimPoints.items.map((item) => {
          const tone = toneStyles[item.tone];
          return (
            <li
              key={item.number}
              className="flex items-start gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-[0_2px_6px_rgba(15,23,42,0.04)] sm:gap-5 sm:p-5"
            >
              <span
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-base font-bold text-white sm:h-14 sm:w-14 sm:text-lg"
                style={{
                  backgroundColor: tone.bg,
                  boxShadow: `0 0 0 6px ${tone.ring}`,
                }}
                aria-hidden
              >
                {item.number}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-[#22313F] sm:text-base">
                  {item.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
                  {item.description}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
