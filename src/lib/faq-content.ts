export type FaqItem = {
  id: string;
  question: string;
  /** A single paragraph, or an array of paragraphs rendered as separate <p> blocks. */
  answer: string | readonly string[];
};

export const faqIntro = {
  eyebrow: "FREQUENTLY-ASKED QUESTIONS",
} as const;

/**
 * Flat list of FAQ items rendered as a numbered accordion.
 * Edit copy here without touching the components.
 */
export const faqItems: ReadonlyArray<FaqItem> = [
  {
    id: "claim-overview",
    question: "What is this Claim about, in plain terms?",
    answer:
      "In plain terms: Bupa and AXA PPP have, we allege, used their grip on the private medical market to keep your fees artificially low — not necessarily by colluding with each other, but because the sheer weight of their individual market power has produced the same result. You have been paid less than a fair market would have delivered, for years. Three distinct legal arguments  - from competition law and the common law doctrines of restraint of trade and interference with business by unlawful means - together give practitioners a strong, multi-layered basis to recover that loss.",
  },
  {
    id: "power-of-attorney",
    question: "What will happen after I grant a Power of Attorney to FIPO?",
    answer:
      "FIPO will take on full responsibility for the conduct of the litigation. This includes devising legal strategy, instructing Harcus Parker and counsel, managing day-to-day developments, and representing your interests in any negotiations or court proceedings. You will not need to attend court or deal with the defendants directly.",
  },
  {
    id: "ongoing-responsibilities",
    question: "What continuing responsibilities will I have?",
    answer:
      "You will need to: (1) preserve and disclose all relevant documents in your possession (see the Document Hold Notice above); (2) cooperate with FIPO and Harcus Parker and counsel in the evidence-gathering process; and (3) potentially provide a witness statement or give evidence if required, though this is unlikely in a case involving many hundreds of practitioners.",
  },
  {
    id: "involvement-burden",
    question: "How onerous will my involvement be?",
    answer:
      "In practice, not very. The most likely requirement is that you will need to sign a statement of truth confirming that you have carried out a proper search for relevant documents — a serious but not burdensome obligation. It is possible, though unlikely, that you will be asked to give a witness statement. FIPO and Harcus Parker will make the process as simple as possible and will guide you at every step.",
  },
  {
    id: "legal-basis",
    question: "What is the legal basis of the Claim?",
    answer: [
      "The Claim rests on three legal foundations. First, competition law: we believe Bupa and AXA PPP have breached the Chapter I and Chapter II prohibitions of the Competition Act 1998, by (a) applying restrictive fee practices across a substantial part of the market and / coordinating their fee schedules with each other (contrary to Section 2) and (b) individually abusing their dominant market positions to impose unfairly low fees and restrictive practices on consultants (contrary to Section 18).", 
      "Second, the common law doctrine of restraint of trade: this longstanding legal principle prevents parties from using their economic power to distort a market in a way that causes unjustified harm to others. Third, potential additional common law economic torts, including interference with business by unlawful means. Together, these legal bases give practitioners a right to claim compensation for the income they have lost as a result of the insurers' conduct.",
    ]
  },
  {
    id: "patient-cost",
    question: "Will this make private medical care more expensive for patients?",
    answer:
      "No. FIPO has campaigned for many years for a properly functioning private medical market — one that does not restrict patient choice, allows genuine competition, and enables practitioners to be paid fairly. Fair fees for practitioners do not automatically mean higher insurance premiums. A competitive market in which practitioners are fairly rewarded is in patients' interests too: it supports the recruitment and retention of highly skilled practitioners, reduces the risk of practitioners leaving the private sector, and means that clinical decisions are not distorted by financial pressure. The current below-market fee structure benefits the insurers' profit margins — not patients."
 },
  {
    id: "risks",
    question: "What are the risks?",
    answer:
      "The main legal risk is an adverse costs order if the Claim fails. However, the structure is designed to protect you: (1) FIPO will not issue proceedings without ATE insurance in place to cover this risk; (2) FIPO itself bears primary responsibility for any adverse costs; (3) any third-party funder also bears responsibility; and (4) even in a worst-case scenario, your individual liability would be proportionate (i.e. a small fraction of the total). The more practitioners who join, the smaller the individual exposure.",
  },
  {
    id: "soundings",
    question: "How will FIPO take soundings from members?",
    answer:
      "FIPO will consider all representations made to it by members. It is also in regular contact with the specialist practitioner organisations that are its direct members — major decisions will, where practicable, be discussed with representatives of those organisations rather than requiring individual consultation with thousands of practitioners.",
  },
  {
    id: "own-solicitor",
    question: "Do I need my own Solicitor to sign the documents?",
    answer:
      "You are not required to instruct your own Solicitor, but you are strongly encouraged to take independent legal advice before signing, particularly regarding the Power of Attorney and the tax implications. At minimum, make sure the documents are properly witnessed as described in the sign-up flow.",
  },
  {
    id: "unsure-insurers",
    question: "What if I am not sure which Insurance companies I have worked with?",
    answer:
      "Please list all private medical insurers you believe you have had agreements with, even if you are not certain. FIPO and Harcus Parker will verify your relationship with the insurers through the documentation you provide and, if necessary, by contacting the insurers directly on your behalf.",
  },
  {
    id: "separate-claim",
    question: "Can I also pursue a separate claim against the insurers myself?",
    answer:
      "No. Once you have signed the Power of Attorney (which is irrevocable after the cooling-off period), you cannot pursue or settle the same claims independently. This is an essential feature of the collective action structure.",
  },
  {
    id: "additional-claims",
    question:
      "What if I discover I have additional claims against other Insurers not named in this action?",
    answer:
      "Contact FIPO as soon as possible. Claims against smaller insurers with few affected practitioners may be more difficult to pursue economically, but FIPO will consider each situation individually.",
  },
  {
    id: "fipo-insolvent",
    question: "What happens if FIPO becomes insolvent?",
    answer:
      "This is considered very unlikely. However, if it did occur, your subscription and any damages held on your behalf would be protected — they are ring-fenced and cannot be claimed by [Organisation]'s creditors. The practical conduct of the Claim would be affected, and Harcus Parker and/or members would need to make alternative arrangements to continue the litigation.",
  },
  {
    id: "death",
    question: "What happens if I die before the litigation concludes?",
    answer:
      "Your estate would be entitled to receive your Proportionate Share of any damages. However, death automatically revokes a Power of Attorney, which means your personal representatives will need to execute a new Power of Attorney to continue the Claim on behalf of your estate.",
  },
  {
    id: "timing",
    question: "How long will it take before I receive any payment?",
    answer:
      "Complex commercial litigation typically takes between two and five years from the issue of proceedings to resolution. The sign-up and pre-action phase will take additional time before proceedings are issued. Settlement before trial — which is a realistic possibility — could shorten this timeline. We cannot give any guarantee of success or timing.",
  },
  {
    id: "legal-team",
    question: "Who is in the Legal team?",
    answer: [
      "The main members are:",
      "Professor Suzanne Rab - a barrister in private practice at Matrix Chambers, who is well known to the medical profession and who has worked on these issues for many years. She represented FIPO in proceedings before the Competition Commission/Competition and Markets Authority, Competition Appeal Tribunal and Court of Appeal in its challenge to the Private Healthcare Market Investigation. She is involved in multiple collective actions involving competition law claims.",
      "Harcus Parker, solicitors is a specialist group litigation and competition law firm and is ranked in the major directories as a leading firm for such work. Partner Jeremy Robinson has acted for FIPO alongside Professor Rab for many years.",
      "The key personnel acting will be:",
      "Jeremy Robinson    - Jeremy has practised antitrust and competition law since 1999. He has advised on a wide range of issues, including anti-competitive agreements, abuses of dominance, market investigations, merger control, and subsidy control (including State aid). He has acted on cases before the Competition and Markets Authority, the Civil Aviation Authority, and the European Commission, and has appeared before the Competition Appeal Tribunal, the High Court, the Court of Appeal, and the Court of Justice of the EU.",
      "Tom Ross  - Tom has extensive experience in banking and finance litigation, including disputes involving structured products, investment funds, and regulatory investigations. He has advised clients across a broad range of financial services matters and is known for his pragmatic and commercial approach to resolving high-stakes disputes.",
      "He also has significant expertise in competition litigation. Tom was involved in both the LIBOR and Forex investigations and represented two major airlines in the UK air cargo cartel proceedings. Those airlines were the first to reach successful settlements in the litigation. He has since presented at conferences on settlement strategy in multi-party proceedings.",
      "The Legal 500 notes:",
      '“Tom Ross and Jeremy Robinson are highly experienced and competent partners, focused on commercial and competition law, and excellent communicators. Customer centric, hardworking and committed, they are ideal partners and team players.”'
    ],
  },
  {
    id: "communications-confidentiality",
    question: "Are my communications with FIPO and Harcus Parker confidential?",
    answer:
      "Yes. Harcus Parker acts as your solicitor and communications between you and Harcus Parker are protected by legal professional privilege. FIPO acts as Harcus Parker’s agent when it receives information from members, so those communications are also privileged. This is important because it means the defendants cannot require those communications to be disclosed to them.",
  },
  {
    id: "retired",
    question: "I retired from private practice. Can I still join?",
    answer:
      "Yes, provided you received payments from Bupa or AXA PPP within the past six years. If you retired more than six years ago, please contact us — the relevant limitation period may affect your ability to claim.",
  },
  {
    id: "small-income",
    question: "I only have a small amount of PMI income. Is it worth joining?",
    answer:
      "Yes. Individual claims are not assessed for minimum value — what matters is the collective strength of the group. Even if your individual losses are modest, your participation strengthens the overall claim, and you are entitled to your proportionate share of any damages recovered.",
  },
  {
    id: "confidentiality",
    question: "Will my involvement in the Claim be kept confidential?",
    answer:[
      "Before proceedings are issued - including throughout the pre-action and Letter Before Claim stage - your identity will be kept strictly confidential. The defendants will not know who has joined but it may be necessary to issue periodic updates on aggregate numbers of sign-ups.",
      "If and once proceedings are issued, the position changes. Court rules require that the individuals on whose behalf a claim is brought are identifiable. Your details will be included in a confidential schedule to the proceedings with unique identifiers matched to your identification details rather than in any public document. FIPO and Harcus Parker will seek all available confidentiality protections from the court to ensure that specific details are only disclosed at the appropriate stage in the proceedings where strictly necessary. But in order to support the Claim, validate your loss and pay out any compensation due to you: the basic details needed to identify that you have a claim will need to be disclosed to the court.",
      "This should not deter you, for two reasons. First, the insurers already hold your details on their own systems — you are not revealing anything they do not already know. Second, by the time proceedings are issued, if necessary, there will be strength in numbers. A large group of practitioners, collectively represented, is far harder to pressure than any individual acting alone. That collective protection is one of the principal reasons the Action Group structure exists.",
      "If you have specific concerns, contact office@fipo.uk or fipo@harcusparker.co.uk before signing."
    ]
  },
];

export const faqContact = {
  eyebrow: "Contact",
  legal: {
    title: "Legal Enquiries",
    description:
      "For legal enquiries relating to the Claim, please contact Harcus Parker:",
    email: "fipo@harcusparker.co.uk",
  },
  admin: {
    title: "Administrative Enquiries",
    description: "For administrative or general FIPO enquiries:",
    email: "office@fipo.uk",
  },
  disclaimer:
    "Please note: the FAQs above are for general information purposes only and do not constitute legal advice. Your specific position will be confirmed in the engagement letter you sign with Harcus Parker.",
} as const;
