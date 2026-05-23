import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

export function Panel({
  id,
  className,
  style,
  children,
}: {
  id?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div id={id} className={cn("rounded-2xl border border-violet-100 p-8 shadow-sm", className)} style={style}>
      {children}
    </div>
  );
}
