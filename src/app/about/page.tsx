import type { Metadata } from "next";
import { AboutPage } from "@/components/common/AboutPage";

export const metadata: Metadata = {
  title: "About FIPO | FIPO Fair Pay Action Group",
  description:
    "Who FIPO is, why the Fair Pay Action Group exists, and why independent medical practitioners can trust our advocacy.",
};

export default function AboutRoute() {
  return <AboutPage />;
}
