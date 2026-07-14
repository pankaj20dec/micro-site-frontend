import type { PageDoc } from "./api";

/**
 * Static fallback news articles — shown when the CMS API is unavailable.
 * Images are served from Unsplash (already in next.config.ts remotePatterns).
 */
export const staticNewsArticles: PageDoc[] = [
  {
    id: "static-1",
    slug: "phin-agm-promises-clearer-information-for-private-healthcare",
    title: "PHIN AGM promises clearer information for private healthcare",
    excerpt:
      "FIPO attended the Private Healthcare Information Network (PHIN) AGM at which it was reported it is on track to deliver its transparency programme to the satisfaction of the CMA by June 2026. In simple terms, this means patients will be able to see clear, comparable information about private healthcare costs.",
    featuredImage:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&q=80",
    category: "Health Awareness",
    publishedAt: "2026-04-22T00:00:00.000Z",
    published: true,
    body: `FIPO attended the Private Healthcare Information Network (PHIN) AGM at which it was reported it is on track to deliver its Transparency Programme to the satisfaction of the CMA by June 2026.

In simple terms, this means patients will be able to see clear, comparable information about private healthcare costs across providers.

The Transparency Programme is a key initiative aimed at enabling patients to make informed decisions about their healthcare. By providing standardised, accessible data, patients will be better placed to compare consultants and treatment options.

FIPO continues to engage with PHIN and the CMA to ensure that transparency measures genuinely serve patients and practitioners alike.`,
  },
  {
    id: "static-2",
    slug: "fipo-briefs-boa-annual-congress",
    title: "FIPO briefs BOA annual congress",
    excerpt:
      "Invited to address the British Orthopaedic Association's annual congress in Liverpool, FIPO Vice Chairman Charlie Chan highlighted concerns about the impact of private medical insurance practices on consultants and patients, giving rise to restrictions on patient choice. He outlined FIPO's position on fee suppression.",
    featuredImage:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
    category: "Doctor Insights",
    publishedAt: "2026-04-22T00:00:00.000Z",
    published: true,
    body: `Invited to address the British Orthopaedic Association's Annual Congress in Liverpool, FIPO Vice Chairman Charlie Chan highlighted concerns about the impact of Private Medical Insurance practices on consultants and patients, giving rise to restrictions on patient choice.

He outlined FIPO's view that the current PMI fee-setting model suppresses consultant earnings while simultaneously reducing patient access to their preferred specialist.

FIPO's engagement with the BOA reflects the breadth of medical specialties affected by these practices and the growing consensus that reform is overdue.

The BOA represents over 4,000 orthopaedic surgeons and trainees across the UK, making this a significant opportunity to build awareness of the ongoing competition law action.`,
  },
  {
    id: "static-3",
    slug: "fipo-challenges-market-distortions-in-private-healthcare",
    title: "FIPO challenges market distortions in private healthcare",
    excerpt:
      "FIPO has met with the Competition and Markets Authority (CMA) to raise serious concerns that the private healthcare market is no longer operating as the CMA intended when it introduced the private healthcare market investigation order in 2014. As private healthcare becomes increasingly concentrated, practitioners face mounting pressure.",
    featuredImage:
      "https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80",
    category: "Healthcare Policies",
    publishedAt: "2026-04-22T00:00:00.000Z",
    published: true,
    body: `FIPO has met with the Competition and Markets Authority (CMA) to raise serious concerns that the private healthcare market is no longer operating as the CMA intended when it introduced the private healthcare market investigation order in 2014.

As private healthcare becomes increasingly dominated by a small number of insurers, practitioners are facing mounting pressure on their fees and clinical freedom.

FIPO presented evidence to the CMA demonstrating that market distortions have worsened since 2014, with insurers continuing to impose restrictions that limit both practitioner autonomy and patient choice.

FIPO is calling on the CMA to review the effectiveness of the existing Market Investigation Order and to consider whether further regulatory action is required to restore competition in the sector.`,
  },
  {
    id: "static-4",
    slug: "fipo-position-statement-november-2023",
    title: "FIPO position statement November 2023",
    excerpt:
      "In the light of recent events in the independent healthcare sector, it seemed appropriate to highlight FIPO's role. FIPO is a Federation comprising the majority of the medical professional associations in the UK with a private practice committee, and is the senior body for specialists in the independent sector.",
    featuredImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80",
    category: "Fair Pay / Industry Issues",
    publishedAt: "2023-11-01T00:00:00.000Z",
    published: true,
    body: `In the light of recent events in the independent healthcare sector, it seemed appropriate to highlight FIPO's role.

FIPO is a Federation comprising the majority of the Medical Professional Associations in the UK with a Private Practice Committee. FIPO is the senior body for specialists providing their medical services within the independent sector.

FIPO exists to represent and protect the interests of independent practitioners and, through them, the interests of patients.

FIPO's member associations collectively represent tens of thousands of consultants across all specialties. This makes FIPO uniquely placed to speak on behalf of the profession on matters affecting private practice.

As events continue to unfold in the independent healthcare sector, FIPO is actively engaged with regulators, insurers, and government to ensure that the interests of practitioners and patients are properly represented.`,
  },
];
