import { ButtonLink, Container, Section, SectionHeading, TextLink } from "@/components/ui";

export function FaqTeaserSection() {
  return (
    <Section id="faq" className="border-t border-neutral-100 bg-neutral-50 py-12">
      <Container max="3xl" className="text-center">
        <SectionHeading variant="compact" align="center">
          Questions?
        </SectionHeading>
        <p className="mt-3 text-sm text-neutral-600">
          Browse our <TextLink href="/faq">frequently asked questions</TextLink>, visit our{" "}
          <TextLink href="/pages">news &amp; updates</TextLink>, or contact{" "}
          <TextLink href="mailto:info@fipo.org">info@fipo.org</TextLink>.
        </p>
        <div className="mt-6 flex justify-center">
          <ButtonLink href="/faq" variant="outline" size="md" className="rounded-full">
            View all FAQs
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
