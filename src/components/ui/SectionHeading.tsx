import type { ReactNode } from "react";
import { topHeadingFontClassName } from "@/lib/bandSectionTitle";
import { cn } from "@/lib/cn";

const variants = {
  section: cn(topHeadingFontClassName, "text-xl uppercase sm:text-2xl"),
  subsection: cn(topHeadingFontClassName, "text-lg uppercase"),
  display: cn(topHeadingFontClassName, "text-2xl"),
  compact: cn(topHeadingFontClassName, "text-lg uppercase"),
} as const;

export type SectionHeadingVariant = keyof typeof variants;

export function SectionHeading({
  as: Tag = "h2",
  variant = "section",
  align = "left",
  tone = "default",
  className,
  children,
}: {
  as?: "h1" | "h2" | "h3";
  variant?: SectionHeadingVariant;
  align?: "left" | "center";
  tone?: "default" | "light";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        variants[variant],
        align === "center" && "text-center",
        tone === "light" && "text-white",
        className
      )}
    >
      {children}
    </Tag>
  );
}
