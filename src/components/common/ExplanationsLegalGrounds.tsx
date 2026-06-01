import { brand } from "@/lib/brand";
import { explanationsLegalGrounds } from "@/lib/explanations-content";
import { SectionTitle } from "./ExplanationsSectionTitle";

export function ExplanationsLegalGrounds() {
  return (
    <section id={explanationsLegalGrounds.id} className="scroll-mt-24">
      <SectionTitle>{explanationsLegalGrounds.title}</SectionTitle>
      <p className="mt-5 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
        {explanationsLegalGrounds.intro}
      </p>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 sm:gap-5">
        {explanationsLegalGrounds.cards.map((card) => (
          <article
            key={card.title}
            className="flex flex-col gap-2 rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_2px_6px_rgba(15,23,42,0.04)] sm:p-6"
          >
            <h3
              className="text-sm font-bold sm:text-base"
              style={{ color: brand.purple }}
            >
              {card.title}
            </h3>
            <p className="text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
              {card.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
