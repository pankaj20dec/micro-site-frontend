import type { Metadata } from "next";
import type { PageSummary } from "@/lib/api";
import { fetchPublishedPages } from "@/lib/api";
import { staticNewsArticles } from "@/lib/news-content";
import { NewsListingPage } from "@/components/common/NewsListingPage";

export const metadata: Metadata = {
  title: "News | FIPO",
  description:
    "Stay up to date with the latest news, updates and insights from FIPO and Harcus Parker.",
};

export default async function NewsIndex() {
  let apiPages: PageSummary[] = [];
  try {
    apiPages = await fetchPublishedPages();
  } catch {
    // API unavailable — static articles will fill the page
  }

  // Always show static articles; API articles take priority for matching slugs
  const apiSlugs = new Set(apiPages.map((p) => p.slug));
  const pages: PageSummary[] = [
    ...apiPages,
    ...staticNewsArticles.filter((s) => !apiSlugs.has(s.slug)),
  ];

  return <NewsListingPage pages={pages} />;
}
