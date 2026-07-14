import { defaultFaqPageContent } from "./faq-content-defaults";

export type FaqItem = {
  id: string;
  question: string;
  /** A single paragraph, or an array of paragraphs rendered as separate <p> blocks. */
  answer: string | readonly string[];
};

export const faqIntro = defaultFaqPageContent.intro;

export const faqItems: ReadonlyArray<FaqItem> = defaultFaqPageContent.items.map(
  (item) => ({
    id: item.id,
    question: item.question,
    answer: item.answerParagraphs,
  })
);

export const faqContact = defaultFaqPageContent.contact;
