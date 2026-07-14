"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { mainNavLinks } from "./nav-links";
import { useSiteLayout } from "./SiteLayoutProvider";

export { mainNavLinks };

function isNavActive(href: string, pathname: string | null): boolean {
  if (!pathname) return false;
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

type NavigationProps = {
  className?: string;
  compact?: boolean;
};

export function Navigation({ className, compact }: NavigationProps) {
  const pathname = usePathname();
  const { siteHeader } = useSiteLayout();
  const links = siteHeader.navLinks;

  return (
    <ul
      className={cn(
        "flex items-center font-medium text-neutral-800",
        compact ? "gap-4 overflow-x-auto pb-1 text-xs whitespace-nowrap" : "flex-wrap gap-x-8 gap-y-2 text-sm",
        className
      )}
    >
      {links.map((link) => {
        const active = isNavActive(link.href, pathname);
        return (
          <li key={`${link.href}-${link.label}`} className="shrink-0">
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
