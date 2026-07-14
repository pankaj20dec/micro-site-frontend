import { getApiBase } from "@/lib/api";
import {
  defaultFaqPageContent,
  mergeFaqPageContent,
  type FaqPageContent,
} from "@/lib/faq-content-defaults";

export async function fetchFaqPageContent(): Promise<FaqPageContent> {
  try {
    const res = await fetch(`${getApiBase()}/api/site-settings/faq`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return defaultFaqPageContent;
    const data = await res.json();
    return mergeFaqPageContent(data.content);
  } catch {
    return defaultFaqPageContent;
  }
}

export async function fetchFaqPageContentClient(): Promise<FaqPageContent> {
  try {
    const res = await fetch(`${getApiBase()}/api/site-settings/faq`);
    if (!res.ok) return defaultFaqPageContent;
    const data = await res.json();
    return mergeFaqPageContent(data.content);
  } catch {
    return defaultFaqPageContent;
  }
}
