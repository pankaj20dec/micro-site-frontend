import { cn } from "@/lib/cn";

export type ImagePlaceholderAspect = "portrait" | "landscape" | "square";

const aspectClass: Record<ImagePlaceholderAspect, string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

/** Gray frame with a generic image glyph — fallback for missing profile photos. */
export function ImagePlaceholder({
  aspect = "landscape",
  className,
}: {
  aspect?: ImagePlaceholderAspect;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-center rounded-xl bg-[#5C6473]",
        aspectClass[aspect],
        className
      )}
      aria-hidden
    >
      <svg className="h-14 w-14 text-white sm:h-16 sm:w-16" viewBox="0 0 64 64" fill="none">
        <rect x="6" y="10" width="52" height="44" rx="4" stroke="currentColor" strokeWidth="2.5" />
        <circle cx="22" cy="22" r="3.5" fill="currentColor" />
        <path
          d="M10 46l13-14 10 9 8-7 13 12"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}
