"use client";

import { useEffect, useState } from "react";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { explanationsContact, explanationsToc } from "@/lib/explanations-content";

export function ExplanationsToc({ className }: { className?: string }) {
  const [activeId, setActiveId] = useState<string>(explanationsToc[0]?.id ?? "");

  useEffect(() => {
    const sections = explanationsToc
      .map((entry) => document.getElementById(entry.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      {
        rootMargin: "-120px 0px -55% 0px",
        threshold: 0,
      }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <nav
        aria-label="On this page"
        className="rounded-2xl bg-[#F4EFF6] px-6 py-6 sm:px-7 sm:py-7"
      >
        <ul className="flex flex-col">
          {explanationsToc.map((entry, index) => {
            const active = entry.id === activeId;
            return (
              <li
                key={entry.id}
                className={cn(index > 0 && "border-t border-[#E2D2E5]")}
              >
                <a
                  href={`#${entry.id}`}
                  className={cn(
                    "block py-3.5 text-sm font-medium leading-snug transition-colors",
                    active ? "font-semibold" : "text-[#3F3247] hover:text-[#802B7D]"
                  )}
                  style={active ? { color: brand.purple } : undefined}
                  aria-current={active ? "true" : undefined}
                >
                  {entry.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        className="rounded-2xl px-6 py-7 text-center text-white"
        style={{ backgroundColor: brand.purple }}
      >
        <p className="text-lg font-bold">{explanationsContact.title}</p>
        <p className="mt-3 text-sm leading-relaxed text-white/85">
          {explanationsContact.note}
        </p>
        <a
          href={`mailto:${explanationsContact.email}`}
          className="mt-2 block break-words text-base font-bold text-white underline-offset-2 hover:underline"
        >
          {explanationsContact.email}
        </a>
      </div>
    </div>
  );
}
