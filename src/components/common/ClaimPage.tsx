import { ClaimSection } from "./ClaimSection";
import { ActionJoinSection } from "./ActionJoinSection";
import { FeesSection } from "./FeesSection";

export function ClaimPage() {
  return (
    <div className="bg-white">
      <ClaimSection />
      <ActionJoinSection />
      <FeesSection />
    </div>
  );
}
