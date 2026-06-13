"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { AboutHeadingRule } from "@/components/common/AboutHeadingRule";
import { ButtonLink, Container, Section } from "@/components/ui";
import { ABOUT_TAB_LABELS, aboutTabPanels } from "@/lib/about-content";
import { bandSectionTitleClassName } from "@/lib/bandSectionTitle";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

type AboutSectionProps = {
  /** When false, omits the band title (use on `/about` where the hero supplies the h1). */
  showBandTitle?: boolean;
  /** Standalone `/about` page — no in-page `#about` anchor. */
  standalone?: boolean;
  joinHref?: string;
};

export function AboutSection({
  showBandTitle = true,
  standalone = false,
  joinHref = "#fees",
}: AboutSectionProps) {
  const sectionId = standalone ? undefined : "about";
  const [active, setActive] = useState(0);
  const uid = useId();
  const panel = aboutTabPanels[active];

  return (
    <Section
      id={sectionId}
      anchorOffset={Boolean(sectionId)}
      className="border-b border-neutral-100 bg-white py-12 sm:py-16"
    >
      <Container>
        {showBandTitle ? (
          <>
            <h2 className={bandSectionTitleClassName}>ABOUT FIPO — WHY FIPO EXISTS</h2>
            <AboutHeadingRule />
          </>
        ) : null}

        <div
          className={cn(
            "flex flex-nowrap gap-x-4 overflow-x-auto border-b border-neutral-200 sm:gap-x-8 md:gap-x-14",
            "[-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            showBandTitle ? "mt-10" : "mt-0"
          )}
          role="tablist"
          aria-label="About FIPO"
        >
          {ABOUT_TAB_LABELS.map((label, i) => (
            <button
              key={label}
              type="button"
              role="tab"
              id={`${uid}-tab-${i}`}
              aria-selected={i === active}
              aria-controls={`${uid}-panel`}
              onClick={() => setActive(i)}
              className={cn(
                "-mb-px shrink-0 whitespace-nowrap border-b-3 border-transparent px-1 px-4 md:px-10 pb-3 text-sm font-semibold transition sm:text-base",
                i === active ? "" : "text-neutral-900 hover:text-neutral-700"
              )}
              style={
                i === active
                  ? { borderBottomColor: brand.purple, color: brand.purple }
                  : undefined
              }
            >
              {label}
            </button>
          ))}
        </div>

        <div className="mt-12 grid gap-10 lg:mt-14 lg:grid-cols-12 lg:items-center lg:gap-12">
          <div className="flex justify-center lg:col-span-5 lg:justify-start">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-neutral-50 lg:max-w-none">
              <Image
                src="/images/about-doctors.png"
                alt="Three medical professionals in lab coats and scrubs, representing independent practice"
                width={800}
                height={800}
                className="h-auto max-h-[420px] w-full object-contain object-center lg:max-h-[480px]"
                sizes="(max-width: 1024px) 100vw, 42vw"
              />
            </div>
          </div>

          <div
            id={`${uid}-panel`}
            role="tabpanel"
            aria-labelledby={`${uid}-tab-${active}`}
            className="lg:col-span-7"
          >
            <h3 className="text-xl font-bold text-neutral-900 sm:text-2xl">{panel.heading}</h3>
            <div className="mt-5 space-y-4 text-base leading-relaxed">
              {panel.paragraphs.map((p, idx) => (
                <p key={`${active}-${idx}`}>{p}</p>
              ))}
            </div>
            <div className="mt-8 flex justify-start">
              <ButtonLink href={joinHref} variant="primary" size="lg" className="rounded-full px-8 sm:px-10">
                Join the claim
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
