import type { FaqPageContent } from "@/lib/faq-content-defaults";
import { buildFaqJsonLd } from "@/lib/faq-seo";

type FaqJsonLdProps = {
  content: FaqPageContent;
  pageUrl?: string;
};

export function FaqJsonLd({ content, pageUrl }: FaqJsonLdProps) {
  const jsonLd = buildFaqJsonLd(content, pageUrl);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
