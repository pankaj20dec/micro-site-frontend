import { cn } from "@/lib/cn";

/** Poppins 700, letter-spacing 0 — use under any top-level section title */
export const topHeadingFontClassName =
  "font-top-heading font-semibold tracking-normal text-[#223645]";

/** Full-width band titles (Fighting, About, …) */
export const bandSectionTitleClassName = cn(
  "mx-auto max-w-5xl text-center text-xl leading-tight sm:text-2xl lg:text-[1.65rem]",
  topHeadingFontClassName
);
