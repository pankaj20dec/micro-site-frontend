import type { Metadata } from "next";
import { FaqPage } from "@/components/common/FaqPage";

export const metadata: Metadata = {
  title: "FAQs | FIPO Fair Pay Action Group",
  description:
    "Answers to common questions about FIPO, the Fair Pay Action Group and joining the legal claim led by Harcus Parker.",
};

export default function FaqRoute() {
  return <FaqPage />;
}
