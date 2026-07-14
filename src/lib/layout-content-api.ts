import { getApiBase } from "@/lib/api";
import {
  defaultSiteLayout,
  mergeSiteHeader,
  type SiteLayoutContent,
} from "@/lib/layout-content-defaults";

export async function fetchSiteLayoutContent(): Promise<SiteLayoutContent> {
  try {
    const res = await fetch(`${getApiBase()}/api/site-settings/layout`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return defaultSiteLayout;
    const data = await res.json();
    return {
      siteHeader: mergeSiteHeader(data.siteHeader),
      authHeader: data.authHeader ?? defaultSiteLayout.authHeader,
      siteFooter: data.siteFooter ?? defaultSiteLayout.siteFooter,
    };
  } catch {
    return defaultSiteLayout;
  }
}

export async function fetchSiteLayoutContentClient(): Promise<SiteLayoutContent> {
  try {
    const res = await fetch(`${getApiBase()}/api/site-settings/layout`);
    if (!res.ok) return defaultSiteLayout;
    const data = await res.json();
    return {
      siteHeader: mergeSiteHeader(data.siteHeader),
      authHeader: data.authHeader ?? defaultSiteLayout.authHeader,
      siteFooter: data.siteFooter ?? defaultSiteLayout.siteFooter,
    };
  } catch {
    return defaultSiteLayout;
  }
}
