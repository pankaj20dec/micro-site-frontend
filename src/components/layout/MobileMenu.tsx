"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/cn";
import { ButtonLink } from "@/components/ui";
import { useSiteLayout } from "./SiteLayoutProvider";

export function MobileMenu() {
  const { siteHeader } = useSiteLayout();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      {/* Hamburger / Close button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-neutral-700 transition hover:bg-neutral-100 lg:hidden"
        aria-label={open ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={open}
      >
        <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
        {/* Animated hamburger → X */}
        <svg
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          {open ? (
            <>
              <line x1="4" y1="4" x2="20" y2="20" />
              <line x1="20" y1="4" x2="4" y2="20" />
            </>
          ) : (
            <>
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </>
          )}
        </svg>
      </button>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 top-[57px] z-40 bg-black/20 backdrop-blur-sm sm:top-[65px] lg:hidden"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}

      {/* Slide-down mobile menu */}
      <div
        className={cn(
          "fixed left-0 right-0 top-[57px] z-50 border-b border-neutral-200 bg-white shadow-lg transition-all duration-300 ease-in-out sm:top-[65px] lg:hidden",
          open
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0"
        )}
      >
        <nav aria-label="Mobile navigation" className="px-4 py-5 sm:px-6">
          <ul className="flex flex-col divide-y divide-neutral-100">
            {siteHeader.navLinks.map((link) => {
              const active =
                pathname === link.href ||
                (link.href !== "/" && pathname?.startsWith(link.href));
              return (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block py-3.5 text-sm font-medium transition-colors hover:text-neutral-950",
                      active ? "font-semibold" : "text-neutral-700"
                    )}
                    style={active ? { color: brand.purple } : undefined}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 pb-1">
            <ButtonLink
              href={siteHeader.ctaHref}
              variant="primary"
              size="md"
              className="w-full rounded-full py-3 text-[11px]"
            >
              {siteHeader.ctaLabel}
            </ButtonLink>
          </div>
        </nav>
      </div>
    </>
  );
}
