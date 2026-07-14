import { getPageMetadata } from "@/lib/get-page-metadata";

export async function generateMetadata() {
  return getPageMetadata("register");
}

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
