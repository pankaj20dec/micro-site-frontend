import { LegalDocumentPage } from "@/components/common/LegalDocumentPage";
import { privacyPageIntro, privacySections } from "@/lib/privacy-content";

export function PrivacyPage() {
  return (
    <LegalDocumentPage
      titleId="privacy-page-title"
      intro={privacyPageIntro}
      sections={privacySections}
    />
  );
}
