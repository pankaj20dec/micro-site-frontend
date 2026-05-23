import type { ReactNode } from "react";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

const shells = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-16 w-16",
} as const;

const iconSlots = {
  sm: "[&>svg]:h-5 [&>svg]:w-5",
  md: "[&>svg]:h-8 [&>svg]:w-8",
  lg: "[&>svg]:h-9 [&>svg]:w-9",
} as const;

type Shell = keyof typeof shells;

export function IconCircle({
  size = "md",
  bgClassName = "bg-violet-50",
  className,
  children,
}: {
  size?: Shell;
  /** Tailwind background for the circle */
  bgClassName?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full",
        shells[size],
        bgClassName,
        iconSlots[size],
        className
      )}
      style={{ color: brand.purple }}
    >
      {children}
    </div>
  );
}

/** Purple rounded square with white icons — join steps */
export function IconStepTile({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "flex h-[4.25rem] w-[4.25rem] shrink-0 items-center justify-center rounded-2xl text-white shadow-sm sm:h-[4.5rem] sm:w-[4.5rem]",
        "[&>svg]:h-9 [&>svg]:w-9 sm:[&>svg]:h-10 sm:[&>svg]:w-10",
        className
      )}
      style={{ backgroundColor: brand.purple }}
    >
      {children}
    </div>
  );
}
