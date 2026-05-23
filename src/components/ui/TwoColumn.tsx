import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function TwoColumn({
  gapClass = "gap-10",
  className,
  children,
}: {
  gapClass?: string;
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("grid lg:grid-cols-2 lg:items-center", gapClass, className)}>{children}</div>;
}
