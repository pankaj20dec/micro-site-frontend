"use client";

import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { getApiBase } from "@/lib/api";
import { getUserToken, setUserToken, clearUserToken, getUser } from "@/lib/user-auth";
import {
  saveStep,
  requestSaveResume,
  saveEvidenceFile,
  uploadEvidenceFile,
  capturePaypalOrder,
  pollPaymentStatus,
  confirmStripePayment,
  fetchApplication,
  fetchDocusignStatus,
  pollDocusignStatus,
  startDocusignSigning,
  startWitnessDocusignSigning,
  isDocusignComplete,
  isDocusignInProgress,
  isSignerStatusDone,
  pickPrimarySigner,
  isWitnessSigningComplete,
  shouldOfferStage1Restart,
  isStage2EnvelopeComplete,
  describeEnvelopeSignerProgress,
  openSignedDocusignPdf,
  downloadSignedDocusignPdf,
  docusignStatusMessage,
  docusignReturnEventMessage,
  getPmiEvidenceFiles,
  getWitnessEvidenceFiles,
  deleteEvidenceFile,
  WITNESS_EVIDENCE_UPLOAD_KEYS,
  type DocusignStatusResponse,
  type EvidenceFileRecord,
  type StartDocusignResponse,
} from "@/lib/application-api";
import MembershipPaymentSection, {
  type PaymentSectionHandle,
} from "./sections/MembershipPaymentSection";
import { SaveResumeModal } from "@/components/common/SaveResumeModal";
import {
  explanationsDocuments,
  explanationsSummaryRisk,
} from "@/lib/explanations-content";

type SectionId = "supporter" | "payment" | "confirmation" | "identity";

const SECTIONS: { id: SectionId; label: string }[] = [
  { id: "supporter", label: "Supporter Registration" },
  { id: "payment", label: "Membership & Payment" },
  { id: "confirmation", label: "Confirmation & Next Steps" },
  { id: "identity", label: "Identity Verification" },
];

type ClaimantSectionId = "overview" | "stage1" | "stage2";

const CLAIMANT_SECTIONS: { id: ClaimantSectionId; label: string }[] = [
  { id: "overview", label: "Become a Claimant Member" },
  {
    id: "stage1",
    label:
      "Stage 1: approval of the terms of FIPO\u2019s engagement with Harcus Parker and Counsel",
  },
  {
    id: "stage2",
    label:
      "Stage 2: execution of a power of attorney [DP26.1]in FIPO\u2019s favour authorising FIPO to bring proceedings against the PMIs on your behalf and agreement to the Litigation Management Agreement.",
  },
];

const CLAIMANT_STAGE_SECTIONS = CLAIMANT_SECTIONS.filter((s) => s.id !== "overview");

const TABS = [
  "Become A Supporter",
  "Legal Documents",
  "Become A Claimant",
  "Final Confirmation",
];

type LegalSectionId = "overview" | "practice" | "pmi" | "evidence";

const LEGAL_SECTIONS: { id: LegalSectionId; label: string }[] = [
  {
    id: "overview",
    label: "STEP 2: become a Claimant Member of the FIPO Fair Pay Action Group",
  },
  { id: "practice", label: "Practice information" },
  { id: "pmi", label: "Private medical insurers relationship details" },
  { id: "evidence", label: "Evidence upload" },
];

const TITLES = ["Dr", "Prof", "Mr", "Mrs", "Ms", "Miss", "Mx"];

const PURPLE = "#802B7D";
const PMI_FORM_DRAFT_KEY = "pmi_form_draft";
const CLAIMANT_ACTIVE = "#660066";
const CLAIMANT_HEADING = "#223645";
const CLAIMANT_PANEL_BG = "#FBF7FE";
const CLAIMANT_PANEL_BORDER = "#F4ECFB";
const CLAIMANT_STAGE2_BTN_BG = "#F3EAF3";
const CLAIMANT_INPUT_BORDER = "#b2bfcf";

function membershipLabel(type: string) {
  return type === "ORGANISATION" ? "£500 membership" : "£250 membership";
}

function isValidGmcNumber(value: string) {
  return /^([A-Za-z]\d{7}|\d{7})$/.test(value.trim());
}

function normalizeGmcNumberInput(value: string) {
  const cleaned = value.replace(/[^A-Za-z0-9]/g, "").toUpperCase();
  if (!cleaned) return "";
  // Allow optional leading letter, then up to 7 digits.
  if (/^[A-Z]/.test(cleaned)) {
    const letter = cleaned[0];
    const digits = cleaned.slice(1).replace(/\D/g, "").slice(0, 7);
    return `${letter}${digits}`;
  }
  return cleaned.replace(/\D/g, "").slice(0, 7);
}

function todayIsoDate() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function yearsAgoIsoDate(years: number) {
  const d = new Date();
  d.setFullYear(d.getFullYear() - years);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

const DOB_MIN_ISO = yearsAgoIsoDate(120);
const DOB_MAX_ISO = yearsAgoIsoDate(18);

function parseIsoDateParts(isoDate: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(isoDate.trim());
  if (!match) return null;
  const y = Number(match[1]);
  const m = Number(match[2]);
  const d = Number(match[3]);
  if (y < 1000) return null; // reject years like 0002
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) {
    return null;
  }
  return { y, m, d };
}

function dobValidationError(isoDate: string): string | null {
  if (!isoDate.trim()) return "Please enter your date of birth.";
  if (!parseIsoDateParts(isoDate)) return "Please enter a valid date of birth.";
  const value = isoDate.trim();
  if (value > todayIsoDate()) return "Date of birth cannot be a future date.";
  if (value < DOB_MIN_ISO) return "Please enter a realistic date of birth.";
  if (value > DOB_MAX_ISO) return "You must be at least 18 years old to register.";
  return null;
}

function normalizePhoneInput(value: string) {
  // Allow digits, spaces, hyphens, parentheses, and a leading +.
  const cleaned = value.replace(/[^\d+\s()-]/g, "");
  const hasPlus = cleaned.trimStart().startsWith("+");
  const rest = cleaned.replace(/\+/g, "");
  return hasPlus ? `+${rest}` : rest;
}

function phoneDigitCount(value: string) {
  return value.replace(/\D/g, "").length;
}

function isValidPhoneNumber(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return false;
  if (!/^\+?[\d\s()-]+$/.test(trimmed)) return false;
  const digits = phoneDigitCount(trimmed);
  return digits >= 10 && digits <= 15;
}

function phoneValidationError(value: string, required = true): string | null {
  if (!value.trim()) {
    return required ? "Please enter your phone number." : null;
  }
  if (!isValidPhoneNumber(value)) {
    return "Please enter a valid phone number (10–15 digits).";
  }
  return null;
}

interface Props {
  application: Record<string, unknown> | null;
}

// Rebuild the wizard's position (which tab/section is open and what's done)
// from the saved application's currentStep, so a resumed session lands where
// the user left off instead of at the very beginning.
function resumePosition(step: number) {
  const doneSections = new Set<SectionId>();
  let open: SectionId = "supporter";
  let activeTab = 0;
  const completedTabs = new Set<number>();
  let legalOpen: LegalSectionId = "overview";
  const legalDoneSections = new Set<LegalSectionId>();
  let claimantOpen: ClaimantSectionId = "overview";
  const claimantDoneSections = new Set<ClaimantSectionId>();

  if (step >= 2) { doneSections.add("supporter"); open = "payment"; }
  if (step >= 3) { doneSections.add("payment"); open = "confirmation"; }
  if (step >= 4) { doneSections.add("confirmation"); open = "identity"; }
  if (step >= 5) { doneSections.add("identity"); activeTab = 1; completedTabs.add(0); }
  if (step >= 6) {
    activeTab = 2;
    completedTabs.add(0);
    completedTabs.add(1);
    legalDoneSections.add("overview");
    legalDoneSections.add("practice");
    legalDoneSections.add("pmi");
    legalDoneSections.add("evidence");
    legalOpen = "evidence";
  }
  if (step >= 7) {
    activeTab = 3;
    completedTabs.add(2);
    claimantDoneSections.add("overview");
    claimantDoneSections.add("stage1");
    claimantDoneSections.add("stage2");
    claimantOpen = "stage2";
  }
  if (step >= 8) { completedTabs.add(3); }

  return {
    doneSections,
    open,
    activeTab,
    completedTabs,
    legalOpen,
    legalDoneSections,
    claimantOpen,
    claimantDoneSections,
  };
}

export default function AccordionRegistration({ application }: Props) {
  const router = useRouter();

  // ── Prefill from a previously saved (resumed) application ──
  const savedStage1 = (application?.stage1Data ?? {}) as Record<string, unknown>;
  const savedStage2 = (application?.stage2Data ?? {}) as Record<string, unknown>;
  const witnessSaved = (savedStage2.witness as Record<string, unknown>) ?? {};
  const initialWitnessFiles = getWitnessEvidenceFiles(application);
  const str = (v: unknown) => (typeof v === "string" ? v : "");
  const savedStep =
    typeof application?.currentStep === "number" ? application.currentStep : 1;
  const initial = resumePosition(savedStep);

  const [open, setOpen] = useState<SectionId>(initial.open);
  const [done, setDone] = useState<Set<SectionId>>(initial.doneSections);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  // ── Supporter Registration fields ──
  const [title, setTitle] = useState(str(savedStage1.title));
  const [forename, setForename] = useState(str(savedStage1.forename));
  const [surname, setSurname] = useState(str(savedStage1.surname));
  const [email, setEmail] = useState(str(savedStage1.email));
  const [gmcNumber, setGmcNumber] = useState(str(savedStage1.gmcNumber));
  const [address, setAddress] = useState(str(savedStage1.address));
  const [dob, setDob] = useState(str(savedStage1.dob));
  const [phone, setPhone] = useState(str(savedStage1.phone));
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirm1, setConfirm1] = useState(!!savedStage1.confirmedPractitioner);
  const [confirm2, setConfirm2] = useState(!!savedStage1.confirmedIndependentDecision);

  // ── Payment fields ──
  const [membershipType, setMembershipType] = useState(
    str(application?.membershipType) || "INDIVIDUAL"
  );
  const savedProvider = str(application?.paymentProvider);
  const [payMethod, setPayMethod] = useState<"stripe" | "paypal" | null>(
    savedProvider === "STRIPE"
      ? "stripe"
      : savedProvider === "PAYPAL"
        ? "paypal"
        : null
  );
  const [paymentPaid, setPaymentPaid] = useState(
    application?.paymentStatus === "PAID"
  );
  const paymentRef = useRef<PaymentSectionHandle>(null);
  const handlePaymentPaid = useCallback(() => setPaymentPaid(true), []);

  // ── Identity ──
  const [idFile, setIdFile] = useState<File | null>(null);
  const [identityConsent, setIdentityConsent] = useState(false);
  const [legalOpen, setLegalOpen] = useState<LegalSectionId>(initial.legalOpen);
  const [legalDone, setLegalDone] = useState<Set<LegalSectionId>>(initial.legalDoneSections);
  const [claimantOpen, setClaimantOpen] = useState<ClaimantSectionId>(initial.claimantOpen);
  const [claimantDone, setClaimantDone] = useState<Set<ClaimantSectionId>>(
    initial.claimantDoneSections
  );
  const [claimantIntroOpen, setClaimantIntroOpen] = useState(
    initial.claimantOpen === "overview"
  );
  const [finalConfirmedGroups, setFinalConfirmedGroups] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(
      explanationsDocuments.readMore.overarchingDeclaration.groups.map(
        (group) => [group.title, true]
      )
    )
  );
  const [finalSubmitted, setFinalSubmitted] = useState(false);

  // ── Legal tab: practice & PMI fields ──
  const [practiceFullName, setPracticeFullName] = useState(
    str(savedStage1.fullName) || [forename, surname].filter(Boolean).join(" ").trim()
  );
  const [practiceEmail, setPracticeEmail] = useState(
    str(savedStage1.practiceEmail) || email
  );
  const [practicePhone, setPracticePhone] = useState(
    str(savedStage1.practicePhone) || phone
  );
  const [practiceSpecialty, setPracticeSpecialty] = useState(str(savedStage1.specialty));
  const [practiceDeanery, setPracticeDeanery] = useState(str(savedStage1.deanery));
  const [practiceIncome, setPracticeIncome] = useState(str(savedStage1.annualIncome));
  const [practiceYearStarted, setPracticeYearStarted] = useState(
    str(savedStage1.yearStartedPrivatePractice)
  );
  const [practiceYearEnded, setPracticeYearEnded] = useState(
    str(savedStage1.yearEndedPrivatePractice)
  );
  const [practiceBupaNumber, setPracticeBupaNumber] = useState(str(savedStage1.bupaNumber));
  const [practiceAxaNumber, setPracticeAxaNumber] = useState(str(savedStage1.axaNumber));
  const [practiceRecognisedOther, setPracticeRecognisedOther] = useState<boolean | null>(
    savedStage1.recognisedByOtherInsurers === true
      ? true
      : savedStage1.recognisedByOtherInsurers === false
        ? false
        : null
  );
  const [practicePmiPct, setPracticePmiPct] = useState(
    str(savedStage1.pmiPercentage) || "50"
  );

  const pmiSaved = (savedStage1.pmi as Record<string, unknown>) ?? {};
  const [pmiIncomeSource, setPmiIncomeSource] = useState(str(pmiSaved.incomeSource));
  const [pmiPaidAxa, setPmiPaidAxa] = useState(!!pmiSaved.paidDirectlyAxa);
  const [pmiAxaYears, setPmiAxaYears] = useState(str(pmiSaved.axaYears));
  const [pmiPaidBupa, setPmiPaidBupa] = useState(!!pmiSaved.paidDirectlyBupa);
  const [pmiBupaYears, setPmiBupaYears] = useState(str(pmiSaved.bupaYears));
  const [pmiPaidCompany, setPmiPaidCompany] = useState(!!pmiSaved.paidThroughCompany);
  const [pmiCompanyName, setPmiCompanyName] = useState(str(pmiSaved.companyName));
  const [pmiCompanyNumber, setPmiCompanyNumber] = useState(str(pmiSaved.companyNumber));
  const [pmiCompanyDirectors, setPmiCompanyDirectors] = useState(str(pmiSaved.companyDirectors));
  const [pmiPaidLlp, setPmiPaidLlp] = useState(!!pmiSaved.paidThroughLlp);
  const [pmiLlpName, setPmiLlpName] = useState(str(pmiSaved.llpName));
  const [pmiLlpNumber, setPmiLlpNumber] = useState(str(pmiSaved.llpRegistrationNumber));
  const [pmiLlpMembers, setPmiLlpMembers] = useState(str(pmiSaved.llpMembers));
  const [pmiPaidAlternative, setPmiPaidAlternative] = useState(!!pmiSaved.paidThroughAlternative);
  const [pmiUploadingA, setPmiUploadingA] = useState(false);
  const [pmiUploadingB, setPmiUploadingB] = useState(false);
  const pmiUploading = pmiUploadingA || pmiUploadingB;
  const [pmiSavedFiles, setPmiSavedFiles] = useState<EvidenceFileRecord[]>(() =>
    getPmiEvidenceFiles(application)
  );
  const [docusignStatus, setDocusignStatus] = useState(
    str(application?.docusignStatus)
  );
  const [docusignStubMode, setDocusignStubMode] = useState(false);
  const [engagementSigned, setEngagementSigned] = useState(
    !!savedStage1.engagementSigned
  );
  const [engagementStubComplete, setEngagementStubComplete] = useState(false);
  const [evidenceUploading, setEvidenceUploading] = useState(false);
  const [evidenceDisclosureAgreed, setEvidenceDisclosureAgreed] = useState(false);

  // ── Claimant stage 2: witness details ──
  const [witnessName, setWitnessName] = useState(str(witnessSaved.fullName));
  const [witnessEmail, setWitnessEmail] = useState(str(witnessSaved.email));
  const [witnessAddress, setWitnessAddress] = useState(str(witnessSaved.address));
  const [witnessPhotoFile, setWitnessPhotoFile] = useState<EvidenceFileRecord | null>(
    initialWitnessFiles.photoId
  );
  const [witnessProofFile, setWitnessProofFile] = useState<EvidenceFileRecord | null>(
    initialWitnessFiles.proofOfAddress
  );
  const [witnessUploadError, setWitnessUploadError] = useState<string | null>(null);
  const [witnessSigned, setWitnessSigned] = useState(
    !!witnessSaved.declarationSigned ||
      (str(application?.docusignStatus) === "COMPLETED" &&
        !!str(witnessSaved.email))
  );
  const [witnessStubComplete, setWitnessStubComplete] = useState(false);

  function applyPmiFromRecord(pmi: Record<string, unknown>) {
    setPmiIncomeSource(str(pmi.incomeSource));
    setPmiPaidAxa(!!pmi.paidDirectlyAxa);
    setPmiAxaYears(str(pmi.axaYears));
    setPmiPaidBupa(!!pmi.paidDirectlyBupa);
    setPmiBupaYears(str(pmi.bupaYears));
    setPmiPaidCompany(!!pmi.paidThroughCompany);
    setPmiCompanyName(str(pmi.companyName));
    setPmiCompanyNumber(str(pmi.companyNumber));
    setPmiCompanyDirectors(str(pmi.companyDirectors));
    setPmiPaidLlp(!!pmi.paidThroughLlp);
    setPmiLlpName(str(pmi.llpName));
    setPmiLlpNumber(str(pmi.llpRegistrationNumber));
    setPmiLlpMembers(str(pmi.llpMembers));
    setPmiPaidAlternative(!!pmi.paidThroughAlternative);
  }

  function buildPmiPayload(declarationSigned: boolean) {
    return {
      incomeSource: pmiIncomeSource,
      paidDirectlyAxa: pmiPaidAxa,
      axaYears: pmiAxaYears,
      paidDirectlyBupa: pmiPaidBupa,
      bupaYears: pmiBupaYears,
      paidThroughCompany: pmiPaidCompany,
      companyName: pmiCompanyName,
      companyNumber: pmiCompanyNumber,
      companyDirectors: pmiCompanyDirectors,
      paidThroughLlp: pmiPaidLlp,
      llpName: pmiLlpName,
      llpRegistrationNumber: pmiLlpNumber,
      llpMembers: pmiLlpMembers,
      paidThroughAlternative: pmiPaidAlternative,
      declarationSigned,
    };
  }

  // ── Claimant phase ──

  // ── Top-level journey tabs ──
  const [activeTab, setActiveTab] = useState(initial.activeTab);
  const [completedTabs, setCompletedTabs] = useState<Set<number>>(
    initial.completedTabs
  );

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [saveModalSaving, setSaveModalSaving] = useState(false);
  const saveResumePromptShown = useRef(false);
  /** Bring the next accordion into view after Continue (after React paints). */
  const pendingScrollSectionIdRef = useRef<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function prefillPracticeFromSupporter() {
    const fullName = [title, forename.trim(), surname.trim()]
      .filter(Boolean)
      .join(" ")
      .trim();
    if (fullName) setPracticeFullName(fullName);
    if (email.trim()) setPracticeEmail(email.trim());
    if (phone.trim()) setPracticePhone(phone.trim());
  }

  // Practice info: copy identity fields from supporter registration when that step opens.
  useEffect(() => {
    if (legalOpen !== "practice") return;
    prefillPracticeFromSupporter();
    // Only when the Practice Information accordion opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- snapshot supporter fields at open time
  }, [legalOpen]);

  useEffect(() => {
    setIsLoggedIn(!!getUserToken());
    const user = getUser();
    if (user?.email && !str(savedStage1.email)) {
      setEmail(user.email);
    }

    const draftRaw = sessionStorage.getItem(PMI_FORM_DRAFT_KEY);
    if (!draftRaw) return;
    try {
      const draft = JSON.parse(draftRaw) as Record<string, unknown>;
      if (draft.incomeSource) applyPmiFromRecord(draft);
    } catch {
      sessionStorage.removeItem(PMI_FORM_DRAFT_KEY);
    }
  }, []);

  // If DocuSign already finalized and witness details exist, show Stage 2 success.
  useEffect(() => {
    if (docusignStatus !== "COMPLETED") return;
    if (!str(witnessEmail) && !str(witnessSaved.email)) return;
    if (!engagementSigned && !engagementStubComplete) return;
    setWitnessSigned(true);
  }, [docusignStatus, witnessEmail, engagementSigned, engagementStubComplete]);
  useEffect(() => {
    if (!getUserToken()) return;

    let cancelled = false;
    fetchDocusignStatus()
      .then((data) => {
        if (cancelled) return;
        const email = witnessEmail.trim() || str(witnessSaved.email);
        if (
          isWitnessSigningComplete(data, email || undefined) ||
          isStage2EnvelopeComplete(data, email || undefined)
        ) {
          if (!witnessSigned) setWitnessSigned(true);
          return;
        }

        if (witnessSigned || witnessSaved.declarationSigned) {
          // Only clear if the envelope is clearly still open for a witness,
          // or completed without any second signer.
          const signers = data.signers ?? [];
          const stillNeedsWitness =
            isDocusignInProgress(data.status) ||
            (isDocusignComplete(data.status) && signers.length <= 1);
          if (!stillNeedsWitness) return;

          setWitnessSigned(false);
          setWitnessStubComplete(false);
          const stage2 = (savedStage2 ?? {}) as Record<string, unknown>;
          const witness = (stage2.witness as Record<string, unknown>) ?? {};
          if (witness.declarationSigned) {
            saveStep({
              stage2Data: {
                ...stage2,
                witness: { ...witness, declarationSigned: false },
              },
            }).catch(() => null);
          }
        }
      })
      .catch(() => null);

    return () => {
      cancelled = true;
    };
  }, []);

  // Envelope completed without witness — Stage 1 UI will offer Sign again.
  // Do not clear engagementSigned here; that made Stage 1 look unfinished.
  useEffect(() => {
    if (!savedStage1.engagementSigned || engagementStubComplete || !getUserToken()) return;

    let cancelled = false;
    fetchDocusignStatus()
      .then((data) => {
        if (cancelled) return;
        const email = witnessEmail.trim() || str(witnessSaved.email);
        if (
          !shouldOfferStage1Restart(data, email || undefined, {
            stage1MarkedComplete: true,
          })
        ) {
          return;
        }
        // Leave engagementSigned true — RegistrationDocuSignSection shows Sign again.
      })
      .catch(() => null);

    return () => {
      cancelled = true;
    };
  }, []);

  const alreadyRegistered = done.has("supporter") || isLoggedIn;

  // Figma: Save And Resume popup after selecting a payment method
  useEffect(() => {
    if (
      activeTab !== 0 ||
      open !== "payment" ||
      !payMethod ||
      paymentPaid ||
      !getUserToken() ||
      saveResumePromptShown.current
    ) {
      return;
    }
    saveResumePromptShown.current = true;
    setSaveModalOpen(true);
  }, [activeTab, open, payMethod, paymentPaid]);

  // Complete PayPal redirect checkout when user returns from sandbox.paypal.com
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("paypalCancel") === "1") {
      sessionStorage.removeItem("paypal_checkout_pending");
      setError("PayPal payment was cancelled.");
      setOpen("payment");
      router.replace("/register?form=1", { scroll: false });
      return;
    }

    if (params.get("paypalReturn") !== "1") return;
    const token = params.get("token");
    if (!token) return;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setOpen("payment");
    setPayMethod("paypal");

    const fee = membershipType === "ORGANISATION" ? 500 : 250;

    capturePaypalOrder(token)
      .then(async () => {
        if (cancelled) return;
        setPaymentPaid(true);
        sessionStorage.removeItem("paypal_checkout_pending");
        await saveStep({ membershipType, membershipFee: fee, currentStep: 3 });
        if (cancelled) return;
        setDone((prev) => new Set(prev).add("payment"));
        setOpen("confirmation");
        router.replace("/register?form=1", { scroll: false });
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "PayPal payment could not be completed. Use a US sandbox Personal account if paying in USD."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [membershipType, router]);

  // Complete Stripe redirect checkout after 3DS / bank authentication
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("stripeReturn") !== "1") return;

    const clientSecret = params.get("payment_intent_client_secret");
    if (!clientSecret) return;
    const paymentIntentClientSecret = clientSecret;

    let cancelled = false;
    setLoading(true);
    setError(null);
    setOpen("payment");
    setPayMethod("stripe");

    const fee = membershipType === "ORGANISATION" ? 500 : 250;
    const redirectStatus = params.get("redirect_status");

    async function completeStripeReturn() {
      const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
      if (!publishableKey) {
        throw new Error("Stripe is not configured.");
      }

      const { loadStripe } = await import("@stripe/stripe-js");
      const stripe = await loadStripe(publishableKey);
      if (!stripe) throw new Error("Could not load Stripe.");

      const { paymentIntent, error } =
        await stripe.retrievePaymentIntent(paymentIntentClientSecret);
      if (error) throw new Error(error.message ?? "Could not verify payment.");
      if (paymentIntent?.status !== "succeeded" && paymentIntent?.status !== "processing") {
        throw new Error(
          redirectStatus === "failed"
            ? "Card payment failed. Please try again."
            : "Payment was not completed. Please try again."
        );
      }

      const confirmed = await pollPaymentStatus();
      if (!confirmed) {
        await confirmStripePayment(paymentIntent?.id);
        const confirmedAfterSync = await pollPaymentStatus({ maxAttempts: 5 });
        if (!confirmedAfterSync) {
          throw new Error(
            "Payment received but confirmation is still processing. Wait a few seconds, then click Continue again."
          );
        }
      }

      setPaymentPaid(true);
      await saveStep({ membershipType, membershipFee: fee, currentStep: 3 });
      setDone((prev) => new Set(prev).add("payment"));
      setOpen("confirmation");
      router.replace("/register?form=1", { scroll: false });
    }

    completeStripeReturn()
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Stripe payment could not be completed."
          );
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [membershipType, router]);

  // DocuSign redirect return — user lands back after embedded signing
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("docusign") !== "complete") return;

    const returnEvent = params.get("event");
    const shouldPollHard =
      returnEvent === "signing_complete" || returnEvent === "viewing_complete";
    const docusignContext =
      params.get("docusignContext") ||
      (sessionStorage.getItem("stage2_witness_docusign_pending")
        ? "claimant-stage2"
        : sessionStorage.getItem("stage1_docusign_pending")
          ? "claimant-stage1"
          : null);
    const isClaimantStage1 = docusignContext === "claimant-stage1";
    const isClaimantStage2 = docusignContext === "claimant-stage2";

    if (!isClaimantStage1 && !isClaimantStage2) {
      router.replace("/register?form=1", { scroll: false });
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setActiveTab(2);
    setClaimantIntroOpen(false);
    setClaimantOpen(isClaimantStage2 ? "stage2" : "stage1");

    async function verifyReturn() {
      const data = await pollDocusignStatus({
        maxAttempts: 2,
        delayMs: 2000,
        refresh: true,
      });
      return { data, status: str(data.status) };
    }

    verifyReturn()
      .then(async ({ data, status }) => {
        if (cancelled) return;
        if (status) setDocusignStatus(status);
        const signers = data.signers ?? [];
        const primarySigner = pickPrimarySigner(signers);
        const witnessEmailForCheck = witnessEmail.trim() || str(witnessSaved.email);

        if (isClaimantStage1) {
          const claimantSigned =
            returnEvent === "signing_complete" ||
            isSignerStatusDone(primarySigner?.status) ||
            (signers.length <= 1 && isDocusignComplete(status));

          if (claimantSigned) {
            sessionStorage.removeItem("stage1_docusign_pending");
            setEngagementSigned(true);
            setSaveMsg("Engagement documents signed successfully.");
            setError(null);

            const app = await fetchApplication();
            if (cancelled) return;
            const stage1 =
              ((app?.stage1Data ?? savedStage1) as Record<string, unknown>) ?? {};
            await saveStep({
              stage1Data: { ...stage1, engagementSigned: true },
            }).catch(() => null);
          } else {
            sessionStorage.removeItem("stage1_docusign_pending");
            const eventMessage = docusignReturnEventMessage(returnEvent);
            setError(eventMessage || docusignStatusMessage(status, data));
          }
        } else if (isClaimantStage2) {
          const witnessDone =
            isStage2EnvelopeComplete(data, witnessEmailForCheck || undefined) ||
            isWitnessSigningComplete(data, witnessEmailForCheck || undefined) ||
            // Returning from the Stage 2 ceremony with a finished envelope means
            // the witness step succeeded (signer lists can lag briefly).
            ((returnEvent === "signing_complete" || returnEvent === "viewing_complete") &&
              isDocusignComplete(status));

          if (witnessDone) {
            sessionStorage.removeItem("stage2_witness_docusign_pending");
            setWitnessSigned(true);
            setDocusignStatus(status || "COMPLETED");
            setSaveMsg(
              isDocusignComplete(status)
                ? "Witness signing completed successfully."
                : "Witness signature recorded — waiting for DocuSign to finalize the document."
            );
            setError(null);

            const app = await fetchApplication();
            if (cancelled) return;
            const stage2 =
              ((app?.stage2Data ?? savedStage2) as Record<string, unknown>) ?? {};
            const witness = (stage2.witness as Record<string, unknown>) ?? {};
            await saveStep({
              stage2Data: {
                ...stage2,
                witness: {
                  ...witness,
                  fullName: witnessName.trim() || str(witness.fullName),
                  email: witnessEmailForCheck || str(witness.email),
                  address: witnessAddress.trim() || str(witness.address),
                  declarationSigned: true,
                },
              },
            }).catch(() => null);
          } else {
            sessionStorage.removeItem("stage2_witness_docusign_pending");
            setSaveMsg(null);
            const eventMessage = docusignReturnEventMessage(returnEvent);
            setError(eventMessage || docusignStatusMessage(status, data));
          }
        }
        router.replace("/register?form=1", { scroll: false });
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Could not verify signing status.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  function scrollRegisterSectionIntoView(sectionId: string) {
    const el = document.getElementById(`register-section-${sectionId}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function requestScrollToSection(sectionId: string) {
    pendingScrollSectionIdRef.current = sectionId;
    // Same-tab targets are often already mounted.
    window.requestAnimationFrame(() => {
      scrollRegisterSectionIntoView(sectionId);
    });
  }

  // Tab switches remount accordion content — scroll again after paint.
  useEffect(() => {
    const sectionId = pendingScrollSectionIdRef.current;
    if (!sectionId) return;
    const timer = window.setTimeout(() => {
      scrollRegisterSectionIntoView(sectionId);
      pendingScrollSectionIdRef.current = null;
    }, 100);
    return () => window.clearTimeout(timer);
  }, [activeTab, open, legalOpen, claimantOpen, claimantIntroOpen]);

  function goToTab(index: number, markCurrentDone = true, scrollSectionId?: string) {
    if (markCurrentDone) {
      setCompletedTabs((prev) => new Set(prev).add(activeTab));
    }
    setError(null);
    setActiveTab(index);
    if (index === 1) setLegalOpen(scrollSectionId === "evidence" ? "evidence" : "overview");
    if (index === 2) {
      const claimantTarget =
        scrollSectionId === "stage1" || scrollSectionId === "stage2"
          ? scrollSectionId
          : "overview";
      setClaimantOpen(claimantTarget);
      setClaimantIntroOpen(claimantTarget === "overview");
    }
    const target =
      scrollSectionId ??
      (index === 1 || index === 2 ? "overview" : index === 3 ? "final" : null);
    if (target) requestScrollToSection(target);
  }

  function markLegalDoneAndOpenNext(current: LegalSectionId) {
    setLegalDone((prev) => new Set(prev).add(current));
    const idx = LEGAL_SECTIONS.findIndex((s) => s.id === current);
    const next = LEGAL_SECTIONS[idx + 1];
    if (next) {
      setLegalOpen(next.id);
      requestScrollToSection(next.id);
    }
  }

  function markClaimantDoneAndOpenNext(current: ClaimantSectionId) {
    setClaimantDone((prev) => new Set(prev).add(current));
    const idx = CLAIMANT_SECTIONS.findIndex((s) => s.id === current);
    const next = CLAIMANT_SECTIONS[idx + 1];
    if (next) {
      setClaimantOpen(next.id);
      if (next.id !== "overview") setClaimantIntroOpen(false);
      requestScrollToSection(next.id);
    }
  }

  function markDoneAndOpenNext(current: SectionId) {
    setDone((prev) => new Set(prev).add(current));
    const idx = SECTIONS.findIndex((s) => s.id === current);
    const next = SECTIONS[idx + 1];
    if (next) {
      setOpen(next.id);
      requestScrollToSection(next.id);
    }
  }

  function openSaveResumeModal() {
    if (!getUserToken()) {
      setError("Please complete supporter registration before saving your progress.");
      return;
    }
    setSaveModalOpen(true);
  }

  async function persistProgressBeforeSave() {
    const fee = membershipType === "ORGANISATION" ? 500 : 250;
    const stepBySection: Record<SectionId, number> = {
      supporter: 1,
      payment: 2,
      confirmation: 3,
      identity: 4,
    };
    const stepByTab = [4, 5, 6, 7];
    await saveStep({
      membershipType,
      membershipFee: fee,
      currentStep:
        activeTab === 0 ? (stepBySection[open] ?? savedStep) : (stepByTab[activeTab] ?? savedStep),
    }).catch(() => null);
  }

  async function handleSaveExit() {
    setSaveModalSaving(true);
    setError(null);
    try {
      await persistProgressBeforeSave();
      const result = await requestSaveResume();
      setSaveModalOpen(false);
      setSaveMsg(
        result.resumeUrl
          ? "Progress saved — a resume link is in your email (and backend console)."
          : "Progress saved — a resume link has been sent to your email."
      );
      router.push("/");
    } catch {
      setError("Could not save right now — please try again.");
    } finally {
      setSaveModalSaving(false);
    }
  }

  function handleBack() {
    setError(null);
    if (activeTab === 1) {
      const idx = LEGAL_SECTIONS.findIndex((s) => s.id === legalOpen);
      if (idx > 0) {
        const prev = LEGAL_SECTIONS[idx - 1].id;
        setLegalOpen(prev);
        requestScrollToSection(prev);
      }
      return;
    }
    if (activeTab === 2) {
      if (claimantOpen === "overview") {
        goToTab(1, false, "evidence");
        return;
      }
      const idx = CLAIMANT_SECTIONS.findIndex((s) => s.id === claimantOpen);
      if (idx > 0) {
        const prev = CLAIMANT_SECTIONS[idx - 1].id;
        setClaimantOpen(prev);
        if (prev === "overview") setClaimantIntroOpen(true);
        requestScrollToSection(prev);
      }
      return;
    }
    if (activeTab === 3) {
      goToTab(2, false, "stage2");
      return;
    }
    const idx = SECTIONS.findIndex((s) => s.id === open);
    if (idx > 0) {
      const prev = SECTIONS[idx - 1].id;
      setOpen(prev);
      requestScrollToSection(prev);
    }
  }

  // ── Section submit handlers ──
  async function submitSupporter() {
    setError(null);

    if (!title || !forename.trim() || !surname.trim() || !email.trim()) {
      setError("Please complete all required fields.");
      return;
    }
    if (gmcNumber.trim() && !isValidGmcNumber(gmcNumber)) {
      setError("GMC number must be 7 digits, or a letter followed by 7 digits (e.g. 1234567 or A1234567).");
      return;
    }
    if (!dob.trim()) {
      setError("Please enter your date of birth.");
      return;
    }
    const dobError = dobValidationError(dob);
    if (dobError) {
      setError(dobError);
      return;
    }
    const phoneError = phoneValidationError(phone);
    if (phoneError) {
      setError(phoneError);
      return;
    }

    // When resuming an existing session the account already exists, so the
    // password fields stay blank — only validate them for brand-new accounts.
    const enteredEmail = email.toLowerCase().trim();
    const currentUser = getUser();
    const sameUser = currentUser?.email?.toLowerCase() === enteredEmail;

    if (!sameUser) {
      if (password.length < 8) {
        setError("Password must be at least 8 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }
    if (!confirm1 || !confirm2) {
      setError("Please tick both confirmation checkboxes to continue.");
      return;
    }

    setLoading(true);
    try {
      // Register a fresh account whenever the entered email differs from the
      // logged-in user; otherwise reuse the current (resumed) session.
      if (!sameUser) {
        clearUserToken();
        const res = await fetch(`${getApiBase()}/api/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: forename.trim(),
            lastName: surname.trim(),
            email: enteredEmail,
            password,
            phone: phone.trim() || undefined,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(typeof data.error === "string" ? data.error : "Registration failed.");
          return;
        }
        setUserToken(data.token);
      }

      // Persist the extra supporter details onto the application.
      await saveStep({
        applicationType: "SUPPORTER",
        currentStep: 2,
        stage1Data: {
          title,
          forename: forename.trim(),
          surname: surname.trim(),
          gmcNumber: gmcNumber.trim(),
          address: address.trim(),
          dob,
          phone: phone.trim(),
          confirmedPractitioner: confirm1,
          confirmedIndependentDecision: confirm2,
        },
      });

      prefillPracticeFromSupporter();
      markDoneAndOpenNext("supporter");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Network error — is the API running?"
      );
    } finally {
      setLoading(false);
    }
  }

  async function submitPayment() {
    setError(null);
    if (!payMethod) {
      setError("Please choose a payment method.");
      return;
    }
    const fee = membershipType === "ORGANISATION" ? 500 : 250;
    setLoading(true);
    try {
      let stripePaymentIntentId: string | undefined;
      if (!paymentPaid) {
        const paymentResult = await paymentRef.current?.processPayment();
        stripePaymentIntentId = paymentResult?.paymentIntentId;
      }

      if (payMethod === "stripe" && process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
        if (!(await pollPaymentStatus({ maxAttempts: 1 }))) {
          if (!stripePaymentIntentId) {
            throw new Error(
              "Please complete card payment in the form above before continuing."
            );
          }
          await confirmStripePayment(stripePaymentIntentId);
        }
        const confirmed = await pollPaymentStatus({ maxAttempts: 8, delayMs: 1500 });
        if (!confirmed) {
          throw new Error(
            "Your card payment was received but could not be confirmed yet. Wait a few seconds, then click Continue again."
          );
        }
      }

      await saveStep({ membershipType, membershipFee: fee, currentStep: 3 });
      markDoneAndOpenNext("payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not process payment right now.");
    } finally {
      setLoading(false);
    }
  }

  async function submitConfirmation() {
    setError(null);
    setLoading(true);
    markDoneAndOpenNext("confirmation");
    try {
      await saveStep({ currentStep: 4 }).catch(() => null);
    } finally {
      setLoading(false);
    }
  }

  async function submitIdentity() {
    if (!identityConsent) {
      setError("Please tick the consent checkbox to continue.");
      return;
    }
    setError(null);
    setLoading(true);
    setDone((prev) => new Set(prev).add("identity"));
    goToTab(1);
    try {
      if (idFile) {
        await saveEvidenceFile({
          fileName: idFile.name,
          fileUrl: `/uploads/identity/${idFile.name}`,
          fileSize: idFile.size,
          mimeType: idFile.type,
        }).catch(() => null);
      }
      await saveStep({ currentStep: 5 }).catch(() => null);
    } finally {
      setLoading(false);
    }
  }

  // ── Tab-level submit handlers ──
  function submitLegalOverview() {
    setError(null);
    prefillPracticeFromSupporter();
    markLegalDoneAndOpenNext("overview");
  }

  function submitPracticeSection() {
    if (!practiceFullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!practiceEmail.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!gmcNumber.trim()) {
      setError("Please enter your GMC number.");
      return;
    }
    if (!isValidGmcNumber(gmcNumber)) {
      setError("GMC number must be 7 digits, or a letter followed by 7 digits (e.g. 1234567 or A1234567).");
      return;
    }
    if (!practicePhone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    const practicePhoneError = phoneValidationError(practicePhone);
    if (practicePhoneError) {
      setError(practicePhoneError);
      return;
    }
    if (!practiceSpecialty.trim()) {
      setError("Please enter your speciality.");
      return;
    }
    if (!practiceDeanery) {
      setError("Please select your deanery.");
      return;
    }
    if (!practiceIncome.trim()) {
      setError("Please enter your average gross private income.");
      return;
    }
    if (!practiceYearStarted) {
      setError("Please select the year you started private practice.");
      return;
    }
    if (!practiceYearEnded) {
      setError("Please select the year you ended private practice.");
      return;
    }
    if (!practiceBupaNumber.trim()) {
      setError("Please enter your BUPA number.");
      return;
    }
    if (!practiceAxaNumber.trim()) {
      setError("Please enter your AXA number.");
      return;
    }
    if (practiceRecognisedOther === null) {
      setError("Please indicate whether you are recognised by other insurers.");
      return;
    }
    setError(null);
    markLegalDoneAndOpenNext("practice");
    saveStep({
      stage1Data: {
        ...savedStage1,
        fullName: practiceFullName,
        practiceEmail,
        practicePhone,
        specialty: practiceSpecialty,
        deanery: practiceDeanery,
        gmcNumber,
        annualIncome: practiceIncome,
        yearStartedPrivatePractice: practiceYearStarted,
        yearEndedPrivatePractice: practiceYearEnded,
        bupaNumber: practiceBupaNumber,
        axaNumber: practiceAxaNumber,
        recognisedByOtherInsurers: practiceRecognisedOther,
        pmiPercentage: practicePmiPct,
      },
    }).catch(() => null);
  }

  function submitPmiSection() {
    if (!pmiIncomeSource) {
      setError("Please select how you receive income from private medical insurers.");
      return;
    }
    if (!pmiPaidAxa && !pmiPaidBupa && !pmiPaidCompany && !pmiPaidLlp && !pmiPaidAlternative) {
      setError("Please select at least one entity through which you were paid.");
      return;
    }
    if (pmiPaidAxa && !pmiAxaYears) {
      setError("Please select the years you were paid directly by AXA.");
      return;
    }
    if (pmiPaidBupa && !pmiBupaYears) {
      setError("Please select the years you were paid directly by BUPA.");
      return;
    }
    if (pmiPaidCompany) {
      if (!pmiCompanyName.trim() || !pmiCompanyNumber.trim() || !pmiCompanyDirectors.trim()) {
        setError("Please complete all company details.");
        return;
      }
    }
    if (pmiPaidLlp) {
      if (!pmiLlpName.trim() || !pmiLlpNumber.trim() || !pmiLlpMembers.trim()) {
        setError("Please complete all LLP details.");
        return;
      }
    }
    if (pmiUploading) {
      setError("Please wait for uploads to finish.");
      return;
    }
    setError(null);
    markLegalDoneAndOpenNext("pmi");
    const pmiData = buildPmiPayload(false);
    sessionStorage.removeItem(PMI_FORM_DRAFT_KEY);
    saveStep({
      stage1Data: { ...savedStage1, pmi: pmiData },
    }).catch(() => null);
  }

  async function submitEvidenceSection() {
    if (evidenceUploading) {
      setError("Please wait for uploads to finish.");
      return;
    }
    if (!evidenceDisclosureAgreed) {
      setError("Please confirm your disclosure obligations to continue.");
      return;
    }
    setError(null);
    setLoading(true);
    setLegalDone((prev) => new Set(prev).add("evidence"));
    goToTab(2);
    try {
      await saveStep({ currentStep: 6 }).catch(() => null);
    } finally {
      setLoading(false);
    }
  }

  function submitClaimantOverview() {
    setError(null);
    markClaimantDoneAndOpenNext("overview");
    setClaimantIntroOpen(false);
  }

  function submitClaimantStage1() {
    setError(null);
    if (!engagementSigned && !engagementStubComplete) {
      setError("Please sign the engagement documents with DocuSign before continuing.");
      return;
    }
    markClaimantDoneAndOpenNext("stage1");
    saveStep({
      currentStep: 6,
      stage1Data: { ...savedStage1, engagementSigned: true },
    }).catch(() => null);
  }

  async function submitClaimantStage2() {
    setError(null);
    if (!witnessName.trim() || !witnessEmail.trim() || !witnessAddress.trim()) {
      setError("Please complete all witness details.");
      return;
    }
    if (!witnessPhotoFile || !witnessProofFile) {
      setError("Please upload witness photo ID and proof of address.");
      return;
    }
    if (!witnessSigned && !witnessStubComplete) {
      setError("Please complete witness signing on the Litigation Management Agreement.");
      return;
    }
    setClaimantDone((prev) => {
      const next = new Set(prev);
      next.add("overview");
      next.add("stage1");
      next.add("stage2");
      return next;
    });
    goToTab(3);
    setLoading(true);
    try {
      await saveStep({
        applicationType: "CLAIMANT",
        currentStep: 7,
        stage2Data: {
          ...savedStage2,
          witness: {
            fullName: witnessName.trim(),
            email: witnessEmail.trim(),
            address: witnessAddress.trim(),
            declarationSigned: witnessSigned || witnessStubComplete,
          },
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save witness details.");
    } finally {
      setLoading(false);
    }
  }

  async function submitFinalTab() {
    setError(null);
    const allConfirmed =
      explanationsDocuments.readMore.overarchingDeclaration.groups.every(
        (group) => finalConfirmedGroups[group.title]
      );
    if (!allConfirmed) {
      setError("Please confirm all items before submitting your registration.");
      return;
    }
    setLoading(true);
    try {
      await saveStep({ status: "COMPLETE", currentStep: 8 }).catch(() => null);
      setCompletedTabs((prev) => new Set(prev).add(3));
      setFinalSubmitted(true);
    } finally {
      setLoading(false);
    }
  }

  function handleContinue() {
    if (activeTab === 0) {
      if (open === "supporter") return submitSupporter();
      if (open === "payment") return submitPayment();
      if (open === "confirmation") return submitConfirmation();
      if (open === "identity") return submitIdentity();
      return;
    }
    if (activeTab === 1) {
      if (legalOpen === "overview") return submitLegalOverview();
      if (legalOpen === "practice") return submitPracticeSection();
      if (legalOpen === "pmi") return submitPmiSection();
      if (legalOpen === "evidence") return submitEvidenceSection();
      return;
    }
    if (activeTab === 2) {
      if (claimantOpen === "overview") return submitClaimantOverview();
      if (claimantOpen === "stage1") return submitClaimantStage1();
      if (claimantOpen === "stage2" || claimantDone.has("stage1")) {
        return submitClaimantStage2();
      }
      return;
    }
    if (activeTab === 3) return submitFinalTab();
  }

  const canSelectTab = (i: number) => i <= activeTab || completedTabs.has(i);

  return (
    <div className="mx-auto max-w-4xl bg-white shadow-lg rounded-2xl">
      {/* Top journey stepper */}
      <StepperTabs
        activeIndex={activeTab}
        completed={completedTabs}
        canSelect={canSelectTab}
        onSelect={(i) => goToTab(i, false)}
      />

      <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
        {/* ── Tab 0: Become A Supporter (accordion) ── */}
        {activeTab === 0 && (
          <div className="space-y-3">
            {SECTIONS.map((section) => {
              const isLocked = section.id === "identity" && !done.has("confirmation");
              return (
              <AccordionItem
                key={section.id}
                sectionId={section.id}
                label={section.label}
                isOpen={open === section.id}
                isDone={done.has(section.id)}
                isLocked={isLocked}
                onToggle={() => {
                  if (isLocked) return;
                  setOpen(open === section.id ? ("" as SectionId) : section.id);
                }}
              >
                {section.id === "supporter" && (
                  <SupporterForm
                    {...{
                      title, setTitle, forename, setForename, surname, setSurname,
                      email, setEmail, gmcNumber, setGmcNumber, address, setAddress,
                      dob, setDob, phone, setPhone, password, setPassword,
                      confirmPassword, setConfirmPassword, confirm1, setConfirm1,
                      confirm2, setConfirm2,
                    }}
                  />
                )}

                {section.id === "payment" && (
                  <MembershipPaymentSection
                    ref={paymentRef}
                    membershipType={membershipType}
                    setMembershipType={setMembershipType}
                    payMethod={payMethod}
                    setPayMethod={setPayMethod}
                    paymentPaid={paymentPaid}
                    onPaymentPaid={handlePaymentPaid}
                  />
                )}

                {section.id === "confirmation" && <ConfirmationSection />}

                {section.id === "identity" && (
                  <IdentitySection
                    agreed={identityConsent}
                    setAgreed={setIdentityConsent}
                  />
                )}

                {error && open === section.id && (
                  <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                    {error}
                  </p>
                )}
              </AccordionItem>
            );
            })}
          </div>
        )}

        {/* ── Tab 1: Legal Documents (accordion) ── */}
        {activeTab === 1 && (
          <div className="space-y-3">
            {LEGAL_SECTIONS.map((section, sectionIdx) => {
              const isLocked =
                sectionIdx > 0 &&
                !legalDone.has(LEGAL_SECTIONS[sectionIdx - 1].id);
              return (
                <AccordionItem
                  key={section.id}
                  sectionId={section.id}
                  label={section.label}
                  isOpen={legalOpen === section.id}
                  isDone={legalDone.has(section.id)}
                  isLocked={isLocked}
                  onToggle={() => {
                    if (isLocked) return;
                    setLegalOpen(
                      legalOpen === section.id ? ("" as LegalSectionId) : section.id
                    );
                  }}
                >
                  {section.id === "overview" && (
                    <LegalDocumentIntroSection membershipType={membershipType} />
                  )}

                  {section.id === "practice" && (
                    <PracticeInfoPanel
                      fullName={practiceFullName}
                      setFullName={setPracticeFullName}
                      email={practiceEmail}
                      setEmail={setPracticeEmail}
                      gmcNumber={gmcNumber}
                      setGmcNumber={setGmcNumber}
                      phone={practicePhone}
                      setPhone={setPracticePhone}
                      specialty={practiceSpecialty}
                      setSpecialty={setPracticeSpecialty}
                      deanery={practiceDeanery}
                      setDeanery={setPracticeDeanery}
                      grossIncome={practiceIncome}
                      setGrossIncome={setPracticeIncome}
                      yearStarted={practiceYearStarted}
                      setYearStarted={setPracticeYearStarted}
                      yearEnded={practiceYearEnded}
                      setYearEnded={setPracticeYearEnded}
                      bupaNumber={practiceBupaNumber}
                      setBupaNumber={setPracticeBupaNumber}
                      axaNumber={practiceAxaNumber}
                      setAxaNumber={setPracticeAxaNumber}
                      recognisedOther={practiceRecognisedOther}
                      setRecognisedOther={setPracticeRecognisedOther}
                      pmiPercentage={practicePmiPct}
                      setPmiPercentage={setPracticePmiPct}
                    />
                  )}

                  {section.id === "pmi" && (
                    <>
                      <PmiRelationshipPanel
                        incomeSource={pmiIncomeSource}
                        setIncomeSource={setPmiIncomeSource}
                        paidAxa={pmiPaidAxa}
                        setPaidAxa={setPmiPaidAxa}
                        axaYears={pmiAxaYears}
                        setAxaYears={setPmiAxaYears}
                        paidBupa={pmiPaidBupa}
                        setPaidBupa={setPmiPaidBupa}
                        bupaYears={pmiBupaYears}
                        setBupaYears={setPmiBupaYears}
                        paidCompany={pmiPaidCompany}
                        setPaidCompany={setPmiPaidCompany}
                        companyName={pmiCompanyName}
                        setCompanyName={setPmiCompanyName}
                        companyNumber={pmiCompanyNumber}
                        setCompanyNumber={setPmiCompanyNumber}
                        companyDirectors={pmiCompanyDirectors}
                        setCompanyDirectors={setPmiCompanyDirectors}
                        paidLlp={pmiPaidLlp}
                        setPaidLlp={setPmiPaidLlp}
                        llpName={pmiLlpName}
                        setLlpName={setPmiLlpName}
                        llpNumber={pmiLlpNumber}
                        setLlpNumber={setPmiLlpNumber}
                        llpMembers={pmiLlpMembers}
                        setLlpMembers={setPmiLlpMembers}
                        paidAlternative={pmiPaidAlternative}
                        setPaidAlternative={setPmiPaidAlternative}
                        setUploadingA={setPmiUploadingA}
                        setUploadingB={setPmiUploadingB}
                        savedPmiFiles={pmiSavedFiles}
                        onPmiFileSaved={(file) =>
                          setPmiSavedFiles((prev) => {
                            if (prev.some((existing) => existing.fileUrl === file.fileUrl)) {
                              return prev;
                            }
                            return [...prev, file];
                          })
                        }
                      />
                    </>
                  )}

                  {section.id === "evidence" && (
                    <EvidenceUploadsPanel
                      onUploadingChange={setEvidenceUploading}
                      disclosureAgreed={evidenceDisclosureAgreed}
                      onDisclosureChange={setEvidenceDisclosureAgreed}
                    />
                  )}

                  {error && legalOpen === section.id && (
                    <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                      {error}
                    </p>
                  )}
                </AccordionItem>
              );
            })}
          </div>
        )}

        {/* ── Tab 2: Become A Claimant (nested accordion) ── */}
        {activeTab === 2 && (
          <ClaimantMemberAccordion
            claimantOpen={claimantOpen}
            setClaimantOpen={setClaimantOpen}
            claimantIntroOpen={claimantIntroOpen}
            setClaimantIntroOpen={setClaimantIntroOpen}
            claimantDone={claimantDone}
            error={error}
            docusignStatus={docusignStatus}
            onDocusignStatusChange={setDocusignStatus}
            engagementSigned={engagementSigned}
            onEngagementSigned={() => {
              setEngagementSigned(true);
              saveStep({
                stage1Data: { ...savedStage1, engagementSigned: true },
              }).catch(() => null);
            }}
            onEngagementUnsigned={() => {
              setEngagementSigned(false);
              saveStep({
                stage1Data: { ...savedStage1, engagementSigned: false },
              }).catch(() => null);
            }}
            docusignStubMode={docusignStubMode}
            onDocusignStubModeChange={setDocusignStubMode}
            engagementStubComplete={engagementStubComplete}
            onEngagementStubComplete={() => {
              setEngagementStubComplete(true);
              setEngagementSigned(true);
              saveStep({
                stage1Data: { ...savedStage1, engagementSigned: true },
              }).catch(() => null);
            }}
            witnessName={witnessName}
            setWitnessName={setWitnessName}
            witnessEmail={witnessEmail}
            setWitnessEmail={setWitnessEmail}
            witnessAddress={witnessAddress}
            setWitnessAddress={setWitnessAddress}
            witnessPhotoFile={witnessPhotoFile}
            setWitnessPhotoFile={setWitnessPhotoFile}
            witnessProofFile={witnessProofFile}
            setWitnessProofFile={setWitnessProofFile}
            witnessUploadError={witnessUploadError}
            setWitnessUploadError={setWitnessUploadError}
            witnessSigned={witnessSigned}
            onWitnessSigned={() => {
              setWitnessSigned(true);
              saveStep({
                stage2Data: {
                  ...savedStage2,
                  witness: {
                    fullName: witnessName.trim(),
                    email: witnessEmail.trim(),
                    address: witnessAddress.trim(),
                    declarationSigned: true,
                  },
                },
              }).catch(() => null);
            }}
            onWitnessUnsigned={() => {
              setWitnessSigned(false);
              setWitnessStubComplete(false);
              setSaveMsg(null);
              saveStep({
                stage2Data: {
                  ...savedStage2,
                  witness: {
                    fullName: witnessName.trim(),
                    email: witnessEmail.trim(),
                    address: witnessAddress.trim(),
                    declarationSigned: false,
                  },
                },
              }).catch(() => null);
            }}
            onBeforeWitnessSign={async () => {
              await saveStep({
                stage2Data: {
                  ...savedStage2,
                  witness: {
                    fullName: witnessName.trim(),
                    email: witnessEmail.trim(),
                    address: witnessAddress.trim(),
                    declarationSigned: witnessSigned || witnessStubComplete,
                  },
                },
              });
            }}
            witnessStubComplete={witnessStubComplete}
            onWitnessStubComplete={() => {
              setWitnessStubComplete(true);
              setWitnessSigned(true);
              saveStep({
                stage2Data: {
                  ...savedStage2,
                  witness: {
                    fullName: witnessName.trim(),
                    email: witnessEmail.trim(),
                    address: witnessAddress.trim(),
                    declarationSigned: true,
                  },
                },
              }).catch(() => null);
            }}
            onClearError={() => {
              setError(null);
            }}
            onStage2NeedsRestartChange={(needs) => {
              if (needs) setSaveMsg(null);
            }}
          />
        )}

        {/* ── Tab 3: Final Confirmation ── */}
        {activeTab === 3 && (
          <FinalConfirmationAccordion
            membershipType={membershipType}
            gmcNumber={gmcNumber}
            confirmedGroups={finalConfirmedGroups}
            onConfirmedGroupsChange={setFinalConfirmedGroups}
            submitted={finalSubmitted}
          />
        )}

        {/* Error (tab 3) */}
        {error && activeTab === 3 && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        )}

        {saveMsg && (
          <p className="mt-4 rounded-lg bg-[#f3eef6] px-3 py-2 text-sm text-[#263238]">
            {saveMsg}
          </p>
        )}

        {/* Footer */}
        <div className="mt-6 flex flex-col-reverse items-stretch gap-3 border-t border-zinc-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            {(activeTab === 0 && open !== "supporter") ||
            (activeTab === 1 && legalOpen !== "overview") ||
            activeTab === 2 ||
            activeTab === 3 ? (
              <button
                type="button"
                onClick={handleBack}
                className="rounded-lg px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90"
                style={{ backgroundColor: "#263238" }}
              >
                Back
              </button>
            ) : null}
            <p className="text-sm text-zinc-500">
              {alreadyRegistered ? "" : "Already registered? "}
              {!alreadyRegistered && (
                <Link href="/login" className="font-semibold hover:underline" style={{ color: PURPLE }}>
                  Sign in
                </Link>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {!(activeTab === 3 && finalSubmitted) && (
              <button
                type="button"
                onClick={openSaveResumeModal}
                disabled={!getUserToken()}
                className="rounded-lg border border-[#627489] bg-white px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-[#263238] transition hover:bg-zinc-50 disabled:opacity-40"
              >
                Save and Resume
              </button>
            )}
            {activeTab === 3 && finalSubmitted ? (
              <button
                type="button"
                onClick={() => router.push("/")}
                className="rounded-lg px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90"
                style={{ backgroundColor: PURPLE }}
              >
                Home
              </button>
            ) : (
              <button
                type="button"
                onClick={handleContinue}
                disabled={loading}
                className="rounded-lg px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:opacity-60"
                style={{
                  backgroundColor:
                    activeTab === 2 || activeTab === 3 ? CLAIMANT_ACTIVE : PURPLE,
                }}
              >
                {loading
                  ? "Please wait…"
                  : activeTab === TABS.length - 1
                    ? "Submit Registration"
                    : open === "confirmation"
                      ? "Next"
                      : "Continue"}
              </button>
            )}
          </div>
        </div>
      </div>

      <SaveResumeModal
        open={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onSaveExit={handleSaveExit}
        saving={saveModalSaving}
      />
    </div>
  );
}

/* ─────────────────────────── Journey stepper tabs ─────────────────────────── */

function StepperTabs({
  activeIndex,
  canSelect,
  onSelect,
}: {
  activeIndex: number;
  completed: Set<number>;
  canSelect: (i: number) => boolean;
  onSelect: (i: number) => void;
}) {
  const inactiveTabs = TABS.slice(activeIndex + 1);

  return (
    <div className="w-full overflow-hidden">
      <div className="flex w-full items-center gap-1">
        {/* Group reached tabs (01…active) in one purple pill */}
        <div
          className="flex min-w-0 items-center gap-0.5 rounded-full p-1"
          style={{
            flex: activeIndex + 1,
            background: "linear-gradient(90deg, #A838A8 0%, #660066 100%)",
          }}
        >
          {TABS.slice(0, activeIndex + 1).map((label, i) => {
            const isActive = i === activeIndex;
            const selectable = canSelect(i);
            const num = String(i + 1).padStart(2, "0");
            return (
              <button
                key={label}
                type="button"
                onClick={() => selectable && onSelect(i)}
                disabled={!selectable}
                className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 rounded-full px-1.5 py-1.5 transition-colors sm:gap-2 sm:px-2 ${
                  selectable ? "cursor-pointer" : "cursor-default"
                }`}
                style={{
                  backgroundColor: isActive ? "rgba(0,0,0,0.12)" : "transparent",
                }}
              >
                <span
                  className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold sm:h-7 sm:w-7 sm:text-xs"
                  style={{ color: PURPLE }}
                >
                  {num}
                </span>
                <span className="truncate text-[11px] font-semibold text-white sm:text-xs">
                  {label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Remaining inactive tabs */}
        {inactiveTabs.map((label, offset) => {
          const i = activeIndex + 1 + offset;
          const num = String(i + 1).padStart(2, "0");
          return (
            <button
              key={label}
              type="button"
              disabled
              className="flex min-w-0 flex-1 cursor-not-allowed items-center justify-center gap-1.5 rounded-full px-1.5 py-1.5 sm:gap-2 sm:px-2"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#374151] text-[10px] font-bold text-white sm:h-7 sm:w-7 sm:text-xs">
                {num}
              </span>
              <span className="truncate text-[11px] font-semibold text-[#263238]sm:text-xs">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ─────────────────────────── Accordion shell ─────────────────────────── */

function AccordionItem({
  label,
  isOpen,
  isDone,
  isLocked = false,
  sectionId,
  onToggle,
  children,
}: {
  label: string;
  isOpen: boolean;
  isDone: boolean;
  isLocked?: boolean;
  sectionId?: string;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div
      id={sectionId ? `register-section-${sectionId}` : undefined}
      className="scroll-mt-28 overflow-hidden rounded-xl border border-zinc-200"
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={isLocked}
        className="flex w-full items-center justify-between px-5 py-3.5 text-left transition disabled:cursor-not-allowed"
        style={{
          backgroundColor: isOpen ? "#F3E8F3" : "#f5f5f5",
          color: isOpen ? PURPLE : isLocked ? "rgba(38, 50, 56, 0.5)" : "#6b7280",
        }}
      >
        <span className="flex items-center gap-2 pr-2 text-sm font-semibold leading-snug">
          {isDone && <span className="text-green-600">✓</span>}
          {label}
        </span>
        <span className="text-lg leading-none">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && <div className="px-5 py-5">{children}</div>}
    </div>
  );
}

/* ─────────────────────────── Section 1 form ─────────────────────────── */

const fieldCls =
  "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#802B7D] focus:ring-2 focus:ring-[#802B7D]/20";

const practiceFieldCls =
  "w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#802B7D] focus:ring-2 focus:ring-[#802B7D]/20";

function Label({ children }: { children: ReactNode }) {
  return (
    <label className="block text-sm font-medium text-zinc-700">
      {children} <span className="text-red-500">*</span>
    </label>
  );
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function SupporterForm(p: any) {
  return (
    <div>
      {/* Disclaimer */}
      <div className="flex gap-3 rounded-xl border border-amber-300 bg-amber-50 p-4">
        <span className="mt-0.5 shrink-0 text-amber-500">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>
        <div className="space-y-2 text-xs leading-relaxed text-zinc-600">
          <p>
            This website provides information about collective legal action against
            private medical insurers. It is intended only for medical practitioners
            who may be eligible to participate.
          </p>
          <p>
            By proceeding, you confirm that you are a registered medical practitioner
            who has provided services under private medical insurance arrangements.
          </p>
          <p>
            The information on this site is provided for potential claimants only. If
            you are employed by or represent any of the defendant insurance companies
            BUPA Insurance Limited or AXA PPP, you should not proceed beyond this page.
          </p>
          <p>
            Detailed legal documents and case materials available to registered members
            are legally privileged and confidential to the litigation.
          </p>
        </div>
      </div>

      <h3 className="mt-6 text-base font-bold" style={{ color: PURPLE }}>
        Become a Supporter Member of the FIPO Fair Pay Action Group
      </h3>

      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
        <div>
          <Label>Title</Label>
          <select value={p.title} onChange={(e) => p.setTitle(e.target.value)} className={fieldCls}>
            <option value="">Select</option>
            {TITLES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <Label>Forename</Label>
          <input className={fieldCls} placeholder="Forename" value={p.forename} onChange={(e) => p.setForename(e.target.value)} />
        </div>
        <div>
          <Label>Surname</Label>
          <input className={fieldCls} placeholder="Surname" value={p.surname} onChange={(e) => p.setSurname(e.target.value)} />
        </div>
        <div>
          <Label>Email</Label>
          <input type="email" className={fieldCls} placeholder="Email" value={p.email} onChange={(e) => p.setEmail(e.target.value)} />
        </div>
        <div>
          <Label>GMC Number</Label>
          <input
            className={fieldCls}
            placeholder="GMC Number"
            inputMode="text"
            maxLength={8}
            value={p.gmcNumber}
            onChange={(e) => p.setGmcNumber(normalizeGmcNumberInput(e.target.value))}
          />
        </div>
        <div>
          <Label>Address</Label>
          <input className={fieldCls} placeholder="Address" value={p.address} onChange={(e) => p.setAddress(e.target.value)} />
        </div>
        <div>
          <Label>Date of birth</Label>
          <input
            type="date"
            className={fieldCls}
            placeholder="DD/MM/YYYY"
            min={DOB_MIN_ISO}
            max={DOB_MAX_ISO}
            value={p.dob}
            onChange={(e) => p.setDob(e.target.value)}
          />
        </div>
        <div>
          <Label>Phone number</Label>
          <input
            type="tel"
            className={fieldCls}
            placeholder="Phone number"
            inputMode="tel"
            value={p.phone}
            onChange={(e) => p.setPhone(normalizePhoneInput(e.target.value))}
          />
        </div>
        <div>
          <Label>Create Password</Label>
          <input type="password" className={fieldCls} placeholder="Create Password" value={p.password} onChange={(e) => p.setPassword(e.target.value)} />
        </div>
        <div>
          <Label>Confirm password</Label>
          <input type="password" className={fieldCls} placeholder="Confirm password" value={p.confirmPassword} onChange={(e) => p.setConfirmPassword(e.target.value)} />
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <label className="flex cursor-pointer items-start gap-2.5">
          <input type="checkbox" checked={p.confirm1} onChange={(e) => p.setConfirm1(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#802B7D]" />
          <span className="text-xs leading-relaxed text-zinc-500">
            I confirm that I am a registered medical practitioner. I further confirm
            that I recognise that the information that I will view if I continue in the
            process is confidential and that I will keep it confidential; and by
            continuing, I confirm that I am not an employee of BUPA Insurance Limited or
            AXA PPP or a partner or employee of a professional adviser acting on behalf
            of BUPA Insurance Limited or AXA PPP. Any person in this excluded category
            who proceeds will knowingly do so in breach of confidence.
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-2.5">
          <input type="checkbox" checked={p.confirm2} onChange={(e) => p.setConfirm2(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#802B7D]" />
          <span className="text-xs leading-relaxed text-zinc-500">
            I confirm that my decision to join this action is my own, made independently
            and based on my own individual judgement. I have not discussed, coordinated,
            or reached any agreement or understanding with any other practitioner, group
            of practitioners, or organisation regarding my decision to join, my own fees,
            or any other aspect of my commercial conduct. I understand that this action
            concerns the legal claim against the named insurers only, and does not extend
            to any arrangement between members regarding their own pricing or business
            practices.
          </span>
        </label>
      </div>
    </div>
  );
}

/* ─────────────────────────── Section 3: confirmation ─────────────────────────── */

function ConfirmationSection() {
  return (
    <div className="flex flex-col items-center px-4 py-10 text-center sm:px-8 sm:py-14">
      <Image
        src="/images/right-tick.png"
        alt=""
        width={106}
        height={106}
        className="h-[106px] w-[106px]"
        priority
      />
      <h2
        className="mt-8 text-3xl font-bold uppercase sm:text-[40px]"
        style={{ color: PURPLE }}
      >
        Thank you!
      </h2>
      <div className="mt-6 max-w-[677px] text-[16px] font-medium leading-[34px] text-[#223645]">
        <p>You are now a Supporter Member of the FIPO Fair Pay Action Group</p>
        <p>Please proceed to Step 2 if you would like to become a Claimant Member</p>
        <p>If you press &lsquo;next&rsquo; below, this will trigger a &lsquo;Know Your Client&rsquo; check.</p>
      </div>
    </div>
  );
}

/* ─────────────────────────── Tab: Become A Claimant ─────────────────────────── */

function ClaimantAccordionIcon({ open }: { open: boolean }) {
  return (
    <Image
      src={open ? "/accordion-remove.svg" : "/accordion-add.svg"}
      alt=""
      width={open ? 35 : 30}
      height={open ? 35 : 30}
      className="shrink-0"
    />
  );
}

function ClaimantMemberAccordion({
  claimantOpen,
  setClaimantOpen,
  claimantIntroOpen,
  setClaimantIntroOpen,
  claimantDone,
  error,
  docusignStatus,
  onDocusignStatusChange,
  engagementSigned,
  onEngagementSigned,
  onEngagementUnsigned,
  docusignStubMode,
  onDocusignStubModeChange,
  engagementStubComplete,
  onEngagementStubComplete,
  witnessName,
  setWitnessName,
  witnessEmail,
  setWitnessEmail,
  witnessAddress,
  setWitnessAddress,
  witnessPhotoFile,
  setWitnessPhotoFile,
  witnessProofFile,
  setWitnessProofFile,
  witnessUploadError,
  setWitnessUploadError,
  witnessSigned,
  onWitnessSigned,
  onWitnessUnsigned,
  onBeforeWitnessSign,
  witnessStubComplete,
  onWitnessStubComplete,
  onClearError,
  onStage2NeedsRestartChange,
}: {
  claimantOpen: ClaimantSectionId;
  setClaimantOpen: (id: ClaimantSectionId) => void;
  claimantIntroOpen: boolean;
  setClaimantIntroOpen: (open: boolean) => void;
  claimantDone: Set<ClaimantSectionId>;
  error: string | null;
  docusignStatus: string;
  onDocusignStatusChange: (status: string) => void;
  engagementSigned: boolean;
  onEngagementSigned: () => void;
  onEngagementUnsigned: () => void;
  docusignStubMode: boolean;
  onDocusignStubModeChange: (stub: boolean) => void;
  engagementStubComplete: boolean;
  onEngagementStubComplete: () => void;
  witnessName: string;
  setWitnessName: (value: string) => void;
  witnessEmail: string;
  setWitnessEmail: (value: string) => void;
  witnessAddress: string;
  setWitnessAddress: (value: string) => void;
  witnessPhotoFile: EvidenceFileRecord | null;
  setWitnessPhotoFile: (file: EvidenceFileRecord | null) => void;
  witnessProofFile: EvidenceFileRecord | null;
  setWitnessProofFile: (file: EvidenceFileRecord | null) => void;
  witnessUploadError: string | null;
  setWitnessUploadError: (value: string | null) => void;
  witnessSigned: boolean;
  onWitnessSigned: () => void;
  onWitnessUnsigned: () => void;
  onBeforeWitnessSign?: () => Promise<void>;
  witnessStubComplete: boolean;
  onWitnessStubComplete: () => void;
  onClearError: () => void;
  onStage2NeedsRestartChange?: (needs: boolean) => void;
}) {
  const [stage2NeedsRestart, setStage2NeedsRestart] = useState(false);
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white">
      <button
        type="button"
        id="register-section-overview"
        onClick={() => setClaimantIntroOpen(!claimantIntroOpen)}
        className="flex min-h-[60px] w-full scroll-mt-28 items-center justify-between px-[30px] py-3 text-left transition"
        style={{
          backgroundColor: claimantIntroOpen ? "#F3E8F3" : "#f5f5f5",
          color: claimantIntroOpen ? CLAIMANT_ACTIVE : CLAIMANT_HEADING,
        }}
      >
        <span className="pr-4 text-[18px] font-medium leading-normal">
          Become a Claimant Member
        </span>
        <ClaimantAccordionIcon open={claimantIntroOpen} />
      </button>

      {claimantIntroOpen && (
        <div className="bg-white px-[24px] py-6">
          <ClaimantIntroSection />
          {error && claimantOpen === "overview" && (
            <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </p>
          )}
        </div>
      )}

      {CLAIMANT_STAGE_SECTIONS.map((section, sectionIdx) => {
        const prevId =
          sectionIdx === 0 ? "overview" : CLAIMANT_STAGE_SECTIONS[sectionIdx - 1].id;
        const isLocked = !claimantDone.has(prevId);
        const isOpen = claimantOpen === section.id;

        return (
          <div
            key={section.id}
            id={`register-section-${section.id}`}
            className="scroll-mt-28"
          >
            <button
              type="button"
              disabled={isLocked}
              onClick={() => {
                if (isLocked) return;
                setClaimantIntroOpen(false);
                setClaimantOpen(isOpen ? ("" as ClaimantSectionId) : section.id);
              }}
              className="flex min-h-[60px] w-full items-center justify-between border-t border-zinc-200 px-[30px] py-4 text-left transition disabled:cursor-not-allowed"
              style={{
                backgroundColor: isOpen ? "#F3E8F3" : "#f5f5f5",
                color: isOpen
                  ? CLAIMANT_ACTIVE
                  : isLocked
                    ? section.id === "stage1"
                      ? "rgba(34, 54, 69, 0.5)"
                      : "rgba(38, 50, 56, 0.5)"
                    : CLAIMANT_HEADING,
                fontWeight: isOpen || !isLocked ? 500 : 400,
              }}
            >
              <span className="pr-4 text-[18px] leading-normal">
                {section.label}
              </span>
              <ClaimantAccordionIcon open={isOpen} />
            </button>

            {isOpen && section.id === "stage1" && (
              <ClaimantStage1Panel
                docusignStatus={docusignStatus}
                onDocusignStatusChange={onDocusignStatusChange}
                engagementSigned={engagementSigned}
                onEngagementSigned={onEngagementSigned}
                onEngagementUnsigned={onEngagementUnsigned}
                witnessEmail={witnessEmail}
                docusignStubMode={docusignStubMode}
                onDocusignStubModeChange={onDocusignStubModeChange}
                engagementStubComplete={engagementStubComplete}
                onEngagementStubComplete={onEngagementStubComplete}
              />
            )}

            {isOpen && section.id === "stage2" && (
              <ClaimantStage2Panel
                witnessName={witnessName}
                setWitnessName={setWitnessName}
                witnessEmail={witnessEmail}
                setWitnessEmail={setWitnessEmail}
                witnessAddress={witnessAddress}
                setWitnessAddress={setWitnessAddress}
                witnessPhotoFile={witnessPhotoFile}
                setWitnessPhotoFile={setWitnessPhotoFile}
                witnessProofFile={witnessProofFile}
                setWitnessProofFile={setWitnessProofFile}
                uploadError={witnessUploadError}
                setUploadError={setWitnessUploadError}
                docusignStatus={docusignStatus}
                onDocusignStatusChange={onDocusignStatusChange}
                witnessSigned={witnessSigned}
                onWitnessSigned={onWitnessSigned}
                onWitnessUnsigned={onWitnessUnsigned}
                onBeforeWitnessSign={onBeforeWitnessSign}
                docusignStubMode={docusignStubMode}
                onDocusignStubModeChange={onDocusignStubModeChange}
                witnessStubComplete={witnessStubComplete}
                onWitnessStubComplete={onWitnessStubComplete}
                engagementSigned={engagementSigned}
                engagementStubComplete={engagementStubComplete}
                onGoToStage1={() => {
                  onClearError();
                  setClaimantOpen("stage1");
                  setClaimantIntroOpen(false);
                }}
                onClearError={onClearError}
                onNeedsStage1RestartChange={(needs) => {
                  setStage2NeedsRestart(needs);
                  onStage2NeedsRestartChange?.(needs);
                  if (needs) onClearError();
                }}
              />
            )}

            {error &&
              claimantOpen === section.id &&
              !(section.id === "stage2" && stage2NeedsRestart) && (
              <p className="border-t border-zinc-200 bg-white px-[30px] py-3">
                <span className="block rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </span>
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ClaimantPurpleCheck() {
  return (
    <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      className="shrink-0"
      aria-hidden
    >
      <path
        d="M14.1667 23.2333L8.5 17.5667L10.4833 15.5833L14.1667 19.2667L23.5167 9.91667L25.5 11.9L14.1667 23.2333Z"
        fill={PURPLE}
      />
    </svg>
  );
}

function EngagementSignedPdfLinks({
  visible,
}: {
  visible: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!visible) return null;

  async function openPdf(download = false) {
    setLoading(true);
    setError(null);
    try {
      if (download) {
        await downloadSignedDocusignPdf();
      } else {
        await openSignedDocusignPdf();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load signed PDF");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <p
        className="mt-4 font-normal"
        style={{ fontSize: 16, lineHeight: "30px", color: "#223645" }}
      >
        To view the engagement documents in pdf,{" "}
        <button
          type="button"
          onClick={() => openPdf(false)}
          disabled={loading}
          className="font-semibold underline disabled:opacity-60"
          style={{ color: PURPLE }}
        >
          {loading ? "Loading…" : "click here."}
        </button>
      </p>
      <button
        type="button"
        onClick={() => openPdf(true)}
        disabled={loading}
        className="mt-4 inline-flex items-center gap-[10px] disabled:opacity-60"
        style={{ color: PURPLE }}
      >
        <Image src="/pdf-file-icon.svg" alt="" width={30} height={30} />
        <span className="font-semibold" style={{ fontSize: 16, lineHeight: "24px" }}>
          {loading ? "Loading…" : "Download PDF"}
        </span>
        <Image src="/open-in-new.svg" alt="" width={24} height={24} />
      </button>
      {error && (
        <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}
    </>
  );
}

function ClaimantStage1Panel({
  docusignStatus,
  onDocusignStatusChange,
  engagementSigned,
  onEngagementSigned,
  onEngagementUnsigned,
  witnessEmail,
  docusignStubMode,
  onDocusignStubModeChange,
  engagementStubComplete,
  onEngagementStubComplete,
}: {
  docusignStatus: string;
  onDocusignStatusChange: (status: string) => void;
  engagementSigned: boolean;
  onEngagementSigned: () => void;
  onEngagementUnsigned: () => void;
  witnessEmail: string;
  docusignStubMode: boolean;
  onDocusignStubModeChange: (stub: boolean) => void;
  engagementStubComplete: boolean;
  onEngagementStubComplete: () => void;
}) {
  const [envelopeNeedsRestart, setEnvelopeNeedsRestart] = useState(false);
  const bullets = [
    "If you paid \u00a3250 to become a Supporter Member then the fee which will be deducted from any damages associated with your claim will be 32.5% + VAT; and if you paid \u00a3500 then the fee deducted from any damages associated with your claim will be 30% + VAT.",
    "FIPO will instruct Harcus Parker as its and your solicitors, who will in turn instruct Suzanne Rab, a barrister in independent practice at Matrix Chambers, who FIPO has instructed directly;",
    "FIPO will use the action group\u2019s funds, which include your subscriptions, to contribute to legal costs during the \u2018Pre-Action Phase\u2019 described in the engagement letter and will use any balance to pay towards the cost of ATE insurance.",
  ];
  const signedPdfReady =
    engagementSigned &&
    isDocusignComplete(docusignStatus) &&
    !engagementStubComplete &&
    !docusignStubMode &&
    !envelopeNeedsRestart;

  return (
    <div className="bg-white px-[24px] py-6">
      <h4
        className="text-[21px] font-semibold leading-[40px]"
        style={{ color: CLAIMANT_ACTIVE }}
      >
        Stage 1: approval of the terms of FIPO&rsquo;s engagement with Harcus Parker
        and Counsel
      </h4>

      <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <p className="max-w-[752px] text-[16px] font-normal leading-[30px] text-[#223645]">
          The reason you are asked to approve this is that the structure of the
          group is that you provide FIPO with authority to run the claim on your
          behalf. You therefore need to know how you will be charged, through
          FIPO executing the agreements for you, because this has a direct impact
          on you and in particular on how much you will be charged.
        </p>
        <div
          className="flex h-[150px] w-[160px] shrink-0 items-center justify-center rounded-lg"
          style={{ backgroundColor: CLAIMANT_PANEL_BG }}
        >
          <Image src="/handshake-icon.svg" alt="" width={100} height={100} />
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-8 xl:flex-row xl:items-start">
        <ul className="flex max-w-[460px] flex-col gap-[15px]">
          {bullets.map((item) => (
            <li key={item} className="flex items-start gap-[10px]">
              <ClaimantPurpleCheck />
              <span
                className="font-normal"
                style={{
                  fontSize: 16,
                  lineHeight: "30px",
                  color: "#263238",
                }}
              >
                {item}
              </span>
            </li>
          ))}
        </ul>

        <div
          className="w-full max-w-[350px] shrink-0 rounded-lg border p-[20px]"
          style={{
            backgroundColor: CLAIMANT_PANEL_BG,
            borderColor: CLAIMANT_PANEL_BORDER,
            minHeight: 340,
          }}
        >
          <h5
            className="font-semibold leading-normal"
            style={{ color: PURPLE, fontSize: 16 }}
          >
            Review the engagement documents
          </h5>
          <p
            className="mt-4 font-normal"
            style={{ fontSize: 16, lineHeight: "30px", color: "#223645" }}
          >
            Sign the engagement letter with DocuSign to approve FIPO&rsquo;s engagement
            with Harcus Parker and Counsel:
          </p>
          <RegistrationDocuSignSection
            variant="embedded"
            requirePmiFiles={false}
            attachPmiEvidence={false}
            autoConfirmOnGlobalComplete={false}
            sessionKey="stage1_docusign_pending"
            returnContext="claimant-stage1"
            primaryButtonLabel="Review Engagement Documents"
            signedMessage="Engagement documents signed successfully"
            docusignStatus={docusignStatus}
            onStatusChange={onDocusignStatusChange}
            declarationSigned={engagementSigned}
            onDeclarationSigned={onEngagementSigned}
            onClearSigned={onEngagementUnsigned}
            witnessEmail={witnessEmail.trim() || undefined}
            stage1Complete={engagementSigned || engagementStubComplete}
            onNeedsStage1RestartChange={setEnvelopeNeedsRestart}
            uploadsInProgress={false}
            pmiFilesReady
            pmiSavedFileCount={0}
            stubMode={docusignStubMode}
            onStubModeChange={onDocusignStubModeChange}
            stubComplete={engagementStubComplete}
            onStubComplete={onEngagementStubComplete}
          />
          <EngagementSignedPdfLinks visible={signedPdfReady} />
        </div>
      </div>

      <div
        className="mt-8 flex h-[80px] items-center gap-5 rounded-[10px] border px-[18px]"
        style={{
          backgroundColor: CLAIMANT_PANEL_BG,
          borderColor: CLAIMANT_PANEL_BORDER,
        }}
      >
        <Image
          src="/info-icon.svg"
          alt=""
          width={50}
          height={50}
          className="shrink-0"
        />
        <p className="text-[16px] font-normal leading-normal text-[#223645]">
          For an explanation of the arrangements, please see the text of the
          engagement letter itself.
        </p>
      </div>
    </div>
  );
}

const CLAIMANT_STAGE2_LEFT_BULLETS = [
  "Please note that the delegation of authority to FIPO is complete and extends to decisions about settlement as well as strategy and day to day conduct.",
  "Please also note that if you die or become incapable while the Claims are ongoing, the power of attorney will be revoked. It will be necessary for your attorney under an LPA or your personal representatives to execute a further power of attorney.",
  "Please note also that if you were paid through another entity we may need to come back to you to ask that you procure that the entity executes a further power of attorney.",
  "The power of attorney should be signed through docusign and requires a witness",
];

const CLAIMANT_STAGE2_LMA_FEATURES = [
  "Confirmation of the practical impact of the power of attorney",
  "A declaration of common purpose with the other medical professionals who join the action group",
  "Your agreement to cooperate with FIPO in the progression of the Claims, including by disclosing documents to FIPO so that it can comply with the formal requirements of the court\u2019s rules;",
  "Your agreement as to how your information will be used;",
  "Your agreement as to how cost and theoretical risk will be shared; and",
  "Your agreement as to the distribution of damages.",
];

const claimantStage2InputCls =
  "w-full rounded-lg border bg-white px-4 font-medium outline-none transition placeholder:font-medium placeholder:text-[#627489] focus:border-[#802B7D] focus:ring-2 focus:ring-[#802B7D]/20";

function ClaimantWitnessLabel({
  children,
  required,
}: {
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <label className="font-medium" style={{ fontSize: 16, color: "#223645" }}>
      {children}
      {required ? <span style={{ color: "#e53935" }}> *</span> : null}
    </label>
  );
}

function ClaimantStage2UploadRow({
  title,
  subtitle,
  status,
  uploading = false,
  onUpload,
  onDelete,
}: {
  title: string;
  subtitle: string;
  status: "empty" | "completed";
  uploading?: boolean;
  onUpload?: () => void;
  onDelete?: () => void;
}) {
  return (
    <div
      className="relative flex h-[52px] items-center rounded-lg border bg-white px-3"
      style={{ borderColor: CLAIMANT_INPUT_BORDER }}
    >
      <Image
        src="/attach-file.svg"
        alt=""
        width={30}
        height={30}
        className="shrink-0"
      />
      <p className="ml-2 min-w-0 flex-1 font-medium leading-normal">
        <span style={{ fontSize: 16, color: "#223645" }}>{title}</span>
        <span style={{ fontSize: 14, color: "#627489" }}> {subtitle}</span>
      </p>
      {status === "completed" ? (
        <div className="ml-3 flex shrink-0 items-center gap-3">
          <span
            className="font-medium"
            style={{ fontSize: 14, color: "#1fb024" }}
          >
            Completed
          </span>
          <button
            type="button"
            onClick={onDelete}
            disabled={uploading}
            className="transition hover:opacity-80 disabled:opacity-50"
            aria-label={`Remove ${title}`}
          >
            <Image src="/delete-icon.svg" alt="" width={30} height={30} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={onUpload}
          disabled={uploading}
          className="ml-3 shrink-0 transition hover:opacity-80 disabled:opacity-50"
          aria-label={`Upload ${title}`}
        >
          <Image src="/cloud-upload.svg" alt="" width={30} height={30} />
        </button>
      )}
    </div>
  );
}

function ClaimantStage2Panel({
  witnessName,
  setWitnessName,
  witnessEmail,
  setWitnessEmail,
  witnessAddress,
  setWitnessAddress,
  witnessPhotoFile,
  setWitnessPhotoFile,
  witnessProofFile,
  setWitnessProofFile,
  uploadError,
  setUploadError,
  docusignStatus,
  onDocusignStatusChange,
  witnessSigned,
  onWitnessSigned,
  onWitnessUnsigned,
  onBeforeWitnessSign,
  docusignStubMode,
  onDocusignStubModeChange,
  witnessStubComplete,
  onWitnessStubComplete,
  engagementSigned,
  engagementStubComplete,
  onGoToStage1,
  onClearError,
  onNeedsStage1RestartChange,
}: {
  witnessName: string;
  setWitnessName: (value: string) => void;
  witnessEmail: string;
  setWitnessEmail: (value: string) => void;
  witnessAddress: string;
  setWitnessAddress: (value: string) => void;
  witnessPhotoFile: EvidenceFileRecord | null;
  setWitnessPhotoFile: (file: EvidenceFileRecord | null) => void;
  witnessProofFile: EvidenceFileRecord | null;
  setWitnessProofFile: (file: EvidenceFileRecord | null) => void;
  uploadError: string | null;
  setUploadError: (value: string | null) => void;
  docusignStatus: string;
  onDocusignStatusChange: (status: string) => void;
  witnessSigned: boolean;
  onWitnessSigned: () => void;
  onWitnessUnsigned: () => void;
  onBeforeWitnessSign?: () => Promise<void>;
  docusignStubMode: boolean;
  onDocusignStubModeChange: (stub: boolean) => void;
  witnessStubComplete: boolean;
  onWitnessStubComplete: () => void;
  engagementSigned: boolean;
  engagementStubComplete: boolean;
  onGoToStage1: () => void;
  onClearError: () => void;
  onNeedsStage1RestartChange: (needs: boolean) => void;
}) {
  const photoInputRef = useRef<HTMLInputElement>(null);
  const proofInputRef = useRef<HTMLInputElement>(null);
  const [photoUploading, setPhotoUploading] = useState(false);
  const [proofUploading, setProofUploading] = useState(false);
  const witnessDetailsReady =
    !!witnessName.trim() &&
    !!witnessEmail.trim() &&
    !!witnessAddress.trim() &&
    !!witnessPhotoFile &&
    !!witnessProofFile;
  const stage1Complete = engagementSigned || engagementStubComplete;
  const witnessSigningReady = witnessDetailsReady && stage1Complete;

  async function handlePhotoUpload(file: File) {
    setUploadError(null);
    setPhotoUploading(true);
    try {
      if (witnessPhotoFile?.id) {
        await deleteEvidenceFile(witnessPhotoFile.id).catch(() => null);
      }
      const saved = await uploadEvidenceFile(file, WITNESS_EVIDENCE_UPLOAD_KEYS.photoId);
      setWitnessPhotoFile(saved);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Photo ID upload failed.");
    } finally {
      setPhotoUploading(false);
      if (photoInputRef.current) photoInputRef.current.value = "";
    }
  }

  async function handleProofUpload(file: File) {
    setUploadError(null);
    setProofUploading(true);
    try {
      if (witnessProofFile?.id) {
        await deleteEvidenceFile(witnessProofFile.id).catch(() => null);
      }
      const saved = await uploadEvidenceFile(file, WITNESS_EVIDENCE_UPLOAD_KEYS.proofOfAddress);
      setWitnessProofFile(saved);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Proof of address upload failed.");
    } finally {
      setProofUploading(false);
      if (proofInputRef.current) proofInputRef.current.value = "";
    }
  }

  async function handlePhotoDelete() {
    setUploadError(null);
    setPhotoUploading(true);
    try {
      if (witnessPhotoFile?.id) {
        await deleteEvidenceFile(witnessPhotoFile.id);
      }
      setWitnessPhotoFile(null);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Could not remove photo ID.");
    } finally {
      setPhotoUploading(false);
    }
  }

  async function handleProofDelete() {
    setUploadError(null);
    setProofUploading(true);
    try {
      if (witnessProofFile?.id) {
        await deleteEvidenceFile(witnessProofFile.id);
      }
      setWitnessProofFile(null);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Could not remove proof of address.");
    } finally {
      setProofUploading(false);
    }
  }

  return (
    <div className="bg-white px-[24px] py-6">
      <p
        className="font-normal"
        style={{ fontSize: 16, lineHeight: "30px", color: "#223645" }}
      >
        Please note that this will have the effect of granting to FIPO the right
        to bring your claim. We remind you again of the implications of becoming
        a claimant member, which can be read{" "}
        <Link
          href="/explanations#key-implications"
          className="font-semibold"
          style={{ color: PURPLE }}
        >
          here
        </Link>
        .
      </p>
      <p
        className="mt-4 font-normal"
        style={{ fontSize: 16, lineHeight: "30px", color: "#223645" }}
      >
        The power of attorney is your way of giving authority to FIPO to act as
        the claimant in the intended litigation.
      </p>

      <div className="mt-8 flex flex-col gap-5 xl:flex-row xl:items-start">
        <div className="min-w-0 max-w-[580px] flex-1">
          <ul className="flex flex-col gap-[10px]">
            {CLAIMANT_STAGE2_LEFT_BULLETS.map((item) => (
              <li key={item} className="flex items-start gap-[10px]">
                <ClaimantPurpleCheck />
                <span
                  className="font-normal"
                  style={{
                    fontSize: 16,
                    lineHeight: "30px",
                    color: "#263238",
                  }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>

          <h5
            className="mt-10 font-semibold leading-normal"
            style={{ color: CLAIMANT_ACTIVE, fontSize: 18 }}
          >
            Witness details
          </h5>

          <div className="mt-6 grid grid-cols-1 gap-[15px] sm:grid-cols-2">
            <div className="flex flex-col gap-[7px]">
              <ClaimantWitnessLabel required>Full name</ClaimantWitnessLabel>
              <input
                type="text"
                value={witnessName}
                onChange={(e) => setWitnessName(e.target.value)}
                placeholder="Full name"
                className={`${claimantStage2InputCls} h-[52px]`}
                style={{
                  borderColor: CLAIMANT_INPUT_BORDER,
                  fontSize: 16,
                  color: "#223645",
                }}
              />
            </div>
            <div className="flex flex-col gap-[7px]">
              <ClaimantWitnessLabel required>Email</ClaimantWitnessLabel>
              <input
                type="email"
                value={witnessEmail}
                onChange={(e) => setWitnessEmail(e.target.value)}
                placeholder="Email"
                className={`${claimantStage2InputCls} h-[52px]`}
                style={{
                  borderColor: CLAIMANT_INPUT_BORDER,
                  fontSize: 16,
                  color: "#223645",
                }}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-[7px]">
            <ClaimantWitnessLabel required>Address</ClaimantWitnessLabel>
            <textarea
              value={witnessAddress}
              onChange={(e) => setWitnessAddress(e.target.value)}
              placeholder="Enter Address"
              rows={3}
              className={`${claimantStage2InputCls} min-h-[100px] resize-none py-3`}
              style={{
                borderColor: CLAIMANT_INPUT_BORDER,
                fontSize: 16,
                color: "#223645",
              }}
            />
          </div>

          <div className="mt-5 flex flex-col gap-3">
            <ClaimantStage2UploadRow
              title="Photo ID"
              subtitle="(Passport / driving licence)"
              status={witnessPhotoFile ? "completed" : "empty"}
              uploading={photoUploading}
              onUpload={() => photoInputRef.current?.click()}
              onDelete={handlePhotoDelete}
            />
            <ClaimantStage2UploadRow
              title="Proof of address"
              subtitle="(utility bill, bank statement, etc.)"
              status={witnessProofFile ? "completed" : "empty"}
              uploading={proofUploading}
              onUpload={() => proofInputRef.current?.click()}
              onDelete={handleProofDelete}
            />
            <input
              ref={photoInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handlePhotoUpload(file);
              }}
            />
            <input
              ref={proofInputRef}
              type="file"
              className="hidden"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void handleProofUpload(file);
              }}
            />
            {uploadError && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{uploadError}</p>
            )}
          </div>
        </div>

        <div className="w-full max-w-[341px] shrink-0 xl:border-l xl:border-zinc-200 xl:pl-6">
          <h5
            className="font-semibold leading-normal"
            style={{ color: CLAIMANT_ACTIVE, fontSize: 21 }}
          >
            Litigation Management Agreement
          </h5>
          {(witnessSigned || witnessStubComplete) &&
            isDocusignComplete(docusignStatus) && (
            <div className="mt-4 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
              Witness signing completed successfully — the document is finalized.
            </div>
          )}
          <p
            className="mt-6 font-normal"
            style={{ fontSize: 16, lineHeight: "30px", color: "#223645" }}
          >
            For an explanation of the Litigation Management Agreement, please see
            the text of the engagement letter.
          </p>
          <p
            className="mt-4 font-normal"
            style={{ fontSize: 16, lineHeight: "30px", color: "#223645" }}
          >
            The main features of the LMA are:
          </p>
          <ul className="mt-4 flex flex-col gap-[15px]">
            {CLAIMANT_STAGE2_LMA_FEATURES.map((item) => (
              <li key={item} className="flex items-start gap-[15px]">
                <ClaimantPurpleCheck />
                <span
                  className="font-normal"
                  style={{
                    fontSize: 16,
                    lineHeight: "26px",
                    color: "#223645",
                  }}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <RegistrationDocuSignSection
            variant="embedded"
            requirePmiFiles={false}
            attachPmiEvidence={false}
            autoConfirmOnGlobalComplete={false}
            sessionKey="stage2_witness_docusign_pending"
            returnContext="claimant-stage2"
            primaryButtonLabel="Review Litigation Agreement"
            signedMessage="Witness signing completed successfully"
            description="The witness signs separately in Stage 2 — click Review Litigation Agreement below and pass the device to your witness. The witness will see a Sign Here tab below your signature (not during Stage 1)."
            docusignStatus={docusignStatus}
            onStatusChange={onDocusignStatusChange}
            declarationSigned={witnessSigned}
            onDeclarationSigned={onWitnessSigned}
            onClearSigned={onWitnessUnsigned}
            uploadsInProgress={photoUploading || proofUploading}
            signingReady={witnessSigningReady}
            signingBlockedMessage={
              !stage1Complete
                ? "Complete Stage 1 engagement signing first."
                : !witnessDetailsReady
                  ? "Complete witness details and upload both documents first."
                  : undefined
            }
            requestSigningFn={async (_forceNew, returnBaseUrl) =>
              startWitnessDocusignSigning(returnBaseUrl, {
                email: witnessEmail.trim(),
                name: witnessName.trim(),
                address: witnessAddress.trim(),
              })
            }
            onBeforeSign={onBeforeWitnessSign}
            witnessEmail={witnessEmail.trim()}
            stage1Complete={stage1Complete}
            onGoToStage1={onGoToStage1}
            onNeedsStage1RestartChange={(needs) => {
              onNeedsStage1RestartChange(needs);
              if (needs) onClearError();
            }}
            stubMode={docusignStubMode}
            onStubModeChange={onDocusignStubModeChange}
            stubComplete={witnessStubComplete}
            onStubComplete={onWitnessStubComplete}
            embeddedButtonStyle="stage2"
          />
        </div>
      </div>
    </div>
  );
}

function ClaimantIntroSection() {
  return (
    <div className="flex items-start gap-[30px]">
      <div className="flex h-[130px] w-[130px] shrink-0 items-center justify-center rounded-full bg-[#F6F0FA]">
        <Image
          src="/approve-doc-icon.svg"
          alt=""
          width={65}
          height={65}
        />
      </div>
      <div className="min-w-0 flex-1">
        <h3
          className="text-[21px] font-semibold leading-normal"
          style={{ color: CLAIMANT_ACTIVE }}
        >
          Become a Claimant Member
        </h3>
        <p className="mt-3 text-[16px] font-normal leading-[30px] text-[#223645]">
          We now ask you to approve the documents that must be approved in order
          for you to become a Claimant Member.
        </p>
        <div className="mt-6 flex h-[100px] items-center gap-5 rounded-lg bg-[#F6F0FA] px-[25px]">
          <Image
            src="/info-icon.svg"
            alt=""
            width={50}
            height={50}
            className="shrink-0"
          />
          <p className="text-[16px] font-normal leading-[30px] text-[#223645]">
            There are two stages to complete. Please read each stage carefully
            and review the documents before proceeding.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Tab: Final Confirmation ─────────────────────────── */

const FINAL_RISK_ICONS = [
  "/risk-no-guarantee.svg",
  "/risk-time.svg",
  "/risk-costs.svg",
  "/risk-irrevocability.svg",
  "/risk-tax.svg",
] as const;

function buildFinalConfirmationGroups(
  membershipType: string,
  gmcNumber: string
): { title: string; items: string[] }[] {
  const fee = membershipType === "ORGANISATION" ? 500 : 250;
  const successFee = membershipType === "ORGANISATION" ? "30%" : "32.5%";
  const groups =
    explanationsDocuments.readMore.overarchingDeclaration.groups;

  return groups.map((group, idx) => {
    let items: string[] = [...group.items];
    if (idx === 1) {
      items = items.map((item) =>
        item
          .replace("£250 / £500", `£${fee}`)
          .replace("32.5% / 30%", successFee)
      );
    }
    if (idx === 3) {
      items = items.map((item) =>
        item.replace("[auto-fill]", gmcNumber.trim() || "—")
      );
    }
    return { title: group.title, items };
  });
}

function FinalInfoBox({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex items-center gap-5 rounded-lg px-[25px] py-5"
      style={{ backgroundColor: CLAIMANT_PANEL_BG }}
    >
      <Image
        src="/info-icon.svg"
        alt=""
        width={50}
        height={50}
        className="shrink-0"
      />
      <p className="text-[16px] font-normal leading-[30px] text-[#223645]">
        {children}
      </p>
    </div>
  );
}

function FinalConfirmationBullet({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-start gap-3 text-[16px] font-normal leading-[30px] text-[#223645]">
      <span
        className="mt-[10px] h-[10px] w-[10px] shrink-0 rounded-full"
        style={{ backgroundColor: CLAIMANT_HEADING }}
        aria-hidden
      />
      <span>{children}</span>
    </li>
  );
}

function FinalConfirmationCheckbox({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="mt-1 shrink-0 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      {checked ? (
        <Image
          src="/final-check-green.svg"
          alt=""
          width={22}
          height={22}
          className="block"
        />
      ) : (
        <span
          className="block h-[22px] w-[22px] rounded-[3px] border-[1.5px] bg-white"
          style={{ borderColor: CLAIMANT_INPUT_BORDER }}
          aria-hidden
        />
      )}
    </label>
  );
}

function FinalConfirmationGroup({
  title,
  items,
  checked,
  onCheckedChange,
}: {
  title: string;
  items: string[];
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="mt-8">
      <div className="flex items-start gap-[30px]">
        <FinalConfirmationCheckbox
          checked={checked}
          onChange={onCheckedChange}
        />
        <h4
          className="min-w-0 flex-1 text-[18px] font-semibold leading-normal"
          style={{ color: CLAIMANT_ACTIVE }}
        >
          {title}
        </h4>
      </div>
      <ul className="mt-4 space-y-3 pl-[52px]">
        {items.map((item) => (
          <FinalConfirmationBullet key={item}>{item}</FinalConfirmationBullet>
        ))}
      </ul>
    </div>
  );
}

function FinalThankYouSection() {
  return (
    <div className="flex flex-col items-center px-[30px] py-12 text-center sm:py-16">
      <Image
        src="/thank-you-check.svg"
        alt=""
        width={106}
        height={106}
        className="h-[106px] w-[106px]"
        priority
      />
      <h3
        className="mt-6 text-[40px] font-bold uppercase leading-normal sm:text-[50px]"
        style={{ color: CLAIMANT_ACTIVE }}
      >
        Thank you!
      </h3>
      <div className="mt-4 max-w-[468px] text-[18px] font-medium leading-[34px] text-[#263238]">
        <p>Your Application Is Currently Under Review.</p>
        <p>We Will Contact You Within 3–5 Working Days.</p>
      </div>
    </div>
  );
}

function FinalConfirmationAccordion({
  membershipType,
  gmcNumber,
  confirmedGroups,
  onConfirmedGroupsChange,
  submitted,
}: {
  membershipType: string;
  gmcNumber: string;
  confirmedGroups: Record<string, boolean>;
  onConfirmedGroupsChange: (groups: Record<string, boolean>) => void;
  submitted: boolean;
}) {
  const [mainOpen, setMainOpen] = useState(!submitted);
  const [thankYouOpen, setThankYouOpen] = useState(submitted);
  const declaration = explanationsDocuments.readMore.overarchingDeclaration;
  const confirmationGroups = buildFinalConfirmationGroups(
    membershipType,
    gmcNumber
  );

  useEffect(() => {
    if (submitted) {
      setMainOpen(false);
      setThankYouOpen(true);
    }
  }, [submitted]);

  function setGroupConfirmed(title: string, checked: boolean) {
    onConfirmedGroupsChange({ ...confirmedGroups, [title]: checked });
  }

  return (
    <div
      id="register-section-final"
      className="scroll-mt-28 overflow-hidden rounded-lg border border-zinc-200 bg-white"
    >
      <button
        type="button"
        onClick={() => setMainOpen(!mainOpen)}
        className="flex min-h-[60px] w-full items-center justify-between px-[30px] py-3 text-left transition"
        style={{
          backgroundColor: mainOpen ? "#F3E8F3" : "#f5f5f5",
          color: mainOpen ? CLAIMANT_ACTIVE : CLAIMANT_HEADING,
        }}
      >
        <span className="pr-4 text-[18px] font-medium leading-normal">
          Final Confirmation &amp; Risk Warnings
        </span>
        <ClaimantAccordionIcon open={mainOpen} />
      </button>

      {mainOpen && (
        <div className="bg-white px-[30px] py-6">
          <div className="flex items-start gap-[30px]">
            <div className="flex h-[130px] w-[130px] shrink-0 items-center justify-center rounded-full bg-[#F6F0FA]">
              <Image
                src="/final-assignment-icon.svg"
                alt=""
                width={65}
                height={65}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h3
                className="text-[24px] font-semibold leading-normal"
                style={{ color: CLAIMANT_ACTIVE }}
              >
                {declaration.confirmationTitle}
              </h3>
              <p className="mt-3 text-[18px] font-normal leading-[30px] text-[#223645]">
                {declaration.confirmationIntro}
              </p>
            </div>
          </div>

          {confirmationGroups.map((group) => (
            <FinalConfirmationGroup
              key={group.title}
              title={group.title}
              items={group.items}
              checked={!!confirmedGroups[group.title]}
              onCheckedChange={(checked) =>
                setGroupConfirmed(group.title, checked)
              }
            />
          ))}

          <div className="mt-8">
            <FinalInfoBox>
              If you have any questions before signing, please contact{" "}
              <a
                href="mailto:fipo@harcusparker.co.uk"
                className="font-medium underline"
                style={{ color: CLAIMANT_ACTIVE }}
              >
                fipo@harcusparker.co.uk
              </a>
              . {declaration.closingNote}
            </FinalInfoBox>
          </div>

          <h3
            className="mt-10 text-[24px] font-semibold leading-normal"
            style={{ color: CLAIMANT_ACTIVE }}
          >
            Risk Warnings
          </h3>

          <div className="mt-8 space-y-8">
            {explanationsSummaryRisk.items.map((item, idx) => (
              <div key={item.title} className="flex items-start gap-5">
                <div className="flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-full">
                  <Image
                    src={FINAL_RISK_ICONS[idx]}
                    alt=""
                    width={60}
                    height={60}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <h4
                    className="text-[18px] font-semibold leading-normal"
                    style={{ color: CLAIMANT_ACTIVE }}
                  >
                    {item.title}
                  </h4>
                  <p className="mt-2 text-[16px] font-normal leading-[30px] text-[#223645]">
                    {item.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8">
            <FinalInfoBox>
              If you have any questions before signing, please contact{" "}
              <a
                href="mailto:fipo@harcusparker.co.uk"
                className="font-medium underline"
                style={{ color: CLAIMANT_ACTIVE }}
              >
                fipo@harcusparker.co.uk
              </a>
              . <strong>{declaration.closingNote}</strong>
            </FinalInfoBox>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setThankYouOpen(!thankYouOpen)}
        className="flex min-h-[60px] w-full items-center justify-between border-t border-zinc-200 px-[30px] py-4 text-left transition"
        style={{
          backgroundColor: thankYouOpen ? "#F3E8F3" : "#f5f5f5",
          color: thankYouOpen ? CLAIMANT_ACTIVE : CLAIMANT_HEADING,
        }}
      >
        <span className="pr-4 text-[18px] font-medium leading-normal">
          Thank You
        </span>
        <ClaimantAccordionIcon open={thankYouOpen} />
      </button>

      {thankYouOpen && (
        <div className="border-t border-zinc-200 bg-white">
          <FinalThankYouSection />
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── Section 4: identity ─────────────────────────── */

const LEADLY_PRIVACY_URL = "https://www.leadly.co.uk/privacy/privacy-policy";

function FipoCheckbox({
  checked,
  onChange,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only"
      />
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border bg-white transition ${
          checked ? "border-[#802B7D]" : "border-[#627489]"
        }`}
        aria-hidden
      >
        <svg
          className={`h-3.5 w-3.5 text-[#22a06b] ${checked ? "block" : "hidden"}`}
          viewBox="0 0 12 10"
          fill="none"
        >
          <path
            d="M1 5L4.5 8.5L11 1.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="text-sm leading-relaxed text-[#627489]">{children}</span>
    </label>
  );
}

const IDENTITY_BULLETS = [
  "Your details will be checked against publicly-available records",
  <>
    We will carry out a &lsquo;soft&rsquo; credit check which will{" "}
    <strong className="font-bold">NOT</strong> affect your credit score
  </>,
  "The process takes 30-60 seconds",
  "If automatic verification is inconclusive, you will be asked to upload photo ID",
] as const;

function IdentitySection({
  agreed,
  setAgreed,
}: {
  agreed: boolean;
  setAgreed: (value: boolean) => void;
}) {
  return (
    <div className="py-2 sm:py-4">
      <h3 className="text-xl font-bold sm:text-[22px]" style={{ color: PURPLE }}>
        Identity Verification Required
      </h3>
      <p className="mt-4 text-[16px] font-medium leading-[34px] text-[#223645]">
        To protect against fraud and ensure all participants are genuine medical practitioners,
        we use Leadly to verify your identity against official records.
      </p>

      <p className="mt-6 text-xl sm:text-[22px] font-bold leading-[34px]" style={{ color: PURPLE }}>
        What happens:
      </p>
      <ul className="mt-3 space-y-1">
        {IDENTITY_BULLETS.map((item, index) => (
          <li key={index} className="flex gap-3 text-[16px] font-medium leading-[34px] text-[#223645]">
            <span
              className="mt-[13px] h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: PURPLE }}
              aria-hidden
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-[16px] font-medium leading-[34px] text-[#223645]">
        <strong className="font-bold">Your data:</strong> Leadly processes your data in accordance
        with{" "}
        <a
          href={LEADLY_PRIVACY_URL}
          target="_blank"
          rel="noreferrer"
          className="font-semibold underline"
          style={{ color: PURPLE }}
        >
          their privacy policy
        </a>
        . We do not store your ID documents permanently.
      </p>

      <div className="mt-8">
        <FipoCheckbox checked={agreed} onChange={setAgreed}>
          I consent to identity verification as described above
        </FipoCheckbox>
      </div>
    </div>
  );
}

/* ─────────────────────────── Tab 2: legal document steps ─────────────────────────── */

function LegalCallout({
  variant,
  icon,
  children,
}: {
  variant: "time" | "warning" | "confidential";
  icon: ReactNode;
  children: ReactNode;
}) {
  const styles = {
    time: "border-none",
    warning: "border-amber-200 bg-amber-50 text-amber-900",
    confidential: "border-[#aaaaaa] bg-[#F0F0F0] text-[#223645]",
  };
  return (
    <div
      className={`mt-6 flex gap-3 rounded-xl border p-4 text-[15px] font-medium leading-[28px] ${styles[variant]}`}
    >
      <span className="mt-0.5 shrink-0" style={{ color: PURPLE }}>
        {icon}
      </span>
      <div>{children}</div>
    </div>
  );
}

function LegalDocumentIntroSection({ membershipType }: { membershipType: string }) {
  const fee = membershipType === "ORGANISATION" ? 500 : 250;
  const feeRate = fee === 500 ? "30%" : "32.5%";

  return (
    <div className="py-2 sm:py-4">
      <h3 className="text-xl font-bold sm:text-[22px]" style={{ color: PURPLE }}>
        Claimant Registration: Legal Document Section
      </h3>

      <div className="mt-4 space-y-4 text-[16px] font-medium leading-[28px] text-[#263238]">
        <p>
        You are now completing the formal legal registration to participate in the collective action. You should proceed only if you are a medical practitioner who may be eligible to participate. By proceeding, you confirm that you are a registered medical practitioner who has provided services under private medical insurance arrangements. If you are employed by or represent the defendant insurance companies BUPA Insurance Limited or AXA PPP you should not proceed.
        </p>
        <p>
        This section is prepared by our solicitors Harcus Parker and its counsel Suzanne Rab and involves:
        </p>
        <ul className="list-disc space-y-1 pl-6">
          <li>Providing information about your practice and PMI relationships</li>
          <li>
          Reviewing and signing legal documents (Power of Attorney, Litigation Management Agreement)
          </li>
          <li>Confirming your understanding of the process and your rights</li>
        </ul>
      </div>

      <LegalCallout
        variant="time"
        icon={
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        }
      >
        Please allow 15-20 minutes to complete this section carefully. You can save your progress and return later if needed.
      </LegalCallout>

      <LegalCallout
        variant="warning"
        icon={
          <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clipPath="url(#clip0_819_1553)">
<path d="M29.6145 1.85846C31.8101 3.61739 32.9443 6.15862 34.2089 8.60857C35.2122 10.5225 36.2708 12.4064 37.3197 14.2956C37.9968 15.5171 38.67 16.7407 39.3435 17.9641C40.465 20.0005 41.5882 22.0359 42.7126 24.0707C43.1284 24.8233 43.5441 25.5759 43.9598 26.3285C44.2216 26.8024 44.4836 27.2762 44.7456 27.75C45.3513 28.8454 45.9554 29.9416 46.5562 31.0397C47.0449 31.9265 47.5394 32.807 48.0434 33.6849C48.2913 34.1251 48.5393 34.5653 48.7948 35.0189C49.0186 35.4097 49.2425 35.8006 49.4732 36.2033C50.4343 38.3955 50.4431 40.5476 50.0002 42.8741C49.0924 45.1022 47.8537 46.441 45.744 47.6158C44.207 48.2449 42.6498 48.1757 41.0099 48.1668C40.6265 48.1708 40.2432 48.1748 39.8482 48.1789C38.5863 48.1897 37.3247 48.189 36.0628 48.1872C35.1818 48.1902 34.3009 48.1936 33.4199 48.1973C31.5752 48.2032 29.7306 48.2029 27.8858 48.1988C25.5271 48.1943 23.1689 48.2075 20.8103 48.2257C18.9913 48.2372 17.1724 48.2379 15.3533 48.2354C14.484 48.2358 13.6146 48.2399 12.7454 48.2478C11.5271 48.2575 10.3098 48.2521 9.09158 48.2431C8.55813 48.252 8.55813 48.252 8.0139 48.2612C5.32497 48.2173 3.60374 47.3435 1.5627 45.6085C-0.221891 43.5192 -0.212918 41.5911 -0.180328 38.8944C0.130674 36.3292 1.31726 34.3552 2.61251 32.1563C2.88263 31.6783 3.15168 31.1997 3.4197 30.7205C4.09467 29.5194 4.78211 28.326 5.47389 27.1346C6.25748 25.78 7.02239 24.4148 7.79086 23.0516C8.19604 22.3343 8.60301 21.618 9.01176 20.9028C10.1942 18.829 11.3427 16.7407 12.4605 14.6316C12.59 14.3877 12.7194 14.1439 12.8528 13.8926C13.4829 12.704 14.1096 11.5138 14.7318 10.321C18.8658 2.48853 18.8658 2.48853 21.4037 1.29694C24.087 0.613057 27.1336 0.506868 29.6145 1.85846ZM20.9355 8.22195C20.3183 9.3305 19.7268 10.4498 19.1408 11.5753C18.6889 12.4271 18.2362 13.2785 17.7828 14.1296C17.5536 14.5607 17.3243 14.9919 17.0881 15.4361C16.0624 17.3412 14.9905 19.2188 13.9162 21.0967C11.6712 25.0336 9.52263 29.0182 7.39709 33.0203C7.16263 33.4613 6.92817 33.9023 6.6866 34.3566C6.47959 34.7474 6.27257 35.1382 6.05928 35.5409C5.66315 36.2678 5.24903 36.9851 4.81836 37.692C4.02979 39.0311 3.96816 40.1947 4.29708 41.7022C5.35148 43.0788 6.12662 43.7356 7.8127 44.046C8.91235 44.0869 10.0025 44.1074 11.1022 44.1089C11.5989 44.1118 11.5989 44.1118 12.1056 44.1148C13.2 44.1205 14.2943 44.1231 15.3887 44.1253C16.1506 44.1276 16.9125 44.1298 17.6744 44.1321C19.2719 44.1362 20.8694 44.1384 22.467 44.1398C24.5108 44.1419 26.5545 44.1513 28.5983 44.1624C30.1723 44.1697 31.7463 44.1718 33.3204 44.1724C34.0737 44.1735 34.827 44.1767 35.5802 44.1818C36.6358 44.1885 37.691 44.1877 38.7466 44.1852C39.0557 44.1888 39.3648 44.1924 39.6834 44.1961C41.7095 44.1809 43.1306 43.8444 44.9221 42.8741C45.9091 41.3936 46.0073 40.2876 45.7033 38.5772C45.0933 37.061 44.2967 35.6703 43.4816 34.2559C43.252 33.8449 43.0223 33.4339 42.7857 33.0104C42.0722 31.7371 41.3497 30.4693 40.6252 29.2022C40.2042 28.4603 39.7836 27.7182 39.3633 26.976C38.748 25.8892 38.1322 24.8028 37.5136 23.7179C36.3155 21.6091 35.1472 19.4869 34.0075 17.3461C33.8122 16.9795 33.8122 16.9795 33.613 16.6056C32.9785 15.4125 32.3469 14.2179 31.7188 13.0214C29.7606 8.65061 29.7606 8.65061 26.5627 5.37408C23.6359 5.08621 22.4826 5.70076 20.9355 8.22195Z" fill="#C55F0F"/>
<path d="M25.0002 15.1367C26.172 15.2344 26.172 15.2344 26.9533 16.0156C27.0313 17.0708 27.0626 18.0851 27.057 19.1406C27.0578 19.4498 27.0585 19.759 27.0593 20.0775C27.0598 20.7316 27.0584 21.3857 27.0551 22.0398C27.051 23.0429 27.0551 24.0457 27.0601 25.0488C27.0596 25.6836 27.0586 26.3184 27.057 26.9531C27.0586 27.2542 27.0602 27.5554 27.0618 27.8656C27.0431 29.9883 27.0431 29.9883 26.172 30.8594C25.0002 30.957 25.0002 30.957 23.8283 30.8594C22.8339 29.865 22.9505 29.222 22.9385 27.8656C22.9401 27.5645 22.9416 27.2634 22.9433 26.9531C22.9425 26.644 22.9418 26.3348 22.941 26.0162C22.9405 25.3621 22.9419 24.708 22.9452 24.054C22.9494 23.0508 22.9452 22.048 22.9402 21.0449C22.9407 20.4102 22.9417 19.7754 22.9433 19.1406C22.9417 18.8395 22.9401 18.5384 22.9385 18.2281C22.9643 15.3064 22.9643 15.3064 25.0002 15.1367Z" fill="#C55F0F"/>
<path d="M25 34.668C26.1719 34.7656 26.1719 34.7656 26.9531 35.5469C27.0508 36.7188 27.0508 36.7188 26.9531 37.8906C26.1719 38.6719 26.1719 38.6719 25 38.7695C23.8281 38.6719 23.8281 38.6719 23.0469 37.8906C22.9492 36.7188 22.9492 36.7188 23.0469 35.5469C23.8281 34.7656 23.8281 34.7656 25 34.668Z" fill="#C55F0F"/>
</g>
<defs>
<clipPath id="clip0_819_1553">
<rect width="50" height="50" fill="white"/>
</clipPath>
</defs>
</svg>

        }
      >
        <strong>Important:</strong> The legal documents you will sign are binding. Please
        read them carefully or seek independent legal advice if you have concerns.
      </LegalCallout>

      <p className="mt-6 text-xl font-bold leading-[34px]" style={{ color: PURPLE }}>
      Through Step 2
      </p>
      <p className="mt-6 text-[16px] font-medium leading-[28px] text-[#263238]">
      Through Step 2 you will be asked to provide the information that Harcus Parker initially require for us to put your claim to the defendants
      </p>
      <p className="mt-6 text-[16px] font-medium leading-[28px] text-[#263238]">
      You should first have familiarised yourself with the implications of becoming a claimant member, which can be read here[DP1]  and with the descriptions and Important Legal Notices which appear on the Action Group’s microsite.
      </p>

      <p className="mt-6 text-xl font-bold leading-[34px]" style={{ color: PURPLE }}>
        You will be asked:
      </p>
      <ul className="mt-3 list-disc space-y-2 pl-6 text-[16px] font-medium leading-[28px] text-[#263238]">
        <li>
        To approve the terms of FIPO’s engagement with its solicitors, Harcus Parker, and its counsel, Suzanne Rab, since the terms will be executed for you and on your behalf, and the legal team will in substance be acting for you and therefore  have a direct bearing on what you may receive from your claim (if you paid £250 at Step 1, then the fee deducted will be 32.5% + VAT; and if you paid £500 then the fee deducted will be 30% + VAT);
        </li>
        <li>
        To execute a power of attorney in FIPO’s favour authorising FIPO to bring proceedings against the PMIs on your behalf and to agree to Harcus Parker's and Counsel's retainers on your behalf;
        </li>
        <li>To sign a “Litigation Management Agreement which regulates the relationship between you, FIPO, Harcus Parker as the solicitors who will be acting on your behalf and other members of the FIPO Fair Pay Action Group; and</li>
        <li>To sign a declaration which records your understanding of the main features of the arrangements. Please note that you can read a fuller description and review the documents in full here.</li>
      </ul>

      <LegalCallout
        variant="confidential"
        icon={
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        }
      >
        <strong className="text-[#660066]">Confidentiality warning:</strong> further descriptions of the above documents and the documents themselves are available through the links provided below. Please note that these descriptions and documents are confidential and privileged and are intended for potential members of the FIPO Fair Pay Action Group only. By proceeding to review the documents and the descriptions of them, you confirm that you are either a working or retired medical practitioner who has received payments from private medical insurers in the past six years and that you are not an employee of BUPA Insurance Limited or AXA PPP or a partner or employee of a professional adviser acting on behalf of BUPA Insurance Limited or AXA PPP. Any person in this excluded category who proceeds will knowingly do so in breach of confidence.
      </LegalCallout>
    </div>
  );
}

function PracticeInfoPanel(p: {
  fullName: string;
  setFullName: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  gmcNumber: string;
  setGmcNumber: (v: string) => void;
  phone: string;
  setPhone: (v: string) => void;
  specialty: string;
  setSpecialty: (v: string) => void;
  deanery: string;
  setDeanery: (v: string) => void;
  grossIncome: string;
  setGrossIncome: (v: string) => void;
  yearStarted: string;
  setYearStarted: (v: string) => void;
  yearEnded: string;
  setYearEnded: (v: string) => void;
  bupaNumber: string;
  setBupaNumber: (v: string) => void;
  axaNumber: string;
  setAxaNumber: (v: string) => void;
  recognisedOther: boolean | null;
  setRecognisedOther: (v: boolean | null) => void;
  pmiPercentage: string;
  setPmiPercentage: (v: string) => void;
}) {
  const pct = Math.min(100, Math.max(0, Number(p.pmiPercentage) || 0));

  return (
    <div className="py-2 sm:py-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <PracticeLabel>Full name</PracticeLabel>
          <input
            className={fieldCls}
            value={p.fullName}
            onChange={(e) => p.setFullName(e.target.value)}
            placeholder="Enter Full Name"
          />
        </div>
        <div>
          <PracticeLabel>Email</PracticeLabel>
          <input
            type="email"
            className={fieldCls}
            value={p.email}
            onChange={(e) => p.setEmail(e.target.value)}
            placeholder="Enter Email Address"
          />
        </div>
        <div>
          <PracticeLabel>GMC number</PracticeLabel>
          <input
            className={fieldCls}
            inputMode="text"
            maxLength={8}
            value={p.gmcNumber}
            onChange={(e) => p.setGmcNumber(normalizeGmcNumberInput(e.target.value))}
            placeholder="Enter GMC Number"
          />
        </div>
        <div>
          <PracticeLabel>Phone number</PracticeLabel>
          <input
            type="tel"
            className={fieldCls}
            inputMode="tel"
            value={p.phone}
            onChange={(e) => p.setPhone(normalizePhoneInput(e.target.value))}
            placeholder="Enter Phone number"
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <PracticeLabel>Speciality</PracticeLabel>
          <input
            className={fieldCls}
            value={p.specialty}
            onChange={(e) => p.setSpecialty(e.target.value)}
            placeholder="Enter Speciality"
          />
        </div>
        <div>
          <PracticeLabel>Deanery</PracticeLabel>
          <select
            className={fieldCls}
            value={p.deanery}
            onChange={(e) => p.setDeanery(e.target.value)}
          >
            <option value="">Select Deanery</option>
            {DEANERIES.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <div>
          <PracticeLabel>Average gross private income</PracticeLabel>
          <div className="relative mt-1">
            <input
              type="number"
              min="0"
              className={`${practiceFieldCls} pr-8`}
              value={p.grossIncome}
              onChange={(e) => p.setGrossIncome(e.target.value)}
              placeholder="Enter Amount"
            />
            <span
              className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm font-medium text-[#627489]"
              aria-hidden
            >
              £
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <PracticeLabel>Year started private practice</PracticeLabel>
          <select
            className={fieldCls}
            value={p.yearStarted}
            onChange={(e) => p.setYearStarted(e.target.value)}
          >
            <option value="">Select Year</option>
            {PRACTICE_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
        <div>
          <PracticeLabel>Year ended private practice</PracticeLabel>
          <select
            className={fieldCls}
            value={p.yearEnded}
            onChange={(e) => p.setYearEnded(e.target.value)}
          >
            <option value="">Select Year</option>
            {PRACTICE_YEARS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <PracticeLabel>BUPA Number</PracticeLabel>
          <input
            className={fieldCls}
            value={p.bupaNumber}
            onChange={(e) => p.setBupaNumber(e.target.value)}
            placeholder="BUPA Number"
          />
        </div>
        <div>
          <PracticeLabel>AXA Number</PracticeLabel>
          <input
            className={fieldCls}
            value={p.axaNumber}
            onChange={(e) => p.setAxaNumber(e.target.value)}
            placeholder="Enter AXA Number"
          />
        </div>
      </div>

      <div className="mt-6">
        <PracticeLabel>Recognised by other insurers</PracticeLabel>
        <div className="mt-2 flex items-center gap-6">
          {[
            { value: true, label: "Yes" },
            { value: false, label: "No" },
          ].map((opt) => (
            <label key={String(opt.value)} className="flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="recognisedOther"
                checked={p.recognisedOther === opt.value}
                onChange={() => p.setRecognisedOther(opt.value)}
                className="h-4 w-4 accent-[#802B7D]"
              />
              <span className="text-sm font-medium text-[#223645]">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mt-8 border-t border-zinc-100 pt-6">
        <h4 className="text-base font-bold" style={{ color: PURPLE }}>
          Estimated % of private practice
        </h4>
        <p className="mt-3 text-sm leading-relaxed text-[#223645]">
          <strong>Note:</strong> This percentage helps us estimate the proportion of your
          practice income that relates to private medical insurance work, which is used in
          calculating potential damages.
        </p>
        <ul className="mt-3 space-y-1 text-sm leading-relaxed text-[#223645]">
          <li>
            <strong style={{ color: PURPLE }}>Include:</strong> All income from the BUPA,
            AXA PPP and other PMIs
          </li>
          <li>
            <strong style={{ color: PURPLE }}>Exclude:</strong> Self-pay private patients,
            NHS work
          </li>
        </ul>

        <div className="mt-5 flex items-center gap-4">
          <div className="min-w-0 flex-1">
            <input
              type="range"
              min="0"
              max="100"
              value={pct}
              onChange={(e) => p.setPmiPercentage(e.target.value)}
              className="h-2 w-full cursor-pointer appearance-none rounded-full accent-[#802B7D]"
              style={{
                background: `linear-gradient(90deg, ${PURPLE} 0%, ${PURPLE} ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`,
              }}
            />
            <div className="mt-1 flex justify-between text-xs text-[#627489]">
              <span>0%</span>
              <span>100%</span>
            </div>
          </div>
          <div className="w-16 shrink-0 rounded-lg border border-zinc-300 px-2 py-2 text-center text-sm font-semibold text-[#223645]">
            {pct}%
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-[#223645]">
          The next questions seek to identify the entities through which you dealt with the PMIs. We appreciate that this may be a mixed picture. Please note that if you were not paid directly it may be necessary to claim through the entity, which will require us to procure the agreement of the entity.
        </p>
      </div>
    </div>
  );
}

const DEANERIES = [
  "East of England",
  "East Midlands",
  "Kent, Surrey and Sussex",
  "London",
  "North East",
  "North West",
  "Northern Ireland",
  "Scotland",
  "South West",
  "Wales",
  "West Midlands",
  "Yorkshire and the Humber",
];

const PRACTICE_YEARS = Array.from(
  { length: new Date().getFullYear() - 1969 },
  (_, i) => String(new Date().getFullYear() - i)
);

function PracticeLabel({ children }: { children: ReactNode }) {
  return (
    <label className="mb-1 block text-sm font-semibold text-[#660066]">
      {children} <span className="text-red-500">*</span>
    </label>
  );
}

const PMI_INCOME_SOURCES = [
  "Directly in my own name as a self-employed practitioner",
  "Through a limited company of which I am a director",
  "Through an LLP of which I am a member",
  "Through a partnership of which I am a partner",
  "Through an alternative structure",
];

function PmiRelationshipPanel(p: {
  incomeSource: string;
  setIncomeSource: (v: string) => void;
  paidAxa: boolean;
  setPaidAxa: (v: boolean) => void;
  axaYears: string;
  setAxaYears: (v: string) => void;
  paidBupa: boolean;
  setPaidBupa: (v: boolean) => void;
  bupaYears: string;
  setBupaYears: (v: string) => void;
  paidCompany: boolean;
  setPaidCompany: (v: boolean) => void;
  companyName: string;
  setCompanyName: (v: string) => void;
  companyNumber: string;
  setCompanyNumber: (v: string) => void;
  companyDirectors: string;
  setCompanyDirectors: (v: string) => void;
  paidLlp: boolean;
  setPaidLlp: (v: boolean) => void;
  llpName: string;
  setLlpName: (v: string) => void;
  llpNumber: string;
  setLlpNumber: (v: string) => void;
  llpMembers: string;
  setLlpMembers: (v: string) => void;
  paidAlternative: boolean;
  setPaidAlternative: (v: boolean) => void;
  setUploadingA: (v: boolean) => void;
  setUploadingB: (v: boolean) => void;
  savedPmiFiles: EvidenceFileRecord[];
  onPmiFileSaved: (file: EvidenceFileRecord) => void;
}) {
  return (
    <div className="py-2 sm:py-4">
      <h4 className="text-base font-bold text-[#660066]">
        How do you receive income from private medical insurers?
      </h4>
      <p className="mt-2 text-sm text-[#223645]">
        Select the option that currently applies (or most recently applied):
      </p>
      <div className="mt-4 space-y-3">
        {PMI_INCOME_SOURCES.map((option) => (
          <label key={option} className="flex cursor-pointer items-start gap-3">
            <input
              type="radio"
              name="pmiIncomeSource"
              checked={p.incomeSource === option}
              onChange={() => p.setIncomeSource(option)}
              className="mt-1 h-4 w-4 shrink-0 accent-[#802B7D]"
            />
            <span className="text-sm leading-relaxed text-[#223645]">{option}</span>
          </label>
        ))}
      </div>
      <p className="mt-4 text-sm leading-relaxed text-[#223645]">
        <strong className="text-[#660066]">Note:</strong> If your structure changed over time or you're unsure, select "Multiple structures." We will work with you to identify where your losses sit — this will not disqualify you.
      </p>

      <h4 className="mt-8 text-[18px] font-semibold text-[#660066]">
        Entities through which you were paid: please tell us, throughout your private practice whether:
      </h4>

      <div className="mt-6 space-y-4">
        <PmiEntityYearRow
          checked={p.paidAxa}
          onChange={p.setPaidAxa}
          label="You were paid directly by AXA"
          years={p.axaYears}
          onYearsChange={p.setAxaYears}
        />
        <PmiEntityYearRow
          checked={p.paidBupa}
          onChange={p.setPaidBupa}
          label="You were paid directly by BUPA"
          years={p.bupaYears}
          onYearsChange={p.setBupaYears}
          yearsLabel="if so, for which years"
        />

        <div>
          <FipoCheckbox checked={p.paidCompany} onChange={p.setPaidCompany}>
            <span className="text-sm text-[#223645]">You were paid through a company</span>
          </FipoCheckbox>
          <div className="mt-4 pl-8">
            <p className="mb-3 text-sm font-bold text-[#660066]">Company details:</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <PracticeLabel>Company name</PracticeLabel>
                <input
                  className={practiceFieldCls}
                  value={p.companyName}
                  onChange={(e) => p.setCompanyName(e.target.value)}
                  placeholder="Enter Company name"
                />
              </div>
              <div>
                <PracticeLabel>Company number</PracticeLabel>
                <input
                  className={practiceFieldCls}
                  value={p.companyNumber}
                  onChange={(e) => p.setCompanyNumber(e.target.value)}
                  placeholder="Enter Company number"
                />
              </div>
              <div>
                <PracticeLabel>Directors</PracticeLabel>
                <input
                  className={practiceFieldCls}
                  value={p.companyDirectors}
                  onChange={(e) => p.setCompanyDirectors(e.target.value)}
                  placeholder="Enter Directors"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <FipoCheckbox checked={p.paidLlp} onChange={p.setPaidLlp}>
            <span className="text-sm text-[#223645]">You were paid through an LLP</span>
          </FipoCheckbox>
          <div className="mt-4 pl-8">
            <p className="mb-3 text-sm font-bold text-[#660066]">LLP details:</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <PracticeLabel>Name</PracticeLabel>
                <input
                  className={practiceFieldCls}
                  value={p.llpName}
                  onChange={(e) => p.setLlpName(e.target.value)}
                  placeholder="Enter Name"
                />
              </div>
              <div>
                <PracticeLabel>Registration number</PracticeLabel>
                <input
                  className={practiceFieldCls}
                  value={p.llpNumber}
                  onChange={(e) => p.setLlpNumber(e.target.value)}
                  placeholder="Enter Registration number"
                />
              </div>
              <div>
                <PracticeLabel>Members</PracticeLabel>
                <input
                  className={practiceFieldCls}
                  value={p.llpMembers}
                  onChange={(e) => p.setLlpMembers(e.target.value)}
                  placeholder="Enter Members"
                />
              </div>
            </div>
          </div>
        </div>

        <FipoCheckbox checked={p.paidAlternative} onChange={p.setPaidAlternative}>
          <span className="text-sm text-[#223645]">
            You were paid through an alternative structure
          </span>
        </FipoCheckbox>
      </div>

      <h4 className="mt-8 text-[18px] font-semibold text-[#660066]">
        We ask you now to upload evidence of:
      </h4>
      <div className="mt-4 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <div className="grid grid-cols-2 divide-x divide-zinc-200">
          <PmiEvidenceDropzone
            letter="a"
            prefix="your / the relevant entity's relationship with "
            boldSuffix="AXA and / or BUPA; and"
            uploadKey="pmi-evidence-a"
            setUploading={p.setUploadingA}
            initialFiles={p.savedPmiFiles.filter(
              (file) =>
                file.uploadKey === "pmi-evidence-a" ||
                file.fileUrl.includes("/pmi-evidence-a/")
            )}
            onFileSaved={p.onPmiFileSaved}
          />
          <PmiEvidenceDropzone
            letter="b"
            prefix="your / the relevant entity's relationship with "
            boldSuffix="AXA and / or BUPA"
            uploadKey="pmi-evidence-b"
            setUploading={p.setUploadingB}
            initialFiles={p.savedPmiFiles.filter(
              (file) =>
                file.uploadKey === "pmi-evidence-b" ||
                file.fileUrl.includes("/pmi-evidence-b/")
            )}
            onFileSaved={p.onPmiFileSaved}
          />
        </div>
      </div>
    </div>
  );
}

function RegistrationDocuSignSection({
  docusignStatus,
  onStatusChange,
  declarationSigned,
  onDeclarationSigned,
  onBeforeSign,
  uploadsInProgress = false,
  requirePmiFiles = true,
  attachPmiEvidence = true,
  pmiFilesReady = true,
  pmiSavedFileCount = 0,
  sessionKey = "pmi_docusign_pending",
  returnContext,
  variant = "section",
  title = "Sign your PMI relationship declaration",
  description,
  primaryButtonLabel,
  signedMessage = "Documents signed successfully",
  autoConfirmOnGlobalComplete = true,
  signingReady = true,
  signingBlockedMessage,
  requestSigningFn,
  embeddedButtonStyle = "stage1",
  witnessEmail,
  onGoToStage1,
  onClearSigned,
  onNeedsStage1RestartChange,
  stage1Complete = false,
  stubMode,
  onStubModeChange,
  stubComplete,
  onStubComplete,
}: {
  docusignStatus: string;
  onStatusChange: (status: string) => void;
  declarationSigned: boolean;
  onDeclarationSigned: () => void;
  onBeforeSign?: () => Promise<void>;
  uploadsInProgress?: boolean;
  requirePmiFiles?: boolean;
  attachPmiEvidence?: boolean;
  pmiFilesReady?: boolean;
  pmiSavedFileCount?: number;
  sessionKey?: string;
  returnContext?: string;
  variant?: "section" | "embedded";
  title?: string;
  description?: string;
  primaryButtonLabel?: string;
  signedMessage?: string;
  autoConfirmOnGlobalComplete?: boolean;
  signingReady?: boolean;
  signingBlockedMessage?: string;
  requestSigningFn?: (
    forceNew: boolean,
    returnBaseUrl: string
  ) => Promise<StartDocusignResponse & { alreadyCompleted?: boolean }>;
  embeddedButtonStyle?: "stage1" | "stage2";
  witnessEmail?: string;
  onGoToStage1?: () => void;
  onClearSigned?: () => void;
  onNeedsStage1RestartChange?: (needs: boolean) => void;
  stage1Complete?: boolean;
  stubMode: boolean;
  onStubModeChange: (stub: boolean) => void;
  stubComplete: boolean;
  onStubComplete: () => void;
}) {
  const needsPmiFiles = requirePmiFiles !== false;
  const filesReady = (needsPmiFiles ? pmiFilesReady : true) && signingReady !== false;
  const attachEvidence = attachPmiEvidence !== false;
  const defaultDescription = needsPmiFiles
    ? `After uploading your evidence above, click below to sign with DocuSign. Your uploaded PMI documents (${pmiSavedFileCount} saved) will be attached to the signing envelope.`
    : "Click below to review and sign the engagement documents with DocuSign.";
  const resolvedDescription = description ?? defaultDescription;
  const resolvedPrimaryLabel =
    primaryButtonLabel ??
    (needsPmiFiles ? "Sign with DocuSign" : "Review Engagement Documents");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [consentUrl, setConsentUrl] = useState<string | null>(null);
  const [statusContext, setStatusContext] = useState<DocusignStatusResponse | null>(null);
  const [needsStage1Restart, setNeedsStage1Restart] = useState(false);
  const signed = declarationSigned || stubComplete;
  const resolvedStatus = statusContext?.status ?? docusignStatus;
  const envelopeComplete = isDocusignComplete(resolvedStatus);
  const signerProgress = describeEnvelopeSignerProgress(
    statusContext ?? { signers: undefined },
    witnessEmail
  );
  const allSignersDone =
    statusContext?.allSignersCompleted ||
    (signerProgress.length > 0 && signerProgress.every((line) => line.done));
  const witnessActuallySigned =
    returnContext !== "claimant-stage2" ||
    stubMode ||
    (statusContext != null &&
      (isWitnessSigningComplete(statusContext, witnessEmail) ||
        isStage2EnvelopeComplete(statusContext, witnessEmail))) ||
    // After return, declarationSigned can be set before signer details load.
    (signed && envelopeComplete);
  // Stage 2 must not show "completed" just because Stage 1 finished the envelope.
  const stage2FalselyComplete =
    returnContext === "claimant-stage2" &&
    signed &&
    !stubMode &&
    statusContext != null &&
    (statusContext.signers?.length ?? 0) > 0 &&
    !isStage2EnvelopeComplete(statusContext, witnessEmail) &&
    !isWitnessSigningComplete(statusContext, witnessEmail) &&
    // Don't clear a Stage 2 success just because signer matching is ambiguous.
    !(statusContext.allSignersCompleted && (statusContext.signers?.length ?? 0) >= 2);
  const signedForUi = signed && !stage2FalselyComplete;
  const showWitnessPendingFinalize =
    returnContext === "claimant-stage2" &&
    signedForUi &&
    !stubMode &&
    !needsStage1Restart &&
    !envelopeComplete &&
    witnessActuallySigned;
  const expectedMultiSignerSetup =
    (statusContext?.signers?.length ?? 0) === 2 &&
    statusContext?.multipleSigners;
  // Only an in-progress envelope can take a witness signature. COMPLETED
  // envelopes must restart Stage 1 — do not treat "claimant signed" alone as ready.
  const stage1ReadyForWitness =
    stage1Complete && isDocusignInProgress(resolvedStatus);
  const statusCheckedForRestart = statusContext != null || !!resolvedStatus;
  const stage2RemoteComplete =
    envelopeComplete &&
    (witnessActuallySigned ||
      !!statusContext?.allSignersCompleted ||
      ((statusContext?.signers?.length ?? 0) >= 2 &&
        (statusContext?.signers ?? []).every((s) => isSignerStatusDone(s.status))));
  // Only lock/restart when we know signers and Stage 2 is NOT actually complete.
  const envelopeLockedCompleted =
    returnContext === "claimant-stage2" &&
    envelopeComplete &&
    statusContext != null &&
    (statusContext.signers?.length ?? 0) > 0 &&
    !stage2RemoteComplete &&
    !stubMode;
  const showStage2RestartPrompt =
    onGoToStage1 &&
    !signedForUi &&
    returnContext === "claimant-stage2" &&
    !stage1ReadyForWitness &&
    !stage2RemoteComplete &&
    ((needsStage1Restart && statusCheckedForRestart) || envelopeLockedCompleted);
  const showSignedSuccess =
    returnContext === "claimant-stage2"
      ? !showStage2RestartPrompt && !stubMode && stage2RemoteComplete
      : signedForUi && !needsStage1Restart;
  const blockSigningForRestart =
    (needsStage1Restart && returnContext === "claimant-stage1") ||
    showStage2RestartPrompt;
  const showExtraSignersWarning =
    !signedForUi &&
    !stubMode &&
    statusContext?.multipleSigners &&
    returnContext !== "claimant-stage2" &&
    !needsStage1Restart &&
    !expectedMultiSignerSetup &&
    ((statusContext?.signers?.length ?? 0) > 2 ||
      (statusContext?.pendingSigners?.length ?? 0) > 0);
  // Stage 2: only offer Review Litigation Agreement when the envelope is still
  // open (SENT/DELIVERED). COMPLETED envelopes must use Sign again instead.
  const showSigningActions =
    !stubMode &&
    !signedForUi &&
    (returnContext === "claimant-stage2"
      ? !showStage2RestartPrompt &&
        (stage1ReadyForWitness || (!statusCheckedForRestart && stage1Complete))
      : !blockSigningForRestart);

  function markNeedsStage1Restart(needs: boolean) {
    setNeedsStage1Restart(needs);
    onNeedsStage1RestartChange?.(needs);
  }

  function applyStatusData(data: DocusignStatusResponse) {
    const status = data.status ? String(data.status) : "";
    if (status) onStatusChange(status);
    setStatusContext(data);
    if (data.rateLimited) {
      setError(
        "DocuSign rate limit reached. Showing last saved status — try Refresh again in a few minutes."
      );
    }
    return status;
  }

  useEffect(() => {
    if (
      signed &&
      returnContext === "claimant-stage1" &&
      isDocusignInProgress(resolvedStatus)
    ) {
      markNeedsStage1Restart(false);
    }
  }, [signed, returnContext, resolvedStatus]);

  // Clear stale "witness signed" when DocuSign shows the witness has not signed.
  useEffect(() => {
    if (returnContext !== "claimant-stage2" || stubMode) return;
    if (!stage2FalselyComplete) return;
    onClearSigned?.();
  }, [returnContext, stubMode, stage2FalselyComplete, onClearSigned]);

  useEffect(() => {
    if (returnContext !== "claimant-stage2") return;
    if (witnessActuallySigned || isStage2EnvelopeComplete(statusContext ?? {}, witnessEmail)) {
      markNeedsStage1Restart(false);
    }
  }, [returnContext, witnessActuallySigned, statusContext, witnessEmail]);

  useEffect(() => {
    if (signedForUi || stubMode) return;

    if (returnContext === "claimant-stage2") {
      if (
        docusignStatus !== "SENT" &&
        docusignStatus !== "DELIVERED" &&
        !isDocusignComplete(docusignStatus)
      ) {
        return;
      }

      let cancelled = false;
      fetchDocusignStatus()
        .then((data) => {
          if (cancelled) return;
          applyStatusData(data);
          if (isWitnessSigningComplete(data, witnessEmail)) {
            sessionStorage.removeItem(sessionKey);
            onDeclarationSigned();
          }
        })
        .catch(() => null);

      return () => {
        cancelled = true;
      };
    }

    if (docusignStatus !== "SENT" && docusignStatus !== "DELIVERED") return;

    let cancelled = false;
    fetchDocusignStatus()
      .then((data) => {
        if (cancelled) return;
        const status = applyStatusData(data);
        if (isDocusignComplete(status)) {
          sessionStorage.removeItem(sessionKey);
          onDeclarationSigned();
          setError(null);
        }
      })
      .catch(() => null);

    return () => {
      cancelled = true;
    };
  }, [signedForUi, stubMode, docusignStatus, onDeclarationSigned, onStatusChange, sessionKey, returnContext, witnessEmail]);

  // Stage 2: sync DocuSign status and surface success after witness signing.
  useEffect(() => {
    if (returnContext !== "claimant-stage2" || stubMode) return;

    let cancelled = false;
    fetchDocusignStatus({ refresh: true })
      .then((data) => {
        if (cancelled) return;
        applyStatusData(data);

        const signers = data.signers ?? [];
        const allDone =
          signers.length >= 2 &&
          signers.every((signer) => isSignerStatusDone(signer.status));
        const complete =
          isStage2EnvelopeComplete(data, witnessEmail) ||
          isWitnessSigningComplete(data, witnessEmail) ||
          (isDocusignComplete(data.status) &&
            (data.allSignersCompleted || allDone));

        if (complete) {
          markNeedsStage1Restart(false);
          sessionStorage.removeItem(sessionKey);
          onDeclarationSigned();
          setError(null);
          return;
        }

        if (isDocusignComplete(data.status) && signers.length <= 1) {
          markNeedsStage1Restart(true);
          if (signed) onClearSigned?.();
          return;
        }

        if (
          signed &&
          signers.length > 0 &&
          !isWitnessSigningComplete(data, witnessEmail) &&
          !isStage2EnvelopeComplete(data, witnessEmail) &&
          isDocusignInProgress(data.status) &&
          onClearSigned
        ) {
          // Keep signed=true while envelope is still open after witness action.
        }
      })
      .catch(() => null);

    return () => {
      cancelled = true;
    };
  }, [returnContext, stubMode, witnessEmail, sessionKey, onDeclarationSigned, onClearSigned, signed, stage1Complete]);

  useEffect(() => {
    if (stubMode || !getUserToken()) return;
    if (returnContext !== "claimant-stage1" && returnContext !== "claimant-stage2") return;
    if (returnContext === "claimant-stage2" && signedForUi) return;

    let cancelled = false;
    fetchDocusignStatus()
      .then((data) => {
        if (cancelled) return;
        applyStatusData(data);
        const needs = shouldOfferStage1Restart(data, witnessEmail, {
          stage1MarkedComplete: stage1Complete,
        });
        markNeedsStage1Restart(needs);
        if (needs) {
          setError(null);
          // Keep Stage 1 marked signed in the app — show Sign again instead of
          // clearing progress (the amber box replaces the green success state).
        } else if (
          (stage1Complete && isDocusignInProgress(data.status)) ||
          (signed && returnContext === "claimant-stage1")
        ) {
          markNeedsStage1Restart(false);
        }
      })
      .catch(() => null);

    return () => {
      cancelled = true;
    };
  }, [signedForUi, signed, returnContext, witnessEmail, stubMode, onClearSigned, stage1Complete]);

  useEffect(() => {
    if (!stage1Complete || returnContext !== "claimant-stage2" || stubMode) return;
    if (isDocusignInProgress(resolvedStatus)) {
      markNeedsStage1Restart(false);
    }
  }, [stage1Complete, returnContext, resolvedStatus, stubMode]);

  useEffect(() => {
    if (!envelopeLockedCompleted) return;
    markNeedsStage1Restart(true);
  }, [envelopeLockedCompleted]);

  function getReturnBaseUrl() {
    const url = new URL(window.location.href);
    url.searchParams.delete("docusign");
    url.searchParams.delete("docusignContext");
    url.searchParams.delete("paypalReturn");
    url.searchParams.delete("paypalCancel");
    url.searchParams.delete("token");
    url.searchParams.delete("event");
    if (returnContext) {
      url.searchParams.set("docusignContext", returnContext);
    }
    if (!url.searchParams.has("form")) {
      url.searchParams.set("form", "1");
    }
    return url.toString();
  }

  async function requestSigning(forceNew = false) {
    const returnBaseUrl = getReturnBaseUrl();
    if (requestSigningFn) {
      return requestSigningFn(forceNew, returnBaseUrl);
    }
    return startDocusignSigning(returnBaseUrl, {
      forceNew,
      attachPmiEvidence: attachEvidence,
    });
  }

  async function redirectToSigning(forceNew = false) {
    const data = await requestSigning(forceNew);

    if (data.docusignStatus) onStatusChange(String(data.docusignStatus));

    if (data.stub) {
      onStubModeChange(true);
      return { redirected: false as const, data };
    }

    if (data.signingUrl) {
      sessionStorage.setItem(sessionKey, "1");
      window.location.assign(data.signingUrl);
      return { redirected: true as const, data };
    }

    return { redirected: false as const, data };
  }

  async function refreshStatus() {
    setLoading(true);
    if (!statusContext?.rateLimited) {
      setError(null);
    }
    try {
      const data = await fetchDocusignStatus({ refresh: true });
      const status = applyStatusData(data);

      if (returnContext === "claimant-stage2") {
        if (
          isStage2EnvelopeComplete(data, witnessEmail) ||
          isWitnessSigningComplete(data, witnessEmail)
        ) {
          sessionStorage.removeItem(sessionKey);
          markNeedsStage1Restart(false);
          onDeclarationSigned();
          if (!data.rateLimited) setError(null);
          return;
        }
        if (isDocusignComplete(status)) {
          // Completed envelope after Stage 2 ceremony — treat as success unless
          // signer data clearly shows no witness participated.
          const signers = data.signers ?? [];
          if (signers.length <= 1) {
            markNeedsStage1Restart(true);
            if (!data.rateLimited) setError(null);
            return;
          }
          sessionStorage.removeItem(sessionKey);
          markNeedsStage1Restart(false);
          onDeclarationSigned();
          if (!data.rateLimited) setError(null);
          return;
        }
        if (isWitnessSigningComplete(data, witnessEmail) && !data.rateLimited) {
          setError(null);
          return;
        }
      } else if (isDocusignComplete(status)) {
        sessionStorage.removeItem(sessionKey);
        onDeclarationSigned();
        if (!data.rateLimited) setError(null);
        return;
      }

      if (
        returnContext === "claimant-stage2" &&
        shouldOfferStage1Restart(data, witnessEmail, {
          stage1MarkedComplete: stage1Complete,
        })
      ) {
        markNeedsStage1Restart(true);
        if (!data.rateLimited) setError(null);
        return;
      }
      if (
        returnContext === "claimant-stage1" &&
        shouldOfferStage1Restart(data, witnessEmail, {
          stage1MarkedComplete: stage1Complete,
        })
      ) {
        markNeedsStage1Restart(true);
        onClearSigned?.();
        if (!data.rateLimited) setError(null);
        return;
      }
      if (!data.rateLimited) {
        setError(docusignStatusMessage(status, data));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not refresh signing status.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReturnToDocusign() {
    setLoading(true);
    setError(null);
    try {
      const result = await redirectToSigning(false);
      if (result.redirected) return;

      const data = result.data;
      if (data.docusignStatus) {
        applyStatusData({
          status: data.docusignStatus,
          signers: statusContext?.signers,
        });
      }

      if (isDocusignComplete(data.docusignStatus)) {
        onDeclarationSigned();
        return;
      }

      if (data.signingUrl) {
        sessionStorage.setItem(sessionKey, "1");
        window.location.assign(data.signingUrl);
        return;
      }

      if (data.alreadyCompleted) {
        setError("DocuSign reports this envelope is already complete. Click Refresh status.");
        return;
      }

      setError("Could not reopen DocuSign. Please try again.");
    } catch (err) {
      const e = err as Error & { code?: string };
      if (e.message) {
        setError(e.message);
      } else {
        setError("Could not reopen DocuSign.");
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleStage1Restart() {
    onClearSigned?.();
    markNeedsStage1Restart(false);
    await handleStartSigning(true);
  }

  async function handleStartSigning(forceNew = false) {
    if (needsPmiFiles && uploadsInProgress) {
      setError("Please wait for your evidence uploads to finish before signing.");
      return;
    }
    if (!filesReady) {
      setError(
        signingBlockedMessage ||
          (needsPmiFiles
            ? "Please upload at least one PMI evidence document before signing with DocuSign."
            : "Please complete the required fields before signing.")
      );
      return;
    }
    if (!getUserToken()) {
      setError("Please sign in before starting DocuSign.");
      return;
    }

    setLoading(true);
    setError(null);
    setConsentUrl(null);

    try {
      await onBeforeSign?.();
      const result = await redirectToSigning(forceNew);
      if (result.redirected) return;

      const data = result.data;

      if (data.alreadyCompleted) {
        if (returnContext === "claimant-stage2") {
          const statusData = await fetchDocusignStatus({ refresh: true });
          applyStatusData(statusData);
          if (isWitnessSigningComplete(statusData, witnessEmail)) {
            onDeclarationSigned();
          } else {
            markNeedsStage1Restart(true);
            onClearSigned?.();
          }
          return;
        }
        onDeclarationSigned();
        return;
      }

      if (isDocusignComplete(data.docusignStatus)) {
        if (returnContext === "claimant-stage2") {
          const statusData = await fetchDocusignStatus({ refresh: true });
          applyStatusData(statusData);
          if (isWitnessSigningComplete(statusData, witnessEmail)) {
            onDeclarationSigned();
            return;
          }
          markNeedsStage1Restart(true);
          onClearSigned?.();
          setError(null);
          return;
        }
        if (autoConfirmOnGlobalComplete) {
          onDeclarationSigned();
          return;
        }
        if (!forceNew) {
          await handleStartSigning(true);
          return;
        }
        setError("Could not start a new signing session. Please try again.");
        return;
      }

      if (data.signingUrl) {
        sessionStorage.setItem(sessionKey, "1");
        window.location.assign(data.signingUrl);
        return;
      }

      setError("No signing URL was returned. Please try again.");
    } catch (err) {
      const e = err as Error & { consentUrl?: string; hint?: string; code?: string };
      if (
        e.code === "ENVELOPE_ALREADY_COMPLETED" ||
        /invalid envelope status/i.test(e.message || "")
      ) {
        markNeedsStage1Restart(true);
        setError(null);
        onClearSigned?.();
        if (returnContext === "claimant-stage2") {
          setStatusContext((prev) =>
            prev
              ? { ...prev, status: "COMPLETED" }
              : ({ status: "COMPLETED", signers: [] } as DocusignStatusResponse)
          );
        }
      } else {
        if (e.consentUrl) setConsentUrl(e.consentUrl);
        const hint = e.hint ? ` ${e.hint}` : "";
        setError(`${e.message}${hint}`);
      }
    } finally {
      setLoading(false);
    }
  }

  const embeddedButton = variant === "embedded";
  const stage2Button = embeddedButtonStyle === "stage2";

  const body = (
    <>
      {variant === "section" && (
        <>
          <h4 className="text-[18px] font-semibold text-[#660066]">{title}</h4>
          <p className="mt-3 text-sm leading-relaxed text-[#223645]">{resolvedDescription}</p>
        </>
      )}

      {variant === "embedded" && description && !showSignedSuccess && !showStage2RestartPrompt && (
        <p
          className="mt-4 font-normal"
          style={{ fontSize: 16, lineHeight: "30px", color: "#223645" }}
        >
          {resolvedDescription}
        </p>
      )}

      {!signedForUi &&
        !stubMode &&
        !blockSigningForRestart &&
        docusignStatus &&
        !(
          autoConfirmOnGlobalComplete === false &&
          isDocusignComplete(docusignStatus)
        ) && (
        <p
          className={`${variant === "section" ? "mt-3" : "mt-4"} rounded-lg bg-[#f3eef6] px-3 py-2 text-sm text-[#223645]`}
        >
          DocuSign status: <strong>{docusignStatus}</strong>
          {docusignStatus === "SENT" || docusignStatus === "DELIVERED" ? (
            <>
              {" "}
              — after signing in DocuSign, click <strong>Finish</strong>, then{" "}
              <strong>Close</strong> (top right) to return here.
            </>
          ) : null}
        </p>
      )}

      {!signedForUi && !stubMode && !filesReady && signingBlockedMessage && !blockSigningForRestart && (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {signingBlockedMessage}
        </p>
      )}

      {needsPmiFiles && !filesReady && !signedForUi && !stubMode && (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          Upload at least one PMI evidence file above. Files are saved to secure storage
          first, then included in DocuSign when you start signing.
        </p>
      )}

      {showWitnessPendingFinalize && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm leading-relaxed text-amber-950">
            The witness signature is recorded, but DocuSign has not finalized the
            envelope yet — the PDF may still show <strong>In Process</strong>.
            {resolvedStatus ? (
              <>
                {" "}
                Current DocuSign status: <strong>{resolvedStatus}</strong>.
              </>
            ) : null}{" "}
            Click <strong>Return to DocuSign</strong> and finish any remaining steps,
            then click <strong>Finish</strong>, and refresh status here.
          </p>
          {signerProgress.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-amber-950">
              {signerProgress.map((line, index) => (
                <li key={`${line.label}-${line.email || index}`}>
                  <strong>{line.label}</strong>
                  {line.email ? ` (${line.email})` : ""}: {line.status}
                  {line.done ? " ✓" : " — still required"}
                </li>
              ))}
            </ul>
          )}
          {(statusContext?.pendingSigners?.length ?? 0) > 0 && (
            <p className="mt-2 text-sm font-medium text-red-900">
              Waiting on:{" "}
              {statusContext?.pendingSigners
                ?.map((s) => s.email || s.name || "unknown recipient")
                .join(", ")}
            </p>
          )}
          {allSignersDone && !envelopeComplete && (
            <p className="mt-2 text-sm font-medium text-amber-950">
              Both signatures are captured. Click <strong>Return to DocuSign</strong> — it will
              try witness, claimant, or sender view so you can click <strong>Finish</strong>.
              If this stays stuck, go to <strong>Stage 1</strong> and click{" "}
              <strong>Sign again</strong> to create a fresh envelope.
            </p>
          )}
          {statusContext?.rateLimited && (
            <p className="mt-2 text-sm font-medium text-amber-900">
              DocuSign rate limit reached — wait a few minutes before refreshing again.
              You can still use <strong>Return to DocuSign</strong>.
            </p>
          )}
          {statusContext?.webhookConfigured && !statusContext?.rateLimited && (
            <p className="mt-2 text-sm text-amber-900">
              Status updates automatically when DocuSign finalizes — reload this page after
              clicking <strong>Finish</strong> in DocuSign (no need to spam Refresh).
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleReturnToDocusign}
              disabled={loading}
              className="rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: CLAIMANT_ACTIVE }}
            >
              {loading ? "Please wait…" : "Return to DocuSign"}
            </button>
            <button
              type="button"
              onClick={refreshStatus}
              disabled={loading}
              className="rounded-lg border border-amber-400 bg-white px-5 py-2.5 text-sm font-semibold text-amber-950 transition hover:bg-amber-100 disabled:opacity-60"
            >
              {loading ? "Please wait…" : "Refresh status"}
            </button>
          </div>
        </div>
      )}

      {showSignedSuccess && (
        <div
          className={`${variant === "section" ? "mt-5" : "mt-4"} rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-semibold text-green-800`}
        >
          {returnContext === "claimant-stage2"
            ? "Witness signing completed successfully — the document is finalized."
            : signedMessage}
        </div>
      )}

      {returnContext === "claimant-stage2" && signedForUi && !stubMode && !needsStage1Restart && envelopeComplete && (
        <div className={`${variant === "section" ? "mt-3" : "mt-4"}`}>
          <button
            type="button"
            onClick={refreshStatus}
            disabled={loading}
            className="rounded-lg border border-[#627489] bg-white px-5 py-2.5 text-sm font-semibold text-[#263238] transition hover:bg-zinc-50 disabled:opacity-60"
          >
            {loading ? "Please wait…" : "Refresh status"}
          </button>
        </div>
      )}

      {needsStage1Restart && returnContext === "claimant-stage1" && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm leading-relaxed text-amber-950">
            Your claimant signature is already saved, but that DocuSign envelope
            finished <strong>without a witness step</strong>. Click{" "}
            <strong>Sign again</strong> to create a new envelope, sign as the
            claimant once more, then continue to Stage 2 for the witness.
          </p>
          <button
            type="button"
            onClick={handleStage1Restart}
            disabled={loading}
            className="mt-3 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
            style={{ backgroundColor: CLAIMANT_ACTIVE }}
          >
            {loading ? "Please wait…" : "Sign again"}
          </button>
        </div>
      )}

      {!signedForUi && stubMode && (
        <div
          className={`${variant === "section" ? "mt-5" : "mt-4"} rounded-xl bg-amber-50 p-4 text-sm text-amber-900`}
        >
          <strong>Dev mode:</strong> DocuSign is not configured. Click below to simulate
          a successful signing.
          <button
            type="button"
            onClick={onStubComplete}
            className={`mt-3 ${embeddedButton ? "flex h-[58px] w-full items-center justify-center rounded-[6px] border-2 px-5 text-[14px] font-normal text-white" : "block rounded-lg px-5 py-2.5 text-sm font-semibold"} transition hover:opacity-90`}
            style={
              embeddedButton
                ? { backgroundColor: CLAIMANT_ACTIVE, borderColor: PURPLE }
                : { backgroundColor: PURPLE }
            }
          >
            Simulate signing
          </button>
        </div>
      )}

      {showSigningActions && (
        <div
          className={`${variant === "section" ? "mt-5 flex flex-wrap items-center gap-3" : "mt-4 flex flex-col gap-3"}`}
        >
          <button
            type="button"
            onClick={() => handleStartSigning(false)}
            disabled={loading || (needsPmiFiles && uploadsInProgress) || !filesReady}
            className={
              embeddedButton
                ? stage2Button
                  ? "mt-8 flex h-[58px] w-full max-w-[340px] items-center justify-center gap-[10px] rounded-[6px] border-2 px-5 font-medium transition hover:opacity-90 disabled:opacity-60"
                  : "flex h-[58px] w-full items-center justify-center gap-[10px] rounded-[6px] border-2 px-5 text-[14px] font-normal text-white transition hover:opacity-90 disabled:opacity-60"
                : "rounded-lg px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition hover:opacity-90 disabled:opacity-60"
            }
            style={
              embeddedButton
                ? stage2Button
                  ? {
                      backgroundColor: CLAIMANT_STAGE2_BTN_BG,
                      borderColor: CLAIMANT_ACTIVE,
                      color: CLAIMANT_ACTIVE,
                      fontSize: 16,
                    }
                  : { backgroundColor: CLAIMANT_ACTIVE, borderColor: PURPLE }
                : { backgroundColor: PURPLE }
            }
          >
            {embeddedButton && !stage2Button && (
              <Image src="/description-icon.svg" alt="" width={24} height={24} />
            )}
            {embeddedButton && stage2Button && (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M8 18H16V16H8V18ZM8 14H16V12H8V14ZM6 22C5.45 22 4.97917 21.8042 4.5875 21.4125C4.19583 21.0208 4 20.55 4 20V4C4 3.45 4.19583 2.97917 4.5875 2.5875C4.97917 2.19583 5.45 2 6 2H14L20 8V20C20 20.55 19.8042 21.0208 19.4125 21.4125C19.0208 21.8042 18.55 22 18 22H6ZM13 9V4H6V20H18V9H13Z"
                  fill={CLAIMANT_ACTIVE}
                />
              </svg>
            )}
            {loading
              ? "Please wait…"
              : needsPmiFiles && uploadsInProgress
                ? "Waiting for uploads…"
                : !filesReady
                  ? signingBlockedMessage
                    ? "Complete details first"
                    : needsPmiFiles
                      ? "Upload evidence first"
                      : resolvedPrimaryLabel
                  : docusignStatus === "SENT" || docusignStatus === "DELIVERED"
                    ? "Continue signing"
                    : resolvedPrimaryLabel}
          </button>
          {(docusignStatus === "SENT" ||
            docusignStatus === "DELIVERED" ||
            isDocusignComplete(docusignStatus)) && (
            <button
              type="button"
              onClick={refreshStatus}
              disabled={loading || (needsPmiFiles && uploadsInProgress) || !filesReady}
              className="rounded-lg border border-[#627489] bg-white px-5 py-2.5 text-sm font-semibold text-[#263238] transition hover:bg-zinc-50 disabled:opacity-60"
            >
              Refresh status
            </button>
          )}
          {(docusignStatus === "SENT" || docusignStatus === "DELIVERED") && (
            <button
              type="button"
              onClick={() => handleStartSigning(true)}
              disabled={loading || (needsPmiFiles && uploadsInProgress) || !filesReady}
              className="rounded-lg border border-amber-300 bg-amber-50 px-5 py-2.5 text-sm font-semibold text-amber-900 transition hover:bg-amber-100 disabled:opacity-60"
            >
              Restart signing
            </button>
          )}
          {isDocusignComplete(docusignStatus) &&
            !declarationSigned &&
            returnContext !== "claimant-stage2" && (
            <button
              type="button"
              onClick={() => handleStartSigning(true)}
              disabled={loading || (needsPmiFiles && uploadsInProgress) || !filesReady}
              className="rounded-lg border border-[#802B7D] bg-white px-5 py-2.5 text-sm font-semibold text-[#802B7D] transition hover:bg-[#f3eef6] disabled:opacity-60"
            >
              Sign again
            </button>
          )}
        </div>
      )}

      {showStage2RestartPrompt && (
        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
          <p className="text-sm leading-relaxed text-amber-950">
            DocuSign shows this envelope as <strong>Completed</strong> after Stage 1
            only — the witness never got a turn, so Stage 2 cannot open signing on
            it. Go to Stage 1 and click <strong>Sign again</strong> to create a{" "}
            <strong>new</strong> envelope. Sign as the claimant only (status should
            stay <strong>Sent</strong>, not Completed), then return here for the
            witness.
          </p>
          <button
            type="button"
            onClick={onGoToStage1}
            className="mt-3 rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: CLAIMANT_ACTIVE }}
          >
            Go to Stage 1 — Sign again
          </button>
        </div>
      )}

      {showExtraSignersWarning && (
        <p className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
          This envelope has extra DocuSign recipients from an old template setup. Click{" "}
          <strong>Restart signing</strong> to create a fresh envelope.
        </p>
      )}

      {autoConfirmOnGlobalComplete &&
        isDocusignComplete(docusignStatus) &&
        !signedForUi &&
        !stubMode && (
        <div
          className={`${variant === "section" ? "mt-5" : "mt-4"} rounded-xl border border-[#d4c4d9] bg-[#f3eef6] p-4`}
        >
          <p className="text-sm leading-relaxed text-[#223645]">
            DocuSign shows these documents as already signed. If you completed signing,
            confirm below to continue this step.
          </p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              onDeclarationSigned();
            }}
            className={`mt-3 ${embeddedButton ? "w-full" : ""} rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90`}
            style={{ backgroundColor: PURPLE }}
          >
            Confirm and continue
          </button>
        </div>
      )}

      {error && !needsStage1Restart && !showStage2RestartPrompt && (
        <p
          className={`mt-4 rounded-lg px-3 py-2 text-sm ${
            docusignStatus === "DELIVERED" || docusignStatus === "SENT"
              ? "bg-amber-50 text-amber-900"
              : "bg-red-50 text-red-700"
          }`}
        >
          {error}
        </p>
      )}

      {consentUrl && (
        <p className="mt-3 text-sm text-[#223645]">
          DocuSign admin consent is required.{" "}
          <a
            href={consentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold underline"
            style={{ color: PURPLE }}
          >
            Grant consent in DocuSign
          </a>
        </p>
      )}
    </>
  );

  if (variant === "embedded") {
    return <div>{body}</div>;
  }

  return (
    <section className="mt-10 border-t border-zinc-200 pt-10">{body}</section>
  );
}

function PmiEntityYearRow({
  checked,
  onChange,
  label,
  years,
  onYearsChange,
  yearsLabel = "If so, for which years",
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  years: string;
  onYearsChange: (v: string) => void;
  yearsLabel?: string;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <FipoCheckbox checked={checked} onChange={onChange}>
        <span className="text-sm text-[#223645]">{label}</span>
      </FipoCheckbox>
      <div className="w-full sm:max-w-[380px] sm:shrink-0">
        <PracticeLabel>{yearsLabel}</PracticeLabel>
        <select
          className={practiceFieldCls}
          value={years}
          onChange={(e) => onYearsChange(e.target.value)}
          disabled={!checked}
        >
          <option value="">Select Year</option>
          {PRACTICE_YEARS.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

const EVIDENCE_FILE_TYPES = [
  { label: "PDF", border: "#DC2626", text: "#DC2626" },
  { label: "JPG", border: "#16A34A", text: "#16A34A" },
  { label: "PNG", border: "#2563EB", text: "#2563EB" },
  { label: "DOC", border: "#2563EB", text: "#2563EB" },
  { label: "DOCX", border: "#2563EB", text: "#2563EB" },
] as const;

const PMI_EVIDENCE_FILE_TYPES = [
  ...EVIDENCE_FILE_TYPES,
  { label: "XLS", border: "#166534", text: "#166534" },
] as const;

type EvidenceUploadFile = {
  name: string;
  size: number;
  status: "uploading" | "done" | "error";
};

function EvidenceFileDropzone({
  uploadKey,
  maxSizeMb = 10,
  compact = false,
  footerLayout = "stacked",
  ctaText = "Drag Files Here or Click to Upload",
  fileTypes = EVIDENCE_FILE_TYPES,
  multipleLabel = "Multiple files accepted",
  initialFiles = [],
  onUploadingChange,
  onFilesChange,
  onFileSaved,
}: {
  uploadKey: string;
  maxSizeMb?: number;
  compact?: boolean;
  footerLayout?: "stacked" | "row";
  ctaText?: string;
  fileTypes?: ReadonlyArray<{ label: string; border: string; text: string }>;
  multipleLabel?: string;
  initialFiles?: EvidenceFileRecord[];
  onUploadingChange?: (uploading: boolean) => void;
  onFilesChange?: (files: EvidenceUploadFile[]) => void;
  onFileSaved?: (file: EvidenceFileRecord) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<EvidenceUploadFile[]>(() =>
    initialFiles.map((file) => ({
      name: file.fileName,
      size: file.fileSize ?? 0,
      status: "done" as const,
    }))
  );
  const onUploadingChangeRef = useRef(onUploadingChange);
  const onFilesChangeRef = useRef(onFilesChange);
  onUploadingChangeRef.current = onUploadingChange;
  onFilesChangeRef.current = onFilesChange;

  const isUploading = uploads.some((upload) => upload.status === "uploading");
  const uploadsNotifyKey = uploads
    .map((upload) => `${upload.name}:${upload.size}:${upload.status}`)
    .join("|");

  useEffect(() => {
    onUploadingChangeRef.current?.(isUploading);
  }, [isUploading]);

  useEffect(() => {
    onFilesChangeRef.current?.(uploads);
  }, [uploadsNotifyKey]);

  async function handleFiles(files: FileList) {
    for (const file of Array.from(files)) {
      if (uploads.some((u) => u.name === file.name)) continue;
      setUploads((prev) => [
        ...prev,
        { name: file.name, size: file.size, status: "uploading" },
      ]);
      try {
        const saved = await uploadEvidenceFile(file, uploadKey);
        setUploads((prev) =>
          prev.map((f) => (f.name === file.name ? { ...f, status: "done" } : f))
        );
        if (saved?.fileUrl) {
          onFileSaved?.({
            id: saved.id,
            fileName: saved.fileName,
            fileUrl: saved.fileUrl,
            uploadKey: saved.uploadKey,
            fileSize: saved.fileSize,
            mimeType: saved.mimeType,
            uploadedAt: saved.uploadedAt,
          });
        }
      } catch {
        setUploads((prev) =>
          prev.map((f) => (f.name === file.name ? { ...f, status: "error" } : f))
        );
      }
    }
  }

  const footer = (
    <>
      <span className="flex items-center gap-2 text-sm font-semibold text-[#263238]">
        <Image src="/file-size.svg" alt="" width={24} height={24} aria-hidden />
        Max {maxSizeMb}MB per file
      </span>
      <span className="flex items-center gap-2 text-sm font-semibold text-[#263238]">
        <Image src="/multiple-file.svg" alt="" width={24} height={24} aria-hidden />
        {multipleLabel}
      </span>
    </>
  );

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#7F2A7F] bg-[#7F2A7F1A] px-4 transition hover:border-[#660066] ${
          compact ? "min-h-[200px] py-6" : "min-h-[260px] px-6 py-10"
        }`}
      >
        <Image src="/upload-icon.svg" alt="" width={50} height={50} aria-hidden />
        <p className="mt-5 text-center text-sm font-bold text-[#660066]">{ctaText}</p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {fileTypes.map((type) => (
            <span
              key={type.label}
              className="rounded bg-white px-2.5 py-1 text-[11px] font-semibold"
              style={{ border: `1px solid ${type.border}`, color: type.text }}
            >
              {type.label}
            </span>
          ))}
        </div>
        <div
          className={`mt-5 ${
            footerLayout === "row"
              ? "flex flex-wrap items-center justify-center gap-8"
              : "flex flex-col items-center"
          }`}
        >
          {footerLayout === "row" ? (
            footer
          ) : (
            <div className="flex flex-col items-start gap-2">{footer}</div>
          )}
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>
      {uploads.length > 0 && (
        <ul className="mt-3 space-y-1">
          {uploads.map((f) => (
            <li key={f.name} className="truncate text-xs text-[#223645]">
              {f.status === "uploading" ? "⏳" : f.status === "done" ? "✅" : "❌"} {f.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EvidenceCheckItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex gap-2.5 text-[15px] font-medium leading-[28px] text-[#223645]">
      <svg
        className="mt-2 h-3.5 w-3.5 shrink-0"
        viewBox="0 0 12 10"
        fill="none"
        aria-hidden
      >
        <path
          d="M1 5L4.5 8.5L11 1.5"
          stroke="#660066"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>{children}</span>
    </li>
  );
}

function PmiEvidenceDropzone({
  letter,
  prefix,
  boldSuffix,
  uploadKey,
  setUploading,
  initialFiles = [],
  onFileSaved,
}: {
  letter: string;
  prefix: string;
  boldSuffix: string;
  uploadKey: string;
  setUploading: (uploading: boolean) => void;
  initialFiles?: EvidenceFileRecord[];
  onFileSaved?: (file: EvidenceFileRecord) => void;
}) {
  const initialFilesKey = initialFiles
    .map((file) => `${file.fileUrl ?? file.id ?? file.fileName}:${file.fileSize ?? 0}`)
    .join("|");

  return (
    <div className="p-4 sm:p-5">
      <p className="mb-4 text-sm leading-relaxed text-[#223645]">
        <span className="font-bold text-[#660066]">{letter})</span> {prefix}
        <strong className="font-bold text-[#223645]">{boldSuffix}</strong>
      </p>
      <EvidenceFileDropzone
        key={`${uploadKey}-${initialFilesKey || "empty"}`}
        uploadKey={uploadKey}
        ctaText="Drag Files Here or Click to Upload"
        fileTypes={PMI_EVIDENCE_FILE_TYPES}
        footerLayout="stacked"
        initialFiles={initialFiles}
        onUploadingChange={setUploading}
        onFileSaved={onFileSaved}
      />
    </div>
  );
}

function EvidenceSectionHeading({
  number,
  title,
}: {
  number: number;
  title: string;
}) {
  return (
    <h4 className="text-xl font-bold leading-[34px] text-[#660066] sm:text-[22px]">
      {number}. {title}
    </h4>
  );
}

const EVIDENCE_SUMMARY_CATEGORIES = [
  {
    label: "PMI Relationships",
    uploadCategory: "Full Relationship Evidence",
    dropzoneKey: "relationship",
  },
  {
    label: "Fee Restrictions",
    uploadCategory: "Fee level eligibility evidence",
    dropzoneKey: "fee-level",
  },
  {
    label: "Income Evidence",
    uploadCategory: "Income Evidence",
    dropzoneKey: "income",
  },
  {
    label: "Additional",
    uploadCategory: "Additional Evidence [Optional]",
    dropzoneKey: "additional",
  },
] as const;

function EvidenceUploadSummary({
  files,
  onRemoveCategory,
}: {
  files: { category: string; name: string; size: number; status: string }[];
  onRemoveCategory: (uploadCategory: string, dropzoneKey: string) => void;
}) {
  return (
    <section className="mt-10 border-t border-zinc-200 pt-10">
      <h4 className="text-xl font-bold leading-[34px] text-[#660066] sm:text-[22px]">
        Upload Summary
      </h4>
      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {EVIDENCE_SUMMARY_CATEGORIES.map((cat) => {
          const catFiles = files.filter((f) => f.category === cat.uploadCategory);
          const count = catFiles.length;
          return (
            <div
              key={cat.label}
              className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-[#fafafa] px-4 py-4"
            >
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-zinc-200">
                  <Image
                    src="/file-size.svg"
                    alt=""
                    width={24}
                    height={24}
                    aria-hidden
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-[#223645]">{cat.label}</p>
                  <p className="text-xs text-[#627489]">
                    {count === 0 ? "No Files Uploaded" : `${count} file${count === 1 ? "" : "s"} uploaded`}
                  </p>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-sm text-[#627489]">
                  {count} file{count === 1 ? "" : "s"}
                </span>
                <button
                  type="button"
                  onClick={() => onRemoveCategory(cat.uploadCategory, cat.dropzoneKey)}
                  className="flex h-6 w-6 shrink-0 items-center justify-center transition hover:opacity-80"
                  aria-label={`Remove files from ${cat.label}`}
                >
                  <Image src="/file-close.svg" alt="" width={24} height={25} aria-hidden />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <p className="mt-4 text-[15px] font-medium leading-[28px] text-[#627489]">
        You can add more documents anytime through your member dashboard.
      </p>
    </section>
  );
}

function EvidenceFaqIcon({ src }: { src: string }) {
  return (
    <span
      className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#660066]"
      aria-hidden
    >
      <Image
        src={src}
        alt=""
        width={20}
        height={20}
        className="brightness-0 invert"
        aria-hidden
      />
    </span>
  );
}

const EVIDENCE_QUICK_FAQ = [
  {
    icon: "/faq-icon1.svg",
    question: "I never had a written PMI contract – can I still participate?",
    answer:
      "Yes. Payment records, emails, and your confirmations are sufficient at this stage",
  },
  {
    icon: "/faq-icon2.svg",
    question: "What if I can't find documents right now?",
    answer: "Tick the confirmation boxes and proceed. You can upload later.",
  },
  {
    icon: "/faq-icon3.svg",
    question: "Is my financial information secure?",
    answer:
      "Yes. Encrypted storage, restricted access, and redacted before any court disclosure.",
  },
  {
    icon: "/faq-icon4.svg",
    question: "I operated through a company – what do I upload?",
    answer:
      "Company accounts, your payslips/dividends, and evidence you personally worked with PMIs.",
  },
] as const;

function EvidenceQuickFaq() {
  return (
    <section className="mt-10">
      <h4 className="text-xl font-bold leading-[34px] text-[#660066] sm:text-[22px]">
        Quick FAQ
      </h4>
      <ul className="mt-4 divide-y divide-zinc-200 border-t border-zinc-200">
        {EVIDENCE_QUICK_FAQ.map((item) => (
          <li key={item.question} className="flex items-start gap-4 py-5">
            <EvidenceFaqIcon src={item.icon} />
            <div>
              <p className="text-[15px] font-bold leading-[28px] text-[#223645]">
                Q: {item.question}
              </p>
              <p className="mt-1 text-[15px] font-medium leading-[28px] text-[#223645]">
                A: {item.answer}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function EvidenceDisclosure({
  agreed,
  onChange,
}: {
  agreed: boolean;
  onChange: (agreed: boolean) => void;
}) {
  return (
    <section className="mt-10">
      <div className="flex gap-3 rounded-xl border border-[#d4c4d9] bg-[#f3eef6] p-4">
        <Image
          src="/shield-icon.svg"
          alt=""
          width={50}
          height={50}
          className="mt-0.5 shrink-0"
          aria-hidden
        />
        <p className="text-[15px] font-medium leading-[28px] text-[#223645]">
          As and when the campaign proceeds to formal litigation you will be obliged to preserve
          your documents and electronic records that relate to the issues in the case and at the
          relevant time to disclose them through FIPO to the defendants.
        </p>
      </div>
      <div className="mt-5">
        <FipoCheckbox checked={agreed} onChange={onChange}>
          I understand my obligations in respect of disclosure and will observe a &lsquo;document
          hold&rsquo;
        </FipoCheckbox>
      </div>
    </section>
  );
}

function EvidenceUploadsPanel({
  onUploadingChange,
  disclosureAgreed,
  onDisclosureChange,
}: {
  onUploadingChange: (uploading: boolean) => void;
  disclosureAgreed: boolean;
  onDisclosureChange: (agreed: boolean) => void;
}) {
  const [zoneUploading, setZoneUploading] = useState<Record<string, boolean>>({});
  const [summaryFiles, setSummaryFiles] = useState<
    { category: string; name: string; size: number; status: string }[]
  >([]);
  const [dropzoneKeys, setDropzoneKeys] = useState({
    relationship: 0,
    "fee-level": 0,
    income: 0,
    additional: 0,
  });
  const [noFeeEvidence, setNoFeeEvidence] = useState(false);
  const [noRelationshipEvidence, setNoRelationshipEvidence] = useState(false);
  const [noIncomeEvidence, setNoIncomeEvidence] = useState(false);
  const [incomePerYear, setIncomePerYear] = useState("");

  const setZone = useCallback((key: string, uploading: boolean) => {
    setZoneUploading((prev) => {
      if (prev[key] === uploading) return prev;
      return { ...prev, [key]: uploading };
    });
  }, []);

  useEffect(() => {
    onUploadingChange(Object.values(zoneUploading).some(Boolean));
  }, [zoneUploading, onUploadingChange]);

  const mergeFiles = useCallback(
    (category: string, files: EvidenceUploadFile[]) => {
      setSummaryFiles((prev) => {
        const rest = prev.filter((f) => f.category !== category);
        return [
          ...rest,
          ...files.map((f) => ({
            category,
            name: f.name,
            size: f.size,
            status: f.status,
          })),
        ];
      });
    },
    []
  );

  const removeCategory = useCallback((uploadCategory: string, dropzoneKey: string) => {
    setSummaryFiles((prev) => prev.filter((f) => f.category !== uploadCategory));
    setDropzoneKeys((prev) => ({
      ...prev,
      [dropzoneKey]: prev[dropzoneKey as keyof typeof prev] + 1,
    }));
  }, []);

  return (
    <div className="py-2 sm:py-4">
      <h3 className="text-xl font-bold sm:text-[22px]" style={{ color: PURPLE }}>
        Supporting evidence upload
      </h3>
      <p className="mt-4 text-[16px] font-medium leading-[28px] text-[#223645]">
      Upload documents showing your PMI relationships and income from PMI work.
      </p>

      <div className="mt-6 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
        <Image src="/warning-icon.svg" alt="" width={50} height={50} className="shrink-0" aria-hidden />
        <p className="text-[15px] font-medium leading-[28px] text-amber-900">
          <strong>IMPORTANT!</strong>  Many practitioners do not have formal contracts with PMIs. This is normal and won't disqualify you.  Upload what you have - you can add more later through your member dashboard.
        </p>
      </div>

      {/* 1. Full Relationship Evidence */}
      <section className="mt-10">
        <EvidenceSectionHeading number={1.} title="PMI Relationship Evidence" />
        <p className="mt-3 text-[15px] font-medium leading-[28px] text-[#223645]">
        Documents showing you worked with BUPA, AXA, or other PMIs:
        </p>
        <ul className="mt-4 space-y-1">
          <EvidenceCheckItem>Provider agreements or recognition letters</EvidenceCheckItem>
          <EvidenceCheckItem>Provider agreements or recognition letters</EvidenceCheckItem>
          <EvidenceCheckItem>Provider numbers or portal screenshots</EvidenceCheckItem>
          <EvidenceCheckItem>Emails about network membership or fees</EvidenceCheckItem>
          <EvidenceCheckItem>Remittance advices showing PMI payments</EvidenceCheckItem>
          <EvidenceCheckItem>Bank statements showing PMI income</EvidenceCheckItem>
        </ul>
        <div className="mt-5">
          <EvidenceFileDropzone
            key={`relationship-${dropzoneKeys.relationship}`}
            uploadKey="relationship"
            footerLayout="row"
            multipleLabel="Multiple files supported"
            onUploadingChange={(u) => setZone("relationship", u)}
            onFilesChange={(f) => mergeFiles("Full Relationship Evidence", f)}
          />
        </div>
        <div className="mt-5">
          <FipoCheckbox checked={noRelationshipEvidence} onChange={setNoRelationshipEvidence}>
          I don't have documents now but confirm I worked with PMIs and will provide evidence later if needed
          </FipoCheckbox>
        </div>
      </section>

      {/* 2. Fee level eligibility evidence */}
      <section className="mt-10">
        <EvidenceSectionHeading number={2.} title="Fee Restrictions Evidence" />
        <p className="mt-3 text-[15px] font-medium leading-[28px] text-[#223645]">
          Documents showing PMI fee levels and restrictions on your charging:
        </p>
        <ul className="mt-4 space-y-1">
          <EvidenceCheckItem>Fee schedules (especially showing changes over time)</EvidenceCheckItem>
          <EvidenceCheckItem>Contract clauses prohibiting top-up fees</EvidenceCheckItem>
          <EvidenceCheckItem>Correspondence about fee freezes or reductions</EvidenceCheckItem>
          <EvidenceCheckItem>Letters threatening de-listing</EvidenceCheckItem>
          <EvidenceCheckItem>Remittance advices showing actual fees paid</EvidenceCheckItem>
          <EvidenceCheckItem>Your records comparing PMI fees vs self-pay rates</EvidenceCheckItem>
        </ul>
        <div className="mt-5">
          <EvidenceFileDropzone
            key={`fee-level-${dropzoneKeys["fee-level"]}`}
            uploadKey="fee-level"
            footerLayout="row"
            multipleLabel="Multiple files supported"
            onUploadingChange={(u) => setZone("fee-level", u)}
            onFilesChange={(f) => mergeFiles("Fee level eligibility evidence", f)}
          />
        </div>
        <div className="mt-5">
          <FipoCheckbox checked={noFeeEvidence} onChange={setNoFeeEvidence}>
          I don't have documents now but confirm PMIs controlled my fees and prohibited top-ups. I will provide evidence later if needed
          </FipoCheckbox>
        </div>
      </section>

      {/* 3. Income Evidence */}
      <section className="mt-10">
        <EvidenceSectionHeading number={3.} title="Income Evidence" />
        <p className="mt-3 text-[15px] font-medium leading-[28px] text-[#223645]">
           Documents showing your income level from PMI work (for damages calculation):
        </p>
        <ul className="mt-4 space-y-1">
          <EvidenceCheckItem>Practice accounts showing PMI income breakdown</EvidenceCheckItem>
          <EvidenceCheckItem>Tax returns (redact unrelated personal information if you prefer)</EvidenceCheckItem>
          <EvidenceCheckItem>Annual summaries from PMIs</EvidenceCheckItem>
          <EvidenceCheckItem>Accountant's letter summarising PMI income</EvidenceCheckItem>
          <EvidenceCheckItem>Bank statements showing PMI payments (redact non-PMI transactions)</EvidenceCheckItem>
          <EvidenceCheckItem>Company/LLP accounts (if operating through entity)</EvidenceCheckItem>
        </ul>

        <div className="mt-5 flex gap-3 rounded-xl border border-[#d4c4d9] bg-[#f3eef6] p-4">
          <svg
            className="mt-0.5 h-6 w-6 shrink-0 text-[#660066]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <p className="text-[15px] font-medium leading-[28px] text-[#223645]">
            <strong className="font-bold">CONFIDENTIAL:</strong> Financial documents are encrypted, shared only with our legal team and expert economists, and redacted before any court disclosure.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 items-stretch gap-4 lg:grid-cols-[1fr_auto_1fr]">
          <EvidenceFileDropzone
            key={`income-${dropzoneKeys.income}`}
            uploadKey="income"
            compact
            footerLayout="row"
            multipleLabel="Multiple files supported"
            onUploadingChange={(u) => setZone("income", u)}
            onFilesChange={(f) => mergeFiles("Income Evidence", f)}
          />
          <div className="hidden items-center justify-center text-[#627489] lg:flex" aria-hidden>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex min-h-[200px] flex-col items-center justify-center rounded-2xl border border-[#660066] bg-white px-6 py-8 text-center">
            <svg
              className="h-12 w-12 text-[#660066]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
              <path d="M9 14l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <p className="mt-4 text-sm font-bold text-[#660066]">Self-Confirmation</p>
            <p className="mt-2 text-sm leading-relaxed text-[#223645]">
              (if you prefer not to upload documents now)
              You can choose to self-certify your income details now and provide supporting documents later, if required.
            </p>
          </div>
        </div>
        <div className="mt-5">
          <FipoCheckbox checked={noIncomeEvidence} onChange={setNoIncomeEvidence}>
          I prefer not to upload income documents at this stage. My approximate average annual income from PMI work during peak years was
          </FipoCheckbox>
        </div>
        <div className="mt-5 max-w-md">
          <PracticeLabel>What is your total annual income?</PracticeLabel>
          <div className="relative mt-1">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm font-medium text-[#660066]">
              £
            </span>
            <input
              type="text"
              inputMode="decimal"
              value={incomePerYear}
              onChange={(e) => setIncomePerYear(e.target.value)}
              className={`${practiceFieldCls} pl-7 pr-16`}
              placeholder="0"
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-[#627489]">
              per year
            </span>
          </div>
        </div>
       
        <p className="mt-4 text-[15px] font-medium leading-[28px] text-[#627489]">
           Documentary proof may be requested later for precise damages calculation.
        </p>
      </section>

      {/* 4. Additional Evidence */}
      <section className="mt-10">
        <EvidenceSectionHeading number={4.} title="Additional Evidence (Optional)" />
        <p className="mt-3 text-[15px] font-medium leading-[28px] text-[#223645]">
          Any other supporting documents (correspondence with colleagues, professional
          association guidance, evidence of practice impact, etc.)
        </p>
        <div className="mt-5">
          <EvidenceFileDropzone
            key={`additional-${dropzoneKeys.additional}`}
            uploadKey="additional"
            footerLayout="row"
            multipleLabel="Multiple files supported"
            onUploadingChange={(u) => setZone("additional", u)}
            onFilesChange={(f) => mergeFiles("Additional Evidence [Optional]", f)}
          />
        </div>
      </section>

      <EvidenceUploadSummary files={summaryFiles} onRemoveCategory={removeCategory} />
      <EvidenceQuickFaq />
      <EvidenceDisclosure agreed={disclosureAgreed} onChange={onDisclosureChange} />
    </div>
  );
}
