import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { fetchPublishedPage } from "@/lib/api";
import { staticNewsArticles } from "@/lib/news-content";
import { NewsArticlePage } from "@/components/common/NewsArticlePage";

type Props = { params: Promise<{ slug: string }> };

async function getPage(slug: string) {
  try {
    const page = await fetchPublishedPage(slug);
    if (page) return page;
  } catch {
    // fall through to static
  }
  return staticNewsArticles.find((a) => a.slug === slug) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return {};
  return {
    title: `${page.title} | FIPO News`,
    description: page.excerpt ?? page.title,
  };
}

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();
  return <NewsArticlePage page={page} />;
}
