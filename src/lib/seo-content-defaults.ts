export const SEO_PAGE_KEYS = [
  "home",
  "about",
  "contact",
  "claim",
  "faq",
  "news",
  "explanations",
  "register",
] as const;

export type SeoPageKey = (typeof SEO_PAGE_KEYS)[number];

export type PageSeoFields = {
  title: string;
  description: string;
  noIndex: boolean;
};

export type SiteSeoSettings = {
  siteName: string;
  siteUrl: string;
  defaultOgImage: string;
  pages: Record<SeoPageKey, PageSeoFields>;
};

export const SEO_PAGE_PATHS: Record<SeoPageKey, string> = {
  home: "/",
  about: "/about",
  contact: "/contact",
  claim: "/claim",
  faq: "/faq",
  news: "/news",
  explanations: "/explanations",
  register: "/register",
};

export const SEO_PAGE_LABELS: Record<SeoPageKey, string> = {
  home: "Home",
  about: "About",
  contact: "Contact",
  claim: "The Claim",
  faq: "FAQ",
  news: "News",
  explanations: "Explanations",
  register: "Register",
};

const defaultPageSeo: Record<SeoPageKey, PageSeoFields> = {
  home: {
    title: "FIPO | Fair Pay Action Group",
    description:
      "Fair pay and professional freedom for medical professionals — join the FIPO action group.",
    noIndex: false,
  },
  about: {
    title: "About FIPO | FIPO Fair Pay Action Group",
    description:
      "Who FIPO is, why the Fair Pay Action Group exists, and why independent medical practitioners can trust our advocacy.",
    noIndex: false,
  },
  contact: {
    title: "Contact | FIPO Fair Pay Action Group",
    description:
      "Contact FIPO and the Legal Team at Harcus Parker — address, phone, email, and a direct message form.",
    noIndex: false,
  },
  claim: {
    title: "The Claim | FIPO",
    description:
      "Learn why FIPO is bringing this Claim against Bupa and AXA PPP, what it seeks to achieve, and how to join the action group.",
    noIndex: false,
  },
  faq: {
    title: "Frequently Asked Questions | FIPO Fair Pay Action Group",
    description:
      "Answers to common questions about FIPO, the Fair Pay Action Group and joining the legal claim led by Harcus Parker.",
    noIndex: false,
  },
  news: {
    title: "News | FIPO",
    description:
      "Stay up to date with the latest news, updates and insights from FIPO and Harcus Parker.",
    noIndex: false,
  },
  explanations: {
    title: "Explanations | FIPO Fair Pay Action Group",
    description:
      "A plain-English explanation of the Fair Pay Action Group claim — what is being claimed, the legal grounds, the process, and how to join.",
    noIndex: false,
  },
  register: {
    title: "Register | FIPO Fair Pay Action Group",
    description:
      "Register your interest and join the FIPO Fair Pay Action Group legal claim against Bupa and AXA PPP.",
    noIndex: false,
  },
};

export const defaultSiteSeoSettings: SiteSeoSettings = {
  siteName: "FIPO Fair Pay Action Group",
  siteUrl: "",
  defaultOgImage: "",
  pages: defaultPageSeo,
};

function mergePageSeo(
  key: SeoPageKey,
  page: Partial<PageSeoFields> | undefined
): PageSeoFields {
  const defaults = defaultSiteSeoSettings.pages[key];
  return {
    title: page?.title?.trim() || defaults.title,
    description: page?.description?.trim() || defaults.description,
    noIndex: page?.noIndex ?? defaults.noIndex,
  };
}

export function mergeSiteSeoSettings(
  content: Partial<SiteSeoSettings> | null | undefined
): SiteSeoSettings {
  const pages = {} as Record<SeoPageKey, PageSeoFields>;
  for (const key of SEO_PAGE_KEYS) {
    pages[key] = mergePageSeo(key, content?.pages?.[key]);
  }

  return {
    siteName: content?.siteName?.trim() || defaultSiteSeoSettings.siteName,
    siteUrl: content?.siteUrl?.trim() || "",
    defaultOgImage: content?.defaultOgImage?.trim() || "",
    pages,
  };
}

export function getPageSeoFields(
  settings: SiteSeoSettings,
  pageKey: SeoPageKey
): PageSeoFields {
  return settings.pages[pageKey];
}
