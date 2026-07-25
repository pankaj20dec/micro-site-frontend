import { ButtonLink, Container, Section } from "@/components/ui";

export type AboutCtaBandProps = {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function AboutCtaBand({
  title = "Ready to join the Fair Pay Action Group?",
  description = "Register your interest, review the claim process, and take the next step with coordinated legal representation.",
  primaryHref = "/login",
  primaryLabel = "Join the claim",
  secondaryHref = "/contact",
  secondaryLabel = "Contact us",
}: AboutCtaBandProps) {
  return (
    <Section className="border-b border-neutral-100 bg-[#F8F9FA] py-14 sm:py-16">
      <Container className="text-center">
        <h2 className="text-xl font-bold text-neutral-900 sm:text-2xl">{title}</h2>
        <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed">{description}</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <ButtonLink href={primaryHref} variant="primary" size="lg" className="rounded-full px-8 sm:px-10">
            {primaryLabel}
          </ButtonLink>
          <ButtonLink href={secondaryHref} variant="outline" size="lg" className="rounded-full px-8 sm:px-10">
            {secondaryLabel}
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
