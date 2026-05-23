import { brand } from "@/lib/brand";
import { Section } from "@/components/ui";
import { HeroSlider } from "./HeroSlider";

export function HeroSection() {
  return (
    <Section
      id="claim"
      className="relative border-b border-violet-100"
      style={{
        backgroundColor: brand.lavender,
        backgroundImage: `linear-gradient(135deg, rgba(255,255,255,0.5) 0%, transparent 38%), radial-gradient(circle at 12% 20%, rgba(125,46,126,0.07) 0%, transparent 45%), radial-gradient(circle at 88% 80%, rgba(125,46,126,0.05) 0%, transparent 42%)`,
      }}
    >
      <HeroSlider />
    </Section>
  );
}
