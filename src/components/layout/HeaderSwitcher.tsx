"use client";

import { usePathname } from "next/navigation";
import { AuthHeader } from "./AuthHeader";
import { Header } from "./Header";

const AUTH_HEADER_PATHS = ["/login", "/register"];

function isAdminPath(pathname: string | null) {
  if (!pathname) return false;
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function usesAuthHeader(pathname: string | null) {
  if (!pathname) return false;
  return AUTH_HEADER_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
}

export function HeaderSwitcher() {
  const pathname = usePathname();
  if (isAdminPath(pathname)) return null;
  return usesAuthHeader(pathname) ? <AuthHeader /> : <Header />;
}
