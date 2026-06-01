import { ButtonLink } from "@/components/ui";
import { brand } from "@/lib/brand";
import { explanationsHowItWorks, explanationsNextSteps } from "@/lib/explanations-content";
import { SectionTitle } from "./ExplanationsSectionTitle";

export function ExplanationsHowItWorks() {
  return (
    <section id={explanationsHowItWorks.id} className="scroll-mt-24">
      <SectionTitle>{explanationsHowItWorks.title}</SectionTitle>

      <div className="mt-5 space-y-4 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
        {explanationsHowItWorks.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <aside
        className="mt-6 rounded-2xl px-5 py-5 sm:px-6 sm:py-6"
        style={{ backgroundColor: brand.lavender }}
      >
        <h3
          className="text-sm font-bold sm:text-base"
          style={{ color: brand.purple }}
        >
          {explanationsHowItWorks.callout.title}
        </h3>
        <p className="mt-1.5 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
          {explanationsHowItWorks.callout.body}
        </p>
      </aside>

      <div className="mt-7 flex justify-center">
        <ButtonLink
          href={explanationsNextSteps.cta.href}
          variant="primary"
          size="md"
          className="rounded-full px-10"
        >
          {explanationsNextSteps.cta.label}
        </ButtonLink>
      </div>
    </section>
  );
}
