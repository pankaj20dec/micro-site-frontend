import { getApiBase } from "@/lib/api";
import {
  defaultSiteSeoSettings,
  mergeSiteSeoSettings,
  type SiteSeoSettings,
} from "@/lib/seo-content-defaults";

export async function fetchSeoSettings(): Promise<SiteSeoSettings> {
  try {
    const res = await fetch(`${getApiBase()}/api/site-settings/seo`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return defaultSiteSeoSettings;
    const data = await res.json();
    return mergeSiteSeoSettings(data.content);
  } catch {
    return defaultSiteSeoSettings;
  }
}
