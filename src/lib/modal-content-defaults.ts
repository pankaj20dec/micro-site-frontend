export const defaultSiteDisclaimer: SiteDisclaimerContent = {
  title: "Welcome To The FIPO Fair Pay Action Group Case Site",
  paragraphs: [
    "This website provides information about collective legal action against private medical insurers. It is intended only for medical practitioners who may be eligible to participate.",
    "By proceeding, you confirm that you are a registered medical practitioner who has provided services under private medical insurance arrangements.",
    "The information on this site is provided for potential claimants only. If you are employed by or represent either of the defendant Insurance companies BUPA Insurance Limited or AXA PPP, you should not proceed beyond this page.",
    "Detailed legal documents and case materials available to registered members are legally privileged and confidential to the litigation.",
  ],
  exitButtonLabel: "Exit",
  confirmButtonLabel: "I Confirm & Proceed",
  exitUrl: "https://www.google.com",
};

export type SiteDisclaimerContent = {
  title: string;
  paragraphs: string[];
  exitButtonLabel: string;
  confirmButtonLabel: string;
  exitUrl: string;
};

export type RegisterDisclaimerContent = {
  title: string;
  paragraphs: string[];
  competitionLaw: {
    title: string;
    paragraphs: string[];
  };
  exitButtonLabel: string;
  confirmButtonLabel: string;
  exitUrl: string;
};

export const defaultRegisterDisclaimer: RegisterDisclaimerContent = {
  title: "The FIPO Fair Pay Action Group",
  paragraphs: [
    "FIPO is bringing a collective legal claim against Bupa and AXA PPP. We believe their conduct has suppressed consultants' fees in breach of a range of related legal areas including competition law, and that consultants who have treated PMI patients are entitled to compensation.",
    "Joining is straightforward. You pay a subscription of £250 or £500, provide basic information about your private practice, and authorise FIPO to run the claim on your behalf. If the claim succeeds, you receive a proportionate share of any damages.",
    "We cannot guarantee the outcome — no litigation comes with that promise. But the case is well-founded, the legal and economics team is strong and experienced, and the evidence of harm to the profession is substantial. More importantly for the future, the claim will seek the return of patient choice of consultant, the ability of doctors to set their own fees and the return of the doctor patient relationship which has been lost.",
    "Please read the [Explanations] section before signing. Detailed FAQs provide more information.",
    'By pressing "Continue" you will be taken through the steps required to join the action.',
  ],
  competitionLaw: {
    title: "A Note on Competition Law",
    paragraphs: [
      "FIPO takes competition law seriously — it is, after all, at the heart of this claim. Before proceeding, please note the following.",
      "Joining the Fair Pay Action Group is an individual decision. It does not involve, and must not involve, any agreement, understanding or coordination between practitioners regarding their own fees, the terms on which they accept or decline patients, or any other aspect of their commercial conduct. The decision of a practitioner on whether to join the action should be taken independently, based on their own assessment of their own circumstances.",
      "FIPO's role is limited to running the collective legal claim on claimants' behalf, as described in this site. It does not coordinate, advise on, or facilitate any commercial arrangements between claimants, and those considering or joining the action should not treat their participation in this action as a basis for discussing or aligning their pricing or commercial practices with one another.",
      "If you have any concerns about how competition law applies to your own practice, you should seek independent legal advice.",
    ],
  },
  exitButtonLabel: "Exit",
  confirmButtonLabel: "I Confirm & Proceed",
  exitUrl: "/",
};

/** @deprecated Use defaultRegisterDisclaimer from modal-content defaults */
export const registerIntroContent = defaultRegisterDisclaimer;
