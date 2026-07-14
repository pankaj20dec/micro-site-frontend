import type { FaqPageContent } from "./faq-content-defaults";

export function buildFaqJsonLd(content: FaqPageContent, pageUrl?: string) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(pageUrl ? { url: pageUrl } : {}),
    mainEntity: content.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answerParagraphs.join("\n\n"),
      },
    })),
  };
}
