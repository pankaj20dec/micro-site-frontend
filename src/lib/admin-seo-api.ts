import { getApiBase } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import {
  mergeSiteSeoSettings,
  type SiteSeoSettings,
} from "@/lib/seo-content-defaults";

function authHeaders() {
  const token = getAdminToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchAdminSeoSettings() {
  const res = await fetch(`${getApiBase()}/api/admin/site-settings/seo`, {
    headers: authHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.error === "string" ? data.error : "Failed to load SEO settings";
    throw Object.assign(new Error(message), { status: res.status });
  }
  return mergeSiteSeoSettings(data.content);
}

export async function saveSeoSettings(content: SiteSeoSettings) {
  const res = await fetch(`${getApiBase()}/api/admin/site-settings/seo`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ content }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.error === "string" ? data.error : "Failed to save SEO settings";
    throw Object.assign(new Error(message), { status: res.status });
  }
  return mergeSiteSeoSettings(data.content);
}
