import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

/** Thin rails + thick purple pill — matches reference underline */
export function AboutHeadingRule({ variant = "default" }: { variant?: "default" | "lavender" }) {
  const railClass = variant === "lavender" ? "bg-violet-200" : "bg-neutral-300";

  return (
    <div
      className="mx-auto mt-4 flex w-full max-w-[15rem] items-center sm:max-w-[17.5rem]"
      aria-hidden
    >
      <div className={cn("h-px min-h-px flex-1 rounded-full", railClass)} />
      <div
        className="mx-2 h-1.5 w-24 shrink-0 rounded-full sm:mx-2.5 sm:w-28"
        style={{ backgroundColor: brand.purple }}
      />
      <div className={cn("h-px min-h-px flex-1 rounded-full", railClass)} />
    </div>
  );
}
