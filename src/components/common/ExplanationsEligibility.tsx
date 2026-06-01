import { brand } from "@/lib/brand";
import { explanationsEligibility } from "@/lib/explanations-content";
import { SectionTitle } from "./ExplanationsSectionTitle";

export function ExplanationsEligibility() {
  return (
    <section id={explanationsEligibility.id} className="scroll-mt-24">
      <SectionTitle>{explanationsEligibility.title}</SectionTitle>
      <p className="mt-5 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
        {explanationsEligibility.intro}
      </p>

      <ul className="mt-7 grid gap-4 sm:grid-cols-2 sm:gap-5">
        {explanationsEligibility.items.map((item) => (
          <li
            key={item.title}
            className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_2px_6px_rgba(15,23,42,0.04)] sm:p-6"
          >
            <h3
              className="text-sm font-bold sm:text-base"
              style={{ color: brand.purple }}
            >
              {item.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
