import type { LegalSection } from "./legal-document";

export const termsPageIntro = {
  eyebrow: "TERMS OF USE",
  lastUpdated: "18 September 2026",
  documentVersion: "1.0",
  nextReviewDate: "18 September 2027",
} as const;

export const termsSections: readonly LegalSection[] = [
  {
    id: "introduction",
    title: "1. INTRODUCTION",
    blocks: [
      {
        type: "p",
        text: "1.1 These Terms of Use (“**Terms**”) govern your access to and use of the Federation of Independent Practitioner Organisations litigation funding and registration platform at fipo.uk (the “**Website**”).",
      },
      {
        type: "p",
        text: "1.2 Please read these Terms carefully, together with our [Privacy Policy](/privacy). By using the Website you agree to these Terms. If you do not agree, you must not use the Website.",
      },
      {
        type: "p",
        text: "1.3 Additional terms apply when you register to join the Fair Pay Action Group, make a contribution, or execute legal documents. Those documents (including any Deed of Assignment, engagement letters and related consents) prevail if they conflict with these Terms on the same subject.",
      },
    ],
  },
  {
    id: "who-we-are",
    title: "2. WHO WE ARE",
    blocks: [
      {
        type: "p",
        text: "2.1 The Website is operated by the Federation of Independent Practitioner Organisations (“**we**”, “**us**”, “**our**”, or the “**Federation**”).",
      },
      {
        type: "p",
        text: "2.2 We are a company limited by guarantee, registered in England and Wales under company number 4148752. Registered office: 2 St Marys Road, Tonbridge, Kent TN9 2LB.",
      },
      {
        type: "p",
        text: "2.3 Contact: [office@fipo.uk](mailto:office@fipo.uk) · [020 7205 4166](tel:+442072054166).",
      },
      {
        type: "p",
        text: "2.4 Harcus Parker acts as solicitors in connection with the Fair Pay Action Group claims. Questions about the litigation itself may be sent to [fipo@harcusparker.co.uk](mailto:fipo@harcusparker.co.uk).",
      },
    ],
  },
  {
    id: "who-may-use",
    title: "3. WHO MAY USE THE WEBSITE",
    blocks: [
      {
        type: "p",
        text: "3.1 The Website is intended for medical practitioners who may be eligible to participate in the Fair Pay Action Group, and for people making genuine enquiries about that action.",
      },
      {
        type: "p",
        text: "3.2 You must be at least 18 years old to use the Website or create an account.",
      },
      {
        type: "p",
        text: "3.3 You must not use the Website if you are employed by, or represent, Bupa Insurance Limited or AXA PPP Healthcare Limited, or if you are a partner or employee of a professional adviser acting for either insurer in relation to this matter, except where we have given prior written permission.",
      },
      {
        type: "p",
        text: "3.4 By continuing past any disclaimer on the Website, you confirm that you are entitled to do so under these Terms.",
      },
    ],
  },
  {
    id: "accounts",
    title: "4. ACCOUNTS AND SECURITY",
    blocks: [
      {
        type: "p",
        text: "4.1 Some parts of the Website require an account. You must provide accurate information and keep it up to date.",
      },
      {
        type: "p",
        text: "4.2 You are responsible for keeping your login details confidential and for all activity under your account. Tell us promptly if you believe someone else has used your account.",
      },
      {
        type: "p",
        text: "4.3 We may suspend or close an account if we reasonably believe these Terms have been broken, information is false, or the account is being used for fraud or unauthorised access.",
      },
    ],
  },
  {
    id: "registration",
    title: "5. REGISTRATION AND THE ACTION GROUP",
    blocks: [
      {
        type: "p",
        text: "5.1 Completing registration, paying a contribution, or signing documents does not guarantee that proceedings will be issued, that the claim will succeed, or that you will receive any particular sum.",
      },
      {
        type: "p",
        text: "5.2 Eligibility, participation and the running of the claim are governed by the legal documents you execute and by instructions given to Harcus Parker and counsel. You should read those documents, and the [Explanations](/explanations) section, before you join.",
      },
      {
        type: "p",
        text: "5.3 You must not treat participation as a basis for discussing or aligning fees or other commercial practices with other practitioners. Joining is an individual decision.",
      },
    ],
  },
  {
    id: "payments",
    title: "6. PAYMENTS AND CONTRIBUTIONS",
    blocks: [
      {
        type: "p",
        text: "6.1 Contributions towards the action, where requested, are processed by third-party payment providers (such as PayPal or Stripe). We do not store complete card or bank account numbers.",
      },
      {
        type: "p",
        text: "6.2 Payment providers have their own terms. You should read those terms before you pay.",
      },
      {
        type: "p",
        text: "6.3 Refunds, if any, are dealt with according to the registration materials and any legal documents you have signed, and applicable law.",
      },
    ],
  },
  {
    id: "uploads",
    title: "7. DOCUMENTS AND INFORMATION YOU PROVIDE",
    blocks: [
      {
        type: "p",
        text: "7.1 You must only upload information and documents that you are entitled to provide, and that are true, complete and not misleading so far as you are aware.",
      },
      {
        type: "p",
        text: "7.2 You must not upload malware or material that is unlawful, defamatory, or infringes someone else’s rights.",
      },
      {
        type: "p",
        text: "7.3 We treat uploaded documents as confidential and potentially legally privileged, as described in our [Privacy Policy](/privacy). We may share them with Harcus Parker, counsel, experts and others as that notice explains.",
      },
    ],
  },
  {
    id: "acceptable-use",
    title: "8. ACCEPTABLE USE",
    blocks: [
      {
        type: "p",
        text: "You agree not to:",
      },
      {
        type: "ol",
        items: [
          "use the Website for any unlawful purpose;",
          "attempt to gain unauthorised access to the Website, other accounts, or our systems;",
          "copy, scrape or harvest content except as allowed by these Terms or by law;",
          "interfere with the Website’s operation, security or other users;",
          "misrepresent your identity, professional status or relationship to the defendants; or",
          "use the Website to send unsolicited marketing or spam.",
        ],
      },
    ],
  },
  {
    id: "intellectual-property",
    title: "9. INTELLECTUAL PROPERTY",
    blocks: [
      {
        type: "p",
        text: "9.1 Unless otherwise stated, the design, layout, text, graphics, logos and other material on the Website are owned by us or our licensors. All rights are reserved.",
      },
      {
        type: "p",
        text: "9.2 You may view and print pages for your personal use in connection with considering or participating in the action. You must not copy, adapt or distribute Website material for any other purpose without our prior written permission, except where the law allows.",
      },
    ],
  },
  {
    id: "no-advice",
    title: "10. NO LEGAL ADVICE AND NO GUARANTEE",
    blocks: [
      {
        type: "p",
        text: "10.1 Content on the Website is for information about the Fair Pay Action Group. It is not legal, financial or tax advice to you personally.",
      },
      {
        type: "p",
        text: "10.2 You are encouraged to take independent legal and financial advice before signing any documents or paying a contribution.",
      },
      {
        type: "p",
        text: "10.3 We do not guarantee the outcome of any claim, the timing of any payment, or that the Website will be uninterrupted or error-free.",
      },
    ],
  },
  {
    id: "confidentiality",
    title: "11. CONFIDENTIALITY",
    blocks: [
      {
        type: "p",
        text: "11.1 Parts of the Website contain confidential and legally privileged information about contemplated or actual litigation. You must keep that information confidential and use it only for considering or participating in the action.",
      },
      {
        type: "p",
        text: "11.2 You must not copy, forward or publish that material except as allowed by the legal documents you have signed or as required by law.",
      },
    ],
  },
  {
    id: "third-parties",
    title: "12. THIRD-PARTY SERVICES AND LINKS",
    blocks: [
      {
        type: "p",
        text: "12.1 The Website may link to, or use, third-party services (including payment providers, identity verification, e-signature tools, and the GMC Register). Those services have their own terms and privacy notices.",
      },
      {
        type: "p",
        text: "12.2 We are not responsible for third-party websites or services that we do not control.",
      },
    ],
  },
  {
    id: "privacy",
    title: "13. PRIVACY",
    blocks: [
      {
        type: "p",
        text: "How we collect and use personal information is explained in our [Privacy Policy](/privacy). By using the Website you acknowledge that notice.",
      },
    ],
  },
  {
    id: "liability",
    title: "14. LIABILITY",
    blocks: [
      {
        type: "p",
        text: "14.1 Nothing in these Terms excludes or limits liability for death or personal injury caused by negligence, fraud, or any other liability that cannot be excluded under English law.",
      },
      {
        type: "p",
        text: "14.2 Subject to clause 14.1, we are not liable for loss of profit, loss of business, loss of data, or any indirect or consequential loss arising from your use of the Website.",
      },
      {
        type: "p",
        text: "14.3 Website content is provided “as is”. We take reasonable care to keep it accurate, but we do not warrant that it is complete or up to date at all times.",
      },
    ],
  },
  {
    id: "changes",
    title: "15. CHANGES TO THE WEBSITE AND THESE TERMS",
    blocks: [
      {
        type: "p",
        text: "15.1 We may update the Website and these Terms from time to time. The version published on this page is the current Terms. The “Last updated” date will change when we make updates.",
      },
      {
        type: "p",
        text: "15.2 If we make a material change, we may also notify you by email or by a notice on the Website. Continued use after a change means you accept the updated Terms.",
      },
    ],
  },
  {
    id: "governing-law",
    title: "16. GOVERNING LAW",
    blocks: [
      {
        type: "p",
        text: "16.1 These Terms are governed by the laws of England and Wales.",
      },
      {
        type: "p",
        text: "16.2 The courts of England and Wales have exclusive jurisdiction over disputes arising from these Terms or your use of the Website, except that we may bring proceedings in another jurisdiction to protect our rights.",
      },
    ],
  },
  {
    id: "contact",
    title: "17. CONTACT",
    blocks: [
      {
        type: "p",
        text: "17.1 **Website and administrative queries:** [office@fipo.uk](mailto:office@fipo.uk) · [020 7205 4166](tel:+442072054166)",
      },
      {
        type: "p",
        text: "17.2 **Litigation queries:** [fipo@harcusparker.co.uk](mailto:fipo@harcusparker.co.uk)",
      },
      {
        type: "p",
        text: "17.3 **Postal address:** Federation of Independent Practitioner Organisations, 2 St Marys Road, Tonbridge, Kent TN9 2LB.",
      },
    ],
  },
  {
    id: "acceptance",
    title: "18. ACCEPTANCE",
    blocks: [
      {
        type: "p",
        text: "By using the Website you acknowledge that you have read and understood these Terms and agree to be bound by them.",
      },
      {
        type: "p",
        text: "**Document Version:** 1.0\n**Last Updated:** 18 September 2026\n**Next Review Date:** 18 September 2027",
      },
      {
        type: "note",
        text: "These Terms of Use should be read with our Privacy Policy. They govern use of the Website and do not replace any Deed of Assignment, engagement letter or other legal document you sign in connection with the claim.",
      },
    ],
  },
];
