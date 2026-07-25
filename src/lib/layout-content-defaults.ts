export type QuickLink = {
  label: string;
  href: string;
};

export type SiteHeaderContent = {
  ctaLabel: string;
  ctaHref: string;
  navLinks: QuickLink[];
};

export type AuthHeaderContent = {
  email: string;
  helpline: string;
  helplineHours: string;
  faqLabel: string;
  faqHref: string;
};

export type SiteFooterContent = {
  contactCardLabel: string;
  contactCardEmail: string;
  quickLinksTitle: string;
  quickLinks: QuickLink[];
  contactInfoTitle: string;
  contactEmail: string;
  contactPhone: string;
  addressLines: string[];
  legalLine1: string;
  legalLine2: string;
  partnerUrl: string;
};

export type SiteLayoutContent = {
  siteHeader: SiteHeaderContent;
  authHeader: AuthHeaderContent;
  siteFooter: SiteFooterContent;
};

export const defaultSiteHeader: SiteHeaderContent = {
  ctaLabel: "Join the Claim",
  ctaHref: "/login",
  navLinks: [
    { label: "The Claim", href: "/" },
    { label: "Explanations", href: "/explanations" },
    { label: "FAQs", href: "/faq" },
    { label: "About us", href: "/about" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact" },
    { label: "Login", href: "/login" },
  ],
};

export const defaultAuthHeader: AuthHeaderContent = {
  email: "fipo@harcusparker.co.uk",
  helpline: "020 7205 4166",
  helplineHours: "(Mon-Fri 9am-5pm)",
  faqLabel: "Visit FAQs",
  faqHref: "/faq",
};

export const defaultSiteFooter: SiteFooterContent = {
  contactCardLabel: "Contact Us",
  contactCardEmail: "office@fipo.uk",
  quickLinksTitle: "Quick Links",
  quickLinks: [
    { label: "The Claim", href: "/" },
    { label: "Explanations", href: "/explanations" },
    { label: "FAQs", href: "/faq" },
    { label: "About us", href: "/about" },
    { label: "News", href: "/news" },
    { label: "Contact", href: "/contact" },
    { label: "Login", href: "/login" },
  ],
  contactInfoTitle: "Contact Info",
  contactEmail: "fipo@harcusparker.co.uk",
  contactPhone: "020 7205 4166",
  addressLines: [
    "The Harley Building",
    "77-79 New Cavendish Street",
    "London",
    "W1W 6XB",
  ],
  legalLine1:
    "The Federation of Independent Practitioner Organisations is a company limited by guarantee, registered in England number 4148752.",
  legalLine2:
    "Registered office: The Harley Building, 77-79 New Cavendish Street, London, W1W 6XB.",
  partnerUrl: "https://harcusparker.co.uk",
};

export const defaultSiteLayout: SiteLayoutContent = {
  siteHeader: defaultSiteHeader,
  authHeader: defaultAuthHeader,
  siteFooter: defaultSiteFooter,
};

export function mergeSiteHeader(
  header: Partial<SiteHeaderContent> | null | undefined
): SiteHeaderContent {
  const navLinks =
    header?.navLinks
      ?.map((link) => ({
        label: link.label.trim(),
        href: link.href.trim(),
      }))
      .filter((link) => link.label && link.href) ?? [];

  return {
    ctaLabel: header?.ctaLabel?.trim() || defaultSiteHeader.ctaLabel,
    ctaHref: header?.ctaHref?.trim() || defaultSiteHeader.ctaHref,
    navLinks: navLinks.length > 0 ? navLinks : defaultSiteHeader.navLinks,
  };
}
