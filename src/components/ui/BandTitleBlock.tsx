import type { ReactNode } from "react";
import { AboutHeadingRule } from "@/components/common/AboutHeadingRule";
import { bandSectionTitleClassName } from "@/lib/bandSectionTitle";
import { cn } from "@/lib/cn";

export function BandTitleBlock({
  as: Tag = "h1",
  children,
  ruleVariant = "default",
  className,
}: {
  as?: "h1" | "h2";
  children: ReactNode;
  ruleVariant?: "default" | "lavender";
  className?: string;
}) {
  return (
    <header className={cn("text-center", className)}>
      <Tag className={bandSectionTitleClassName}>{children}</Tag>
      <AboutHeadingRule variant={ruleVariant} />
    </header>
  );
}
