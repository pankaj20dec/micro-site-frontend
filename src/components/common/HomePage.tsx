import { Footer } from "@/components/layout/Footer";
import { AboutSection } from "./AboutSection";
import { ActionJoinSection } from "./ActionJoinSection";
import { ClaimSection } from "./ClaimSection";
import { FaqTeaserSection } from "./FaqTeaserSection";
import { FeesSection } from "./FeesSection";
import { FightingSection } from "./FightingSection";
import { HeroSection } from "./HeroSection";
import { StepsSection } from "./StepsSection";

export function HomePage() {
  return (
    <div className="bg-white text-neutral-800">
      <HeroSection />
      <FightingSection />
      <ActionJoinSection />
      <AboutSection />
      <ClaimSection />
      <StepsSection />
      <FeesSection />
    </div>
  );
}
