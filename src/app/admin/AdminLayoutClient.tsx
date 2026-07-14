"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AdminAuthLayout } from "@/components/admin/AdminAuthLayout";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminToken } from "@/lib/admin-auth";
import { useMounted } from "@/hooks/use-mounted";

function isAdminLoginPath(pathname: string | null) {
  if (!pathname) return false;
  return pathname === "/admin/login" || pathname.startsWith("/admin/login/");
}

function isAdminRegisterPath(pathname: string | null) {
  if (!pathname) return false;
  return pathname === "/admin/register" || pathname.startsWith("/admin/register/");
}

export function AdminLayoutClient({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const mounted = useMounted();

  const useAuthLayout =
    isAdminLoginPath(pathname) ||
    (isAdminRegisterPath(pathname) && (!mounted || !getAdminToken()));

  if (useAuthLayout) {
    return <AdminAuthLayout>{children}</AdminAuthLayout>;
  }

  return <AdminShell>{children}</AdminShell>;
}
