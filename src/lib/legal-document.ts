export type LegalListItem = {
  text: string;
  children?: readonly string[];
};

export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "h3"; text: string }
  | { type: "ol"; items: readonly (string | LegalListItem)[] }
  | { type: "ul"; items: readonly (string | LegalListItem)[] }
  | { type: "checks"; items: readonly string[] }
  | {
      type: "table";
      headers: readonly string[];
      rows: readonly (readonly string[])[];
      note?: string;
    }
  | { type: "note"; text: string };

export type LegalSection = {
  id: string;
  title: string;
  blocks: readonly LegalBlock[];
};

export type LegalDocumentIntro = {
  eyebrow: string;
  lastUpdated: string;
  documentVersion: string;
  nextReviewDate: string;
};
