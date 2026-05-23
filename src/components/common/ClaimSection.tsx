import { bandSectionTitleClassName } from "@/lib/bandSectionTitle";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { ButtonLink, Container, Section } from "@/components/ui";
import {
  IllustrationCompetitionLaw,
  IllustrationEconomicTorts,
  IllustrationRestraintOfTrade,
} from "./ClaimCardIllustrations";

const parallelRestrictions = [
  {
    label: "Fee Suppression",
    text: "prohibiting any charges above insurance company schedules regardless of case complexity or practitioner expertise",
  },
  {
    label: "Relationship interference",
    text: "forcing practitioners to bill insurers rather than patients, severing the sacred professional-patient bond",
  },
  {
    label: "Expulsion",
    text: "threatening or implementing network expulsion for any resistance",
  },
  {
    label: "Quality Sabotage",
    text: "directing patients to cheapest rather than best practitioners through manipulated referral systems",
  },
] as const;

const legalCards = [
  {
    title: "Competition Law",
    text: "Challenging agreements and concerted practices that restrict competition — including arrangements that keep consultant fees artificially low.",
    Illustration: IllustrationCompetitionLaw,
  },
  {
    title: "Restraint Of Trade",
    text: "Testing whether insurer rules and network terms unreasonably restrain how you practise, contract, and earn.",
    Illustration: IllustrationRestraintOfTrade,
  },
  {
    title: "Economic Torts",
    text: "Pursuing claims where unlawful interference with your practice has caused measurable financial harm.",
    Illustration: IllustrationEconomicTorts,
  },
] as const;

function ClaimBullet({ label, text }: { label: string; text: string }) {
  return (
    <li className="flex gap-3 text-left text-sm leading-relaxed sm:text-base">
      <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-white" aria-hidden />
      <span>
        <strong className="font-bold">{label}:</strong> {text}
      </span>
    </li>
  );
}

export function ClaimSection() {
  return (
    <Section className="py-16 text-white sm:py-20 lg:py-24" style={{ backgroundColor: brand.purple }}>
      <Container className="text-center">
        <h2 className={cn(bandSectionTitleClassName, "uppercase text-white")}>
          Why we are bringing this claim
        </h2>
        <div className="mx-auto mt-5 h-px w-14 bg-white" aria-hidden />

        <h3 className="mt-8 text-lg font-bold sm:mt-10 sm:text-xl">What the Insurers Have Done</h3>

        <div className="mx-auto mt-8 max-w-4xl space-y-5 text-sm leading-relaxed sm:text-base">
          <p>
            For many years, the UK private medical insurance market has been dominated by a small number of powerful
            institutions. Bupa Insurance Limited and AXA PPP Healthcare Limited, together with other private medical
            insurers (PMIs), exercise enormous influence over how consultants practise and what they are paid.
          </p>
          <p>
            In exercising that influence, they have not competed fairly. Instead, they have imposed a series of parallel
            restrictions on independent practitioners — restrictions that work together to suppress fees and control
            clinical freedom. These &apos;parallel&apos; restrictions include:
          </p>
        </div>

        <ul className="mx-auto mt-8 grid max-w-4xl gap-x-10 gap-y-4 text-left sm:grid-cols-2 sm:gap-y-5">
          {parallelRestrictions.map((item) => (
            <ClaimBullet key={item.label} {...item} />
          ))}
        </ul>

        <div className="mx-auto mt-8 max-w-4xl space-y-5 text-sm leading-relaxed sm:mt-10 sm:text-base">
          <p>
            Taken together, these practices have damaged practitioners financially and narrowed patient choice —
            directing people away from the consultant best placed to help them.
          </p>
          <p>We believe these PMIs have exploited that market power unlawfully, in three ways:</p>
        </div>

        <ul className="mx-auto mt-10 grid max-w-5xl gap-6 text-neutral-900 sm:mt-12 sm:gap-8 lg:grid-cols-3">
          {legalCards.map(({ title, text, Illustration }) => (
            <li key={title} className="flex flex-col rounded-xl bg-white px-5 pb-6 pt-4 shadow-lg sm:px-6 sm:pb-8">
              <Illustration className="mx-auto h-32 w-full max-w-[12rem] sm:h-36" />
              <h4 className="mt-4 text-base font-bold sm:text-lg">{title}</h4>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-neutral-700">{text}</p>
              <div className="mt-6 flex justify-center">
                <ButtonLink href="/about" variant="primary" size="sm" className="rounded-md px-8">
                  Read more
                </ButtonLink>
              </div>
            </li>
          ))}
        </ul>

        <h3 className="mt-12 text-lg font-bold sm:mt-16 sm:text-xl">In plain terms — tying it all together:</h3>

        <p className="mx-auto mt-6 max-w-4xl text-sm leading-relaxed sm:text-base">
          This action is not about enriching doctors for its own sake. It is about restoring fair competition,
          transparent relationships with insurers, and the freedom for patients to choose specialists based on skill
          and trust — not insurer steering. By joining together, practitioners can pursue compensation and lasting reform
          through established competition and tort principles.
        </p>

        <div className="mt-10 flex justify-center sm:mt-12">
          <ButtonLink href="#join" variant="inverse" size="lg" className="rounded-full px-12 sm:px-14">
            Join the claim
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
