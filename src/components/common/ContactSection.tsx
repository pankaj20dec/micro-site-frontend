import { Container, Section } from "@/components/ui";
import { ContactForm } from "@/components/common/ContactForm";
import { ContactInfo } from "@/components/common/ContactInfo";

export function ContactSection() {
  return (
    <Section className="bg-white pb-14 sm:pb-20">
      <Container className="pt-6 sm:pt-10">
        <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
          <ContactInfo className="lg:pt-2" />
          <ContactForm />
        </div>
      </Container>
    </Section>
  );
}
