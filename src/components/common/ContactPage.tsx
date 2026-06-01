import { ContactPageHero } from "@/components/common/ContactPageHero";
import { ContactSection } from "@/components/common/ContactSection";

export function ContactPage() {
  return (
    <div className="bg-white">
      <ContactPageHero />
      <ContactSection />
    </div>
  );
}
