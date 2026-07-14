import { getApiBase } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import {
  mergeFaqPageContent,
  type FaqPageContent,
} from "@/lib/faq-content-defaults";

function authHeaders() {
  const token = getAdminToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchAdminFaqContent() {
  const res = await fetch(`${getApiBase()}/api/admin/site-settings/faq`, {
    headers: authHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.error === "string" ? data.error : "Failed to load FAQ content";
    throw Object.assign(new Error(message), { status: res.status });
  }
  return mergeFaqPageContent(data.content);
}

export async function saveFaqContent(content: FaqPageContent) {
  const res = await fetch(`${getApiBase()}/api/admin/site-settings/faq`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ content }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.error === "string" ? data.error : "Failed to save FAQ content";
    throw Object.assign(new Error(message), { status: res.status });
  }
  return mergeFaqPageContent(data.content);
}
