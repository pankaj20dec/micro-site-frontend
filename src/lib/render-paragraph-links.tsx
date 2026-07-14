import Link from "next/link";
import type { ReactNode } from "react";

const EXPLANATIONS_TOKEN = "[Explanations]";
const REGISTER_PURPLE = "#660066";

export function renderParagraphWithLinks(text: string, linkColor = REGISTER_PURPLE): ReactNode {
  if (!text.includes(EXPLANATIONS_TOKEN)) return text;

  const parts = text.split(EXPLANATIONS_TOKEN);
  return parts.map((part, index) => (
    <span key={`${part}-${index}`}>
      {part}
      {index < parts.length - 1 && (
        <Link href="/explanations" className="font-medium underline" style={{ color: linkColor }}>
          Explanations
        </Link>
      )}
    </span>
  ));
}
