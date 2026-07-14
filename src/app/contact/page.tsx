import { ContactPage } from "@/components/common/ContactPage";
import { getPageMetadata } from "@/lib/get-page-metadata";

export async function generateMetadata() {
  return getPageMetadata("contact");
}

export default function ContactRoute() {
  return <ContactPage />;
}
