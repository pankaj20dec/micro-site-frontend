/**
 * Browser: same-origin `/api/...` so Next can rewrite to Express (avoids CORS).
 * Server (RSC): direct URL to the API (relative fetch is unreliable in RSC).
 */
export function getApiBase(): string {
  if (typeof window !== "undefined") {
    return "";
  }
  return (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:5000").replace(/\/$/, "");
}

export type PageSummary = {
  id: string;
  slug: string;
  title: string;
  updatedAt?: string;
  publishedAt?: string;
  excerpt?: string;
  featuredImage?: string;
  category?: string;
};

export type PageDoc = PageSummary & {
  body: string;
  published: boolean;
};

export async function fetchPublishedPages(): Promise<PageSummary[]> {
  const res = await fetch(`${getApiBase()}/api/pages`, {
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error("Failed to load pages");
  const data = (await res.json()) as { pages: PageSummary[] };
  return data.pages ?? [];
}

export async function fetchPublishedPage(slug: string): Promise<PageDoc | null> {
  const res = await fetch(`${getApiBase()}/api/pages/${encodeURIComponent(slug)}`, {
    next: { revalidate: 30 },
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load page");
  const data = (await res.json()) as { page: PageDoc };
  return data.page;
}
