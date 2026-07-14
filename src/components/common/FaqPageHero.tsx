import { BandTitleBlock, Container, Section } from "@/components/ui";
import type { FaqPageContent } from "@/lib/faq-content-defaults";

type FaqPageHeroProps = {
  intro: FaqPageContent["intro"];
};

export function FaqPageHero({ intro }: FaqPageHeroProps) {
  return (
    <Section className="bg-white">
      <Container className="pt-12 pb-2 sm:pt-16">
        <BandTitleBlock id="faq-page-title">{intro.eyebrow}</BandTitleBlock>
      </Container>
    </Section>
  );
}
