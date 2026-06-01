import { explanationsIntroduction } from "@/lib/explanations-content";
import { SectionTitle } from "./ExplanationsSectionTitle";

export function ExplanationsIntroduction() {
  return (
    <section id={explanationsIntroduction.id} className="scroll-mt-24">
      <SectionTitle>{explanationsIntroduction.title}</SectionTitle>
      <div className="mt-5 space-y-4 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
        {explanationsIntroduction.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </section>
  );
}
