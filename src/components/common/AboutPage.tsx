import { AboutPageHero } from "@/components/common/AboutPageHero";
import { FipoFirmSection } from "@/components/common/FipoFirmSection";
import { HarcusParkerSection } from "@/components/common/HarcusParkerSection";

export function AboutPage() {
  return (
    <div className="bg-white">
      <AboutPageHero />
      <HarcusParkerSection />
      <FipoFirmSection />
    </div>
  );
}
