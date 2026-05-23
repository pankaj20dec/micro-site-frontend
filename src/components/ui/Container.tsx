import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

const maxWidths = {
  sm: "max-w-sm",
  md: "max-w-md",
  "3xl": "max-w-3xl",
  /** Main site container — 1400px */
  "6xl": "max-w-[1400px]",
  "7xl": "max-w-7xl",
  full: "max-w-full",
} as const;

export type ContainerMax = keyof typeof maxWidths;

export function Container({
  max = "6xl",
  className,
  children,
}: {
  max?: ContainerMax;
  className?: string;
  children: ReactNode;
}) {
  return <div className={cn("mx-auto w-full px-6", maxWidths[max], className)}>{children}</div>;
}
