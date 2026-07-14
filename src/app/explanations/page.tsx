import { ExplanationsPage } from "@/components/common/ExplanationsPage";
import { getPageMetadata } from "@/lib/get-page-metadata";

export async function generateMetadata() {
  return getPageMetadata("explanations");
}

export default function ExplanationsRoute() {
  return <ExplanationsPage />;
}
