import { ClaimPage } from "@/components/common/ClaimPage";
import { getPageMetadata } from "@/lib/get-page-metadata";

export async function generateMetadata() {
  return getPageMetadata("claim");
}

export default function ClaimRoute() {
  return <ClaimPage />;
}
