import { bandSectionTitleClassName } from "@/lib/bandSectionTitle";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { Container, DataTable, Section } from "@/components/ui";
import { AboutHeadingRule } from "./AboutHeadingRule";
const headers = ["Features", "Standard Membership", "Enhanced Membership"] as const;

const rows = [
  ["Subscription", "£250", "£500"],
  ["Fee deducted from damages", "32.5% + VAT", "30% + VAT"],
  ["Legal representation", "Yes", "Yes"],
  ["ATE insurance protection", "Yes", "Yes"],
  ["Proportionate share of damages", "Yes", "Yes"],
] as const;

function FeesHeadingRule() {
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

export function FeesSection() {
  return (
    <Section id="fees" className="scroll-mt-20 border-b border-neutral-100 bg-white py-12 lg:py-16">
      <Container className="text-center">
        <h2 className={cn(bandSectionTitleClassName, "uppercase")}>Membership levels</h2>
        <AboutHeadingRule />

        <p className="mx-auto mt-8 max-w-3xl text-sm leading-relaxed sm:mt-10 sm:text-base">
          You can join at one of two levels, both of which entitle you to the same legal representation and
          proportionate share of any damages:
        </p>

        <DataTable
          className="mx-auto mt-10 max-w-4xl sm:mt-12"
          headers={headers}
          rows={rows}
          align="center"
          caption="Comparison of Standard and Enhanced membership levels."
        />

        <p className="mx-auto mt-8 max-w-3xl text-sm leading-relaxed sm:mt-10 sm:text-base">
          The higher subscription level reduces the percentage fee deducted from your damages. Neither subscription is
          refundable once the pre-action phase has commenced.
        </p>
      </Container>
    </Section>
  );
}
