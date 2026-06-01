import { BandTitleBlock, Container, Section } from "@/components/ui";
import { brand } from "@/lib/brand";
import { explanationsIntro } from "@/lib/explanations-content";

export function ExplanationsPageHero() {
  return (
    <Section className="bg-white">
      <Container className="pt-12 pb-2 sm:pt-16">
        <BandTitleBlock>{explanationsIntro.eyebrow}</BandTitleBlock>
        <div
          className="mx-auto mt-10 max-w-4xl rounded-xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-900 sm:px-6 sm:py-5 sm:text-[15px]"
          role="note"
        >
          <p className="font-bold uppercase tracking-wide text-amber-800 text-xs sm:text-[13px]">
            {explanationsIntro.notice.title}
          </p>
          <p className="mt-1.5" style={{ color: brand.text }}>
            {explanationsIntro.notice.body}
          </p>
        </div>
      </Container>
    </Section>
  );
}
