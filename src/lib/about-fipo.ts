export type FipoDirector = {
  name: string;
  role: string;
};

/** FIPO firm block — Figma about page partners card */
export const fipoFirm = {
  name: "FIPO",
  linkedInHref: "https://www.linkedin.com/",
  linkedInLabel: "FIPO on LinkedIn",
  paragraphs: [
    "The Federation of Independent Practitioner Organisations (FIPO[SR25.1]) is a not-for-profit independent professional body dedicated to doctors, with charitable/professional (non-profit) objectives including the advancement of the practice of independent medical practitioners, the maintenance of professional and clinical standards, and the protection of the public interest in relation to private healthcare services.",
    "Since 2000, we have campaigned tirelessly for a private medical market that is fair, competitive, and properly regulated.",
  ],
  boardHeading: "Executive Board of Directors",
  directors: [
    { name: "Mr. Richard Packard", role: "Chairman" },
    { name: "Mr. Ian McDermott", role: "Vice Chairman" },
    { name: "Mr. Charlie Chan", role: "Vice Chairman" },
    { name: "Ms. Rosemary Hittinger", role: "Board Member" },
  ] satisfies readonly FipoDirector[],
} as const;
