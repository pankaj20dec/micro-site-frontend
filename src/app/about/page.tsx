import { AboutPage } from "@/components/common/AboutPage";
import { getPageMetadata } from "@/lib/get-page-metadata";

export async function generateMetadata() {
  return getPageMetadata("about");
}

export default function AboutRoute() {
  return <AboutPage />;
}
