import { BandTitleBlock, Container, Section } from "@/components/ui";
import { faqIntro } from "@/lib/faq-content";

export function FaqPageHero() {
  return (
    <Section className="bg-white">
      <Container className="pt-12 pb-2 sm:pt-16">
        <BandTitleBlock>{faqIntro.eyebrow}</BandTitleBlock>
      </Container>
    </Section>
  );
}
