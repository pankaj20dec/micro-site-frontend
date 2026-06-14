import { BandTitleBlock, Container, Section } from "@/components/ui";
import { explanationsIntro } from "@/lib/explanations-content";

export function ExplanationsPageHero() {
  return (
    <Section className="bg-white">
      <Container className="pt-12 pb-2 sm:pt-16">
        <BandTitleBlock>{explanationsIntro.eyebrow}</BandTitleBlock>
      </Container>
    </Section>
  );
}
