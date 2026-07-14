"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getApiBase, type PageDoc } from "@/lib/api";
import { clearAdminToken, getAdminToken } from "@/lib/admin-auth";

export function AdminPagesList() {
  const router = useRouter();
  const [pages, setPages] = useState<PageDoc[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`${getApiBase()}/api/admin/pages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));
        if (res.status === 401 || res.status === 403) {
          clearAdminToken();
          router.replace("/admin/login");
          return;
        }
        if (!res.ok) {
          throw new Error(typeof data.error === "string" ? data.error : "Failed to load");
        }
        if (!cancelled) setPages(data.pages ?? []);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load pages");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  if (loading) {
    return <p className="text-sm text-zinc-600">Loading pages…</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">CMS Pages</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Manage pages for the public site.
          </p>
        </div>
        <Link
          href="/admin/pages/new"
          className="rounded-lg bg-[#660066] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#550055]"
        >
          New page
        </Link>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {error}
        </p>
      )}

      {pages.length === 0 ? (
        <p className="text-zinc-600">No pages yet. Create one to get started.</p>
      ) : (
        <ul className="divide-y divide-zinc-200 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          {pages.map((p) => (
            <li
              key={p.id}
              className="flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <span className="font-medium text-zinc-900">{p.title}</span>
                <span className="ml-2 text-sm text-zinc-500">/{p.slug}</span>
                <span
                  className={`ml-2 rounded px-2 py-0.5 text-xs ${
                    p.published
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {p.published ? "Published" : "Draft"}
                </span>
              </div>
              <Link
                href={`/admin/pages/${p.id}/edit`}
                className="text-sm font-medium text-[#660066] hover:underline"
              >
                Edit
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
