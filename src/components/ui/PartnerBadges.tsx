import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";

export type PartnerBadge = {
  /** Single letter (or short text) shown inside the badge. */
  initial: string;
  /** CSS color value used for the badge background. */
  color: string;
  /** Accessible label for screen readers. */
  label: string;
};

export const defaultPartnerBadges: PartnerBadge[] = [
  { initial: "H", color: brand.accentBlue, label: "Harcus Parker" },
  { initial: "R", color: brand.purple, label: "FIPO Fair Pay Action Group" },
];

/** Small overlapping avatar circles — partnership / endorsement indicator. */
export function PartnerBadges({
  badges = defaultPartnerBadges,
  className,
  size = 28,
}: {
  badges?: readonly PartnerBadge[];
  className?: string;
  size?: number;
}) {
  return (
    <ul className={cn("flex items-center", className)} aria-label="Partners">
      {badges.map((b, i) => (
        <li
          key={`${b.initial}-${i}`}
          className={cn(
            "flex items-center justify-center rounded-full font-semibold text-white ring-2 ring-white",
            i > 0 && "-ml-2"
          )}
          style={{
            backgroundColor: b.color,
            width: size,
            height: size,
            fontSize: Math.round(size * 0.45),
          }}
          title={b.label}
        >
          <span aria-hidden>{b.initial}</span>
          <span className="sr-only">{b.label}</span>
        </li>
      ))}
    </ul>
  );
}
