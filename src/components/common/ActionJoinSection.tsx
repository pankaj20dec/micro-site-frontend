import { topHeadingFontClassName } from "@/lib/bandSectionTitle";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import {
  ButtonLink,
  Container,
  IconDocumentsStack,
  IconHandCard,
  IconSealCheck,
  IconStepTile,
  IconUserPlus,
  Section,
} from "@/components/ui";

const seeks = [
  "Recognition that PMI fee-setting and referral practices constitute unlawful restrictions of competition",
  "Compensation for consultants whose earnings were suppressed by PMI practices",
  "An end to compulsory fixed-fee schedules as a condition of recognition",
  "Transparent, fair and comparable PMI benefit information for patients",
  "Freedom for patients to choose their consultant based on what matters to them without insurer interference",
] as const;

const joinSteps = [
  {
    Icon: IconUserPlus,
    title: "Register & Pay",
    text: "Complete your details and choose your membership level. Pay securely online.",
  },
  {
    Icon: IconSealCheck,
    title: "Sign Documents",
    text: "Execute the power of attorney and litigation management agreement online. It takes about 15 minutes.",
  },
  {
    Icon: IconDocumentsStack,
    title: "Upload Evidence",
    text: "Upload documents to confirm your relationship with Bupa and/or AXA PPP (e.g. fee schedules, samples of correspondence or payment records).",
  },
  {
    Icon: IconHandCard,
    title: "We Take It From Here",
    text: "FIPO and our legal team conduct the claim on your behalf. You will be kept informed throughout.",
  },
] as const;

export function ActionJoinSection() {
  return (
    <Section className="border-b border-neutral-200/80 bg-[#F8F9FA] py-12 sm:py-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-12 lg:items-start lg:gap-12 xl:gap-14">
          <aside id="explanations" className="scroll-mt-20 flex flex-col gap-3 lg:col-span-4">
            <div
              className="flex flex-col rounded-xl px-5 py-5 sm:px-8 sm:py-8"
              style={{ backgroundColor: brand.lavender }}
            >
              <h2 className="text-base font-semibold leading-snug text-[#223645] sm:text-[24px]">
                What this action seeks
              </h2>
              <ul className="mt-4 space-y-2.5">
                {seeks.map((line) => (
                  <li key={line} className="flex gap-2.5 text-sm leading-relaxed">
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ backgroundColor: brand.purple }}
                      aria-hidden
                    />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div
              className="flex shrink-0 flex-col items-center justify-center gap-2 rounded-xl px-5 py-5 text-center text-white sm:py-6"
              style={{ backgroundColor: brand.purple }}
            >
              <p className="text-sm font-medium sm:text-base">Tell us your experience</p>
              <a
                href="mailto:fipo@harcusparker.co.uk"
                className="text-base font-bold tracking-tight underline-offset-2 hover:underline sm:text-lg"
              >
                fipo@harcusparker.co.uk
              </a>
            </div>
          </aside>

          <div id="join" className="scroll-mt-20 lg:col-span-8">
            <h2
              className={cn(
                "text-center text-xl sm:text-2xl",
                topHeadingFontClassName
              )}
            >
              How to Join the Action Group
            </h2>

            <div className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {joinSteps.map(({ Icon, title, text }, i) => (
                  <div
                    key={title}
                    className={cn(
                      "flex flex-col items-center px-3 py-4 text-center sm:px-5",
                      "border-b border-neutral-200 last:border-b-0",
                      i < 2 && "sm:border-b sm:border-neutral-200",
                      i >= 2 && "sm:border-b-0",
                      i % 2 === 0 && "sm:border-r sm:border-neutral-200"
                    )}
                  >
                    <IconStepTile className="mx-auto">
                      <Icon />
                    </IconStepTile>
                    <p className="mt-5 text-sm font-semibold text-[#223645] sm:text-base">{title}</p>
                    <p className="mt-3 max-w-md text-sm leading-relaxed sm:max-w-none">
                      {text}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 flex justify-center">
              <ButtonLink href="#fees" variant="primary" size="lg" className="rounded-full px-10 sm:px-14">
                Join the claim
              </ButtonLink>
            </div>

            <p className="mx-auto mt-8 max-w-3xl text-center text-sm leading-relaxed">
            The action group seeks to restore patient choice, transparent pricing, and clinically-driven care pathways. The aim is not to enrich doctors, but to dismantle a system where non-clinical intermediaries exploit both professionals and patients, who may be directed away from the consultant of their choice, whilst paying increasing premiums and receiving reduced benefits over time.  That is unlawful. You may be owed compensation. It costs you little to find out.
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}
