import type { Metadata } from "next";
import { ExplanationsPage } from "@/components/common/ExplanationsPage";

export const metadata: Metadata = {
  title: "Explanations | FIPO Fair Pay Action Group",
  description:
    "A plain-English explanation of the Fair Pay Action Group claim — what is being claimed, the legal grounds, the process, and how to join.",
};

export default function ExplanationsRoute() {
  return <ExplanationsPage />;
}
