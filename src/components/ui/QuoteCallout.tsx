import type { ReactNode } from "react";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

export type QuoteCalloutProps = {
  label?: ReactNode;
  children: ReactNode;
  className?: string;
};

/** Lavender panel with decorative opening quote mark — for testimonials / citations. */
export function QuoteCallout({ label, children, className }: QuoteCalloutProps) {
  return (
    <figure
      className={cn(
        "rounded-2xl px-6 py-6 sm:px-8 sm:py-7",
        className
      )}
      style={{ backgroundColor: brand.lavender }}
    >
      <div className="flex gap-4 sm:gap-5">
        <span
          aria-hidden
          className="select-none font-serif text-5xl leading-none sm:text-6xl"
          style={{ color: "rgba(128,43,125,0.35)" }}
        >
          &ldquo;
        </span>
        <div className="min-w-0 flex-1 pt-1">
          {label ? (
            <figcaption className="text-base font-bold text-[#22313F] sm:text-lg">
              {label}
            </figcaption>
          ) : null}
          <blockquote
            className={cn(
              "text-sm italic leading-[1.75] text-[#22313F]/85 sm:text-base",
              label ? "mt-2" : ""
            )}
          >
            {children}
          </blockquote>
        </div>
      </div>
    </figure>
  );
}
