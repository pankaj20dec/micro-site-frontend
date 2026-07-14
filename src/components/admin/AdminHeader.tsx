"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAdminToken, getAdmin, type AdminPayload } from "@/lib/admin-auth";
import { useMounted } from "@/hooks/use-mounted";
import { useEffect, useState } from "react";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Dashboard",
  "/admin/pages": "CMS Pages",
  "/admin/settings": "Site Settings",
  "/admin/seo": "SEO",
  "/admin/faq": "FAQ Page",
  "/admin/modals": "Modal Popups",
  "/admin/users": "Users",
  "/admin/leads": "Contact Leads",
  "/admin/register": "Register Admin",
  "/admin/login": "Sign In",
};

function roleLabel(role: string) {
  return role.replace("_", " ");
}

function getPageTitle(pathname: string) {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith("/admin/pages/")) return "Edit Page";
  if (pathname.startsWith("/admin/users/")) return "User Details";
  return "Admin";
}

function getInitials(email: string) {
  return email.charAt(0).toUpperCase();
}

export function AdminHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const mounted = useMounted();
  const [admin, setAdmin] = useState<AdminPayload | null>(null);

  useEffect(() => {
    if (mounted) setAdmin(getAdmin());
  }, [mounted]);

  function logout() {
    clearAdminToken();
    router.replace("/admin/login");
  }

  const pageTitle = getPageTitle(pathname ?? "/admin");

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md lg:px-8">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3 lg:hidden">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#660066] text-sm font-bold text-white shadow-sm">
              F
            </div>
            <span className="text-sm font-semibold text-slate-900">FIPO Admin</span>
          </Link>
        </div>

        <div className="hidden min-w-0 lg:block">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">Admin portal</p>
          <h1 className="truncate text-lg font-semibold text-slate-900">{pageTitle}</h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/"
            target="_blank"
            className="hidden rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 sm:inline-flex"
          >
            View site ↗
          </Link>

          {admin && (
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/80 py-1.5 pl-1.5 pr-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#660066] text-sm font-semibold text-white">
                {getInitials(admin.email)}
              </div>
              <div className="hidden text-left sm:block">
                <p className="max-w-[180px] truncate text-sm font-medium text-slate-900">
                  {admin.email}
                </p>
                <p className="text-xs text-slate-500">{roleLabel(admin.role)}</p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <LogoutIcon />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

function LogoutIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9"
      />
    </svg>
  );
}
