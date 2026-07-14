import { getApiBase } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import type { AdminApplication } from "@/lib/admin-users-api";

function authHeaders() {
  const token = getAdminToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchAdminApplication(id: string) {
  const res = await fetch(`${getApiBase()}/api/admin/applications/${id}`, {
    headers: authHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.error === "string" ? data.error : "Failed to load application";
    throw Object.assign(new Error(message), { status: res.status });
  }
  return data.application as AdminApplication & {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      phone: string | null;
      organisation: string | null;
      role: string;
      createdAt: string;
    };
  };
}

export async function fetchAdminApplications(params?: {
  search?: string;
  status?: string;
  applicationType?: string;
  page?: number;
}) {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.status) qs.set("status", params.status);
  if (params?.applicationType) qs.set("applicationType", params.applicationType);
  if (params?.page) qs.set("page", String(params.page));

  const res = await fetch(
    `${getApiBase()}/api/admin/applications${qs.size ? `?${qs}` : ""}`,
    { headers: authHeaders() }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.error === "string" ? data.error : "Failed to load applications";
    throw Object.assign(new Error(message), { status: res.status });
  }
  return data as {
    applications: (AdminApplication & {
      user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
      };
      _count: { evidenceFiles: number };
    })[];
    total: number;
    page: number;
  };
}
