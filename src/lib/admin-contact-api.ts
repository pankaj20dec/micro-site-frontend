import { getApiBase } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";

function authHeaders() {
  const token = getAdminToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export type ContactLeadStatus = "NEW" | "READ" | "REPLIED" | "ARCHIVED";

export interface ContactLead {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  ip: string | null;
  status: ContactLeadStatus;
  createdAt: string;
}

export async function fetchContactLeads(params?: {
  status?: ContactLeadStatus;
  page?: number;
  limit?: number;
}) {
  const qs = new URLSearchParams();
  if (params?.status) qs.set("status", params.status);
  if (params?.page) qs.set("page", String(params.page));
  if (params?.limit) qs.set("limit", String(params.limit));

  const res = await fetch(
    `${getApiBase()}/api/contact${qs.size ? `?${qs}` : ""}`,
    { headers: authHeaders() }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.error === "string" ? data.error : "Failed to load contact leads";
    throw Object.assign(new Error(message), { status: res.status });
  }
  return data as {
    submissions: ContactLead[];
    total: number;
    page: number;
  };
}

export async function fetchAllContactLeads(params?: {
  status?: ContactLeadStatus;
}) {
  const limit = 100;
  let page = 1;
  let total = 0;
  const submissions: ContactLead[] = [];

  do {
    const data = await fetchContactLeads({
      status: params?.status,
      page,
      limit,
    });
    submissions.push(...data.submissions);
    total = data.total;
    page += 1;
  } while (submissions.length < total);

  return submissions;
}

export async function updateContactLeadStatus(id: string, status: ContactLeadStatus) {
  const res = await fetch(`${getApiBase()}/api/contact/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.error === "string" ? data.error : "Failed to update lead";
    throw Object.assign(new Error(message), { status: res.status });
  }
  return data.submission as ContactLead;
}

export async function deleteContactLead(id: string) {
  const res = await fetch(`${getApiBase()}/api/contact/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (res.status === 204) return;
  const data = await res.json().catch(() => ({}));
  const message =
    typeof data.error === "string" ? data.error : "Failed to delete lead";
  throw Object.assign(new Error(message), { status: res.status });
}
