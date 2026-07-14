import type { ReactNode } from "react";
import {
  AboutHeadingRule,
  type AboutHeadingRuleTone,
} from "@/components/common/AboutHeadingRule";
import { bandSectionTitleClassName } from "@/lib/bandSectionTitle";
import { cn } from "@/lib/cn";

export function BandTitleBlock({
  as: Tag = "h1",
  children,
  id,
  ruleVariant = "default",
  ruleTone = "purple",
  className,
}: {
  as?: "h1" | "h2";
  children: ReactNode;
  id?: string;
  ruleVariant?: "default" | "lavender";
  /** Rule color: "purple" (default) for light backgrounds, "white" for dark/colored bands. */
  ruleTone?: AboutHeadingRuleTone;
  className?: string;
}) {
  return (
    <header className={cn("text-center", className)}>
      <Tag id={id} className={bandSectionTitleClassName}>
        {children}
      </Tag>
      <AboutHeadingRule />
    </header>
  );
}
