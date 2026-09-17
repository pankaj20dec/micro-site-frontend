import { PrivacyPage } from "@/components/common/PrivacyPage";
import { getPageMetadata } from "@/lib/get-page-metadata";

export async function generateMetadata() {
  return getPageMetadata("privacy");
}

export default function PrivacyRoute() {
  return <PrivacyPage />;
}
