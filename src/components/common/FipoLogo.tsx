import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import Image from "next/image";

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
      <Image
        src="/images/logo.png"
        alt="FIPO Logo - Federation of Independent Practitioner Organisations"
        width={160}
        height={80}
        className="h-auto w-[160px] object-contain"
        priority
      />
      </div>
    </div>
  );
}
