import { getApiBase } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import type {
  AuthHeaderContent,
  SiteFooterContent,
  SiteHeaderContent,
  SiteLayoutContent,
} from "@/lib/layout-content-defaults";

function authHeaders() {
  const token = getAdminToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchAdminLayoutContent() {
  const res = await fetch(`${getApiBase()}/api/admin/site-settings/layout`, {
    headers: authHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.error === "string" ? data.error : "Failed to load layout settings";
    throw Object.assign(new Error(message), { status: res.status });
  }
  return data as SiteLayoutContent;
}

export async function saveSiteHeaderContent(content: SiteHeaderContent) {
  const res = await fetch(`${getApiBase()}/api/admin/site-settings/layout/site_header`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ content }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.error === "string" ? data.error : "Failed to save site header";
    throw Object.assign(new Error(message), { status: res.status });
  }
  return data.content as SiteHeaderContent;
}

export async function saveAuthHeaderContent(content: AuthHeaderContent) {
  const res = await fetch(`${getApiBase()}/api/admin/site-settings/layout/auth_header`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ content }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.error === "string" ? data.error : "Failed to save auth header";
    throw Object.assign(new Error(message), { status: res.status });
  }
  return data.content as AuthHeaderContent;
}

export async function saveSiteFooterContent(content: SiteFooterContent) {
  const res = await fetch(`${getApiBase()}/api/admin/site-settings/layout/site_footer`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ content }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.error === "string" ? data.error : "Failed to save footer";
    throw Object.assign(new Error(message), { status: res.status });
  }
  return data.content as SiteFooterContent;
}
