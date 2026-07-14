"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { clearAdminToken, getAdminToken } from "@/lib/admin-auth";
import {
  deleteContactLead,
  fetchAllContactLeads,
  fetchContactLeads,
  updateContactLeadStatus,
  type ContactLead,
  type ContactLeadStatus,
} from "@/lib/admin-contact-api";
import { downloadContactLeadsCsv } from "@/lib/export-contact-leads";

const STATUSES: ContactLeadStatus[] = ["NEW", "READ", "REPLIED", "ARCHIVED"];

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function statusBadge(status: ContactLeadStatus) {
  const styles: Record<ContactLeadStatus, string> = {
    NEW: "bg-emerald-100 text-emerald-800",
    READ: "bg-blue-100 text-blue-800",
    REPLIED: "bg-purple-100 text-purple-800",
    ARCHIVED: "bg-zinc-100 text-zinc-600",
  };
  return (
    <span className={`rounded px-2 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

function LeadDetail({
  lead,
  onStatusChange,
  onDelete,
  updating,
  deleting,
}: {
  lead: ContactLead;
  onStatusChange: (status: ContactLeadStatus) => void;
  onDelete: () => void;
  updating: boolean;
  deleting: boolean;
}) {
  return (
    <div className="space-y-4 rounded-xl border border-zinc-200 bg-zinc-50 p-5">
      <dl className="grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-zinc-500">Lead ID</dt>
          <dd className="mt-1 font-mono text-xs text-zinc-900">{lead.id}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Submitted</dt>
          <dd className="mt-1 font-medium text-zinc-900">{formatDateTime(lead.createdAt)}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Name</dt>
          <dd className="mt-1 font-medium text-zinc-900">{lead.name}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Email</dt>
          <dd className="mt-1 font-medium text-zinc-900">
            <a href={`mailto:${lead.email}`} className="text-[#660066] hover:underline">
              {lead.email}
            </a>
          </dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-zinc-500">Subject</dt>
          <dd className="mt-1 font-medium text-zinc-900">{lead.subject}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-zinc-500">Message</dt>
          <dd className="mt-1 whitespace-pre-wrap rounded-lg border border-zinc-200 bg-white p-4 text-zinc-900">
            {lead.message}
          </dd>
        </div>
        <div>
          <dt className="text-zinc-500">IP address</dt>
          <dd className="mt-1 font-medium text-zinc-900">{lead.ip || "—"}</dd>
        </div>
        <div>
          <dt className="text-zinc-500">Status</dt>
          <dd className="mt-1">{statusBadge(lead.status)}</dd>
        </div>
      </dl>

      <div className="flex flex-wrap items-center gap-3 border-t border-zinc-200 pt-4">
        <label className="text-sm font-medium text-zinc-700">
          Update status
          <select
            value={lead.status}
            disabled={updating}
            onChange={(e) => onStatusChange(e.target.value as ContactLeadStatus)}
            className="ml-2 rounded-lg border border-zinc-300 bg-white px-3 py-1.5 text-sm"
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
        >
          {deleting ? "Deleting…" : "Delete lead"}
        </button>
      </div>
    </div>
  );
}

export function AdminContactLeads() {
  const router = useRouter();
  const [leads, setLeads] = useState<ContactLead[]>([]);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState<ContactLeadStatus | "">("");
  const [search, setSearch] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exporting, setExporting] = useState(false);

  const loadLeads = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchContactLeads({
        status: statusFilter || undefined,
        limit: 200,
      });
      setLeads(data.submissions);
      setTotal(data.total);
    } catch (e) {
      const status = (e as { status?: number }).status;
      if (status === 401 || status === 403) {
        clearAdminToken();
        router.replace("/admin/login");
        return;
      }
      setError(e instanceof Error ? e.message : "Failed to load contact leads");
    } finally {
      setLoading(false);
    }
  }, [router, statusFilter]);

  useEffect(() => {
    loadLeads();
  }, [loadLeads]);

  const filteredLeads = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return leads;
    return leads.filter(
      (lead) =>
        lead.name.toLowerCase().includes(q) ||
        lead.email.toLowerCase().includes(q) ||
        lead.subject.toLowerCase().includes(q) ||
        lead.message.toLowerCase().includes(q)
    );
  }, [leads, search]);

  async function handleStatusChange(lead: ContactLead, status: ContactLeadStatus) {
    setUpdatingId(lead.id);
    setError(null);
    try {
      const updated = await updateContactLeadStatus(lead.id, status);
      setLeads((prev) => prev.map((item) => (item.id === lead.id ? updated : item)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(lead: ContactLead) {
    if (!window.confirm(`Delete lead from ${lead.name} (${lead.email})?`)) return;

    setDeletingId(lead.id);
    setError(null);
    try {
      await deleteContactLead(lead.id);
      setLeads((prev) => prev.filter((item) => item.id !== lead.id));
      setTotal((prev) => Math.max(0, prev - 1));
      if (expandedId === lead.id) setExpandedId(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete lead");
    } finally {
      setDeletingId(null);
    }
  }

  const newCount = leads.filter((lead) => lead.status === "NEW").length;

  async function handleExport() {
    setExporting(true);
    setError(null);
    try {
      const allLeads = await fetchAllContactLeads({
        status: statusFilter || undefined,
      });

      const q = search.trim().toLowerCase();
      const toExport = q
        ? allLeads.filter(
            (lead) =>
              lead.name.toLowerCase().includes(q) ||
              lead.email.toLowerCase().includes(q) ||
              lead.subject.toLowerCase().includes(q) ||
              lead.message.toLowerCase().includes(q)
          )
        : allLeads;

      if (toExport.length === 0) {
        setError("No leads to export for the current filters.");
        return;
      }

      const suffix = statusFilter ? statusFilter.toLowerCase() : "all";
      downloadContactLeadsCsv(toExport, `contact-leads-${suffix}.csv`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to export leads");
    } finally {
      setExporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Contact leads</h1>
          <p className="mt-1 text-sm text-zinc-600">
            {total} submission{total === 1 ? "" : "s"} total
            {newCount > 0 ? ` — ${newCount} new` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={handleExport}
          disabled={exporting || loading}
          className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-60"
        >
          {exporting ? "Exporting…" : "Export CSV"}
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          placeholder="Search name, email, subject, or message…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-[#660066] focus:ring-2 focus:ring-[#660066]/20"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as ContactLeadStatus | "")}
          className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-zinc-600">Loading contact leads…</p>
      ) : filteredLeads.length === 0 ? (
        <p className="text-sm text-zinc-600">No contact leads found.</p>
      ) : (
        <div className="space-y-4">
          {filteredLeads.map((lead) => {
            const expanded = expandedId === lead.id;
            return (
              <div
                key={lead.id}
                className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : lead.id)}
                  className="flex w-full flex-col gap-3 px-4 py-4 text-left sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-zinc-900">{lead.name}</span>
                      {statusBadge(lead.status)}
                    </div>
                    <p className="mt-1 truncate text-sm text-zinc-600">{lead.email}</p>
                    <p className="mt-1 truncate text-sm font-medium text-zinc-800">
                      {lead.subject}
                    </p>
                  </div>
                  <div className="shrink-0 text-sm text-zinc-500">
                    {formatDateTime(lead.createdAt)}
                  </div>
                </button>

                {expanded && (
                  <div className="border-t border-zinc-200 px-4 py-4">
                    <LeadDetail
                      lead={lead}
                      updating={updatingId === lead.id}
                      deleting={deletingId === lead.id}
                      onStatusChange={(status) => handleStatusChange(lead, status)}
                      onDelete={() => handleDelete(lead)}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
