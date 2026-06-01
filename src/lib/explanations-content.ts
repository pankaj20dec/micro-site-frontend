export type ExplanationsToc = {
  id: string;
  label: string;
};

export const explanationsIntro = {
  eyebrow: "EXPLANATIONS",
  notice: {
    title: "Read this first",
    body: "This page explains, in plain English, what the action is about, the legal grounds being relied on, and what you can expect if you join. It is for general information only and is not legal advice.",
  },
} as const;

export const explanationsToc: ReadonlyArray<ExplanationsToc> = [
  { id: "introduction", label: "Introduction" },
  { id: "what-we-claim", label: "What we are claiming" },
  { id: "legal-grounds", label: "Legal grounds" },
  { id: "how-it-works", label: "How it works" },
  { id: "the-process", label: "The process" },
  { id: "eligibility", label: "Eligibility" },
  { id: "next-steps", label: "Next steps" },
];

export const explanationsIntroduction = {
  id: "introduction",
  title: "An Introduction To The Claim",
  paragraphs: [
    "For many years, the major UK private medical insurers (PMIs) have exercised disproportionate control over the fees paid to independent consultants. The Fair Pay Action Group, led by FIPO and Harcus Parker, exists to challenge that control where it has crossed the line into unlawful conduct.",
    "The claim seeks both compensation for affected consultants and a structural reset of the way fees are set and disclosed, so that the relationship between insurer, consultant and patient is fair and transparent going forward.",
  ],
} as const;

export const explanationsClaimPoints = {
  id: "what-we-claim",
  title: "What We Are Claiming",
  intro:
    "The claim has three core strands. Each is treated independently in the underlying legal arguments and they can succeed individually or together.",
  items: [
    {
      number: "01",
      title: "Suppressed Fees",
      description:
        "PMIs have for years imposed fee schedules that are not the product of free negotiation. Consultants have been paid materially less than a competitive market would have produced.",
      tone: "purple" as const,
    },
    {
      number: "02",
      title: "Restricted Practice",
      description:
        "Network terms have dictated how consultants can practise, contract and refer — including a prohibition on charging above schedule even where the work warrants it.",
      tone: "blue" as const,
    },
    {
      number: "03",
      title: "Patient Steering",
      description:
        "Patients have been directed away from the consultant of their choice through opaque referral and approval systems that prioritise insurer economics over clinical fit.",
      tone: "amber" as const,
    },
  ],
} as const;

export const explanationsLegalGrounds = {
  id: "legal-grounds",
  title: "The Legal Grounds, In Plain Terms",
  intro:
    "The claim is built on established UK and EU law. We are not asking a court to invent new doctrine — we are asking it to apply existing principles to a market where they have not been enforced for too long.",
  cards: [
    {
      title: "Competition Law",
      body: "We say the major PMIs have operated agreements and concerted practices that restrict competition between consultants and suppress fees below a competitive level — contrary to UK and EU competition rules.",
    },
    {
      title: "Restraint Of Trade",
      body: "Network rules and recognition terms unreasonably restrain how consultants can practise, contract and earn. The common-law doctrine of restraint of trade has long policed exactly this kind of restriction.",
    },
    {
      title: "Economic Torts",
      body: "Where unlawful interference with a consultant's practice has caused measurable financial harm — for example through coordinated expulsion threats — that loss is recoverable as a matter of tort.",
    },
    {
      title: "Statutory Duties",
      body: "Insurers operate in a regulated market and owe related duties of transparency. Where those duties have been ignored to the detriment of consultants and patients, the same conduct supports the wider claim.",
    },
  ],
} as const;

export const explanationsHowItWorks = {
  id: "how-it-works",
  title: "How A Group Claim Works",
  paragraphs: [
    "A group claim allows a large number of consultants to bring a single coordinated case rather than each pursuing the insurer alone. The economics, the evidence and the legal strategy are shared.",
    "Harcus Parker leads the litigation. FIPO acts as the claimant representative and as the bridge between members and the legal team. The case is funded under a no-win-no-fee style arrangement and is supported by after-the-event insurance, so claimants are not personally exposed to adverse legal costs if the claim is unsuccessful.",
  ],
  callout: {
    title: "What that means for you",
    body: "Sign-up is straightforward, your personal exposure is small, and the heavy lifting — drafting, disclosure, expert evidence, court applications — is handled by Harcus Parker and the funder.",
  },
} as const;

export const explanationsProcess = {
  id: "the-process",
  title: "The Process From Sign-Up To Recovery",
  steps: [
    {
      title: "Sign up",
      body: "Complete the online registration and choose your membership level. Most consultants finish this in under fifteen minutes.",
    },
    {
      title: "Sign documents",
      body: "Execute the engagement letter, retainer and a limited power of attorney online. These are drafted to be clear and self-explanatory.",
    },
    {
      title: "Share evidence",
      body: "Upload the records you already have — fee schedules, sample correspondence and payment records — so the legal team can build the picture.",
    },
    {
      title: "We pursue the claim",
      body: "Harcus Parker takes the case forward. You will receive updates at every key stage and will be consulted on major decisions.",
    },
    {
      title: "Recovery and reform",
      body: "If the claim succeeds, recoveries are distributed in line with the engagement letter. The reform component aims to change how fees are set in future.",
    },
  ],
  facts: {
    title: "Key practical points",
    bullets: [
      "There is no minimum income threshold to join — modest claims still add up across the group.",
      "Retired consultants are eligible if they treated insured patients during the relevant period.",
      "Your participation is confidential and is not disclosed to insurers on a name-by-name basis.",
      "Communications with Harcus Parker are protected by legal professional privilege.",
    ],
  },
  warning:
    "Group litigation of this scale typically runs for several years from issue to resolution. We will keep you informed at every key stage, including in any settlement discussions.",
} as const;

export const explanationsEligibility = {
  id: "eligibility",
  title: "Are You Eligible To Join?",
  intro:
    "If you have treated patients funded by Bupa, AXA PPP or other major UK private medical insurers during the relevant period, you are very likely eligible. The list below sets out the typical profile.",
  items: [
    {
      title: "Current and former consultants",
      body: "Whether you are still in active private practice or have since retired, you can join if you treated insured patients in the relevant period.",
    },
    {
      title: "Specialty is not a barrier",
      body: "The claim is not limited to a particular specialty. Surgeons, physicians, anaesthetists, psychiatrists and others have all been affected.",
    },
    {
      title: "Insurer is not a barrier",
      body: "If you are unsure which insurers you have billed, sign up anyway — anonymised insurer data will be used to identify your eligible treatments.",
    },
    {
      title: "Estates of deceased consultants",
      body: "A claim survives death and forms part of the estate. Executors can continue it on the same terms.",
    },
  ],
} as const;

export const explanationsNextSteps = {
  id: "next-steps",
  title: "Next Steps",
  paragraphs: [
    "If you would like to join, the quickest way is to start the online registration. If you would like to talk first, our team is happy to answer questions before you commit.",
  ],
  legal: {
    title: "Legal queries",
    email: "fipo@harcusparker.co.uk",
    note: "For questions about joining the claim or the legal arguments, contact Harcus Parker directly.",
  },
  admin: {
    title: "Administrative queries",
    email: "office@fipo.uk",
    note: "For questions about FIPO membership or general administration, contact the FIPO office.",
  },
  cta: {
    label: "Join the claim",
    href: "/#join",
  },
} as const;
