"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

const COMPACT_FOOTER_PATHS = ["/login", "/register"];

function isAdminPath(pathname: string | null) {
  if (!pathname) return false;
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function usesCompactFooter(pathname: string | null) {
  if (!pathname) return false;
  return COMPACT_FOOTER_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function FooterSwitcher() {
  const pathname = usePathname();
  if (isAdminPath(pathname)) return null;
  return <Footer compact={usesCompactFooter(pathname)} />;
}
