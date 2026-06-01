"use client";

import { useEffect, useState } from "react";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { explanationsToc } from "@/lib/explanations-content";

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
    <nav
      aria-label="On this page"
      className={cn(
        "rounded-2xl border border-neutral-200 bg-white p-5 shadow-[0_2px_6px_rgba(15,23,42,0.04)] sm:p-6",
        className
      )}
    >
      <p className="text-[11px] font-bold uppercase tracking-widest text-neutral-500">
        On this page
      </p>
      <ol className="mt-3 flex flex-col gap-1.5 text-sm">
        {explanationsToc.map((entry) => {
          const active = entry.id === activeId;
          return (
            <li key={entry.id}>
              <a
                href={`#${entry.id}`}
                className={cn(
                  "group flex items-start gap-2 rounded-md px-2 py-1.5 leading-snug transition-colors",
                  active
                    ? "font-semibold"
                    : "text-neutral-700 hover:text-neutral-900"
                )}
                style={active ? { color: brand.purple } : undefined}
                aria-current={active ? "true" : undefined}
              >
                <span
                  aria-hidden
                  className={cn(
                    "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full transition-colors",
                    active ? "" : "bg-neutral-300 group-hover:bg-neutral-400"
                  )}
                  style={active ? { backgroundColor: brand.purple } : undefined}
                />
                <span>{entry.label}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
