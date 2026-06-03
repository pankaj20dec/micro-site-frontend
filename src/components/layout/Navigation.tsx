"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { mainNavLinks } from "./nav-links";

export { mainNavLinks };

function isNavActive(
  link: (typeof mainNavLinks)[number],
  pathname: string | null
): boolean {
  if (!pathname) return false;
  if (link.id === "news") {
    return pathname === "/news" || pathname.startsWith("/news/");
  }
  if (link.id === "about") {
    return pathname === "/about" || pathname.startsWith("/about/");
  }
  if (link.id === "faq") {
    return pathname === "/faq" || pathname.startsWith("/faq/");
  }
  if (link.id === "contact") {
    return pathname === "/contact" || pathname.startsWith("/contact/");
  }
  if (link.id === "explanations") {
    return pathname === "/explanations" || pathname.startsWith("/explanations/");
  }
  if (link.id === "claim") {
    return pathname === "/";
  }
  return false;
}

type NavigationProps = {
  className?: string;
  compact?: boolean;
};

export function Navigation({ className, compact }: NavigationProps) {
  const pathname = usePathname();

  return (
    <ul
      className={cn(
        "flex items-center font-medium text-neutral-800",
        compact ? "gap-4 overflow-x-auto pb-1 text-xs whitespace-nowrap" : "flex-wrap gap-x-8 gap-y-2 text-sm",
        className
      )}
    >
      {mainNavLinks.map((link) => {
        const active = isNavActive(link, pathname);
        return (
          <li key={link.href} className="shrink-0">
            <Link
              href={link.href}
              className={cn(
                "transition-colors hover:text-neutral-950",
                !active && "text-neutral-800"
              )}
              style={active ? { color: brand.purple } : undefined}
            >
              {link.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/** Narrow screens: horizontal scroll of full link set */
export function NavigationCompact({ className }: { className?: string }) {
  return <Navigation compact className={className} />;
}
