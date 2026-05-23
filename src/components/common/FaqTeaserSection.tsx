import { Container, Section, SectionHeading, TextLink } from "@/components/ui";

export function FaqTeaserSection() {
  return (
    <Section id="faq" className="border-t border-neutral-100 bg-neutral-50 py-12">
      <Container max="3xl" className="text-center">
        <SectionHeading variant="compact" align="center">
          Questions?
        </SectionHeading>
        <p className="mt-3 text-sm text-neutral-600">
          Visit our <TextLink href="/pages">news &amp; updates</TextLink> or contact{" "}
          <TextLink href="mailto:info@fipo.org">info@fipo.org</TextLink>.
        </p>
      </Container>
    </Section>
  );
}
