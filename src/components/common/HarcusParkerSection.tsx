import { HarcusParkerLogo } from "@/components/common/HarcusParkerLogo";
import { Container, QuoteCallout, Section } from "@/components/ui";
import { IconLinkedIn } from "@/components/ui/icons";
import {
  harcusParkerFirm,
  harcusParkerPartners,
  harcusParkerQuote,
} from "@/lib/about-harcus-parker";

function PartnerBio({ name, bio }: { name: string; bio: string }) {
  return (
    <div>
      <h3 className="text-lg font-bold text-[#22313F] sm:text-xl">{name}</h3>
      <div className="mt-3 space-y-3 text-sm leading-[1.75] sm:text-base">
        {bio.split("\n").map((paragraph, idx) => (
          <p key={`${name}-${idx}`}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

/** Harcus Parker firm card — intro + partners + Legal 500 quote (Figma about page block). */
export function HarcusParkerSection() {
  return (
    <Section className="bg-white py-4 sm:py-6 sm:pb-10">
      <Container>
        <article className="mx-auto max-w-6xl rounded-2xl border border-neutral-200/70 bg-white p-6 shadow-[0_4px_12px_rgba(15,23,42,0.06),0_20px_40px_-12px_rgba(15,23,42,0.18)] sm:p-8 lg:p-10">
          <div className="grid gap-8 sm:grid-cols-12 sm:items-start sm:gap-10">
            <div className="sm:col-span-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="text-xl font-bold text-[#22313F] sm:text-2xl">
                  {harcusParkerFirm.name}
                </h2>
                {harcusParkerFirm.linkedInHref ? (
                  <a
                    href={harcusParkerFirm.linkedInHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-[#0A66C2] transition hover:opacity-80"
                    aria-label={harcusParkerFirm.linkedInLabel}
                  >
                    <IconLinkedIn className="h-6 w-6 sm:h-7 sm:w-7" />
                  </a>
                ) : null}
              </div>
              <p className="mt-4 text-sm leading-[1.75] sm:text-base">
                {harcusParkerFirm.intro}
              </p>
              <p className="mt-4 text-sm leading-[1.75] sm:text-base">
                {harcusParkerFirm.keyPersonnelLabel}
              </p>
            </div>

            <div className="sm:col-span-5">
              <HarcusParkerLogo />
            </div>
          </div>

          <div className="mt-10 grid gap-10 sm:mt-12 sm:grid-cols-2 sm:gap-12">
            {harcusParkerPartners.map((partner) => (
              <PartnerBio key={partner.name} name={partner.name} bio={partner.bio} />
            ))}
          </div>

          <QuoteCallout className="mt-10 sm:mt-12" label={harcusParkerQuote.label}>
            &ldquo;{harcusParkerQuote.text}&rdquo;
          </QuoteCallout>
        </article>
      </Container>
    </Section>
  );
}
