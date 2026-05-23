import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export function MediaFrame({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-violet-200/80 bg-white shadow-lg shadow-violet-200/40",
        className
      )}
    >
      {children}
    </div>
  );
}
