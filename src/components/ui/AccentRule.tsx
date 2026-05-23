import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

/** Thin rule: grey ends, vibrant purple band in the centre */
export function AccentRule({ className }: { className?: string }) {
  return (
    <div
      className={cn("mx-auto mt-5 flex h-[3px] w-full max-w-lg overflow-hidden rounded-full sm:mt-6", className)}
      aria-hidden
    >
      <div className="min-h-0 flex-1 bg-neutral-200" />
      <div className="w-20 shrink-0 sm:w-28" style={{ backgroundColor: brand.purple }} />
      <div className="min-h-0 flex-1 bg-neutral-200" />
    </div>
  );
}
