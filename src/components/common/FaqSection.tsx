"use client";

import { Accordion, type AccordionItem, Container, Section } from "@/components/ui";
import { FaqIllustration } from "@/components/common/FaqIllustration";
import type { FaqItemContent } from "@/lib/faq-content-defaults";

type FaqSectionProps = {
  items: FaqItemContent[];
};

export function FaqSection({ items }: FaqSectionProps) {
  const accordionItems: AccordionItem[] = items.map((item, index) => ({
    id: item.id,
    question: item.question,
    answer: (
      <div className="space-y-3 sm:space-y-4">
        {item.answerParagraphs.map((text, i) => (
          <p key={i}>{text}</p>
        ))}
      </div>
    ),
    illustration: index === 0 ? <FaqIllustration /> : undefined,
  }));

  return (
    <Section
      className="bg-white pb-14 sm:pb-20"
      aria-labelledby="faq-page-title"
    >
      <Container max="5xl" className="pt-6 sm:pt-10 px-3">
        <Accordion items={accordionItems} numbered defaultOpenIndex={0} />
      </Container>
    </Section>
  );
}
