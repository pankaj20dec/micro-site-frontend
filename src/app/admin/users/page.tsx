"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  clearAdminToken,
  getAdmin,
  getAdminToken,
  type AdminPayload,
} from "@/lib/admin-auth";
import { useMounted } from "@/hooks/use-mounted";
import {
  deleteAdminUser,
  fetchAdminUsers,
  type AdminUserSummary,
} from "@/lib/admin-users-api";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getInitials(user: AdminUserSummary) {
  const first = user.firstName?.charAt(0) ?? "";
  const last = user.lastName?.charAt(0) ?? "";
  return (first + last).toUpperCase() || "?";
}

function roleBadge(role: AdminUserSummary["role"]) {
  const styles: Record<AdminUserSummary["role"], string> = {
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

function TableSkeleton() {
  return (
    <div className="animate-pulse divide-y divide-slate-100">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-5 py-4">
          <div className="h-10 w-10 rounded-full bg-slate-200" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-40 rounded bg-slate-200" />
            <div className="h-3 w-56 rounded bg-slate-100" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminUsersPage() {
  const router = useRouter();
  const mounted = useMounted();
  const [admin, setAdmin] = useState<AdminPayload | null>(null);
  const isSuperAdmin = admin?.role === "SUPER_ADMIN";

  const [users, setUsers] = useState<AdminUserSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminUsers({
        search: search.trim() || undefined,
        role: roleFilter || undefined,
      });
      setUsers(data.users);
      setTotal(data.total);
    } catch (e) {
      const status = (e as { status?: number }).status;
      if (status === 401 || status === 403) {
        clearAdminToken();
        router.replace("/admin/login");
        return;
      }
      setError(e instanceof Error ? e.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [router, search, roleFilter]);

  useEffect(() => {
    if (!mounted) return;
    setAdmin(getAdmin());
    loadUsers();
  }, [mounted, loadUsers]);

  const roleCounts = useMemo(() => {
    return users.reduce(
      (acc, user) => {
        acc[user.role] = (acc[user.role] ?? 0) + 1;
        return acc;
      },
      {} as Record<AdminUserSummary["role"], number>
    );
  }, [users]);

  async function handleDelete(user: AdminUserSummary) {
    if (!isSuperAdmin) return;
    if (user.role === "SUPER_ADMIN") return;
    if (user.id === admin?.sub) {
      setError("You cannot delete your own account.");
      return;
    }

    const confirmed = window.confirm(
      `Delete ${user.firstName} ${user.lastName} (${user.email})?\n\nThis will permanently remove their account and all associated applications.`
    );
    if (!confirmed) return;

    setDeletingId(user.id);
    setError(null);
    try {
      await deleteAdminUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setTotal((prev) => Math.max(0, prev - 1));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete user");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Registered users
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {isSuperAdmin
              ? "Browse accounts, view registration data, and manage access."
              : "Browse registered accounts. Registration data is available to Super Admin only."}
          </p>
        </div>
        {isSuperAdmin && (
          <Link
            href="/admin/register"
            className="inline-flex items-center gap-2 rounded-lg bg-[#660066] px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-[#550055]"
          >
            <PlusIcon />
            Register admin
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <SummaryPill label="Total" value={total} />
        {(roleCounts.USER ?? 0) > 0 && (
          <SummaryPill label="Users" value={roleCounts.USER ?? 0} tone="slate" />
        )}
        {(roleCounts.ADMIN ?? 0) > 0 && (
          <SummaryPill label="Admins" value={roleCounts.ADMIN ?? 0} tone="blue" />
        )}
        {(roleCounts.SUPER_ADMIN ?? 0) > 0 && (
          <SummaryPill label="Super admins" value={roleCounts.SUPER_ADMIN ?? 0} tone="purple" />
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search by name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none transition focus:border-[#660066]/40 focus:bg-white focus:ring-2 focus:ring-[#660066]/10"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-[#660066]/40 focus:bg-white focus:ring-2 focus:ring-[#660066]/10 sm:min-w-[160px]"
          >
            <option value="">All roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
            <option value="SUPER_ADMIN">Super Admin</option>
          </select>
        </div>

        {error && (
          <div className="border-b border-red-100 bg-red-50 px-5 py-3 text-sm text-red-800">
            {error}
          </div>
        )}

        {loading ? (
          <TableSkeleton />
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <UsersIcon />
            </div>
            <p className="mt-4 font-medium text-slate-900">No users found</p>
            <p className="mt-1 text-sm text-slate-500">
              {search || roleFilter
                ? "Try adjusting your search or filter."
                : "Registered users will appear here."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3.5">User</th>
                  <th className="px-5 py-3.5">Role</th>
                  <th className="px-5 py-3.5">Applications</th>
                  <th className="px-5 py-3.5">Registered</th>
                  {isSuperAdmin && <th className="px-5 py-3.5 text-right">Actions</th>}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((user) => {
                  const canDelete =
                    isSuperAdmin &&
                    user.role !== "SUPER_ADMIN" &&
                    user.id !== admin?.sub;
                  const canView = isSuperAdmin && user.role === "USER";
                  const fullName = `${user.firstName} ${user.lastName}`.trim();

                  return (
                    <tr key={user.id} className="transition hover:bg-slate-50/60">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#660066]/10 text-sm font-semibold text-[#660066]">
                            {getInitials(user)}
                          </div>
                          <div className="min-w-0">
                            {canView ? (
                              <Link
                                href={`/admin/users/${user.id}`}
                                className="font-medium text-slate-900 transition hover:text-[#660066]"
                              >
                                {fullName}
                              </Link>
                            ) : (
                              <p className="font-medium text-slate-900">{fullName}</p>
                            )}
                            <p className="truncate text-sm text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">{roleBadge(user.role)}</td>
                      <td className="px-5 py-4">
                        {user._count.applications > 0 && isSuperAdmin ? (
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-sm font-medium text-[#660066] transition hover:border-[#660066]/30 hover:bg-[#660066]/5"
                          >
                            <span>{user._count.applications}</span>
                            <span className="text-slate-400">·</span>
                            <span>View</span>
                          </Link>
                        ) : (
                          <span className="inline-flex min-w-[2rem] items-center justify-center rounded-lg bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-600">
                            {user._count.applications}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-slate-600">{formatDate(user.createdAt)}</td>
                      {isSuperAdmin && (
                        <td className="px-5 py-4 text-right">
                          {canDelete ? (
                            <button
                              type="button"
                              onClick={() => handleDelete(user)}
                              disabled={deletingId === user.id}
                              className="inline-flex items-center rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition hover:bg-red-100 disabled:opacity-50"
                            >
                              {deletingId === user.id ? "Deleting…" : "Delete"}
                            </button>
                          ) : (
                            <span className="text-xs text-slate-300">—</span>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {!loading && users.length > 0 && (
          <div className="border-t border-slate-100 bg-slate-50/50 px-5 py-3 text-xs text-slate-500">
            Showing {users.length} of {total} user{total === 1 ? "" : "s"}
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryPill({
  label,
  value,
  tone = "slate",
}: {
  label: string;
  value: number;
  tone?: "slate" | "blue" | "purple";
}) {
  const tones = {
    slate: "border-slate-200 bg-white text-slate-700",
    blue: "border-blue-200/80 bg-blue-50/50 text-blue-700",
    purple: "border-[#660066]/20 bg-[#660066]/5 text-[#660066]",
  };

  return (
    <div className={`rounded-lg border px-3 py-2 ${tones[tone]}`}>
      <p className="text-xs font-medium uppercase tracking-wide opacity-70">{label}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
    </svg>
  );
}
