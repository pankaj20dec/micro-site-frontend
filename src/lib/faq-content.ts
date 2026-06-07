export type FaqItem = {
  id: string;
  question: string;
  answer: string;
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
    question: "What Is This Claim About, In Plain Terms?",
    answer:
      "It looks at the years in which the major UK private medical insurers have suppressed and unfairly fixed the fees they pay to consultants for treating their members. The Fair Pay Action Group, led by Harcus Parker, is bringing a collective claim to recover those losses for affected consultants and to restore a transparent, market-based fee structure going forward.",
  },
  {
    id: "power-of-attorney",
    question: "What Will Happen When I Grant A Power Of Attorney To FIPO?",
    answer:
      "The limited Power of Attorney lets FIPO take steps on your behalf in connection with the claim — for example, signing the engagement letter with Harcus Parker, instructing the lawyers, and accepting communications from the court. It does not give FIPO any authority over your practice, your patients or your finances.",
  },
  {
    id: "ongoing-responsibilities",
    question: "What Continuing Responsibilities Will I Have?",
    answer:
      "Very few. You agree to keep your contact details up to date, to respond to occasional requests for information from Harcus Parker, and — only if your case is selected as a sample — to assist with a witness statement. The lawyers do the heavy lifting.",
  },
  {
    id: "involvement-burden",
    question: "How Onerous Will My Involvement Be?",
    answer:
      "For the vast majority of claimants, involvement is minimal. Most claimants spend less than an hour on the entire process — completing the sign-up form and reviewing the engagement letter. Only a small number of representative claimants are asked to provide witness evidence.",
  },
  {
    id: "legal-basis",
    question: "What Is The Legal Basis Of The Claim?",
    answer:
      "The claim is brought principally under UK and EU competition law, alleging that the major insurers have abused their market power and operated arrangements that have unlawfully suppressed fees paid to consultants. The detailed legal grounds are set out in the engagement letter.",
  },
  {
    id: "patient-cost",
    question: "Will This Make Private Medical Care More Expensive For Patients?",
    answer:
      "No. The claim is about insurers paying consultants a fair, market-based fee — it is not about increasing premiums or out-of-pocket costs for patients. Fair pay supports the long-term viability of high-quality independent care, which benefits patients.",
  },
  {
    id: "risks",
    question: "What Are The Risks?",
    answer:
      "The claim is funded under a no-win-no-fee style arrangement and is supported by after-the-event insurance, so claimants are not personally exposed to adverse legal costs if the claim is unsuccessful. The principal risk is therefore the time you commit, which is small.",
  },
  {
    id: "soundings",
    question: "How Will FIPO Take Soundings From Members?",
    answer:
      "FIPO will consult the Fair Pay Action Group at every key stage — including any settlement proposal — through email updates, online briefings and written soundings. Major decisions are not taken without member input.",
  },
  {
    id: "own-solicitor",
    question: "Do I Need My Own Solicitor To Sign The Documents?",
    answer:
      "No. The engagement letter, retainer and Power of Attorney have been drafted to be clear and self-explanatory. You are of course free to take independent legal advice if you wish; many claimants do not.",
  },
  {
    id: "unsure-insurers",
    question: "What If I Am Not Sure Which Insurance Companies I Have Worked With?",
    answer:
      "Don't worry — most consultants will have treated patients funded by several insurers over the years. Sign up anyway: Harcus Parker will work with anonymised data from the defendant insurers to identify and value your eligible treatments.",
  },
  {
    id: "separate-claim",
    question: "Can I Also Pursue A Separate Claim Against The Insurers Myself?",
    answer:
      "In principle, yes — but it is rarely sensible to do so once you are part of the group claim. Group litigation gives claimants strength in numbers, shared funding and a coordinated legal strategy that an individual claim cannot match.",
  },
  {
    id: "additional-claims",
    question:
      "What If I Discover I Have Additional Claims Against Other Insurers Not Named In This Action?",
    answer:
      "Tell Harcus Parker. The claim is structured to allow new defendants and new claimants to be added as the picture becomes clearer. Additional claims can normally be folded into the group action without affecting your existing position.",
  },
  {
    id: "fipo-insolvent",
    question: "What Happens If FIPO Becomes Insolvent?",
    answer:
      "Your claim is held with Harcus Parker, not with FIPO. The retainer, the funder's commitment and your individual entitlement to any recovery are unaffected by FIPO's solvency.",
  },
  {
    id: "death",
    question: "What Happens If I Die Before The Litigation Concludes?",
    answer:
      "Your claim survives and forms part of your estate. Your executors or personal representatives can continue the claim on the same terms and any recovery is paid to your estate.",
  },
  {
    id: "timing",
    question: "How Long Will It Take Before I Receive Any Payment?",
    answer:
      "Group litigation of this scale typically runs for several years from issue to resolution. Harcus Parker will keep claimants updated at every key stage, including any settlement discussions which can sometimes shorten that timeline.",
  },
  {
    id: "legal-team",
    question: "Who Is In The Legal Team?",
    answer:
      "Harcus Parker is the instructed firm and leads the case. The team includes specialist competition partners and senior counsel with extensive experience in collective actions. Full team biographies are available on the Harcus Parker website.",
  },
  {
    id: "communications-confidentiality",
    question: "Are My Communications With FIPO And Harcus Parker Confidential?",
    answer:
      "Yes. Communications with Harcus Parker are protected by legal professional privilege. FIPO treats your involvement as confidential and your name is not disclosed to insurers on a name-by-name basis.",
  },
  {
    id: "retired",
    question: "I Retired From Private Practice. Can I Still Join?",
    answer:
      "Yes. The claim relates to historic treatments, so retired consultants who treated insured patients during the relevant period are eligible to join.",
  },
  {
    id: "small-income",
    question: "I Only Have A Small Amount Of PMI Income. Is It Worth Joining?",
    answer:
      "Yes — there is no minimum threshold. Even modest individual claims add up across the group, and your participation is essentially cost-free under the funding arrangement.",
  },
  {
    id: "confidentiality",
    question: "Will My Involvement In The Claim Be Kept Confidential?",
    answer:
      "Yes. The claimant group is represented collectively, and your individual participation is not disclosed to insurers or third parties unless you give specific consent or a court orders disclosure.",
  },
];

export const faqContact = {
  eyebrow: "Contact",
  legal: {
    title: "Legal Enquiries",
    description:
      "For legal queries relating to joining and case-related questions, contact:",
    name: "Liz Holmes",
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
