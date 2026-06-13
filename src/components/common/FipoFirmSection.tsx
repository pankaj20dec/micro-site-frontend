import { FipoLogo } from "@/components/common/FipoLogo";
import { Container, Section } from "@/components/ui";
import { IconLinkedIn } from "@/components/ui/icons";
import { fipoFirm } from "@/lib/about-fipo";
import Image from "next/image";

/** FIPO firm card — logo + intro paragraphs + Executive Board heading (Figma about page block). */
export function FipoFirmSection() {
  return (
    <Section className="bg-white py-8 pt-5 pb-12 sm:py-6 sm:pb-25">
      <Container>
        <article className="mx-auto max-w-6xl rounded-2xl border border-neutral-200/70 bg-white p-4 md:p-6 shadow-[0_4px_12px_rgba(15,23,42,0.06),0_20px_40px_-12px_rgba(15,23,42,0.18)] sm:p-8 lg:p-10">
          <div className="grid gap-5 sm:grid-cols-12 sm:items-start sm:gap-10">
            <div className="sm:col-span-5">
              <FipoLogo />
            </div>

            <div className="sm:col-span-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <h2 className="text-xl font-bold text-[#22313F] sm:text-2xl">{fipoFirm.name}</h2>
                {fipoFirm.linkedInHref ? (
                  <a
                    href={fipoFirm.linkedInHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-[#0A66C2] transition hover:opacity-80"
                    aria-label={fipoFirm.linkedInLabel}
                  >
                    <IconLinkedIn className="h-6 w-6 sm:h-7 sm:w-7" />
                  </a>
                ) : null}
              </div>

              <div className="mt-4 space-y-4 text-sm leading-[1.75] sm:text-base">
                {fipoFirm.paragraphs.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              <h3 className="mt-6 text-base font-bold text-[#22313F] sm:mt-8 sm:text-lg">
                {fipoFirm.boardHeading}
              </h3>

              {fipoFirm.directors.length > 0 ? (
                <ul className="mt-4 grid grid-cols-2 gap-3 sm:mt-5 sm:grid-cols-4 sm:gap-3.5">
                  {fipoFirm.directors.map((director) => (
                    <li
                      key={director.name}
                      className="rounded-lg border border-neutral-200/80 bg-white px-3 py-2 text-center shadow-sm sm:px-2.5 sm:py-2.5"
                    >
                      <p className="text-[14px] font-semibold leading-snug text-[#22313F] sm:text-sm">
                        {director.name}
                      </p>
                      <p className="mt-1 text-[11px] leading-snug text-neutral-500 sm:text-xs">
                        {director.role}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </article>
      </Container>
    </Section>
  );
}
