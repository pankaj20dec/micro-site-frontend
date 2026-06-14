import type { ReactNode } from "react";
import Image from "next/image";
import { ButtonLink, Container, Section } from "@/components/ui";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { ExplanationsKeyImplicationsSection } from "@/components/common/ExplanationsKeyImplicationsSection";
import { ExplanationsDocumentsSection } from "@/components/common/ExplanationsDocumentsSection";
import { ExplanationsPageHero } from "@/components/common/ExplanationsPageHero";
import { ExplanationsToc } from "@/components/common/ExplanationsToc";
import {
  explanationsClaimStructure,
  explanationsCostsRisk,
  explanationsCta,
  explanationsDamages,
  explanationsDocumentHold,
  explanationsHowToJoin,
  explanationsIntro,
  explanationsLegalNotice,
  explanationsSubscriptions,
  explanationsSummaryRisk,
  explanationsTax,
  explanationsUpload,
  explanationsWhyStructure,
} from "@/lib/explanations-content";

/* --------------------------------- atoms --------------------------------- */

function Card({
  id,
  className,
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-28 rounded-2xl border border-neutral-200/80 bg-white p-4 shadow-[0_8px_28px_-20px_rgba(15,23,42,0.25)] sm:p-8",
        className
      )}
    >
      {children}
    </section>
  );
}

function SectionTitle({ children, className }: { children: ReactNode, className?: string }) {
  return (
    <h2 className={cn("text-xl font-bold text-[#223645] sm:text-2xl", className)}>{children}</h2>
  );
}

function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="mt-3 text-sm leading-relaxed text-[#627489] sm:text-[15px]">
      {children}
    </p>
  );
}

function Bullets({ items }: { items: ReadonlyArray<string> }) {
  return (
    <ul className="mt-4 flex flex-col gap-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed sm:text-[15px] text-[#627489]">
          <span
            aria-hidden
            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ backgroundColor: brand.purple }}
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Large lavender rounded-square number badge with a purple numeral. */
function NumberTile({ children }: { children: ReactNode }) {
  return (
    <span
      className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold sm:h-16 sm:w-16 sm:text-xl"
      style={{ backgroundColor: brand.lavender, color: brand.purple }}
      aria-hidden
    >
      {children}
    </span>
  );
}

function WarningIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 69 69" className={className} fill="none" aria-hidden>
      <path
        d="M40.8676 3.23437C43.8976 5.6617 45.4627 9.1686 47.2079 12.5495C48.5925 15.1907 50.0534 17.7905 51.5008 20.3976C52.4352 22.0832 53.3642 23.7718 54.2936 25.4602C55.8414 28.2703 57.3913 31.0793 58.9431 33.8872C59.5168 34.9258 60.0905 35.9644 60.6642 37.003C61.0255 37.657 61.387 38.3109 61.7485 38.9647C62.5844 40.4764 63.4181 41.9892 64.2472 43.5046C64.9217 44.7282 65.604 45.9434 66.2995 47.1548C66.6417 47.7623 66.9839 48.3698 67.3364 48.9957C67.6454 49.5351 67.9544 50.0745 68.2727 50.6303C69.599 53.6555 69.6111 56.6254 68.9999 59.8359C67.7472 62.9108 66.0378 64.7583 63.1263 66.3795C61.0052 67.2477 58.8564 67.1521 56.5933 67.1399C56.0643 67.1454 55.5352 67.1509 54.9902 67.1566C53.2487 67.1715 51.5078 67.1705 49.7664 67.168C48.5506 67.1722 47.3349 67.1769 46.1191 67.182C43.5734 67.1901 41.0278 67.1898 38.4821 67.1841C35.2271 67.1778 31.9728 67.1961 28.7179 67.2211C26.2076 67.237 23.6975 67.2379 21.1872 67.2346C19.9875 67.2351 18.7879 67.2408 17.5883 67.2516C15.9071 67.265 14.2272 67.2576 12.546 67.2452C11.8099 67.2575 11.8099 67.2575 11.0588 67.2701C7.34812 67.2096 4.97282 66.0038 2.15619 63.6094C-0.306552 60.7262 -0.294168 58.0654 -0.249195 54.344C0.179988 50.804 1.81747 48.0799 3.60492 45.0454C3.97769 44.3857 4.34898 43.7252 4.71884 43.0639C5.65031 41.4064 6.59897 39.7596 7.55362 38.1154C8.63498 36.2461 9.69055 34.3621 10.751 32.4809C11.3102 31.491 11.8718 30.5026 12.4359 29.5155C14.0676 26.6537 15.6526 23.7718 17.1952 20.8613C17.3738 20.5248 17.5524 20.1883 17.7365 19.8416C18.6061 18.2013 19.4709 16.5588 20.3295 14.9127C26.0345 4.10386 26.0345 4.10386 29.5368 2.45947C33.2397 1.51572 37.4441 1.36918 40.8676 3.23437ZM28.8907 12.016C28.0389 13.5458 27.2226 15.0905 26.414 16.6436C25.7903 17.8191 25.1656 18.9941 24.5399 20.1685C24.2236 20.7635 23.9072 21.3585 23.5813 21.9715C22.1658 24.6005 20.6866 27.1916 19.204 29.7832C16.106 35.2161 13.1409 40.7148 10.2076 46.2378C9.88409 46.8463 9.56053 47.4549 9.22717 48.0818C8.94149 48.6212 8.6558 49.1605 8.36146 49.7161C7.8148 50.7192 7.24332 51.7091 6.64899 52.6847C5.56077 54.5326 5.47572 56.1383 5.92962 58.2188C7.38471 60.1184 8.45439 61.0249 10.7812 61.4531C12.2987 61.5096 13.8031 61.5379 15.3207 61.54C16.0061 61.544 16.0061 61.544 16.7054 61.5481C18.2156 61.556 19.7258 61.5596 21.2361 61.5626C22.2875 61.5657 23.3389 61.5688 24.3904 61.5719C26.5949 61.5776 28.7995 61.5807 31.0041 61.5826C33.8245 61.5856 36.6448 61.5985 39.4652 61.6139C41.6374 61.6239 43.8096 61.6267 45.9818 61.6276C47.0213 61.6292 48.0609 61.6335 49.1004 61.6406C50.557 61.6498 52.0133 61.6488 53.4699 61.6453C53.8965 61.6502 54.3232 61.6552 54.7627 61.6603C57.5588 61.6394 59.5198 61.175 61.9921 59.8359C63.3542 57.7929 63.4898 56.2666 63.0702 53.9062C62.2284 51.8139 61.1291 49.8947 60.0043 47.9429C59.6874 47.3757 59.3704 46.8085 59.0439 46.2241C58.0592 44.4669 57.0623 42.7173 56.0624 40.9688C55.4815 39.9449 54.901 38.9209 54.321 37.8965C53.4719 36.3968 52.6221 34.8975 51.7684 33.4004C50.115 30.4902 48.5027 27.5617 46.93 24.6074C46.6605 24.1015 46.6605 24.1015 46.3856 23.5854C45.51 21.9389 44.6383 20.2904 43.7717 18.6392C41.0692 12.6075 41.0692 12.6075 36.6562 8.08594C32.6172 7.68866 31.0256 8.53675 28.8907 12.016Z"
        fill="#E3A631"
      />
      <path
        d="M34.5004 20.8887C36.1176 21.0234 36.1176 21.0234 37.1957 22.1016C37.3034 23.5578 37.3465 24.9575 37.3389 26.4141C37.3399 26.8407 37.341 27.2674 37.342 27.707C37.3427 28.6096 37.3408 29.5123 37.3363 30.4149C37.3305 31.7992 37.3362 33.1831 37.3431 34.5674C37.3424 35.4434 37.341 36.3193 37.3389 37.1953C37.3411 37.6109 37.3433 38.0264 37.3455 38.4545C37.3196 41.3839 37.3196 41.3839 36.1176 42.5859C34.5004 42.7207 34.5004 42.7207 32.8832 42.5859C31.5109 41.2137 31.6718 40.3263 31.6553 38.4545C31.6575 38.039 31.6596 37.6234 31.6619 37.1953C31.6609 36.7687 31.6598 36.342 31.6588 35.9024C31.658 34.9998 31.66 34.0971 31.6645 33.1945C31.6703 31.8102 31.6646 30.4263 31.6577 29.042C31.6584 28.166 31.6598 27.29 31.6619 26.4141C31.6597 25.9985 31.6575 25.583 31.6553 25.1548C31.6909 21.1228 31.6909 21.1228 34.5004 20.8887Z"
        fill="#E3A631"
      />
      <path
        d="M34.4995 47.8418C36.1167 47.9766 36.1167 47.9766 37.1948 49.0547C37.3296 50.6719 37.3296 50.6719 37.1948 52.2891C36.1167 53.3672 36.1167 53.3672 34.4995 53.502C32.8823 53.3672 32.8823 53.3672 31.8042 52.2891C31.6694 50.6719 31.6694 50.6719 31.8042 49.0547C32.8823 47.9766 32.8823 47.9766 34.4995 47.8418Z"
        fill="#E3A631"
      />
    </svg>
  );
}

function WarningBand({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex items-center gap-4 rounded-xl bg-amber-50 px-4 py-4 text-sm leading-relaxed text-[#263238] sm:px-6 sm:text-[15px]"
      role="note"
    >
      <WarningIcon className="h-9 w-9 shrink-0 sm:h-14 sm:w-14" />
      <span>{typeof children === "string" ? withEmphasizedLabel(children) : children}</span>
    </div>
  );
}

/** Renders a leading ALL-CAPS label (e.g. "CONFIDENTIALITY NOTICE:") in semibold. */
function withEmphasizedLabel(text: string): ReactNode {
  const match = text.match(/^([A-Z][A-Z\s]+:)\s*([\s\S]*)$/);
  if (!match) return text;
  const [, label, rest] = match;
  return (
    <>
      <span className="font-semibold">{label}</span> {rest}
    </>
  );
}

/* -------------------------------- sections ------------------------------- */

function LegalNotice() {
  return (
    <section id={explanationsLegalNotice.id} className="scroll-mt-28">
      <SectionTitle>{explanationsLegalNotice.title}</SectionTitle>
      <div className="mt-5 flex flex-col gap-5">
        {explanationsLegalNotice.cards.map((card) => {
          const paragraphs = Array.isArray(card.body) ? card.body : [card.body];
          return (
            <div
              key={card.title}
              className="rounded-2xl border text-[#627489] border-neutral-200/80 bg-white p-6 shadow-[0_8px_28px_-20px_rgba(15,23,42,0.25)] sm:p-7"
            >
              <h3 className="text-lg font-bold text-[#22313F]">{card.title}</h3>
              <div className="mt-2 space-y-3 text-sm leading-relaxed sm:text-[15px]">
                {paragraphs.map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
              {card.bullets.length > 0 ? <Bullets items={card.bullets} /> : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* Icons for the "How To Join" steps (one per step, in order). */
const howToJoinIcons = [
  { src: "/pay-subscription.svg", alt: "Pay a subscription" },
  { src: "/accept.svg", alt: "Approve the terms" },
  { src: "/authoritative.svg", alt: "Execute a power of attorney" },
  { src: "/contract.svg", alt: "Sign the agreement" },
  { src: "/document.svg", alt: "Sign a declaration" },
];

function StepIconTile({ index, className }: { index: number; className?: string }) {
  const icon = howToJoinIcons[index] ?? howToJoinIcons[0];
  return (
    <span
      className={cn("flex shrink-0 items-center justify-center rounded-2xl", className)}
      style={{ backgroundColor: brand.lavender }}
    >
      <Image
        src={icon.src}
        alt={icon.alt}
        width={32}
        height={32}
        className="h-7 w-7 object-contain sm:h-8 sm:w-8"
      />
    </span>
  );
}

function HowToJoin() {
  const steps = explanationsHowToJoin.steps;
  return (
    <Card id={explanationsHowToJoin.id}>
      <SectionTitle>{explanationsHowToJoin.title}</SectionTitle>
      <Lead>{explanationsHowToJoin.intro}</Lead>

      <ol className="mt-8 flex flex-col">
        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          return (
            <li key={step.number} className="relative flex gap-4 sm:gap-5">
              {/* Horizontal connector from the number badge to the icon tile */}
              <span
                aria-hidden
                className="absolute left-9 top-7 h-px w-4 sm:left-10 sm:top-8 sm:w-5"
                style={{ backgroundColor: brand.divider }}
              />
              {/* Number badge + continuous vertical rail */}
              <div className="relative flex w-9 shrink-0 justify-center sm:w-10">
                {!isLast ? (
                  <span
                    aria-hidden
                    className="absolute left-1/2 top-7 h-full w-px -translate-x-1/2 sm:top-8"
                    style={{ backgroundColor: brand.divider }}
                  />
                ) : null}
                <span
                  className="relative z-10 mt-2.5 flex h-9 w-9 items-center justify-center rounded-full border bg-white text-xs font-bold sm:mt-3 sm:h-10 sm:w-10 sm:text-sm"
                  style={{ borderColor: brand.lavender, color: brand.purple }}
                >
                  {step.number}
                </span>
              </div>

              <StepIconTile index={i} className="h-14 w-14 sm:h-16 sm:w-16" />

              <p
                className={cn(
                  "flex-1 self-start text-sm leading-relaxed text-[#627489] sm:text-[15px]",
                  isLast ? "" : "pb-9"
                )}
              >
                <span className="font-bold text-[#627489]">{step.lead}</span>
                {step.body ? <> {step.body}</> : null}
              </p>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

function ClaimStructure() {
  return (
    <Card id={explanationsClaimStructure.id}>
      <SectionTitle>{explanationsClaimStructure.title}</SectionTitle>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
        {explanationsClaimStructure.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </Card>
  );
}

function WhyStructure() {
  return (
    <section id={explanationsWhyStructure.id} className="scroll-mt-28">
      <SectionTitle>{explanationsWhyStructure.title}</SectionTitle>
      <div className="mt-5 grid gap-5 md:grid-cols-2">
        {explanationsWhyStructure.cards.map((card) => (
          <div
            key={card.title}
            className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-[0_8px_28px_-20px_rgba(15,23,42,0.25)] sm:p-7"
          >
            <h3 className="text-lg font-bold text-[#22313F]">{card.title}</h3>
            <Bullets items={card.bullets} />
          </div>
        ))}
      </div>
    </section>
  );
}

function Subscriptions() {
  return (
    <Card id={explanationsSubscriptions.id}>
      <div className="flex flex-col items-center gap-6 sm:gap-8 lg:flex-row lg:gap-10">
        <div className="w-full max-w-xs shrink-0 lg:w-72">
          <Image
            src={explanationsSubscriptions.image.src}
            alt={explanationsSubscriptions.image.alt}
            width={420}
            height={320}
            className="h-auto w-full object-contain"
          />
        </div>

        <div className="min-w-0 flex-1">
          <SectionTitle className="sm:text-[20px]">{explanationsSubscriptions.title}</SectionTitle>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#627489] sm:text-[15px]">
            {explanationsSubscriptions.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <Bullets items={explanationsSubscriptions.bullets} />
        </div>
      </div>
    </Card>
  );
}

function CostsRisk() {
  return (
    <section id={explanationsCostsRisk.id} className="scroll-mt-28">
      {/* <SectionTitle>{explanationsCostsRisk.title}</SectionTitle>
      <Lead>{explanationsCostsRisk.intro}</Lead> */}
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-[0_8px_28px_-20px_rgba(15,23,42,0.25)] sm:p-7">
          <h3 className="text-lg font-bold text-[#22313F]">
             {explanationsCostsRisk.title}
          </h3>
          <Lead>{explanationsCostsRisk.intro}</Lead>
          <ol className="flex flex-col gap-5 mt-4">
            {explanationsCostsRisk.steps.map((step) => (
              <li key={step.number} className="flex gap-4">
                <NumberTile>{step.number}</NumberTile>
                <p className="text-sm leading-relaxed text-[#627489] sm:text-[15px]">
                  <span className="font-semibold text-[#627489]">{step.lead}</span>{" "}
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-[0_8px_28px_-20px_rgba(15,23,42,0.25)] sm:p-7">
          <h3 className="text-lg font-bold text-[#22313F]">
            {explanationsCostsRisk.benefit.title}
          </h3>
          <Bullets items={explanationsCostsRisk.benefit.bullets} />
          <p className="mt-4 text-sm leading-relaxed text-[#627489] sm:text-[15px]">
            {explanationsCostsRisk.benefit.note}
          </p>
        </div>
      </div>
    </section>
  );
}

function Damages() {
  return (
    <Card id={explanationsDamages.id}>
      <SectionTitle className="sm:text-[20px]">{explanationsDamages.title}</SectionTitle>
      <Lead>{explanationsDamages.intro}</Lead>

      <ol className="mt-6 grid gap-x-8 gap-y-8 sm:grid-cols-2">
        {explanationsDamages.steps.map((step) => (
          <li key={step.number} className="flex gap-4">
            <NumberTile>{step.number}</NumberTile>
            <div className="min-w-0">
              <h3 className="text-base font-bold text-[#22313F]">{step.title}</h3>
              {step.body ? (
                <p className="mt-1.5 text-sm leading-relaxed text-[#627489] sm:text-[15px]">
                  {step.body}
                </p>
              ) : null}
              {step.bullets ? <Bullets items={step.bullets} /> : null}
              {step.note ? (
                <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
                  {step.note}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>

      <div
        className="mt-8 rounded-2xl p-6 sm:p-7"
        style={{ backgroundColor: brand.lavender }}
      >
        <p className="text-base font-semibold text-[#634F63] sm:text-[21px]">
          {explanationsDamages.example.title}
        </p>
        <div className="mt-3 space-y-2 text-base leading-relaxed text-[#634F63] sm:text-[21px]">
          {explanationsDamages.example.lines.map((line) => (
            <p key={line.text} className={line.bold ? "font-semibold text-[#634F63]" : undefined}>
              {line.text}
            </p>
          ))}
        </div>
      </div>
    </Card>
  );
}

function TaxImplications() {
  return (
    <Card id={explanationsTax.id}>
      <SectionTitle>{explanationsTax.title}</SectionTitle>
      <div className="mt-4">
        <WarningBand>{explanationsTax.warning}</WarningBand>
      </div>
      <p className="mt-5 text-sm leading-relaxed text-[#627489] sm:text-[15px]">
        {explanationsTax.intro}
      </p>
      <Bullets items={explanationsTax.bullets} />
    </Card>
  );
}

function UploadEvidence() {
  return (
    <Card id={explanationsUpload.id}>
      <SectionTitle>{explanationsUpload.title}</SectionTitle>
      <p className="mt-4 text-sm leading-relaxed text-[#627489] sm:text-[15px]">
        {explanationsUpload.intro}
      </p>
      {explanationsUpload.sections.map((section) => (
        <div key={section.title} className="mt-5">
          <h3 className="text-base font-bold text-[#22313F]">{section.title}</h3>
          {"bullets" in section && section.bullets ? (
            <Bullets items={section.bullets} />
          ) : (
            <p className="mt-2 text-sm leading-relaxed text-[#627489] sm:text-[15px]">
              {"body" in section ? section.body : null}
            </p>
          )}
        </div>
      ))}
    </Card>
  );
}

function DocumentHoldAndRisk() {
  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,0.55fr)_minmax(0,1fr)]">
      <section
        id={explanationsDocumentHold.id}
        className="scroll-mt-28 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-[0_8px_28px_-20px_rgba(15,23,42,0.25)] sm:p-7"
      >
        <h2 className="text-xl font-bold text-[#22313F]">
          {explanationsDocumentHold.title}
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
          {explanationsDocumentHold.body}
        </p>
      </section>

      <section
        id={explanationsSummaryRisk.id}
        className="scroll-mt-28 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-[0_8px_28px_-20px_rgba(15,23,42,0.25)] sm:p-7"
      >
        <h2 className="text-xl font-bold text-[#22313F]">
          {explanationsSummaryRisk.title}
        </h2>
        <dl className="mt-4 flex flex-col gap-4">
          {explanationsSummaryRisk.items.map((item) => (
            <div key={item.title}>
              <dt className="text-base font-bold text-[#22313F]">{item.title}</dt>
              <dd className="mt-1 text-sm leading-relaxed text-[#627489] sm:text-[15px]">
                {item.body}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

/* ---------------------------------- page --------------------------------- */

export function ExplanationsPage() {
  return (
    <div className="bg-white">
      <ExplanationsPageHero />

      <Section className="bg-white pb-14 sm:pb-20">
        <Container className="pt-6 sm:pt-10">
          <div className="grid gap-10 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-12 xl:grid-cols-[20rem_minmax(0,1fr)] xl:gap-14">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <ExplanationsToc />
            </aside>

            <div className="flex flex-col gap-6 sm:gap-8">
              <WarningBand>{explanationsIntro.warning}</WarningBand>

              <LegalNotice />
              <HowToJoin />
              {/* <ClaimStructure /> */}
              <WhyStructure />
              <CostsRisk />
              <Subscriptions />
              <ExplanationsKeyImplicationsSection />
              <Damages />
              <TaxImplications />
              <ExplanationsDocumentsSection />
              <UploadEvidence />
              <DocumentHoldAndRisk />

              <div className="flex justify-center pt-2">
                <ButtonLink
                  href={explanationsCta.href}
                  variant="primary"
                  size="lg"
                  className="rounded-full px-12"
                >
                  {explanationsCta.label}
                </ButtonLink>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </div>
  );
}
