import { Container, Section } from "@/components/ui";
import { ExplanationsClaimPoints } from "@/components/common/ExplanationsClaimPoints";
import { ExplanationsEligibility } from "@/components/common/ExplanationsEligibility";
import { ExplanationsHowItWorks } from "@/components/common/ExplanationsHowItWorks";
import { ExplanationsIntroduction } from "@/components/common/ExplanationsIntroduction";
import { ExplanationsLegalGrounds } from "@/components/common/ExplanationsLegalGrounds";
import { ExplanationsNextSteps } from "@/components/common/ExplanationsNextSteps";
import { ExplanationsPageHero } from "@/components/common/ExplanationsPageHero";
import { ExplanationsProcess } from "@/components/common/ExplanationsProcess";
import { ExplanationsToc } from "@/components/common/ExplanationsToc";

export function ExplanationsPage() {
  return (
    <div className="bg-white">
      <ExplanationsPageHero />

      <Section className="bg-white pb-14 sm:pb-20">
        <Container className="pt-6 sm:pt-10">
          <div className="grid gap-10 lg:grid-cols-[16rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[18rem_minmax(0,1fr)] xl:gap-14">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <ExplanationsToc />
            </aside>

            <div className="flex flex-col gap-12 sm:gap-14">
              <ExplanationsIntroduction />
              <ExplanationsClaimPoints />
              <ExplanationsLegalGrounds />
              <ExplanationsHowItWorks />
              <ExplanationsProcess />
              <ExplanationsEligibility />
              <ExplanationsNextSteps />
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
