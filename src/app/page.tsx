import { HomePage } from "@/components/common/HomePage";
import { getPageMetadata } from "@/lib/get-page-metadata";

export async function generateMetadata() {
  return getPageMetadata("home");
}

export default function Home() {
  return <HomePage />;
}
