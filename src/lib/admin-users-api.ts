import { getApiBase } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";

function authHeaders() {
  const token = getAdminToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export interface AdminUserSummary {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  organisation: string | null;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  createdAt: string;
  _count: { applications: number };
}

export async function fetchAdminUsers(params?: {
  search?: string;
  role?: string;
  page?: number;
}) {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.role) qs.set("role", params.role);
  if (params?.page) qs.set("page", String(params.page));

  const res = await fetch(
    `${getApiBase()}/api/admin/users${qs.size ? `?${qs}` : ""}`,
    { headers: authHeaders() }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.error === "string" ? data.error : "Failed to load users";
    throw Object.assign(new Error(message), { status: res.status });
  }
  return data as { users: AdminUserSummary[]; total: number; page: number };
}

export async function deleteAdminUser(id: string) {
  const res = await fetch(`${getApiBase()}/api/admin/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (res.status === 204) return;
  const data = await res.json().catch(() => ({}));
  const message =
    typeof data.error === "string" ? data.error : "Failed to delete user";
  throw Object.assign(new Error(message), { status: res.status });
}

export async function createAdminUser(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "ADMIN" | "SUPER_ADMIN";
}) {
  const res = await fetch(`${getApiBase()}/api/admin/users`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.error === "string" ? data.error : "Failed to create admin";
    throw Object.assign(new Error(message), { status: res.status });
  }
  return data.user as AdminUserSummary;
}

export interface AdminEvidenceFile {
  id: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface AdminPaymentEvent {
  id: string;
  provider: string;
  providerEventId: string;
  type: string;
  amount: string | number;
  currency: string;
  status: string;
  createdAt: string;
}

export interface AdminApplication {
  id: string;
  userId: string;
  applicationType: string | null;
  currentStep: number;
  status: string;
  membershipType: string | null;
  membershipFee: string | number | null;
  paymentProvider: string | null;
  paymentStatus: string;
  stripePaymentIntentId: string | null;
  paypalOrderId: string | null;
  idDocumentUrl: string | null;
  idVerifiedAt: string | null;
  docusignEnvelopeId: string | null;
  docusignStatus: string | null;
  legalSignedAt: string | null;
  stage1Data: Record<string, unknown> | null;
  stage2Data: Record<string, unknown> | null;
  riskAcceptedAt: string | null;
  evidenceFiles: AdminEvidenceFile[];
  paymentEvents: AdminPaymentEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminUserDetail {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  organisation: string | null;
  role: AdminUserSummary["role"];
  createdAt: string;
  updatedAt: string;
  applications: AdminApplication[];
}

export async function fetchAdminUserDetail(id: string) {
  const res = await fetch(`${getApiBase()}/api/admin/users/${id}`, {
    headers: authHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.error === "string" ? data.error : "Failed to load user";
    throw Object.assign(new Error(message), { status: res.status });
  }
  return data.user as AdminUserDetail;
}
