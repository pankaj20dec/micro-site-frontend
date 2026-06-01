"use client";

import { useId, useState, type ReactNode } from "react";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

export type AccordionItem = {
  id?: string;
  question: ReactNode;
  answer: ReactNode;
  /** Optional visual shown in the right column when this item is open. */
  illustration?: ReactNode;
};

type AccordionProps = {
  items: ReadonlyArray<AccordionItem>;
  /** When true, only one item can be open at a time (default). */
  singleOpen?: boolean;
  /** Show a 01-, 02-style index badge to the left of each question. */
  numbered?: boolean;
  /** 1-based start for the numbered badge. */
  numberStart?: number;
  /** Index of the item that should be open on first render. */
  defaultOpenIndex?: number;
  className?: string;
};

export function Accordion({
  items,
  singleOpen = true,
  numbered = false,
  numberStart = 1,
  defaultOpenIndex,
  className,
}: AccordionProps) {
  const uid = useId();
  const [openSet, setOpenSet] = useState<Set<number>>(
    () => new Set(typeof defaultOpenIndex === "number" ? [defaultOpenIndex] : [])
  );

  const toggle = (index: number) => {
    setOpenSet((prev) => {
      const next = new Set(singleOpen ? [] : prev);
      if (prev.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  return (
    <ul className={cn("flex flex-col gap-3 sm:gap-4", className)}>
      {items.map((item, index) => {
        const isOpen = openSet.has(index);
        const triggerId = `${uid}-trigger-${index}`;
        const panelId = `${uid}-panel-${index}`;
        const number = formatTwoDigit(numberStart + index);

        return (
          <li
            key={item.id ?? index}
            className={cn(
              "rounded-2xl border transition-shadow",
              isOpen
                ? "bg-white shadow-[0_10px_30px_-12px_rgba(92,36,92,0.18)]"
                : "bg-[#F4EFF6] hover:bg-[#EDE5F1]"
            )}
            style={{
              borderColor: isOpen ? "#E2D2E5" : "transparent",
            }}
          >
            <h3 className="m-0">
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(index)}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors sm:gap-4 sm:px-5 sm:py-4",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                )}
                style={{
                  ["--tw-ring-color" as string]: brand.purple,
                }}
              >
                {numbered ? (
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white sm:h-10 sm:w-10 sm:text-sm"
                    style={{ backgroundColor: brand.purpleDark }}
                    aria-hidden
                  >
                    {number}
                  </span>
                ) : null}

                <span
                  className="flex-1 text-sm font-semibold leading-snug text-[#22313F] sm:text-base"
                >
                  {item.question}
                </span>

                <PlusMinusIcon open={isOpen} />
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={cn(
                "grid transition-[grid-template-rows] duration-300 ease-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="min-h-0 overflow-hidden">
                <div
                  className={cn(
                    "px-4 pb-5 sm:px-5 sm:pb-6",
                    numbered ? "sm:pl-[5.25rem]" : ""
                  )}
                >
                  <div
                    className={cn(
                      "grid gap-6",
                      item.illustration
                        ? "sm:grid-cols-[1fr_auto] sm:items-center"
                        : ""
                    )}
                  >
                    <div className="text-sm leading-relaxed text-neutral-700 sm:text-base">
                      {item.answer}
                    </div>
                    {item.illustration ? (
                      <div className="hidden sm:block sm:w-[180px] sm:shrink-0">
                        {item.illustration}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function formatTwoDigit(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

function PlusMinusIcon({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border bg-white sm:h-9 sm:w-9"
      style={{
        borderColor: brand.purple,
        color: brand.purple,
      }}
    >
      <span className="block h-[2px] w-3.5 rounded bg-current sm:w-4" />
      <span
        className={cn(
          "absolute block h-3.5 w-[2px] rounded bg-current transition-transform duration-200 sm:h-4",
          open ? "scale-y-0" : "scale-y-100"
        )}
      />
    </span>
  );
}
