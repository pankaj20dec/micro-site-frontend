export type ExplanationsToc = {
  id: string;
  label: string;
};

export const explanationsIntro = {
  eyebrow: "EXPLANATIONS",
  /** Top full-width warning band shown above the content. */
  warning:
    "CONFIDENTIALITY NOTICE: This section of the site is intended solely for working or retired medical practitioners who have received payments from private medical insurers in the past six years. By continuing, you confirm that you are not an employee of Bupa Insurance Limited or AXA PPP Healthcare Limited, or a partner or employee of a professional adviser acting on behalf of either insurer. The content of these pages is confidential and legally privileged.",
} as const;

export const explanationsToc: ReadonlyArray<ExplanationsToc> = [
  { id: "legal-notice", label: "Important Legal Notice" },
  { id: "how-to-join", label: "How To Join The Action Group" },
  { id: "claim-structure", label: "How The Claim Is Structured" },
  { id: "why-structure", label: "Why This Structure?" },
  { id: "subscriptions", label: "How Subscriptions Will Be Used" },
  {
    id: "key-implications",
    label: "Key Implications Of Joining The Action Group You Must Understand",
  },
  { id: "damages", label: "How Damages Will Be Distributed" },
  {
    id: "documents",
    label: "Descriptions Of The Documents And How To Execute Or Approve Them",
  },
  { id: "document-hold", label: "Document Hold" },
  { id: "summary-risk", label: "Summary Risk Warning" },
];

export const explanationsContact = {
  title: "Have Questions?",
  note: "If you have any questions or concerns, contact",
  email: "fipo@harcusparker.co.uk",
} as const;

/* -------------------------------------------------------------------------- */
/* Section content                                                            */
/* -------------------------------------------------------------------------- */

export const explanationsLegalNotice = {
  id: "legal-notice",
  title: "Important Legal Notice",
  cards: [
    {
      title: "Independent Legal And Financial Advice",
      body: "You are strongly encouraged to seek independent legal and financial advice before signing the documents associated with membership of the FIPO Fair Pay Action Group, particularly regarding:",
      bullets: [
        "the taxation implications;",
        "the consequences of permitting FIPO to run your Claim subject to the Power of Attorney; and",
        "Your rights and obligations under the LMA.",
      ],
    },
    {
      title: "No Guarantee Of Success",
      body: "FIPO makes no guarantee or representation regarding",
      bullets: [
        "The likelihood of success of the Claims",
        "the quantum of damages that may be recovered; or",
        "the timing of any payment.",
      ],
    },
    {
      title: "Professional Indemnity Insurance",
      body: "You should ensure your professional indemnity insurance is not affected by participation in litigation against insurers. Notify your insurer if required by your policy terms.",
      bullets: [],
    },
    {
      title: "Litigation Timeline",
      body: "Complex commercial litigation typically takes 2-5 years. Be prepared for a long process with no guaranteed outcome. However, settlement short of final judgment is a possibility",
      bullets: [],
    },
    {
      title: "A Note on Competition Law",
      body: [
        "FIPO takes competition law seriously — it is, after all, at the heart of this claim. Before proceeding, please note the following.",
        "Joining the Fair Pay Action Group is an individual decision. It does not involve, and must not involve, any agreement, understanding or coordination between practitioners regarding their own fees, the terms on which they accept or decline patients, or any other aspect of their commercial conduct. The decision of a practitioner on whether to join the action should be taken independently, based on their own assessment of their own circumstances.",
        "FIPO's role is limited to running the collective legal claim on claimants' behalf, as described in this site. It does not coordinate, advise on, or facilitate any commercial arrangements between claimants, and those considering or joining the action should not treat their participation in this action as a basis for discussing or aligning their pricing or commercial practices with one another.",
        "If you have any concerns about how competition law applies to your own practice, you should seek independent legal advice.",
      ],
      bullets: [],
    },
  ],
} as const;

export const explanationsHowToJoin = {
  id: "how-to-join",
  title: "How To Join The Action Group",
  intro: "In order to join the Action Group, you must:",
  steps: [
    {
      number: "01",
      lead: "Pay a Subscription",
      body: "of either £250 or £500. If you pay £250, then the fee which will be deducted from any damages associated with your claim will be 32.5% + VAT; and if you pay £500 then the fee deducted from any damages associated with your claim will be 30% + VAT.",
    },
    {
      number: "02",
      lead: "Approve the terms of FIPO's engagement with Harcus Parker and Counsel on its and your behalf.",
      body: "This is very important, as the intention is that FIPO will execute the engagement on your behalf. It will take up the administrative burden of running the litigation for you, but the litigation will in substance remain yours, and Harcus Parker will be acting for you, so you should ensure that you are happy with the terms, which will be contracted on your behalf. In particular, you should note that the DBA with Harcus Parker will operate as though it were agreed with each member of the group. The key financial term of the DA is that if your claim succeeds, the damages associated with your claim will be reduced by a fee of 32.5% if you paid a subscription of £250 and of 30% if you paid a subscription of £500.",
    },
    {
      number: "03",
      lead: "Execute a power of attorney in FIPO's favour",
      body: "authorising FIPO to bring proceedings against the PMIs on your behalf and to agree to Harcus Parker's and Counsel's retainers, and in particular to enter into a DBA with Harcus Parker on your behalf, as a result of which the damages associated with your claim will be reduced by a fee of 32.5% if you paid a subscription of £250 and of 30% if you paid a subscription of £500.",
    },
    {
      number: "04",
      lead: "Sign a \u201cLitigation Management Agreement\u201d",
      body: "which regulates the relationship between you, FIPO, the solicitors who will be acting on your behalf and other members of the FIPO Fair Pay Action Group.",
    },
    {
      number: "05",
      lead: "Sign a declaration which records your understanding of the main features of the arrangements.",
      body: "",
    },
  ],
} as const;

export const explanationsClaimStructure = {
  id: "claim-structure",
  title: "How the Claim Is Structured",
  paragraphs: [
    "The Claim is brought as a coordinated group action. FIPO acts as the claimant representative and instructs Harcus Parker, who lead the litigation, together with specialist counsel. Each member's individual claim remains their own, but the cases are run together under a single, shared strategy.",
    "This gives members the benefit of collective scale — shared costs, shared evidence and a single, well-resourced legal team — while keeping the conduct of the litigation in the hands of experienced solicitors rather than individual practitioners.",
  ],
} as const;

export const explanationsWhyStructure = {
  id: "why-structure",
  title: "Why This Structure?",
  cards: [
    {
      title: "Legal and practical reasons",
      bullets: [
        "Collective actions are most effective when strategy is centrally controlled — otherwise, defendants will exploit divisions between claimants.",
        "Individual claims are not economically viable on their own. The value of your claim depends entirely on the success of the collective action.",
        "Over 12,000 practitioners may be affected. Managing thousands of individual decisions is not feasible.",
        "FIPO takes on the day-to-day administrative burden, freeing you to get on with your clinical work.",
        "FIPO believes deeply in the justice of this cause and is committed to seeing it through.",
      ],
    },
    {
      title: "What You Retain",
      bullets: [
        "Your right to be kept reasonably informed about the progress of the case.",
        "Your right to be consulted on major decisions (where practicable, this may be via representative organizations for particular specialisms).",
        "Your right to receive your proportionate share of any damages.",
        "Your right to expect that FIPO will act in good faith and with reasonable care on your behalf.",
      ],
    },
  ],
} as const;

export const explanationsSubscriptions = {
  id: "subscriptions",
  title: "How Subscriptions Will Be Used",
  image: {
    src: "/images/account-amico.jpg",
    alt: "Illustration of a secured account and subscription funds",
  },
  paragraphs: [
    "FIPO will hold your subscriptions on trust for the sole agreed purpose of funding the pre-action phase of the litigation and / or to pay towards the cost of ATE insurance. Specifically:",
  ],
  bullets: [
    "Subscriptions will be held in a separate, ring-fenced account (most likely a client account of Harcus Parker) entirely separate from FIPO's general funds;",
    "Subscriptions will not be used for FIPO's general purposes unless and until the claims progress beyond the pre-action phase and a balance remains after ATE insurance has been purchased. If FIPO were to become insolvent, your subscription would be protected and could not be claimed by FIPO's creditors.",
  ],
} as const;

export const explanationsCostsRisk = {
  id: "costs-risk",
  title: "How You Are Protected From Costs Risk",
  intro:
    "Any litigation carries the risk of an adverse costs order — meaning that if the claim fails, you might be ordered to pay the defendants' legal costs. This is a real risk that we take seriously. Here is how the structure protects you:",
  steps: [
    {
      number: "01",
      lead: "After-the-Event (ATE) Insurance:",
      body: "FIPO will not issue proceedings until it has arranged a suitable ATE insurance policy. This policy will cover the risk of an adverse costs order. You will not be liable for any premium unless and until the case proceeds.",
    },
    {
      number: "02",
      lead: "FIPO's Primary Liability:",
      body: "FIPO accepts that it has primary responsibility for any adverse costs that are not covered by insurance.",
    },
    {
      number: "03",
      lead: "Third-Party Funder:",
      body: "Any third-party funder of the claim also accepts responsibility for adverse costs and — as an institution — is a more accessible target than thousands of individual practitioners.",
    },
    {
      number: "04",
      lead: "Proportionate Several Liability:",
      body: "Even in the unlikely worst-case scenario in which all of the above protections failed, your individual liability would be limited to your proportionate share of any adverse costs. The more practitioners who join, the smaller that share would be.",
    },
  ],
  benefit: {
    title: "How You Benefit",
    bullets: [
      "Professional legal representation you could not afford individually;",
      "Strength of collective action;",
      "After-The-Event insurance protection;",
      "Proportionate share of any damages recovered;",
      "Pressure on insurance companies to reform their practices.",
    ],
    note: "The structure has been designed so that it is highly unlikely that you will face any personal financial liability, even if the claim is unsuccessful.",
  },
} as const;

export const explanationsKeyImplications = {
  id: "key-implications",
  title: "Key Implications Of Joining The Action Group You Must Understand",
  groups: [
    {
      title: "Costs",
      intro:
        "FIPO will hold your subscriptions on trust for the sole agreed purpose of funding the pre-action phase of the litigation and / or to pay towards the cost of ATE insurance. Specifically:",
      items: [
        {
          text: "No litigation proceeds without the risk of being ordered to pay the defendant's costs if a claim is unsuccessful.",
        },
        {
          text: "But you will be protected in at least three ways:",
          children: [
            "FIPO will not issue proceedings unless it has arranged a suitable policy of After The Event insurance to protect you from the impact of an adverse costs judgment;",
            "FIPO acknowledges that it itself will have the primary responsibility to a pay adverse costs, should the insurance fail or be insufficient; and",
            "Any third-party funder of the claim will similarly be responsible for adverse costs, and will be an easier target than thousands of individuals.",
          ],
        },
        {
          text: "As a consequence of this structure, it is highly unlikely that you will face any personal liability.",
        },
      ],
    },
  ],
  readMore: {
    label: "Read More",
    labelExpanded: "Read Less",
    control: {
      title: "Control",
      parts: [
        {
          lead: "you are delegating decisions in relation to the conduct of the litigation to FIPO:",
          bullets: [
            "FIPO will have sole discretion over how the Claims are conducted;",
            "you will not be able to tell FIPO what to do;",
            "you cannot veto FIPO's decisions;",
            "you cannot settle directly with the Defendants;",
          ],
        },
        {
          lead: "FIPO's discretion includes:",
          bullets: [
            "whether and when to issue proceedings, if at all;",
            "which legal and economic arguments to pursue;",
            "whether to settle and on what terms;",
            "how to allocate litigation resources;",
            "which lawyers and experts to instruct.",
          ],
        },
        {
          bullets: [
            "you are not giving away the value of your claim;",
            "but you are accepting that in the interest of efficiency it may be expedient not to make minute calculations as to the value of claims;",
          ],
        },
        {
          lead: "you are not disclaiming responsibility – you will still be required to participate:",
          bullets: [
            "you will need to put together information and documents for disclosure to the defendants;",
            "you may be required to give evidence;",
          ],
        },
        {
          lead: "you will have the following essential remaining rights:",
          bullets: [
            "a right to be kept reasonably informed (although you accept that because of the risk that information may be shared with the defendants it will be necessary to be reasonably circumspect;",
            "you will be consulted on major decisions (where reasonably practicable) although consultation may be at the level of representative organisations formed to represent particular specialisms;",
            "a right to receive your Proportionate Share of damages; and",
            "a right to expect good faith and reasonable care on the part of FIPO.",
          ],
        },
        {
          lead: "what if you disagree with the course FIPO takes?",
          bullets: [
            "you can express your views to FIPO. It will have regard to them when making decisions in the best interests of the collective;",
            "but FIPO's decision is final;",
            "you cannot challenge FIPO's litigation strategy; and",
            "collective action requires the acceptance of group members of majority decisions.",
          ],
        },
      ],
    },
    irrevocability: {
      title: "Irrevocability",
      parts: [
        {
          bullets: [
            "After a 14-day cooling-off period, you cannot change your mind after you have signed the power of attorney and joined the action group. You cannot unilaterally revoke or cancel it.",
            "The power of attorney will remain in force until [  ] which is the date when it expires, by which time the Claims should have concluded.",
            "The power of attorney will also expire if you die or become incapable.",
            "FIPO can however exercise its discretion to discontinue your claim if you become an Obstructive Claimant under the terms of the LMA.",
          ],
        },
        {
          lead: "Why the power of attorney must be irrevocable:",
          bullets: [
            "FIPO, its advisers and potential funders, need certainty to pursue expensive litigation;",
            "FIPO will be taking a significant and serious step on your behalf by issuing a claim in the High Court on your behalf;",
            "if members were free to end their involvement in the litigation, this would also be against the interests of other members: members cannot withdraw mid-case; collective action requires commitment from all participants; and",
            "defendants need to know who has standing to sue;",
          ],
        },
        {
          lead: "What if nevertheless you want to withdraw?",
          bullets: [
            "if you become obstructive, and do not cooperate, FIPO can decide to discontinue your claim. Discontinuance is usually followed by a costs order in favour of the defendant, as it is an acceptance that the claim should not have been brought and (even if other Claims succeed) the defendant will have wasted time and costs on the discontinued claim;",
            "the only way to withdraw without cost (which is unlikely to be agreed once proceedings are issued is by agreement between FIPO and the defendants.",
          ],
        },
      ],
    },
  },
} as const;

type DamageStep = {
  number: string;
  title: string;
  body?: string;
  bullets?: readonly string[];
  note?: string;
};

export const explanationsDamages: {
  id: string;
  title: string;
  intro: string;
  steps: readonly DamageStep[];
  example: {
    title: string;
    lines: readonly { text: string; bold?: boolean }[];
  };
} = {
  id: "damages",
  title: "How Damages Will Be Distributed",
  intro:
    "If the case succeeds at trial, a specific amount will be allocated to each practitioner's claim (or a formula will be set out which leads to a specific amount). Settlement, however, provides for more flexibility, and the text below describes what is likely to happen. The following example uses illustrative figures only and does not represent any estimate of the value of the claims.",
  steps: [
    {
      number: "01",
      title: "Receipt Of Funds",
      body: "Funds are received from defendants into Harcus Parker's client account. A specialist class action administrator such as GC Partners or Shield Pay is likely to be used to distribute the funds.",
    },
    {
      number: "02",
      title: "Deduction Of Costs",
      bullets: [
        "Legal fees, expert fees, court fees and expenses not recovered from the Defendants;",
        "The cost of deferred insurance premiums; and",
        "Administration costs.",
      ],
      note: "Illustrative example: if £50 million is received and total costs are £8 million, the net fund available for distribution is £42 million.",
    },
    {
      number: "03",
      title: "Individual Allocation",
      body: "If the court has awarded specific amounts to specific practitioners, or if specific amounts have been negotiated, those amounts are paid. If a global sum has been agreed for distribution among all members (which is a common feature of group action settlements), Step 4 applies.",
    },
    {
      number: "04",
      title: "Proportionate Share Calculation",
      body: "Expert economists will calculate each member's Proportionate Share based on:",
      bullets: [
        "Their individual PMI income during the relevant period;",
        "Their practice characteristics;",
        "Competitive market fee analysis (which may vary from specialism to specialism); and",
        "Their documented losses.",
      ],
    },
    {
      number: "05",
      title: "DBA Fee Deduction And Payment",
      body: "The DBA fee (32.5% or 30% + VAT, depending on your subscription level) is deducted from your Proportionate Share, and the net amount is paid to you.",
    },
  ],
  example: {
    title: "Worked Example (illustrative figures only)",
    lines: [
      { text: "Total damages after costs: £42 million" },
      { text: "Total members: 500" },
      { text: "Your individual documented losses: £300,000" },
      { text: "Total documented losses (all members): £150 million" },
      {
        text: "Your Proportionate Share: (£300,000 / £150 million) × £42 million = £84,000",
        bold: true,
      },
      { text: "Less DBA fee (32.5% + VAT, standard member): approx. £32,760" },
    ],
  },
};

export const explanationsTax = {
  id: "tax",
  title: "Tax Implications",
  warning:
    "IMPORTANT: Neither FIPO nor Harcus Parker will advise you on tax matters. The following is general information only, not tax advice. You should consult your own tax adviser.",
  intro:
    "Damages received in compensation for lost income are generally treated as taxable income by HMRC. You should be aware of the following:",
  bullets: [
    "Damages for lost income are typically taxable as income in the year of receipt, although it may be possible to spread the charge across the years to which the losses relate.",
    "You may be able to deduct legal costs from the damages received for tax purposes.",
    "You should inform your accountant about your participation in the claim when filing your tax returns.",
  ],
} as const;

export const explanationsDocuments = {
  id: "documents",
  title: "Descriptions Of The Documents And How To Execute Or Approve Them",
  items: [
    {
      number: "01",
      title: "The Retainer and Damages-Based Agreement with Harcus Parker",
      body: "FIPO will enter into this agreement on your behalf, exercising the authority you give it under the power of attorney. The DBA means that if your claim succeeds, Harcus Parker’s fees will be deducted from your damages (at the rate of 32.5% or 30% + VAT depending on your subscription level). If your claim does not succeed, you will owe Harcus Parker nothing.",
    },
    {
      number: "02",
      title: "The Power of Attorney",
      body: ["This is the key document. By signing it, you authorise FIPO to bring your claim on your behalf, to instruct lawyers on your behalf, and to make all decisions in relation to your claim — including whether and when to settle. You should read it carefully.", "The power of attorney becomes irrevocable after a 14-day cooling-off period. If you die or become incapacitated while the claim is ongoing, the power of attorney will be automatically revoked and your personal representatives will need to execute a new one to continue your claim."]
    },
    {
      number: "03",
      title: "The Litigation Management Agreement (LMA)",
      body: "The LMA is the agreement between you, FIPO and Harcus Parker that governs how the claim is run. It covers: decision-making, your obligations to cooperate (including providing disclosure and potentially giving evidence), how costs are shared, and how damages are distributed.",
    },
    {
      number: "04",
      title: "The Overarching Declaration",
      body: "The LMA is the agreement between you, FIPO and Harcus Parker that governs how the claim is run. It covers: decision-making, your obligations to cooperate (including providing disclosure and potentially giving evidence), how costs are shared, and how damages are distributed.",
    },
  ],
  footnote: {
    title:
      "Fipo’s Engagement With Harcus Parker and Counsel, Including the DBA It Will Execute on Your Behalf With Your Approval",
    body: "This sets out the terms on which Harcus Parker will act for FIPO in the prosecution of your claim. It will enter the agreement with Harcus Parker for you and as you. You should read the entire document, but note:",
  },
  readMore: {
    label: "Read More",
    labelExpanded: "Read Less",
    engagement: {
      items: [
        {
          text: "the percentage fee that will be deducted from any damages that you receive will be:",
          children: [
            "32.5% + VAT if you contribute £250 by way of subscription; or",
            "30% + VAT if you contribute £500 by way of subscription;",
          ],
        },
        {
          text: "FIPO will instruct Harcus Parker as solicitors, who will in turn instruct Suzanne Rab, a barrister in independent practice at Matrix Chambers, who FIPO has instructed directly;",
        },
        {
          text: "FIPO will use action group's funds, which include your subscriptions, to contribute to legal costs during the 'Pre-Action Phase' and will use any balance to pay towards the cost of ATE insurance.",
        },
      ],
    },
    powerOfAttorney: {
      title: "THE POWER OF ATTORNEY",
      paragraphs: [
        "The power of attorney is your way of giving authority to FIPO to act as the claimant in the intended litigation.",
        "Please note that the delegation of authority to FIPO is complete and extends to decisions about settlement as well as strategy and day to day conduct.",
        "Please also note that if you die or become incapable while the Claims are ongoing, the power of attorney will be revoked. It will be necessary for your attorney under an LPA or your personal representatives to execute a further power of attorney.",
      ],
    },
    litigationManagement: {
      title: "THE LITIGATION MANAGEMENT AGREEMENT",
      intro: "The main features of the LMA are:",
      features: [
        "confirmation of the practical impact of the power of attorney;",
        "a declaration of common purpose with the other medical professionals who join the action group;",
        "your agreement to cooperate with FIPO in the progression of the Claims, including by disclosing documents to FIPO so that it can comply with the formal requirements of the court's rules;",
        "your agreement as to how your information will be used;",
        "your agreement as to how cost and theoretical risk will be shared; and",
        "your agreement as to the distribution of damages.",
      ],
      note: "You should read every word before signing, but we draw your specific attention to the extract below, which appears at clause 6 and following:",
      agreement: {
        title: "Agreement to work together and with FIPO",
        intro:
          "You and the other Consultants may have different complaints to bring against the Defendants, but you agree that you have a common interest in bringing your Claims together.",
        groups: [
          {
            lead: "By executing this agreement and the Power of Attorney, you and every other Consultant warrant:",
            bullets: [
              "that You have no interest which is adverse to the success of the Claims;",
              "that You have full capacity and authority to enter into this Agreement;",
              "that You are the sole legal and beneficial owner of your Claim or Claims;",
              "that your Claim or Claims have not been assigned, charged, or otherwise disposed of to any other person;",
              "that You have not done or omitted to do anything that might prejudice the Claims;",
              "that You are not aware of any facts that would defeat, reduce, or materially prejudice the Claims;",
              "that all information that You provided or will provide to Harcus Parker or FIPO regarding the Claims is true, accurate, and complete to the best of Your knowledge and belief.",
            ],
          },
          {
            lead: "You and the other Consultants agree:",
            bullets: [
              "that You will cooperate fully with FIPO, Harcus Parker and Counsel and any other expert advisers who may be appointed in the pursuit of the Claims;",
              "that, notwithstanding that FIPO will progress Your Claim as your attorney, You have a duty to the Court and will conduct yourself as though You were yourself bringing the Claim on Your own behalf;",
              "that You will observe a \"document hold\" (that is, you take steps to preserve all and any documents and data that are or may be relevant to the subject matter of the Claim) recognising that in due course it will be necessary for FIPO to disclose such documents regardless of whether they help your Claim or harm it;",
              "that You will provide such documents, information, and evidence as may reasonably be required and will respond to any requests in this respect in a timely fashion;",
              "that to the extent that You communicate directly with FIPO in relation to the Claim or send information directly to FIPO, including through any website portal, any such interactions with FIPO are in its capacity as Harcus Parker's agent in relation to the Claims and are subject to legal professional privilege;",
              "that to the extent that You communicate with any other Consultant in relation to Your or their Claim or the Claims in general such communications are subject to common interest privilege;",
              "that You will attend meetings and hearings if reasonably required to do so;",
              "that You will not do anything that might prejudice or compromise or otherwise have a detrimental impact on the Claims;",
              "that You will notify FIPO and Harcus parker immediately of any material developments affecting the Claims.",
            ],
          },
          {
            lead: "FIPO will:",
            bullets: [
              "act in good faith in pursuing the Claims for the collective benefit of all Consultants;",
              "keep the Consultants (subject to clause 7 below and the need to be circumspect because of the risk of information being disclosed to the Defendants) reasonably informed of material developments in the Claims;",
              "notwithstanding that it has no duty to do so and retains a discretion as to whether it should, consult Consultants on major strategic decisions where reasonably practicable and expedient;",
              "with no duty to the Consultants conduct the Claims diligently and with reasonable skill and care.",
            ],
          },
          {
            lead: "You acknowledge and agree that:",
            bullets: [
              "FIPO's decisions regarding the Claims are final and binding;",
              "You have no right to interfere with or challenge FIPO's conduct of the Claims;",
              "FIPO may settle the Claims on such terms as it considers appropriate in the collective interest;",
              "Individual Consultants may have different views on litigation strategy, but collective decision-making is necessary for effective collective action;",
              "the Consultants' common interest is in FIPO attempting to secure the largest possible sum from the Defendant(s). This could be as a result of the Court awarding a sum of compensation or as a result of the Defendant(s) to your Claim making an offer of settlement which is accepted on your behalf by FIPO;",
              "if the Claims result in a successful judgment at trial, the court may order that some Consultants, through FIPO, are ultimately compensated in a different way from others because of their individual circumstances; and",
              "although Your primary interest in the Claims is a financial interest in any damages associated with Your Claim or Claims and / or your Proportionate Share in the Claims overall, circumstances may arise in which it would be expedient not to take detailed account of the individual issues of each Consultant's case in the allocation of the Overall Claim Proceeds to Consultants because it would otherwise be expensive and burdensome to work out a fair division.",
            ],
          },
        ],
      },
    },
    overarchingDeclaration: {
      title: "THE OVERARCHING DECLARATION",
      intro: "You will be asked to make the following acknowledgment.",
      confirmationTitle: "Final Confirmation",
      confirmationIntro:
        "Before submitting your registration, please confirm you understand the key features of participating in this collective action:",
      groups: [
        {
          title: "I understand the legal process",
          items: [
            "I have read or been offered the opportunity to read all legal documents including in particular Harcus Parker's engagement documents, which FIPO is executing on my behalf, and have read the Important Legal Notice on the claim website",
            "I understand FIPO will bring and manage the litigation on behalf of all participants",
            "I understand major decisions (including settlement) are made by FIPO in the collective interest",
          ],
        },
        {
          title: "I understand the financial arrangements",
          items: [
            "I have paid £250 / £500 as a litigation funding contribution",
            "If the case succeeds, a success fee of 32.5% / 30% + VAT will be deducted from my damages",
            "I understand there is no guarantee either of success or any specific level of damages",
            "I understand that I will incur a potential liability for adverse costs which FIPO will seek to neutralise through appropriate ATE insurance",
            "I have noted that I should ensure that my professional indemnity insurance is not affected by participation in litigation against insurers and will notify my insurer if required",
          ],
        },
        {
          title: "I understand this is legally binding",
          items: [
            "The documents I have signed are legally binding and cannot be easily withdrawn from",
            "I have had the opportunity to seek independent legal advice (whether or not I chose to do so)",
            "I am participating voluntarily with full understanding of the implications",
          ],
        },
        {
          title: "I confirm my eligibility",
          items: [
            "I am a registered medical practitioner (GMC number: [auto-fill])",
            "I have received income from private medical insurers",
            "I am not employed by or acting for any of the defendant insurance companies",
          ],
        },
        {
          title: "I confirm the accuracy of my information",
          items: [
            "All information I have provided is true and accurate to the best of my knowledge",
            "I will notify Harcus Parker if any material information changes",
            "I understand providing false information could invalidate my participation",
          ],
        },
      ],
      closingNote: "Do not complete until you are satisfied you understand the implications.",
    },
  },
} as const;

export const explanationsUpload = {
  id: "upload-evidence",
  title: "How To Upload Your Evidence",
  intro:
    "After completing the sign-up process, you will be asked to upload documents evidencing your relationship with Bupa and/or AXA PPP. This is important: your share of any damages will be calculated by reference to the fees you received from the insurers, so the more complete your evidence, the better.",
  sections: [
    {
      title: "What to Upload",
      bullets: [
        "Fee schedules received from Bupa or AXA PPP (any years for which you have them);",
        "Correspondence with the insurers about fees or recognition;",
        "Payment records or remittance advices from the insurers;",
        "Any specialist recognition letters or agreements; and",
        "Any other documents relating to your financial relationship with the insurers.",
      ],
    },
    {
      title: "What Format?",
      body: "Documents can be uploaded as PDFs, Word documents, images (JPG or PNG), or Excel spreadsheets. Please label them clearly (e.g. 'Bupa fee schedule 2022', 'AXA correspondence March 2024').",
    },
    {
      title: "What If I Don't Have Much Documentation?",
      body: "Don't worry — join the claim anyway. Harcus Parker will work with you to reconstruct your fee history, including by requesting information directly from the insurers on your behalf. The more members who join, the stronger the overall evidential picture.",
    },
  ],
} as const;

export const explanationsDocumentHold = {
  id: "document-hold",
  title: "Document Hold",
  body: "DOCUMENT HOLD NOTICE: By joining the Action Group, you are required from the date of your membership to preserve all documents and data in your possession, custody or control that may be relevant to the claims. This includes emails, letters, fee schedules, payment records and any other communications with or about Bupa or AXA PPP. Do not delete, destroy or overwrite any such documents. This obligation applies even if the documents would otherwise be subject to routine deletion under your data retention policy.",
} as const;

export const explanationsSummaryRisk = {
  id: "summary-risk",
  title: "Summary Risk Warning",
  items: [
    {
      title: "No Guarantee of Success",
      body: "This is litigation, not an investment. There is no guarantee we will win or recover any damages. You could lose your entire contribution if the case fails.",
    },
    {
      title: "Time Commitment",
      body: "Complex litigation typically takes 2-5 years. Be prepared for a long process with no quick resolution.",
    },
    {
      title: "Costs Protection",
      body: "We will have ATE insurance to protect against having to pay defendants' costs if we lose. However, your contribution is at risk and insurance cannot remove the theoretical risk of the insurance failing.",
    },
    {
      title: "Irrevocability",
      body: "Once you sign the legal documents, you cannot easily withdraw.",
    },
    {
      title: "Tax Implications",
      body: "Any damages you receive may be taxable. Seek independent tax advice.",
    },
  ],
} as const;

export const explanationsCta = {
  label: "Join the claim",
  href: "/#join",
} as const;
