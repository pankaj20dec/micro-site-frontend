"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { mainNavLinks } from "./nav-links";

export { mainNavLinks };

function useHash() {
  const [hash, setHash] = useState("");
  useEffect(() => {
    const sync = () => setHash(window.location.hash);
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  return hash;
}

function isNavActive(
  link: (typeof mainNavLinks)[number],
  pathname: string | null,
  hash: string
): boolean {
  if (!pathname) return false;
  if (link.id === "news") {
    return pathname === "/pages" || pathname.startsWith("/pages/");
  }
  if (pathname !== "/") return false;
  const fragment = link.href.includes("#") ? `#${link.href.split("#")[1]}` : "";
  if (!fragment) return false;
  if (link.id === "claim") {
    return hash === "" || hash === "#" || hash === "#claim";
  }
  return hash === fragment;
}

type NavigationProps = {
  className?: string;
  compact?: boolean;
};

export function Navigation({ className, compact }: NavigationProps) {
  const pathname = usePathname();
  const hash = useHash();

  return (
    <ul
      className={cn(
        "flex items-center font-medium text-neutral-800",
        compact ? "gap-4 overflow-x-auto pb-1 text-xs whitespace-nowrap" : "flex-wrap gap-x-8 gap-y-2 text-sm",
        className
      )}
    >
      {mainNavLinks.map((link) => {
        const active = isNavActive(link, pathname, hash);
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
