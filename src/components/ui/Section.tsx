import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type SectionProps = {
  id?: string;
  /** When true (default if `id` is set), adds scroll margin for sticky header offset */
  anchorOffset?: boolean;
  className?: string;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<"section">, "children" | "className">;

export function Section({ id, anchorOffset, className, children, ...rest }: SectionProps) {
  const scroll = anchorOffset ?? Boolean(id);
  return (
    <section
      id={id}
      className={cn(scroll && "scroll-mt-20", className)}
      {...rest}
    >
      {children}
    </section>
  );
}
