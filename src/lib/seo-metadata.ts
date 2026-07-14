import type { Metadata } from "next";
import {
  SEO_PAGE_PATHS,
  defaultSiteSeoSettings,
  mergeSiteSeoSettings,
  type SeoPageKey,
  type SiteSeoSettings,
} from "./seo-content-defaults";

function resolveSiteUrl(siteUrl: string): URL | undefined {
  const trimmed = siteUrl.trim();
  if (!trimmed) return undefined;
  try {
    return new URL(trimmed);
  } catch {
    return undefined;
  }
}

function resolveAbsoluteUrl(path: string, siteUrl: string): string {
  const base = resolveSiteUrl(siteUrl);
  if (!base) return path;
  return new URL(path, base).toString();
}

function resolveOgImage(settings: SiteSeoSettings): string | undefined {
  const image = settings.defaultOgImage.trim();
  if (!image) return undefined;
  if (image.startsWith("http://") || image.startsWith("https://")) return image;
  return resolveAbsoluteUrl(image, settings.siteUrl);
}

export function buildSiteMetadata(settings: SiteSeoSettings): Metadata {
  const merged = mergeSiteSeoSettings(settings);
  const metadataBase = resolveSiteUrl(merged.siteUrl);

  return {
    ...(metadataBase ? { metadataBase } : {}),
    title: {
      default: merged.pages.home.title,
      template: `%s | ${merged.siteName}`,
    },
    description: merged.pages.home.description,
    robots: merged.pages.home.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

export function buildPageMetadata(
  pageKey: SeoPageKey,
  settings: SiteSeoSettings
): Metadata {
  const merged = mergeSiteSeoSettings(settings);
  const page = merged.pages[pageKey];
  const path = SEO_PAGE_PATHS[pageKey];
  const ogImage = resolveOgImage(merged);

  const metadata: Metadata = {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title: page.title,
      description: page.description,
      type: "website",
      url: path,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: page.title,
      description: page.description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    robots: page.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };

  const metadataBase = resolveSiteUrl(merged.siteUrl);
  if (metadataBase) {
    metadata.metadataBase = metadataBase;
  }

  return metadata;
}

export function buildFaqJsonLdUrl(settings: SiteSeoSettings): string | undefined {
  const merged = mergeSiteSeoSettings(settings);
  const base = merged.siteUrl.trim();
  if (!base) return undefined;
  return resolveAbsoluteUrl(SEO_PAGE_PATHS.faq, base);
}

export { defaultSiteSeoSettings };
