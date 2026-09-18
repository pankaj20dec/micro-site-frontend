import { TermsPage } from "@/components/common/TermsPage";
import { getPageMetadata } from "@/lib/get-page-metadata";

export async function generateMetadata() {
  return getPageMetadata("terms");
}

export default function TermsRoute() {
  return <TermsPage />;
}
