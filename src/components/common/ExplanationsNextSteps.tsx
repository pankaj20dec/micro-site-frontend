import { ButtonLink } from "@/components/ui";
import { brand } from "@/lib/brand";
import { explanationsNextSteps } from "@/lib/explanations-content";
import { SectionTitle } from "./ExplanationsSectionTitle";

export function ExplanationsNextSteps() {
  return (
    <section id={explanationsNextSteps.id} className="scroll-mt-24">
      <SectionTitle>{explanationsNextSteps.title}</SectionTitle>

      <div className="mt-5 space-y-4 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
        {explanationsNextSteps.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-5">
        <ContactCard
          title={explanationsNextSteps.legal.title}
          email={explanationsNextSteps.legal.email}
          note={explanationsNextSteps.legal.note}
        />
        <ContactCard
          title={explanationsNextSteps.admin.title}
          email={explanationsNextSteps.admin.email}
          note={explanationsNextSteps.admin.note}
        />
      </div>

      <div className="mt-8 flex justify-center">
        <ButtonLink
          href={explanationsNextSteps.cta.href}
          variant="primary"
          size="lg"
          className="rounded-full px-12"
        >
          {explanationsNextSteps.cta.label}
        </ButtonLink>
      </div>
    </section>
  );
}

function ContactCard({
  title,
  email,
  note,
}: {
  title: string;
  email: string;
  note: string;
}) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_2px_6px_rgba(15,23,42,0.04)] sm:p-6">
      <h3 className="text-sm font-bold text-[#22313F] sm:text-base">{title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-neutral-700 sm:text-[15px]">
        {note}
      </p>
      <a
        href={`mailto:${email}`}
        className="mt-2 inline-block break-all text-sm font-semibold underline-offset-2 hover:underline sm:text-base"
        style={{ color: brand.purple }}
      >
        {email}
      </a>
    </div>
  );
}
