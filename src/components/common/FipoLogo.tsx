import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

/** Light-gray placeholder tile with the FIPO wordmark, tagline, and decorative rules. */
export function FipoLogo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex aspect-[4/3] w-full items-center justify-center rounded-xl bg-[#E7E8EB] px-6",
        className
      )}
      aria-label="FIPO — Federation of Independent Practitioner Organisations"
      role="img"
    >
      <div className="text-left" style={{ color: brand.purple }}>
        <div className="flex items-center gap-0.5 text-4xl font-extrabold leading-none tracking-tight sm:text-5xl lg:text-[3.25rem]">
          <span>F</span>
          <span>I</span>
          <span>P</span>
          <span className="relative inline-flex items-center justify-center">
            <span>O</span>
            <span
              aria-hidden
              className="absolute inset-0 flex items-center justify-center"
            >
              <span
                className="flex h-3 w-3 items-center justify-center rounded-[2px] text-[10px] font-bold sm:h-3.5 sm:w-3.5 sm:text-[11px] lg:h-4 lg:w-4 lg:text-xs"
                style={{ backgroundColor: brand.purple, color: "#FFFFFF" }}
              >
                +
              </span>
            </span>
          </span>
        </div>

        <p className="mt-2 text-[11px] font-medium leading-tight sm:text-xs lg:text-sm">
          federation of independent
          <br />
          practitioner organisations
        </p>

        <div className="mt-3 space-y-1.5">
          <div className="h-[3px] w-32 sm:w-36 lg:w-40" style={{ backgroundColor: brand.purple }} />
          <div className="h-[3px] w-32 sm:w-36 lg:w-40" style={{ backgroundColor: brand.purple }} />
        </div>
      </div>
    </div>
  );
}
