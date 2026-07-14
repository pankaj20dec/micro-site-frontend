"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  clearAdminToken,
  getAdmin,
  getAdminToken,
} from "@/lib/admin-auth";
import { useMounted } from "@/hooks/use-mounted";
import {
  fetchAdminUserDetail,
  type AdminUserDetail,
} from "@/lib/admin-users-api";
import { AdminApplicationViewer } from "@/components/admin/AdminApplicationViewer";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitials(user: Pick<AdminUserDetail, "firstName" | "lastName">) {
  const first = user.firstName?.charAt(0) ?? "";
  const last = user.lastName?.charAt(0) ?? "";
  return (first + last).toUpperCase() || "?";
}

function roleBadge(role: AdminUserDetail["role"]) {
  const styles: Record<AdminUserDetail["role"], string> = {
    USER: "bg-slate-100 text-slate-700 ring-1 ring-slate-200/80",
    ADMIN: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/80",
    SUPER_ADMIN: "bg-[#660066]/10 text-[#660066] ring-1 ring-[#660066]/20",
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[role]}`}>
      {role.replace("_", " ")}
    </span>
  );
}

function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-4 w-32 rounded bg-slate-200" />
      <div className="h-40 rounded-xl bg-slate-200/80" />
      <div className="h-64 rounded-xl bg-slate-200/80" />
    </div>
  );
}

export default function AdminUserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = String(params.id ?? "");

  const mounted = useMounted();
  const [user, setUser] = useState<AdminUserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mounted) return;

    const token = getAdminToken();
    const currentAdmin = getAdmin();

    if (!token) {
      router.replace("/admin/login");
      return;
    }

    if (currentAdmin?.role !== "SUPER_ADMIN") {
      setError("Registration data is available to Super Admin only.");
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    (async () => {
      try {
        const data = await fetchAdminUserDetail(userId);
        if (!cancelled) setUser(data);
      } catch (e) {
        const status = (e as { status?: number }).status;
        if (status === 401 || status === 403) {
          clearAdminToken();
          router.replace("/admin/login");
          return;
        }
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "Failed to load user");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [mounted, router, userId]);

  if (loading) return <PageSkeleton />;

  return (
    <div className="space-y-6">
      <Link
        href="/admin/users"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-[#660066]"
      >
        <BackIcon />
        Back to users
      </Link>

      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
          {error}
        </div>
      ) : user ? (
        <>
          <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
            <div className="border-b border-slate-100 bg-gradient-to-r from-[#660066]/5 to-transparent px-6 py-6">
              <div className="flex flex-wrap items-start gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#660066] text-xl font-semibold text-white shadow-sm">
                  {getInitials(user)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
                      {user.firstName} {user.lastName}
                    </h1>
                    {roleBadge(user.role)}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                  <p className="mt-2 text-xs text-slate-400">
                    Member since {formatDate(user.createdAt)}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                  <p className="text-2xl font-semibold text-slate-900">
                    {user.applications.length}
                  </p>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    Application{user.applications.length === 1 ? "" : "s"}
                  </p>
                </div>
              </div>
            </div>

            <dl className="grid gap-px bg-slate-100 sm:grid-cols-2 lg:grid-cols-4">
              <InfoCell label="Email" value={user.email} />
              <InfoCell label="Phone" value={user.phone || "—"} />
              <InfoCell label="Organisation" value={user.organisation || "—"} />
              <InfoCell label="Registered" value={formatDate(user.createdAt)} />
            </dl>
          </section>

          {user.applications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-white px-5 py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <DocumentIcon />
              </div>
              <p className="mt-4 font-medium text-slate-900">No applications</p>
              <p className="mt-1 text-sm text-slate-500">
                This user has not submitted a registration application yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {user.applications.map((application, index) => (
                <section
                  key={application.id}
                  className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm"
                >
                  <div className="border-b border-slate-100 px-6 py-4">
                    <h2 className="font-semibold text-slate-900">
                      Registration
                      {user.applications.length > 1 ? ` ${index + 1}` : ""}
                    </h2>
                    <p className="mt-0.5 text-sm text-slate-500">
                      Full application data and uploaded evidence
                    </p>
                  </div>
                  <div className="p-6">
                    <AdminApplicationViewer application={application} />
                  </div>
                </section>
              ))}
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white px-5 py-4">
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

function BackIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}
