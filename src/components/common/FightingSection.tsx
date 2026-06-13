import Image from "next/image";
import { Container, Section } from "@/components/ui";
import { bandSectionTitleClassName } from "@/lib/bandSectionTitle";
import { brand } from "@/lib/brand";
import { AboutHeadingRule } from "@/components/common/AboutHeadingRule";

/** ~35% of typical title width; centre pill ≈25% of rule, thicker than grey rails */
function FightingHeadingRule() {
  return (
    <div
      className="mx-auto mt-4 flex w-[min(18rem,88vw)] max-w-[20rem] shrink-0 items-center sm:w-[min(19.5rem,40vw)]"
      aria-hidden
    >
      <div className="h-px min-h-px w-[20%] shrink-0" style={{ backgroundColor: brand.purple }}/>
      <div
        className="h-2 w-1/4 shrink-0 rounded-full"
        style={{ backgroundColor: brand.purple }}
      />
      <div className="h-px min-h-px w-[20%] shrink-0" style={{ backgroundColor: brand.purple }}/>
    </div>
  );
}

export function FightingSection() {
  return (
    <Section id="cause" className="border-b border-neutral-100 bg-white py-12 sm:py-18">
      <Container>
        <div>
          <h2 className={bandSectionTitleClassName}>
            FIGHTING FOR FAIR PAY AND PROFESSIONAL FREEDOM
          </h2>
          <AboutHeadingRule />
        </div>

        <div className="mt-5 md:mt-10 grid grid-cols-1 gap-4 sm:mt-12 sm:gap-12 lg:mt-14 lg:grid-cols-12 lg:items-center lg:gap-x-10 lg:gap-y-0 xl:gap-x-14">
          <div className="flex justify-center lg:col-span-5 lg:justify-start">
            <Image
              src="/images/health-professional-team.png"
              alt="Three healthcare professionals — doctor and colleagues in clinical attire"
              width={800}
              height={800}
              className="h-auto max-h-[480px] w-full max-w-[min(100%,22rem)] object-contain object-left sm:max-w-[26rem] lg:max-w-none"
              sizes="(max-width: 1024px) 100vw, 42vw"
              priority={false}
            />
          </div>
          <div className="space-y-5 text-left text-base leading-[1.75] lg:col-span-7 lg:max-w-none">
            <p>
              FIPO is launching the Fair Pay Action Group to pursue justice for private medical practitioners, whose
              earnings and freedom to deal directly with their patients have been suppressed by the unlawful conduct of
              private medical insurers.
            </p>
            <p>
              We believe that Bupa Insurance Limited and AXA PPP Healthcare Limited have, for many years, unlawfully
              limited the fees paid to doctors and other healthcare practitioners to artificially low levels and
              interfered with doctor-patient pathways — in breach of UK competition law and contrary to the common law
              doctrines of restraint of trade and interference with business by unlawful means. This has caused real
              financial harm to thousands of practitioners across the country and restricted patient choice of specialist.
            </p>
            <p>
              The FIPO Fair Pay Action Group exists to put that right. By pooling the claims of affected practitioners into
              a single, coordinated legal action, we can achieve together what no individual could achieve alone: fair
              compensation for lost earnings, and lasting change in the way insurers treat the medical profession and
              restoring the ability for medical practitioners to serve patients based on their individual skill and
              expertise.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
