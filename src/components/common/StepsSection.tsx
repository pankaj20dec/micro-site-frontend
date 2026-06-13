import { bandSectionTitleClassName } from "@/lib/bandSectionTitle";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { AboutHeadingRule } from "./AboutHeadingRule";
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

const steps = [
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
    text: "Upload documents showing your relationship with Bupa and/or AXA PPP (e.g. fee schedules, correspondence, payment records).",
  },
  {
    Icon: IconHandCard,
    title: "We Take It From Here",
    text: "FIPO and our legal team conduct the claim on your behalf. You will be kept informed throughout.",
  },
] as const;

function StepsHeadingRule() {
  return (
    <div
      className="mx-auto mt-4 flex w-[min(18rem,88vw)] max-w-[20rem] shrink-0 items-center sm:w-[min(19.5rem,40vw)]"
      aria-hidden
    >
      <div className="h-px w-[37.5%] shrink-0 bg-neutral-200" />
      <div
        className="h-2 w-1/4 shrink-0 rounded-full"
        style={{ backgroundColor: brand.purple }}
      />
      <div className="h-px w-[37.5%] shrink-0 bg-neutral-200" />
    </div>
  );
}

export function StepsSection() {
  return (
    <Section className="border-b border-neutral-100 bg-[#DDDDDD] py-12 lg:py-16">
      <Container className="text-center">
        <h2 className={cn(bandSectionTitleClassName, "uppercase font-bold")}>
          How to join the action group
        </h2>
        <AboutHeadingRule />

        <p className="mt-6 text-sm font-bold text-[#223645] sm:text-base">Four Simple Steps</p>

        <ol className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-5 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {steps.map(({ Icon, title, text }) => (
            <li
              key={title}
              className="flex flex-col items-center rounded-xl bg-white px-5 py-8 text-center shadow-md sm:px-6 sm:py-9"
            >
              <IconStepTile>
                <Icon />
              </IconStepTile>
              <h3 className="mt-5 text-sm font-bold text-neutral-900 sm:text-base">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed">{text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 flex justify-center sm:mt-12">
          <ButtonLink href="#fees" variant="primary" size="lg" className="rounded-full px-10 sm:px-14">
            Join the claim
          </ButtonLink>
        </div>
      </Container>
    </Section>
  );
}
