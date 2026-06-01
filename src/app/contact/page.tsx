import type { Metadata } from "next";
import { ContactPage } from "@/components/common/ContactPage";

export const metadata: Metadata = {
  title: "Contact | FIPO Fair Pay Action Group",
  description:
    "Contact FIPO and the legal team at Harcus Parker — address, phone, email, and a direct message form.",
};

export default function ContactRoute() {
  return <ContactPage />;
}
