"use client";

import Link from "next/link";
import type { ReactNode } from "react";

export function AdminAuthLayout({ children }: { children: ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <div className="flex min-h-screen flex-col bg-zinc-100">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/admin/login" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#660066] text-sm font-bold text-white">
              F
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">FIPO Admin</p>
              <p className="text-xs text-zinc-500">Sign in to manage the site</p>
            </div>
          </Link>
          <Link
            href="/"
            className="text-sm text-zinc-600 transition hover:text-zinc-900"
          >
            ← Public site
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-10">
        {children}
      </main>

      <footer className="border-t border-zinc-200 bg-white px-6 py-4">
        <p className="text-center text-xs text-zinc-500">
          FIPO Admin Portal · © {year} FIPO. For authorised administrators only.
        </p>
      </footer>
    </div>
  );
}
