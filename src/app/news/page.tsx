import type { PageSummary } from "@/lib/api";
import { fetchPublishedPages } from "@/lib/api";
import { staticNewsArticles } from "@/lib/news-content";
import { NewsListingPage } from "@/components/common/NewsListingPage";
import { getPageMetadata } from "@/lib/get-page-metadata";

export async function generateMetadata() {
  return getPageMetadata("news");
}

export default async function NewsIndex() {
  let apiPages: PageSummary[] = [];
  try {
    apiPages = await fetchPublishedPages();
  } catch {
    // API unavailable — static articles will fill the page
  }

  const apiSlugs = new Set(apiPages.map((p) => p.slug));
  const pages: PageSummary[] = [
    ...apiPages,
    ...staticNewsArticles.filter((s) => !apiSlugs.has(s.slug)),
  ];

  return <NewsListingPage pages={pages} />;
}
