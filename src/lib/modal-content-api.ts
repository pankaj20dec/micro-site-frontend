import { getApiBase } from "@/lib/api";
import {
  defaultRegisterDisclaimer,
  defaultSiteDisclaimer,
  type RegisterDisclaimerContent,
  type SiteDisclaimerContent,
} from "@/lib/modal-content-defaults";

export async function fetchSiteDisclaimerContent(): Promise<SiteDisclaimerContent> {
  try {
    const res = await fetch(`${getApiBase()}/api/site-settings/modals/site_disclaimer`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return defaultSiteDisclaimer;
    const data = await res.json();
    return (data.content as SiteDisclaimerContent) ?? defaultSiteDisclaimer;
  } catch {
    return defaultSiteDisclaimer;
  }
}

export async function fetchRegisterDisclaimerContent(): Promise<RegisterDisclaimerContent> {
  try {
    const res = await fetch(`${getApiBase()}/api/site-settings/modals/register_disclaimer`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return defaultRegisterDisclaimer;
    const data = await res.json();
    return (data.content as RegisterDisclaimerContent) ?? defaultRegisterDisclaimer;
  } catch {
    return defaultRegisterDisclaimer;
  }
}

export async function fetchModalContentsClient(): Promise<{
  siteDisclaimer: SiteDisclaimerContent;
  registerDisclaimer: RegisterDisclaimerContent;
}> {
  try {
    const res = await fetch(`${getApiBase()}/api/site-settings/modals`);
    if (!res.ok) {
      return {
        siteDisclaimer: defaultSiteDisclaimer,
        registerDisclaimer: defaultRegisterDisclaimer,
      };
    }
    const data = await res.json();
    return {
      siteDisclaimer: data.siteDisclaimer ?? defaultSiteDisclaimer,
      registerDisclaimer: data.registerDisclaimer ?? defaultRegisterDisclaimer,
    };
  } catch {
    return {
      siteDisclaimer: defaultSiteDisclaimer,
      registerDisclaimer: defaultRegisterDisclaimer,
    };
  }
}
