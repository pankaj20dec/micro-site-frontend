import { getApiBase } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";
import type {
  RegisterDisclaimerContent,
  SiteDisclaimerContent,
} from "@/lib/modal-content-defaults";

function authHeaders() {
  const token = getAdminToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchAdminModalContents() {
  const res = await fetch(`${getApiBase()}/api/admin/site-settings/modals`, {
    headers: authHeaders(),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.error === "string" ? data.error : "Failed to load modal content";
    throw Object.assign(new Error(message), { status: res.status });
  }
  return data as {
    siteDisclaimer: SiteDisclaimerContent;
    registerDisclaimer: RegisterDisclaimerContent;
  };
}

export async function saveSiteDisclaimerContent(content: SiteDisclaimerContent) {
  const res = await fetch(`${getApiBase()}/api/admin/site-settings/modals/site_disclaimer`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ content }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.error === "string" ? data.error : "Failed to save site disclaimer";
    throw Object.assign(new Error(message), { status: res.status });
  }
  return data.content as SiteDisclaimerContent;
}

export async function saveRegisterDisclaimerContent(content: RegisterDisclaimerContent) {
  const res = await fetch(`${getApiBase()}/api/admin/site-settings/modals/register_disclaimer`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ content }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      typeof data.error === "string" ? data.error : "Failed to save register disclaimer";
    throw Object.assign(new Error(message), { status: res.status });
  }
  return data.content as RegisterDisclaimerContent;
}
