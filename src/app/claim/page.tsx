import type { Metadata } from "next";
import { ClaimPage } from "@/components/common/ClaimPage";

export const metadata: Metadata = {
  title: "The Claim | FIPO",
  description:
    "Learn why FIPO is bringing this Claim against Bupa and AXA PPP, what it seeks to achieve, and how to join the action group.",
};

export default function ClaimRoute() {
  return <ClaimPage />;
}
