import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

/** Two supported tones: purple (light backgrounds) and white (dark/colored bands). */
const tones = {
  purple: brand.purple,
  white: "#ffffff",
} as const;

export type AboutHeadingRuleTone = keyof typeof tones;

/** Thin rails + thick pill — matches reference underline. Defaults to brand purple. */
export function AboutHeadingRule({
  variant = "default",
  tone = "purple",
  color,
}: {
  variant?: "default" | "lavender";
  /** Pick one of the two supported colors: "purple" (default) or "white". */
  tone?: AboutHeadingRuleTone;
  /** Optional explicit color override; takes precedence over `tone`. */
  color?: string;
}) {
  const resolvedColor = color ?? tones[tone];
  const isLavender = variant === "lavender";
  const railStyle = isLavender ? undefined : { backgroundColor: resolvedColor };

  return (
    <div
      className="mx-auto mt-4 flex w-full max-w-[10rem] items-center sm:max-w-[12rem]"
      aria-hidden
    >
      <div
        className={cn("h-px min-h-px flex-1 rounded-full", isLavender && "bg-violet-200")}
        style={railStyle}
      />
      <div
        className="h-1.5 w-15 shrink-0 rounded-full sm:w-18"
        style={{ backgroundColor: resolvedColor }}
      />
      <div
        className={cn("h-px min-h-px flex-1 rounded-full", isLavender && "bg-violet-200")}
        style={railStyle}
      />
    </div>
  );
}
