import { fetchSeoSettings } from "@/lib/seo-content-api";
import { buildPageMetadata } from "@/lib/seo-metadata";
import type { SeoPageKey } from "@/lib/seo-content-defaults";

export async function getPageMetadata(pageKey: SeoPageKey) {
  const settings = await fetchSeoSettings();
  return buildPageMetadata(pageKey, settings);
}
