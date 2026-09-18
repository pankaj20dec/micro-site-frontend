import { LegalDocumentPage } from "@/components/common/LegalDocumentPage";
import { termsPageIntro, termsSections } from "@/lib/terms-content";

export function TermsPage() {
  return (
    <LegalDocumentPage
      titleId="terms-page-title"
      intro={termsPageIntro}
      sections={termsSections}
    />
  );
}
