import { FaqJsonLd } from "@/components/common/FaqJsonLd";
import { FaqPage } from "@/components/common/FaqPage";
import { fetchFaqPageContent } from "@/lib/faq-content-api";
import { getPageMetadata } from "@/lib/get-page-metadata";
import { fetchSeoSettings } from "@/lib/seo-content-api";
import { buildFaqJsonLdUrl } from "@/lib/seo-metadata";

export async function generateMetadata() {
  return getPageMetadata("faq");
}

export default async function FaqRoute() {
  const [content, seoSettings] = await Promise.all([
    fetchFaqPageContent(),
    fetchSeoSettings(),
  ]);

  return (
    <>
      <FaqJsonLd content={content} pageUrl={buildFaqJsonLdUrl(seoSettings)} />
      <FaqPage content={content} />
    </>
  );
}
