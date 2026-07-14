import { FaqContactCta } from "@/components/common/FaqContactCta";
import { FaqPageHero } from "@/components/common/FaqPageHero";
import { FaqSection } from "@/components/common/FaqSection";
import type { FaqPageContent } from "@/lib/faq-content-defaults";

type FaqPageProps = {
  content: FaqPageContent;
};

export function FaqPage({ content }: FaqPageProps) {
  return (
    <main className="bg-white">
      <FaqPageHero intro={content.intro} />
      <FaqSection items={content.items} />
      <FaqContactCta contact={content.contact} />
    </main>
  );
}
