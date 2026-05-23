import type { ReactNode } from "react";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

export function FeatureCard({
  icon,
  title,
  description,
  footer,
  className,
}: {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("rounded-xl bg-white p-6 text-neutral-800 shadow-lg", className)}>
      <div style={{ color: brand.purple }}>{icon}</div>
      <h3 className="mt-4 text-sm font-extrabold uppercase tracking-wide" style={{ color: brand.purple }}>
        {title}
      </h3>
      <div className="mt-2 text-sm leading-relaxed text-neutral-600">{description}</div>
      {footer ? <div className="mt-4">{footer}</div> : null}
    </div>
  );
}
