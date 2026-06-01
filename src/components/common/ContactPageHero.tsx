import { BandTitleBlock, Container, Section } from "@/components/ui";
import { contactIntro } from "@/lib/contact-content";

export function ContactPageHero() {
  return (
    <Section className="bg-white">
      <Container className="pt-12 pb-2 sm:pt-16">
        <BandTitleBlock>{contactIntro.eyebrow}</BandTitleBlock>
      </Container>
    </Section>
  );
}
