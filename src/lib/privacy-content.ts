export const privacyPageIntro = {
  eyebrow: "PRIVACY POLICY",
  lastUpdated: "17 September 2026",
  summary:
    "This notice explains how the Federation of Independent Practitioner Organisations (FIPO) collects, uses and looks after personal data on portal.fipo.uk.",
} as const;

export type PrivacySection = {
  id: string;
  title: string;
  paragraphs: string[];
  bullets?: string[];
  afterBullets?: string[];
};

export const privacySections: PrivacySection[] = [
  {
    id: "who-we-are",
    title: "1. Who we are",
    paragraphs: [
      "The data controller for this website and membership portal is the Federation of Independent Practitioner Organisations (FIPO), a company limited by guarantee registered in England and Wales (company number 4148752).",
      "Registered office: The Harley Building, 77-79 New Cavendish Street, London, W1W 6XB.",
      "For privacy questions, email office@fipo.uk. Enquiries about the legal claim may also be sent to fipo@harcusparker.co.uk.",
    ],
  },
  {
    id: "what-this-covers",
    title: "2. What this notice covers",
    paragraphs: [
      "This notice applies to visitors, people who contact us, and medical practitioners who create an account, pay a contribution, complete registration, verify their identity, or sign engagement documents through the portal.",
      "It does not cover third-party websites we link to (including Leadly, DocuSign, payment providers and Harcus Parker). Those services have their own privacy notices.",
    ],
  },
  {
    id: "data-we-collect",
    title: "3. Personal data we collect",
    paragraphs: ["Depending on how you use the site, we may collect:"],
    bullets: [
      "Identity and contact details: name, email address, phone number, postal address, and account login details (including Google sign-in if you choose it).",
      "Professional details: GMC or equivalent registration, specialty, practice information, and PMI / insurer information you provide (including AXA and Bupa year selections).",
      "Registration and claim documents: files you upload as evidence, and information needed to prepare engagement letters, a power of attorney and related legal documents.",
      "Identity verification data processed by Leadly, such as checks against official records. We do not keep copies of identity documents permanently.",
      "Payment records: amount paid, payment status, and provider references from Stripe or PayPal. We do not store full card numbers.",
      "E-signature data: signer and witness name, email, address, signature, and envelope status via DocuSign.",
      "Communications: messages sent through the contact form, and emails we send you (for example account, witness and welcome emails).",
      "Technical data: IP address, browser type, and cookies or similar technology needed to keep you signed in and run the site.",
    ],
  },
  {
    id: "how-we-use-data",
    title: "4. How we use your data",
    paragraphs: ["We use personal data to:"],
    bullets: [
      "create and administer your FIPO portal account;",
      "take membership or claim contributions and confirm payment;",
      "verify that participants are genuine medical practitioners;",
      "prepare and send legal engagement documents for electronic signature;",
      "share necessary information with Harcus Parker and counsel so they can act on the claim;",
      "email you about your account, signing steps, and the action group;",
      "answer enquiries and operate, secure and improve the website;",
      "meet legal, regulatory and professional obligations.",
    ],
    afterBullets: [
      "We rely on one or more of: taking steps to enter a contract with you and performing that contract; our legitimate interests in running the action group and preventing fraud; consent where we ask for it (for example identity verification); and legal obligation.",
    ],
  },
  {
    id: "who-we-share-with",
    title: "5. Who we share data with",
    paragraphs: [
      "We only share personal data where it is needed to run the portal and the claim. Recipients may include:",
    ],
    bullets: [
      "Harcus Parker LLP and instructed counsel, as solicitors and advisers on the claim.",
      "Leadly, for identity verification (see leadly.co.uk/privacy/privacy-policy).",
      "DocuSign, to send and store signed engagement documents.",
      "Stripe and PayPal, to process payments.",
      "Zoho, to send email from FIPO.",
      "DigitalOcean, which hosts the website, database and uploaded files.",
      "Google, if you sign in with Google.",
      "Professional advisers, insurers, or regulators where the law requires or permits it.",
    ],
    afterBullets: ["We do not sell your personal data."],
  },
  {
    id: "transfers",
    title: "6. International transfers",
    paragraphs: [
      "Some providers (including DocuSign, Google, Stripe and PayPal) may process data outside the UK. Where that happens, we use providers that apply appropriate safeguards, such as the UK Extension to the EU-US Data Privacy Framework or standard contractual clauses.",
    ],
  },
  {
    id: "retention",
    title: "7. How long we keep data",
    paragraphs: [
      "We keep personal data only for as long as we need it for the purposes above, including the life of the claim and any period we must keep records afterwards (for example legal, accounting or professional rules).",
      "Identity documents used in verification are not stored by FIPO permanently. Payment card details are held by the payment provider, not on our servers. Signed legal documents are retained as part of the claim file.",
    ],
  },
  {
    id: "security",
    title: "8. Security",
    paragraphs: [
      "We use technical and organisational measures to protect personal data, including encrypted connections (HTTPS), access controls for the portal and admin tools, and restricted hosting. No online service is completely secure. Please keep your password confidential.",
    ],
  },
  {
    id: "your-rights",
    title: "9. Your rights",
    paragraphs: [
      "Under UK GDPR you may have the right to access your data, correct it, delete it, restrict or object to certain processing, and ask for data portability. Where we rely on consent, you can withdraw it. That will not affect processing already carried out.",
      "To exercise these rights, email office@fipo.uk. You can also complain to the Information Commissioner's Office at ico.org.uk or 0303 123 1113.",
    ],
  },
  {
    id: "cookies",
    title: "10. Cookies and similar technology",
    paragraphs: [
      "We use cookies and similar storage that are necessary to operate the site, keep you signed in, and remember your progress through registration. We do not use advertising cookies on this portal.",
      "You can block cookies in your browser. If you do, some features (including staying logged in) may not work.",
    ],
  },
  {
    id: "children",
    title: "11. Children",
    paragraphs: [
      "This site is for medical practitioners joining the action group. It is not directed at children, and we do not knowingly collect data from anyone under 18.",
    ],
  },
  {
    id: "changes",
    title: "12. Changes to this notice",
    paragraphs: [
      "We may update this page when our practices or the law change. The last updated date at the top will change when we do. Please check this page from time to time.",
    ],
  },
];

export const privacyContact = {
  title: "13. How to contact us",
  intro:
    "To exercise your rights, or if you have a question about this notice, contact FIPO in the first instance.",
  emails: [
    { label: "Administrative enquiries", address: "office@fipo.uk" },
    { label: "Legal enquiries (Harcus Parker)", address: "fipo@harcusparker.co.uk" },
  ],
  phone: "020 7205 4166",
  icoLabel: "Information Commissioner’s Office",
  icoPhone: "0303 123 1113",
  icoUrl: "https://ico.org.uk/make-a-complaint/",
} as const;
