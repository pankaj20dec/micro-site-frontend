import { Accordion, type AccordionItem, Container, Section } from "@/components/ui";
import { FaqIllustration } from "@/components/common/FaqIllustration";
import { faqItems } from "@/lib/faq-content";

export function FaqSection() {
  const items: AccordionItem[] = faqItems.map((item, index) => {
    const paragraphs = Array.isArray(item.answer) ? item.answer : [item.answer];

    return {
      id: item.id,
      question: item.question,
      answer: (
        <div className="space-y-3 sm:space-y-4">
          {paragraphs.map((text, i) => (
            <p key={i}>{text}</p>
          ))}
        </div>
      ),
      illustration: index === 0 ? <FaqIllustration /> : undefined,
    };
  });

  return (
    <Section className="bg-white pb-14 sm:pb-20">
      <Container max="5xl" className="pt-6 sm:pt-10 px-3">
        <Accordion items={items} numbered defaultOpenIndex={0} />
      </Container>
    </Section>
  );
}
