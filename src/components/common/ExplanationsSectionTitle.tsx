import type { ReactNode } from "react";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

export function SectionTitle({
  as: Tag = "h2",
  children,
  className,
}: {
  as?: "h2" | "h3";
  children: ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("flex flex-col gap-2", className)}>
      <Tag className="text-lg font-bold leading-tight text-[#22313F] sm:text-xl">
        {children}
      </Tag>
      <span
        aria-hidden
        className="h-1 w-12 rounded-full"
        style={{ backgroundColor: brand.purple }}
      />
    </header>
  );
}
