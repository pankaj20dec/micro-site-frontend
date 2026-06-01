import { FaqContactCta } from "@/components/common/FaqContactCta";
import { FaqPageHero } from "@/components/common/FaqPageHero";
import { FaqSection } from "@/components/common/FaqSection";

export function FaqPage() {
  return (
    <div className="bg-white">
      <FaqPageHero />
      <FaqSection />
      <FaqContactCta />
    </div>
  );
}
