import { bandSectionTitleClassName } from "@/lib/bandSectionTitle";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { ButtonLink, Container, Section } from "@/components/ui";
import {
  IllustrationCompetitionLaw,
  IllustrationEconomicTorts,
  IllustrationRestraintOfTrade,
} from "./ClaimCardIllustrations";
import { AboutHeadingRule } from "./AboutHeadingRule";

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
    paragraphs: [
      "a) Network effects (Chapter I of the Competition Act 1998). The Chapter I claim does not depend on Bupa and AXA PPP having coordinated with each other at all. The argument is different: each insurer has its own web of individual agreements with practitioners — fee schedules, recognition terms, and so on. When you look at those agreements across the whole market, their cumulative effect is to lock practitioners into artificially low fees and restrict competition across the sector as a whole. The market ends up being distorted not because the insurers conspired together, but because each insurer's network of agreements, taken together with the other's, forecloses the market. This is what the landmark case of Delimitis v Henninger Bräu established — that a web of individually innocent-looking agreements can collectively breach competition law without any coordination between the parties operating them. Coordination between Bupa and AXA is not ruled out, but we do not need to prove it.",
      "b) Abuse of dominant position (Chapter II of the Competition Act 1998). Separately, each insurer may have abused its own individual market dominance by imposing unfairly low fees and restrictive practices on practitioners. This stands entirely on its own and requires no link between the two insurers whatsoever.",
    ],
    Illustration: IllustrationCompetitionLaw,
  },
  {
    title: "Restraint of Trade",
    paragraphs: [
      "This is an older common law principle, independent of statute. It prevents economically powerful actors from distorting a market in ways that cause unjustified harm to others — a flexible backstop that supports the competition law claims.",
    ],
    Illustration: IllustrationRestraintOfTrade,
  },
  {
    title: "Economic Torts",
    paragraphs: [
      "This is the most direct expression of the harm to individual practitioners. The insurers have not merely set low fees passively — we contend they have actively interfered with practitioners' freedom to deal with patients on their own terms, using unlawful means to do so. Where that interference is deliberate and causes financial loss, it gives rise to a direct personal claim for compensation.",
    ],
    Illustration: IllustrationEconomicTorts,
  },
] as const;

const scrollableContentClassName =
  "mt-3 max-h-40 flex-1 overflow-y-auto pr-1 text-left text-sm leading-relaxed text-neutral-700 [scrollbar-color:#521f52_#f3f4f6] [scrollbar-width:thin] sm:max-h-52 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#521f52]/60 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-neutral-100";

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
    <Section className="py-12 text-white lg:py-16" style={{ backgroundColor: brand.purple }}>
      <Container className="text-center">

        <div>
        <h2 className={cn(bandSectionTitleClassName, "uppercase text-white")}>
          Why we are bringing this claim
        </h2>
        <AboutHeadingRule tone="white" />
        </div>

        <h3 className="mt-8 text-lg font-bold sm:mt-10 sm:text-xl">What the Insurers have done</h3>

        <div className="mx-auto mt-8 max-w-4xl space-y-5 text-sm leading-relaxed sm:text-base">
          <p>
          Private medical insurance companies, including Bupa and AXA PPP, are the dominant purchasers of private medical services in the UK. Between them they control a very large proportion of the market through which patients pay for private treatment. That market dominance gives them enormous leverage over what they pay doctors and other practitioners.
          </p>
          <p><strong>The evidence:</strong> supposedly independent insurance companies have developed virtually identical contract and fee practices. These ‘parallel’ restrictions include:
          </p>
        </div>

        <ul className="mx-auto mt-8 grid max-w-4xl gap-x-10 gap-y-4 text-left sm:grid-cols-2 sm:gap-y-5">
          {parallelRestrictions.map((item) => (
            <ClaimBullet key={item.label} {...item} />
          ))}
        </ul>

        <div className="mx-auto mt-8 max-w-4xl space-y-5 text-sm leading-relaxed sm:mt-10 sm:text-base">
          <p>
          The effect on practitioners has been concrete and measurable: fees that should have risen with inflation and increased clinical complexity have instead stagnated or fallen in real terms, representing a substantial and ongoing transfer of wealth from practitioners to insurers.
          </p>
          <p>We believe these PMIs have exploited that market power unlawfully, in three ways:</p>
        </div>

        <ul className="mx-auto mt-10 grid max-w-5xl gap-6 text-neutral-900 sm:mt-12 sm:gap-8 lg:grid-cols-3">
          {legalCards.map((card) => {
            const { title, Illustration } = card;

            return (
              <li
                key={title}
                className="flex flex-col rounded-xl bg-white px-5 pb-6 pt-4 shadow-lg sm:px-6 sm:pb-8"
              >
                <Illustration className="mx-auto block h-28 w-28 sm:h-32 sm:w-32" />
                <h4 className="mt-4 text-base font-bold sm:text-lg">{title}</h4>
                <div className={scrollableContentClassName}>
                  <div className="space-y-4">
                    {card.paragraphs.map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <h3 className="mt-12 text-lg font-bold sm:mt-16 sm:text-xl">In plain terms — tying it all together:</h3>

        <p className="mx-auto mt-6 max-w-4xl text-sm leading-relaxed sm:text-base">
        Bupa and AXA PPP have, we will allege, used their market power over the private medical market to keep practitioners' fees artificially low. They did not need to sit in a room and agree a plan. The sheer scale and structure of their individual dealings with practitioners across the market has had the same effect as if they had. The result is the same: practitioners have been paid less than a competitive market would have delivered, year after year. These three legal arguments — competition law, restraint of trade, and economic torts — attack that conduct from different angles and together give practitioners a strong and multi-layered basis for compensation.
        </p>

        <div className="mt-10 flex justify-center sm:mt-12">
          <ButtonLink href="#join" variant="inverse" size="lg" className="rounded-full px-12 sm:px-14 font-semibold">
            Join the claim
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
