"use client";

import { useEffect, useRef, useState } from "react";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { explanationsKeyImplications } from "@/lib/explanations-content";

function NestedBullets({
  items,
}: {
  items: ReadonlyArray<{ text: string; children?: ReadonlyArray<string> }>;
}) {
  return (
    <ul className="mt-4 flex flex-col gap-3.5">
      {items.map((item) => (
        <li key={item.text} className="flex flex-col gap-3">
          <div className="flex gap-3 text-sm leading-relaxed text-[#627489] sm:text-[15px]">
            <span
              aria-hidden
              className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full"
              style={{ backgroundColor: brand.purple }}
            />
            <span>{item.text}</span>
          </div>

          {item.children && item.children.length > 0 ? (
            <ul className="ml-6 flex flex-col gap-3 sm:ml-7">
              {item.children.map((child) => (
                <li
                  key={child}
                  className="flex gap-2.5 text-sm leading-relaxed text-[#627489] sm:text-[15px]"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="mt-1 h-3.5 w-3.5 shrink-0"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ color: brand.purple }}
                    aria-hidden
                  >
                    <path d="M9 6l6 6-6 6" />
                  </svg>
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
    <ul className="mt-2 flex flex-col gap-2.5">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 text-sm leading-relaxed text-[#627489] sm:text-[15px]"
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

function ReadMoreSection({
  title,
  parts,
}: {
  title: string;
  parts: ReadonlyArray<{
    lead?: string;
    bullets: readonly string[];
  }>;
}) {
  return (
    <div className="mt-6">
      <h4 className="text-base font-bold text-[#223645]">{title}</h4>
      <div className="mt-3 flex flex-col gap-4">
        {parts.map((part, i) => (
          <div key={i}>
            {part.lead ? (
              <p className="text-sm leading-relaxed text-[#627489] sm:text-[15px]">{part.lead}</p>
            ) : null}
            <DotBullets items={part.bullets} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ExplanationsKeyImplicationsSection() {
  const [expanded, setExpanded] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const wasExpandedRef = useRef(false);
  const { readMore } = explanationsKeyImplications;

  useEffect(() => {
    if (wasExpandedRef.current && !expanded) {
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    wasExpandedRef.current = expanded;
  }, [expanded]);

  return (
    <section
      ref={sectionRef}
      id={explanationsKeyImplications.id}
      className="scroll-mt-28 rounded-2xl border border-neutral-200/80 bg-white p-6 shadow-[0_8px_28px_-20px_rgba(15,23,42,0.25)] sm:p-8"
    >
      <h2 className="text-xl font-bold text-[#22313F] sm:text-[20px]">
        {explanationsKeyImplications.title}
      </h2>

      {explanationsKeyImplications.groups.map((group) => (
        <div key={group.title} className="mt-5">
          <h3 className="text-base font-bold text-[#223645]">{group.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-[#627489] sm:text-[15px]">
            {group.intro}
          </p>
          <NestedBullets items={group.items} />
        </div>
      ))}

      {expanded ? (
        <div>
          <ReadMoreSection title={readMore.control.title} parts={readMore.control.parts} />
          <ReadMoreSection
            title={readMore.irrevocability.title}
            parts={readMore.irrevocability.parts}
          />
        </div>
      ) : null}

      <div className="mt-7">
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
