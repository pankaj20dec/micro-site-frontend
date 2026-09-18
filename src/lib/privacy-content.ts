import type { LegalBlock, LegalListItem, LegalSection } from "./legal-document";

export const privacyPageIntro = {
  eyebrow: "PRIVACY POLICY",
  lastUpdated: "18 September 2026",
  documentVersion: "1.0",
  nextReviewDate: "18 September 2027",
} as const;

export type PrivacyListItem = LegalListItem;
export type PrivacyBlock = LegalBlock;
export type PrivacySection = LegalSection;

export const privacySections: readonly PrivacySection[] = [
  {
    id: "introduction",
    title: "1. INTRODUCTION",
    blocks: [
      {
        type: "p",
        text: "1.1 This Privacy Notice explains how the Federation of Independent Practitioner Organisations (“**we**”, “**us**”, “**our**”, or the “**Federation**”) collects, uses, stores, and protects your personal information when you use our litigation funding and registration platform at fipo.uk (the “**Website**”).",
      },
      {
        type: "p",
        text: "1.2 We are committed to protecting your privacy and complying with data protection laws, including the UK General Data Protection Regulation (“**UK GDPR**”) and the Data Protection Act 2018.",
      },
      {
        type: "p",
        text: "1.3 **Please read this Privacy Notice carefully** before providing any personal information through our Website. By using our Website and providing your information, you acknowledge that you have read and understood this Privacy Notice.",
      },
    ],
  },
  {
    id: "who-we-are",
    title: "2. WHO WE ARE",
    blocks: [
      {
        type: "p",
        text: "2.1 **Data Controller:**\nFederation of Independent Practitioner Organisations\nCompany Number: 4148752\nRegistered Office: 2 St Marys Road, Tonbridge, Kent TN9 2LB\nEmail: [office@fipo.uk](mailto:office@fipo.uk)\nTelephone: [020 7205 4166](tel:+442072054166)",
      },
      {
        type: "p",
        text: "2.2 We are the data controller for the personal information you provide through this Website. This means we are responsible for deciding how we hold and use your personal information.",
      },
      {
        type: "p",
        text: "2.3 **Data Protection Officer:**\nData Protection Officer\nEmail: [office@fipo.uk](mailto:office@fipo.uk)\nAddress: 2 St Marys Road, Tonbridge, Kent TN9 2LB",
      },
      {
        type: "p",
        text: "2.4 You can contact our Data Protection Officer if you have any questions about this Privacy Notice or how we handle your personal information.",
      },
    ],
  },
  {
    id: "what-we-collect",
    title: "3. WHAT PERSONAL INFORMATION WE COLLECT",
    blocks: [
      {
        type: "p",
        text: "We collect and process the following categories of personal information:",
      },
      { type: "h3", text: "3.1 Registration and Account Information" },
      {
        type: "p",
        text: "When you register for an account on our Website, we collect:",
      },
      {
        type: "ol",
        items: [
          "Full name",
          "Email address",
          "Telephone number (mobile and/or landline)",
          "Practice address(es)",
          "GMC (General Medical Council) registration number",
          "Professional qualification details",
          "Specialty and sub-specialty",
          "Professional organisation membership details",
          "Username and password (password stored in encrypted form only)",
        ],
      },
      { type: "h3", text: "3.2 Professional Practice Information" },
      {
        type: "p",
        text: "To assess eligibility and calculate potential damages, we collect:",
      },
      {
        type: "ol",
        items: [
          "Years qualified and in practice",
          "Current employment status (NHS/private/mixed)",
          "Private Medical Insurance (PMI) provider relationships",
          "Approximate percentage of income from PMI work",
          "Practice size and patient volume (approximate)",
          "Geographic location of practice",
          "Specialisation and service types offered",
          "Estimated annual income ranges (optional)",
          "Estimated financial losses from PMI restrictions",
        ],
      },
      { type: "h3", text: "3.3 Financial Information" },
      {
        type: "p",
        text: "For litigation funding contributions, we collect:",
      },
      {
        type: "ol",
        items: [
          "Payment method selection (PayPal, BACS Direct Debit)",
          "Payment confirmation details",
          "Contribution amount",
          "Payment date and status",
        ],
      },
      {
        type: "p",
        text: "**Important:** We do NOT store complete credit card or bank account numbers. Payment processing is handled by secure third-party payment processors (PayPal, Stripe) who maintain their own secure systems. We receive only transaction confirmation details.",
      },
      { type: "h3", text: "3.4 Uploaded Documents" },
      {
        type: "p",
        text: "You may upload the following documents to our Website:",
      },
      {
        type: "ol",
        items: [
          "Proof of identity (passport, driving licence, other photo ID)",
          "GMC registration certificate",
          "Signed Deed of Assignment with witness details",
          "Witness identification documents",
          "Professional organisation membership certificates",
          "PMI provider agreements and contracts",
          "Fee schedules and payment records",
          "Correspondence with PMI providers",
          "Practice income evidence (tax returns, accounts – optional)",
          "Other supporting documentation",
        ],
      },
      {
        type: "p",
        text: "**Legal Professional Privilege:** Some documents you upload may be legally privileged communications with solicitors. We treat all uploaded documents as potentially privileged and maintain appropriate confidentiality safeguards.",
      },
      { type: "h3", text: "3.5 Identity Verification Information" },
      {
        type: "p",
        text: "To verify your identity and professional credentials:",
      },
      {
        type: "ol",
        items: [
          "GMC Register verification results",
          "Professional registration status checks",
          "Referral code information (linked to affiliated organisation)",
          "IP address at time of registration",
          "Device information (browser type, operating system)",
        ],
      },
      { type: "h3", text: "3.6 Legal Documents and Consents" },
      {
        type: "ol",
        items: [
          "Executed Deed of Assignment (with electronic signature)",
          "Witness details for Deed execution",
          "Consent records (to assignment, data processing, participation)",
          "Acknowledgments of terms and conditions",
          "Tax implications acknowledgments",
          "Litigation participation agreements",
        ],
      },
      { type: "h3", text: "3.7 Communication Records" },
      {
        type: "ol",
        items: [
          "Email correspondence with you",
          "Support queries and responses",
          "Telephone call records (if you contact us)",
          "Messages sent through the Website",
          "Notification preferences",
        ],
      },
      { type: "h3", text: "3.8 Website Usage Information" },
      {
        type: "p",
        text: "3.9 We automatically collect certain information when you visit our Website:",
      },
      {
        type: "ol",
        items: [
          "IP address",
          "Browser type and version",
          "Operating system",
          "Pages visited and time spent",
          "Date and time of access",
          "Device type (desktop, mobile, tablet)",
          "Clickstream data",
        ],
      },
      { type: "h3", text: "3.10 Cookies and Similar Technologies" },
      {
        type: "p",
        text: "We use cookies and similar tracking technologies. See Section 12 for detailed information about our cookie practices.",
      },
    ],
  },
  {
    id: "how-we-collect",
    title: "4. HOW WE COLLECT YOUR INFORMATION",
    blocks: [
      { type: "p", text: "We collect personal information through:" },
      { type: "h3", text: "4.1 Direct Provision" },
      {
        type: "p",
        text: "Information you provide directly when you:",
      },
      {
        type: "ol",
        items: [
          "Register for an account",
          "Complete registration forms",
          "Upload documents",
          "Execute the Deed of Assignment electronically",
          "Make payment contributions",
          "Contact us via email, phone, or contact forms",
          "Update your account or preferences",
        ],
      },
      { type: "h3", text: "4.2 Automated Collection" },
      {
        type: "p",
        text: "Information collected automatically when you:",
      },
      {
        type: "ol",
        items: [
          "Visit our Website (usage data, cookies)",
          "Navigate through pages",
          "Download documents or forms",
        ],
      },
      { type: "h3", text: "4.3 Third-Party Sources" },
      { type: "p", text: "Information we receive from:" },
      {
        type: "ol",
        items: [
          "**GMC Register:** Professional registration verification",
          "**Payment processors:** Payment confirmation (PayPal, Stripe)",
          "**Professional organisations:** Membership verification (with your consent)",
          "**Our legal advisors:** Case-related information",
          "**Referral organisations:** Confirmation of legitimate referral codes",
        ],
      },
      { type: "h3", text: "4.4 Public Sources" },
      {
        type: "ol",
        items: [
          "GMC Register (publicly available professional registration data)",
          "Professional directory listings (where applicable)",
        ],
      },
    ],
  },
  {
    id: "legal-basis",
    title: "5. LEGAL BASIS FOR PROCESSING YOUR INFORMATION",
    blocks: [
      {
        type: "p",
        text: "Under UK GDPR, we must have a lawful basis to process your personal information. We rely on the following legal bases:",
      },
      { type: "h3", text: "5.1 Contract (Article 6(1)(b))" },
      {
        type: "ol",
        items: [
          "Processing necessary for the performance of a contract with you, specifically:",
          "Managing your registration and account",
          "Processing your assignment of legal claims to the Federation",
          "Managing your participation in collective litigation",
          "Processing your contribution payments",
          "Providing access to your account dashboard",
        ],
      },
      { type: "h3", text: "5.2 Legal Obligation (Article 6(1)(c))" },
      {
        type: "p",
        text: "Processing necessary to comply with legal obligations, including:",
      },
      {
        type: "ol",
        items: [
          "Financial record-keeping requirements",
          "Tax reporting obligations",
          "Anti-money laundering checks",
          "Court orders or regulatory requirements",
          "Disclosure obligations in litigation",
        ],
      },
      { type: "h3", text: "5.3 Legitimate Interests (Article 6(1)(f))" },
      {
        type: "p",
        text: "Processing necessary for our legitimate interests or those of a third party, including:",
      },
      {
        type: "ol",
        items: [
          "Fraud prevention and detection",
          "Network and information security",
          "Enforcing our legal rights",
          "Managing and administering the litigation effectively",
          "Improving our Website and services",
          "Communicating about the litigation progress",
        ],
      },
      {
        type: "p",
        text: "**Balancing Test:** We have carefully balanced our legitimate interests against your rights and freedoms. We only rely on legitimate interests where your rights do not override our interests.",
      },
      { type: "h3", text: "5.4 Consent (Article 6(1)(a))" },
      {
        type: "p",
        text: "Where we rely on your consent, you have the right to withdraw consent at any time. We rely on consent for:",
      },
      {
        type: "ol",
        items: [
          "Non-essential cookies and analytics",
          "Marketing communications (if any – we do not currently send marketing)",
          "Sharing information beyond litigation requirements",
          "Optional data processing activities",
        ],
      },
      {
        type: "h3",
        text: "5.5 Legal Claims (Article 9(2)(f) for Special Category Data)",
      },
      {
        type: "p",
        text: "For special category data (if any is inadvertently collected), we may rely on:",
      },
      {
        type: "ol",
        items: [
          "Establishment, exercise, or defence of legal claims",
          "Substantial public interest (Article 9(2)(g))",
        ],
      },
      {
        type: "p",
        text: "**Special Category Data:** We do not intentionally collect special category data (health data, racial/ethnic origin, political opinions, religious beliefs, etc.). If such data is inadvertently included in documents you upload, we process it only to the extent necessary for the litigation.",
      },
    ],
  },
  {
    id: "how-we-use",
    title: "6. HOW WE USE YOUR INFORMATION",
    blocks: [
      { type: "h3", text: "6.1 Litigation Purposes" },
      { type: "p", text: "We use your information to:" },
      {
        type: "ol",
        items: [
          "Assess your eligibility to participate in the litigation",
          "Verify your professional credentials and identity",
          "Process your assignment of claims via Deed of Assignment",
          "Calculate your potential individual damages",
          "Prepare evidence for court proceedings",
          "Instruct expert witnesses",
          "Communicate with defendants",
          "Distribute damages if litigation is successful",
          "Manage settlement negotiations",
        ],
      },
      { type: "h3", text: "6.2 Financial Management" },
      { type: "p", text: "We use your information to:" },
      {
        type: "ol",
        items: [
          "Process contribution payments",
          "Track funding threshold progress",
          "Manage trust accounting obligations",
          "Process refunds if minimum threshold not reached",
          "Calculate cost recovery and distribution ratios",
          "Provide financial reports to solicitors and auditors",
          "Comply with tax reporting requirements",
        ],
      },
      { type: "h3", text: "6.3 Website and Account Management" },
      { type: "p", text: "We use your information to:" },
      {
        type: "ol",
        items: [
          "Create and manage your user account",
          "Provide access to secure member areas",
          "Authenticate your identity when you log in",
          "Send account-related notifications",
          "Respond to your queries and support requests",
          "Improve Website functionality and user experience",
        ],
      },
      { type: "h3", text: "6.4 Communication" },
      { type: "p", text: "We use your information to:" },
      {
        type: "ol",
        items: [
          "Send important updates about the litigation",
          "Notify you of required actions or documents",
          "Respond to your inquiries",
          "Provide litigation progress reports",
          "Send confirmation emails (registration, payment, document uploads)",
          "Notify you of changes to terms or policies",
        ],
      },
      {
        type: "p",
        text: "**Marketing:** We do NOT use your information for marketing purposes. All communications relate to the litigation or your account.",
      },
      { type: "h3", text: "6.5 Verification and Fraud Prevention" },
      { type: "p", text: "We use your information to:" },
      {
        type: "ol",
        items: [
          "Verify your GMC registration and professional status",
          "Validate referral codes",
          "Detect duplicate or fraudulent registrations",
          "Prevent unauthorised access to the Website",
          "Protect against cyber attacks and security breaches",
          "Monitor for suspicious activity",
        ],
      },
      { type: "h3", text: "6.6 Legal and Regulatory Compliance" },
      { type: "p", text: "We use your information to:" },
      {
        type: "ol",
        items: [
          "Comply with court orders and legal obligations",
          "Respond to regulatory inquiries",
          "Maintain audit trails",
          "Respond to Solicitors Regulation (“**SRA**”) inquiries and requirements (in consultation with our legal advisors)",
          "Meet data protection obligations",
          "Defend legal claims",
        ],
      },
      { type: "h3", text: "6.7 Analysis and Improvement" },
      {
        type: "p",
        text: "We use aggregated or anonymised information to:",
      },
      {
        type: "p",
        text: "Analyse registration trends and patterns",
      },
      {
        type: "ol",
        items: [
          "Improve Website functionality",
          "Identify technical issues",
          "Optimise user experience",
          "Assess litigation participation demographics",
        ],
      },
    ],
  },
  {
    id: "who-we-share-with",
    title: "7. WHO WE SHARE YOUR INFORMATION WITH",
    blocks: [
      {
        type: "p",
        text: "We share your personal information only when necessary and with appropriate safeguards.",
      },
      {
        type: "p",
        text: "Information you provide through this portal will be shared with Harcus Parker, the solicitors acting in the claims, and with counsel and expert economists instructed in connection with those claims. All recipients are bound by legal professional privilege and applicable data protection obligations. Your information will be used solely for the purpose of pursuing the claims on your behalf.",
      },
      { type: "h3", text: "7.1 Legal Advisors" },
      {
        type: "p",
        text: "**Who:** Harcus Parker and instructed barristers\n**Why:** To prosecute the litigation on your behalf\n**What:** All information necessary for legal representation including registration details, financial information, uploaded documents, and damages calculations\n**Safeguards:** Professional legal privilege protects communications; solicitors bound by SRA rules and confidentiality obligations",
      },
      { type: "h3", text: "7.2 Expert Witnesses" },
      {
        type: "p",
        text: "**Who:** Economic experts, industry experts, and other expert witnesses\n**Why:** To prepare expert evidence for court proceedings\n**What:** Professional practice information, financial data, market analysis data (typically anonymised or pseudonymised where possible)\n**Safeguards:** Expert witness confidentiality obligations; non-disclosure agreements",
      },
      { type: "h3", text: "7.3 The Court and Defendants" },
      {
        type: "p",
        text: "**Who:** High Court of Justice, defendant insurance companies, and their legal representatives\n**Why:** Court disclosure obligations in litigation\n**What:** Information relevant to the legal claims, as required by court rules and orders\n**Safeguards:** Court rules govern disclosure; confidentiality orders may protect sensitive information; redaction of irrelevant personal data",
      },
      {
        type: "p",
        text: "**Important:** Once litigation commences, some of your information will become part of court proceedings and may be disclosed to defendants and potentially become public record. We will minimise disclosure to what is legally required and seek protective orders where appropriate.",
      },
      { type: "h3", text: "7.4 Payment Processors" },
      {
        type: "p",
        text: "**Who:** PayPal, Stripe\n**Why:** To process contribution payments\n**What:** Payment transaction details (they collect payment card/bank details directly, not through us)\n**Safeguards:** Payment processors are PCI DSS compliant and have their own privacy policies",
      },
      { type: "h3", text: "7.5 IT Service Providers" },
      {
        type: "p",
        text: "**Who:** Website hosting provider, email service provider, backup services, security services\n**Why:** To operate and secure the Website\n**What:** Technical access to database and systems (minimal personal information access)\n**Safeguards:** Data Processing Agreements, confidentiality obligations, security standards (ISO 27001 or equivalent)",
      },
      { type: "h3", text: "7.6 Professional Verification Services" },
      {
        type: "p",
        text: "**Who:** GMC Register database provider, identity verification services (if used)\n**Why:** To verify your professional credentials and identity\n**What:** GMC number, name, date of birth (for identity checks)\n**Safeguards:** Data Processing Agreements, limited purpose use",
      },
      { type: "h3", text: "7.7 Accountants and Auditors" },
      {
        type: "p",
        text: "**Who:** Federation’s accountants and auditors\n**Why:** Financial reporting, tax compliance, audit requirements\n**What:** Financial contribution records, trust accounting data\n**Safeguards:** Professional confidentiality obligations",
      },
      { type: "h3", text: "7.8 Regulatory Authorities" },
      {
        type: "p",
        text: "**Who:** Information Commissioner’s Office (ICO), Solicitors Regulation Authority\n**Why:** Compliance with legal and regulatory obligations\n**What:** Information requested in formal inquiries or investigations\n**Safeguards:** Legal obligations limit sharing to what is required",
      },
      { type: "h3", text: "7.9 Law Enforcement" },
      {
        type: "p",
        text: "**Who:** Police, fraud investigators, court orders\n**Why:** Legal obligation to comply with lawful requests\n**What:** Information specified in warrant, court order, or statutory requirement\n**Safeguards:** We verify legitimacy of requests and provide only what is legally required",
      },
      { type: "h3", text: "7.10 Referral Organisations" },
      {
        type: "p",
        text: "**Who:** Professional organisations that issued referral codes\n**Why:** To verify legitimate use of referral codes and provide participation statistics\n**What:** Confirmation that member used their code (typically anonymised statistics)\n**Safeguards:** Data Processing Agreements, limited information sharing",
      },
      { type: "h3", text: "7.11 Other Participants (limited)" },
      {
        type: "p",
        text: "**Who:** Other litigation participants\n**Why:** Collective action coordination (if necessary)\n**What:** Minimal information (typically just number of participants, not individual identities)\n**Safeguards:** Aggregated/anonymised data only; individual identities protected",
      },
      { type: "p", text: "**We do NOT:**" },
      {
        type: "ol",
        items: [
          "Sell your personal information to third parties",
          "Share your information for marketing purposes",
          "Provide your information to data brokers",
          "Use your information for purposes unrelated to the litigation",
        ],
      },
    ],
  },
  {
    id: "international-transfers",
    title: "8. INTERNATIONAL TRANSFERS",
    blocks: [
      {
        type: "p",
        text: "8.1 **UK-Based Processing:** We process your personal information primarily within the United Kingdom.",
      },
      {
        type: "p",
        text: "8.2 **Limited International Transfers:** Some service providers may process data outside the UK/EEA, including:",
      },
      {
        type: "ol",
        items: [
          "**Cloud storage providers** (e.g., AWS, Google Cloud) – may have servers globally",
          "**Payment processors** (PayPal, Stripe) – US-based companies with global operations",
          "**Email services** – may route through international servers.",
        ],
      },
      {
        type: "p",
        text: "8.3 **Safeguards for International Transfers:** Where we transfer personal information outside the UK, we ensure appropriate safeguards including:",
      },
      {
        type: "ol",
        items: [
          "**Adequacy Decisions:** Transfers to countries with UK adequacy decisions (e.g., EEA countries, specific approved countries)",
          "**Standard Contractual Clauses:** EU Commission approved contracts between us and the recipient",
          "**UK International Data Transfer Agreement:** ICO-approved transfer agreements",
          "**Service Provider Certifications:** Processors certified under recognised frameworks.",
        ],
      },
      {
        type: "p",
        text: "8.4 You can obtain information about specific safeguards by contacting our Data Protection Officer.",
      },
    ],
  },
  {
    id: "retention",
    title: "9. HOW LONG WE KEEP YOUR INFORMATION",
    blocks: [
      {
        type: "p",
        text: "We retain your personal information for different periods depending on the purpose:",
      },
      { type: "h3", text: "9.1 During Active Litigation" },
      {
        type: "p",
        text: "**Retention Period:** Throughout the litigation and until final resolution (including appeals)\n**Reason:** Necessary for legal claims and litigation management",
      },
      { type: "h3", text: "9.2 Post-Litigation" },
      {
        type: "p",
        text: "**Retention Period:** 7 years after final resolution of litigation\n**Reason:**",
      },
      {
        type: "ol",
        items: [
          "Limitation periods for potential claims",
          "Regulatory and tax requirements",
          "Professional indemnity insurance requirements",
          "Audit and compliance needs",
        ],
      },
      { type: "h3", text: "9.3 Financial Records" },
      {
        type: "p",
        text: "**Retention Period:** Minimum 7 years from end of financial year\n**Reason:** Tax law requirements, trust accounting obligations",
      },
      { type: "h3", text: "9.4 Legal Documents" },
      {
        type: "p",
        text: "**Retention Period:** Deed of Assignment and related legal documents retained permanently or for limitation period (12 years for deeds)\n**Reason:** Legal enforceability, proof of assignment",
      },
      { type: "h3", text: "9.5 If Litigation Not Commenced" },
      {
        type: "p",
        text: "**Retention Period:** 3 years if litigation does not commence\n**Reason:** Administrative purposes, potential future litigation, regulatory",
      },
      { type: "h3", text: "9.6 Website Account Data" },
      {
        type: "p",
        text: "**Retention Period:** Deleted 1 year after litigation conclusion (subject to legal document retention requirements above)\n**Reason:** No ongoing need for account access",
      },
      { type: "h3", text: "9.7 Communications" },
      {
        type: "p",
        text: "**Retention Period:** 7 years from date of communication\n**Reason:** Evidence of notifications, compliance records",
      },
      { type: "h3", text: "9.8 Cookies and Analytics" },
      {
        type: "p",
        text: "**Retention Period:** Up to 26 months for analytics data\n**Reason:** Statistical analysis, Website improvement",
      },
      {
        type: "p",
        text: "**9.9 Secure Deletion:** When retention periods expire, we securely delete or anonymise your information using industry-standard deletion methods.",
      },
      {
        type: "p",
        text: "**Exceptions:** We may retain information beyond these periods if:",
      },
      {
        type: "ol",
        items: [
          "Required by law or court order",
          "Necessary to defend legal claims",
          "You have consented to longer retention",
          "Anonymised for statistical purposes (no longer personal data)",
        ],
      },
    ],
  },
  {
    id: "your-rights",
    title: "10. YOUR RIGHTS UNDER DATA PROTECTION LAW",
    blocks: [
      {
        type: "p",
        text: "You have the following rights regarding your personal information:",
      },
      { type: "h3", text: "10.1 Right of Access (Article 15)" },
      { type: "p", text: "You have the right to:" },
      {
        type: "ol",
        items: [
          "Obtain confirmation whether we process your personal information",
          "Access your personal information",
          "Receive information about how we use your data",
        ],
      },
      {
        type: "p",
        text: "**How to exercise:** Submit a Subject Access Request to our Data Protection Officer. We will respond within one month (extendable by two months for complex requests).",
      },
      {
        type: "p",
        text: "**What we provide:** Copy of your personal information in commonly used electronic format (usually PDF).",
      },
      { type: "h3", text: "10.2 Right to Rectification (Article 16)" },
      { type: "p", text: "You have the right to:" },
      {
        type: "ol",
        items: [
          "Correct inaccurate personal information",
          "Complete incomplete personal information",
        ],
      },
      {
        type: "p",
        text: "**How to exercise:** Log into your account and update information directly, or contact us with corrections.",
      },
      {
        type: "p",
        text: "**Timeframe:** We will correct errors within one month.",
      },
      {
        type: "h3",
        text: "10.3 Right to Erasure / “Right to be Forgotten” (Article 17)",
      },
      {
        type: "p",
        text: "You have the right to request deletion of your personal information in certain circumstances.",
      },
      { type: "p", text: "**IMPORTANT LIMITATION – Litigation Context:**" },
      {
        type: "p",
        text: "Your right to erasure is **significantly limited** because we process your information for legal claims. Under Article 17(3)(e), we can refuse erasure where processing is necessary for:",
      },
      {
        type: "p",
        text: "**Establishment, exercise, or defence of legal claims**",
      },
      {
        type: "p",
        text: "This means we **cannot delete** your information while:",
      },
      {
        type: "ol",
        items: [
          "Litigation is active or contemplated",
          "Limitation periods are running",
          "We have legal/regulatory retention obligations",
        ],
      },
      { type: "p", text: "**Limited Erasure Available:**" },
      {
        type: "ol",
        items: [
          "If you withdraw before litigation commences AND minimum threshold not reached",
          "After all retention periods have expired",
          "For information not necessary for legal claims (e.g., marketing preferences if we ever collect them)",
        ],
      },
      { type: "h3", text: "10.4 Right to Restriction of Processing (Article 18)" },
      {
        type: "p",
        text: "You have the right to request we restrict processing of your personal information in certain circumstances:",
      },
      {
        type: "ol",
        items: [
          "You contest the accuracy of data (restriction while we verify)",
          "Processing is unlawful but you don’t want erasure",
          "We no longer need the data but you need it for legal claims",
          "You have objected to processing (restriction while we verify grounds)",
        ],
      },
      {
        type: "p",
        text: "**Effect:** We store the data but don’t actively process it (except with your consent or for legal claims).",
      },
      { type: "h3", text: "10.5 Right to Data Portability (Article 20)" },
      { type: "p", text: "You have the right to:" },
      {
        type: "ol",
        items: [
          "Receive personal information you provided in structured, commonly used format",
          "Transmit that data to another controller",
        ],
      },
      { type: "p", text: "**Limitations:**" },
      {
        type: "ol",
        items: [
          "Only applies to information YOU provided (not information we generated)",
          "Only where processing is based on consent or contract",
          "Only for automated processing",
        ],
      },
      {
        type: "p",
        text: "**Practical application:** Limited in litigation context as most processing is for legal claims, not based on consent.",
      },
      { type: "h3", text: "10.6 Right to Object (Article 21)" },
      {
        type: "p",
        text: "You have the right to object to processing based on legitimate interests.",
      },
      { type: "p", text: "**IMPORTANT LIMITATION:**" },
      {
        type: "p",
        text: "You **cannot object** to processing that is:",
      },
      {
        type: "ol",
        items: [
          "Necessary for legal claims (litigation)",
          "Required by legal obligation",
          "Necessary for contract performance",
        ],
      },
      { type: "p", text: "**Where you CAN object:**" },
      {
        type: "ol",
        items: [
          "Marketing (though we don’t do marketing)",
          "Some analytics and profiling (limited application here)",
        ],
      },
      {
        type: "h3",
        text: "10.7 Rights Related to Automated Decision-Making (Article 22)",
      },
      {
        type: "p",
        text: "You have the right not to be subject to decisions based solely on automated processing that produce legal effects.",
      },
      {
        type: "p",
        text: "**Our Position:** We do NOT use automated decision-making or profiling that produces legal effects. All significant decisions involve human review.",
      },
      { type: "h3", text: "10.8 Right to Withdraw Consent" },
      {
        type: "p",
        text: "Where processing is based on consent, you can withdraw consent at any time.",
      },
      {
        type: "ol",
        items: [
          "**Effect:** We will stop processing for that purpose (but can continue for other lawful purposes).",
          "**Limitations:** Cannot withdraw consent for processing necessary for legal claims or legal obligations.",
        ],
      },
      { type: "h3", text: "10.9 Right to Complain" },
      {
        type: "p",
        text: "You have the right to lodge a complaint with the supervisory authority:",
      },
      {
        type: "p",
        text: "**Information Commissioner’s Office (ICO)**\nWycliffe House\nWater Lane\nWilmslow\nCheshire\nSK9 5AF",
      },
      {
        type: "p",
        text: "**Telephone:** [0303 123 1113](tel:+443031231113)\n**Website:** [www.ico.org.uk](https://www.ico.org.uk)",
      },
      {
        type: "p",
        text: "**Our Preference:** We encourage you to contact us first so we can try to resolve your concern.",
      },
    ],
  },
  {
    id: "exercise-rights",
    title: "11. HOW TO EXERCISE YOUR RIGHTS",
    blocks: [
      { type: "h3", text: "11.1 Contact Methods:" },
      {
        type: "p",
        text: "**Email:** [office@fipo.uk](mailto:office@fipo.uk)\n**Post:** Data Protection Officer, Federation of Independent Practitioner Organisations, 2 St Marys Road, Tonbridge, Kent TN9 2LB\n**Online Form:** [Contact page](/contact)",
      },
      { type: "h3", text: "11.2 What to Include:" },
      {
        type: "ol",
        items: [
          "Your full name and contact details",
          "Description of your request",
          "Proof of identity (to protect your information)",
          "Account username (if applicable)",
        ],
      },
      { type: "h3", text: "11.3 Our Response:" },
      {
        type: "ol",
        items: [
          "**Timeframe:** One month (extendable to three months for complex requests)",
          "**Free of charge:** Generally no fee (we may charge for manifestly unfounded or excessive requests)",
          "**Verification:** We may request additional information to verify your identity.",
        ],
      },
    ],
  },
  {
    id: "cookies",
    title: "12. COOKIES AND TRACKING TECHNOLOGIES",
    blocks: [
      {
        type: "p",
        text: "**12.1 What Are Cookies?** Cookies are small text files stored on your device when you visit our Website. They help the Website function properly and provide usage information.",
      },
      { type: "h3", text: "12.2 Types of Cookies We Use" },
      {
        type: "ol",
        items: [
          {
            text: "**Strictly Necessary Cookies** (No consent required)",
            children: [
              "Session management and authentication",
              "Security and fraud prevention",
              "Essential Website functionality",
              "Load balancing",
            ],
          },
        ],
      },
      {
        type: "p",
        text: "**Example:** Login session cookie keeping you logged in",
      },
      {
        type: "ol",
        items: [
          {
            text: "**Performance/Analytics Cookies** (Consent required)",
            children: [
              "Website traffic analysis",
              "Understanding how visitors use the Website",
              "Identifying errors and issues",
            ],
          },
        ],
      },
      {
        type: "p",
        text: "**Example:** Google Analytics (if used) – anonymised",
      },
      {
        type: "ol",
        items: [
          {
            text: "**Functional Cookies** (Consent required)",
            children: [
              "Remember your preferences",
              "Enhance user experience",
              "Remember language/region settings",
            ],
          },
        ],
      },
      { type: "p", text: "12.3 **We do NOT use:**" },
      {
        type: "ol",
        items: [
          "Marketing/advertising cookies",
          "Third-party advertising cookies",
          "Social media tracking cookies (except if you share content)",
        ],
      },
      {
        type: "p",
        text: "**12.4 Third-Party Cookies** We may use carefully selected third-party services that set cookies:",
      },
      {
        type: "ol",
        items: [
          "Google Analytics (if used) – for Website statistics",
          "Payment processors (during payment process only)",
          "reCAPTCHA (for security)",
        ],
      },
      { type: "h3", text: "12.5 Managing Cookies" },
      {
        type: "ol",
        items: [
          {
            text: "**Browser Settings:** You can control cookies through your browser settings. Most browsers allow you to:",
            children: [
              "See what cookies are stored",
              "Delete cookies",
              "Block all cookies",
              "Block third-party cookies",
            ],
          },
          {
            text: "**Browser Help Resources:**",
            children: [
              "Chrome: chrome://settings/cookies",
              "Firefox: [support.mozilla.org/en-US/kb/cookies](https://support.mozilla.org/en-US/kb/cookies)",
              "Safari: [support.apple.com/guide/safari](https://support.apple.com/guide/safari)",
              "Edge: [support.microsoft.com/microsoft-edge](https://support.microsoft.com/microsoft-edge)",
            ],
          },
        ],
      },
      { type: "h3", text: "12.6 Impact of Blocking Cookies:" },
      {
        type: "ol",
        items: [
          "Strictly necessary cookies: Website may not function properly",
          "Other cookies: Functionality may be limited but core features work",
        ],
      },
      {
        type: "p",
        text: "**12.7 Our Cookie Banner:** When you first visit, you’ll see a cookie banner allowing you to:",
      },
      {
        type: "ol",
        items: [
          "Accept all cookies",
          "Reject non-essential cookies",
          "Manage cookie preferences",
        ],
      },
      { type: "h3", text: "12.8 Cookie List" },
      {
        type: "table",
        headers: ["Cookie Name", "Type", "Purpose", "Duration"],
        rows: [
          ["session_id", "Strictly Necessary", "Login session management", "Session"],
          ["csrf_token", "Strictly Necessary", "Security protection", "Session"],
          [
            "cookie_consent",
            "Strictly Necessary",
            "Remember your cookie preferences",
            "1 year",
          ],
          [
            "_ga",
            "Analytics (if used)",
            "Google Analytics visitor identification",
            "2 years",
          ],
          [
            "_gid",
            "Analytics (if used)",
            "Google Analytics session identification",
            "24 hours",
          ],
        ],
        note: "This list will be updated as cookies are implemented.",
      },
    ],
  },
  {
    id: "security",
    title: "13. SECURITY MEASURES",
    blocks: [
      {
        type: "p",
        text: "We take the security of your personal information seriously and implement appropriate technical and organisational measures:",
      },
      { type: "h3", text: "13.1 Technical Measures" },
      {
        type: "ol",
        items: [
          "**Encryption:** All data transmission uses HTTPS/SSL encryption",
          "**Secure Storage:** Encrypted storage for sensitive documents and data",
          "**Access Controls:** Role-based access limiting who can view data",
          "**Firewalls:** Web application firewall protection",
          "**Security Monitoring:** 24/7 monitoring for threats and intrusions",
          "**Regular Updates:** Security patches and software updates",
          "**Backup Systems:** Regular encrypted backups stored securely",
          "**Authentication:** Strong password requirements, optional two-factor authentication",
          "**Antivirus/Malware:** Protection against malicious software",
        ],
      },
      { type: "h3", text: "13.2 Organisational Measures" },
      {
        type: "ol",
        items: [
          "**Staff Training:** Data protection training for all personnel with data access",
          "**Confidentiality Agreements:** All staff and contractors bound by confidentiality",
          "**Access Logs:** Audit trails of who accesses personal information",
          "**Data Minimisation:** We collect only information necessary for purposes",
          "**Need-to-Know:** Access granted only to those who require it",
          "**Incident Response Plan:** Procedures for handling security breaches",
          "**Vendor Management:** Security assessment of third-party processors",
          "**Physical Security:** Secure facilities for any physical records",
        ],
      },
      { type: "h3", text: "13.3 Security Limitations" },
      {
        type: "ol",
        items: [
          "**No Absolute Security:** Despite our measures, no internet transmission or electronic storage is 100% secure. We cannot guarantee absolute security.",
          {
            text: "**Your Responsibility:**",
            children: [
              "Keep your login credentials confidential",
              "Use a strong, unique password",
              "Log out after using shared devices",
              "Report suspicious activity immediately",
              "Keep your email account secure (password reset emails)",
            ],
          },
        ],
      },
      { type: "h3", text: "13.4 Data Breach Notification:" },
      {
        type: "p",
        text: "If a personal data breach occurs that is likely to result in high risk to your rights:",
      },
      {
        type: "ol",
        items: [
          "We will notify you **without undue delay**",
          "We will notify the ICO within **72 hours** of becoming aware",
          "We will provide information about the breach and steps taken",
          "We will advise on measures you can take to protect yourself.",
        ],
      },
    ],
  },
  {
    id: "children",
    title: "14. CHILDREN’S PRIVACY",
    blocks: [
      {
        type: "p",
        text: "14.1 Our Website is not intended for children under 18 years of age.",
      },
      {
        type: "p",
        text: "14.2 We do not knowingly collect personal information from anyone under 18. Registration for participation in the Litigation is only for qualified medical professionals.",
      },
      {
        type: "p",
        text: "14.3 If we become aware we have inadvertently collected information from someone under 18, we will delete it promptly.",
      },
    ],
  },
  {
    id: "external-links",
    title: "15. LINKS TO OTHER WEBSITES",
    blocks: [
      {
        type: "p",
        text: "15.1 Our Website may contain links to third-party websites (e.g., GMC Register, payment processors, legal resources).",
      },
      {
        type: "p",
        text: "15.2 **Important:** We are not responsible for the privacy practices of other websites. This Privacy Notice applies only to our Website.",
      },
      {
        type: "p",
        text: "15.3 **Recommendation:** Read the privacy policy of any website you visit after leaving ours.",
      },
    ],
  },
  {
    id: "changes",
    title: "16. CHANGES TO THIS PRIVACY NOTICE",
    blocks: [
      {
        type: "p",
        text: "16.1 We may update this Privacy Notice from time to time to reflect:",
      },
      {
        type: "ol",
        items: [
          "Changes in law or regulation",
          "Changes to our practices",
          "New features or services",
          "Feedback or complaints.",
        ],
      },
      { type: "p", text: "16.2 **Notification of Changes:**" },
      {
        type: "ol",
        items: [
          "**Material Changes:** We will notify you by email or prominent Website notice",
          "**Minor Changes:** Updated version posted on Website with new “Last Updated” date",
          "**Your Responsibility:** Review this Privacy Notice periodically",
          "**Continued Use:** Your continued use of the Website after changes constitutes acceptance of the updated Privacy Notice.",
        ],
      },
      {
        type: "p",
        text: "16.3 **Archives:** Previous versions available on request from our Data Protection Officer.",
      },
    ],
  },
  {
    id: "contact",
    title: "17. CONTACT INFORMATION",
    blocks: [
      { type: "h3", text: "17.1 Data Protection Queries" },
      {
        type: "p",
        text: "**Data Protection Officer:**\nData Protection Officer\nFederation of Independent Practitioner Organisations\n2 St Marys Road, Tonbridge, Kent TN9 2LB\nEmail: [office@fipo.uk](mailto:office@fipo.uk)\nTel: [020 7205 4166](tel:+442072054166)",
      },
      { type: "h3", text: "17.2 General Website Queries" },
      {
        type: "p",
        text: "Email: [office@fipo.uk](mailto:office@fipo.uk)\nTel: [020 7205 4166](tel:+442072054166)\nWebsite: [fipo.uk](https://fipo.uk)",
      },
      { type: "h3", text: "17.3 Litigation Queries" },
      {
        type: "p",
        text: "17.4 For questions about the litigation itself (not data protection):",
      },
      {
        type: "p",
        text: "Email: [fipo@harcusparker.co.uk](mailto:fipo@harcusparker.co.uk)\nTel: [020 7205 4166](tel:+442072054166)",
      },
      { type: "h3", text: "17.5 Complaints" },
      {
        type: "p",
        text: "**First Step:** Contact our Data Protection Officer",
      },
      {
        type: "p",
        text: "**Supervisory Authority:**\nInformation Commissioner’s Office (ICO)\nWycliffe House, Water Lane, Wilmslow, Cheshire SK9 5AF\nTel: [0303 123 1113](tel:+443031231113)\nWebsite: [www.ico.org.uk](https://www.ico.org.uk)",
      },
    ],
  },
  {
    id: "acceptance",
    title: "18. YOUR ACCEPTANCE OF THIS PRIVACY NOTICE",
    blocks: [
      {
        type: "p",
        text: "18.1 By using our Website, registering for an account, and providing personal information, you acknowledge that:",
      },
      {
        type: "checks",
        items: [
          "You have read and understood this Privacy Notice",
          "You consent to the collection, use, and disclosure of your information as described",
          "You understand your rights and how to exercise them",
          "You understand the limitations on your rights in the litigation context",
          "You understand information may be disclosed in court proceedings",
        ],
      },
      {
        type: "p",
        text: "**If you do not agree** with this Privacy Notice, please do not use our Website or provide personal information.",
      },
      {
        type: "p",
        text: "**Document Version:** 1.0\n**Last Updated:** 18 September 2026\n**Next Review Date:** 18 September 2027",
      },
      {
        type: "note",
        text: "This Privacy Notice has been prepared in accordance with UK GDPR, the Data Protection Act 2018, and guidance from the Information Commissioner’s Office. It has been reviewed by Harcus Parker as legal advisers to the litigation.",
      },
    ],
  },
];
