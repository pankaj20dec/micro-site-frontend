import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

/** Light-gray placeholder tile with the HARCUS PARKER wordmark. */
export function HarcusParkerLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-[#E7E8EB] px-6",
        className
      )}
      aria-label="Harcus Parker"
      role="img"
    >
      <div className="text-center leading-tight">
        <div className="text-2xl font-semibold tracking-[0.18em] text-[#1B1B1B] sm:text-3xl lg:text-[2.25rem]">
          HARCUS
        </div>
        <div
          className="mt-1 text-2xl font-semibold tracking-[0.18em] sm:text-3xl lg:text-[2.25rem]"
          style={{ color: brand.accentBlue }}
        >
          PARKER
        </div>
      </div>
    </div>
  );
}
