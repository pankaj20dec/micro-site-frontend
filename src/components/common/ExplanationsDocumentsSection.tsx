"use client";

import { useEffect, useRef, useState } from "react";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { explanationsDocuments } from "@/lib/explanations-content";

function NumberTile({ children }: { children: React.ReactNode }) {
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

function ReadMoreBullets({
  items,
}: {
  items: ReadonlyArray<{
    text: string;
    children?: ReadonlyArray<string>;
  }>;
}) {
  return (
    <ul className="mt-3 flex flex-col gap-3">
      {items.map((item) => (
        <li key={item.text} className="flex flex-col gap-2.5">
          <div className="flex gap-3 text-sm leading-relaxed text-neutral-600 sm:text-[15px]">
            <span
              aria-hidden
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: brand.purple }}
            />
            <span>{item.text}</span>
          </div>
          {item.children && item.children.length > 0 ? (
            <ul className="ml-6 flex flex-col gap-2 sm:ml-7">
              {item.children.map((child) => (
                <li
                  key={child}
                  className="flex gap-2.5 text-sm leading-relaxed text-neutral-600 sm:text-[15px]"
                >
                  <span
                    aria-hidden
                    className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
                    style={{ backgroundColor: brand.purple }}
                  />
                  <span>{child}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </li>
      ))}
    </ul>
  );
}

function DotBullets({ items }: { items: ReadonlyArray<string> }) {
  return (
    <ul className="mt-2 flex flex-col gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 text-sm leading-relaxed text-neutral-600 sm:text-[15px]"
        >
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

function ReadMoreSubsection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-6">
      <h4 className="text-sm font-bold uppercase tracking-wide text-[#22313F]">{title}</h4>
      <div className="mt-3">{children}</div>
    </div>
  );
}

export function ExplanationsDocumentsSection() {
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const wasExpandedRef = useRef(false);
  const { readMore, footnote } = explanationsDocuments;

  useEffect(() => {
    if (wasExpandedRef.current && !expanded) {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    wasExpandedRef.current = expanded;
  }, [expanded]);

  return (
    <section
      ref={sectionRef}
      id={explanationsDocuments.id}
      className="scroll-mt-28 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-[0_8px_28px_-20px_rgba(15,23,42,0.25)] sm:p-8"
    >
      <h2 className="text-xl font-bold text-[#22313F] sm:text-2xl">
        {explanationsDocuments.title}
      </h2>

      <ol className="mt-5 flex flex-col gap-6">
        {explanationsDocuments.items.map((item) => {
          const paragraphs = Array.isArray(item.body) ? item.body : [item.body];
          return (
            <li key={item.number} className="flex gap-4">
              <NumberTile>{item.number}</NumberTile>
              <div className="min-w-0">
                <h4 className="text-base font-bold text-[#22313F]">{item.title}</h4>
                <div className="mt-1.5 space-y-3 text-sm leading-relaxed text-[#627489] sm:text-[15px]">
                  {paragraphs.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-7">
        <p className="text-base font-bold text-[#22313F]">{footnote.title}</p>
        <p className="mt-2 text-sm leading-relaxed text-[#627489] sm:text-[15px]">
          {footnote.body}
        </p>

        {expanded ? (
          <div className="mt-4 space-y-1">
            <ReadMoreBullets items={readMore.engagement.items} />

            <ReadMoreSubsection title={readMore.powerOfAttorney.title}>
              <div className="space-y-3 text-sm leading-relaxed text-[#627489] sm:text-[15px]">
                {readMore.powerOfAttorney.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </ReadMoreSubsection>

            <ReadMoreSubsection title={readMore.litigationManagement.title}>
              <p className="text-sm leading-relaxed text-[#627489] sm:text-[15px]">
                {readMore.litigationManagement.intro}
              </p>
              <DotBullets items={readMore.litigationManagement.features} />
              <p className="mt-4 text-sm leading-relaxed text-[#627489] sm:text-[15px]">
                {readMore.litigationManagement.note}
              </p>

              <div className="mt-5">
                <h5 className="text-sm font-bold text-[#22313F]">
                  {readMore.litigationManagement.agreement.title}
                </h5>
                <p className="mt-2 text-sm leading-relaxed text-[#627489] sm:text-[15px]">
                  {readMore.litigationManagement.agreement.intro}
                </p>
                {readMore.litigationManagement.agreement.groups.map((group) => (
                  <div key={group.lead} className="mt-4">
                    <p className="text-sm leading-relaxed text-[#627489] sm:text-[15px]">
                      {group.lead}
                    </p>
                    <DotBullets items={group.bullets} />
                  </div>
                ))}
              </div>
            </ReadMoreSubsection>

            <ReadMoreSubsection title={readMore.overarchingDeclaration.title}>
              <p className="text-sm leading-relaxed text-[#627489] sm:text-[15px]">
                {readMore.overarchingDeclaration.intro}
              </p>

              <div className="mt-5">
                <h5 className="text-sm font-bold text-[#22313F]">
                  {readMore.overarchingDeclaration.confirmationTitle}
                </h5>
                <p className="mt-2 text-sm leading-relaxed text-[#627489] sm:text-[15px]">
                  {readMore.overarchingDeclaration.confirmationIntro}
                </p>

                <div className="mt-4 flex flex-col gap-5">
                  {readMore.overarchingDeclaration.groups.map((group) => (
                    <div key={group.title}>
                      <p className="flex gap-2 text-sm font-semibold text-[#22313F]">
                        <span aria-hidden className="shrink-0">
                          ☐
                        </span>
                        <span>{group.title}</span>
                      </p>
                      <ul className="mt-2 flex flex-col gap-2 pl-6">
                        {group.items.map((item) => (
                          <li
                            key={item}
                            className="text-sm leading-relaxed text-[#627489] sm:text-[15px]"
                          >
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>

                <p className="mt-5 text-sm leading-relaxed text-[#627489] sm:text-[15px]">
                  If you have ANY questions or concerns before signing, contact{" "}
                  <a
                    href="mailto:fipo@harcusparker.co.uk"
                    className="font-medium text-[#802B7D] underline-offset-2 hover:underline"
                  >
                    fipo@harcusparker.co.uk
                  </a>
                  :
                </p>
                <p className="mt-2 text-sm font-medium leading-relaxed text-neutral-700 sm:text-[15px]">
                  {readMore.overarchingDeclaration.closingNote}
                </p>
              </div>
            </ReadMoreSubsection>
          </div>
        ) : null}
      </div>

      <div className="mt-6">
        <button
          type="button"
          onClick={() => setExpanded((open) => !open)}
          aria-expanded={expanded}
          className={cn(
            "inline-flex items-center justify-center rounded-full px-7 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white transition hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 sm:text-xs"
          )}
          style={{ backgroundColor: brand.purple }}
        >
          {expanded ? readMore.labelExpanded : readMore.label}
        </button>
      </div>
    </section>
  );
}
