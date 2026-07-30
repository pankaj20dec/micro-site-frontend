import { getApiBase } from "@/lib/api";
import { getUserToken, clearUserToken } from "@/lib/user-auth";

function authHeaders() {
  const token = getUserToken();
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function parseApiJson(res: Response) {
  const text = await res.text();
  if (!text) {
    return { data: {}, ok: res.ok, status: res.status };
  }
  try {
    return { data: JSON.parse(text), ok: res.ok, status: res.status };
  } catch {
    const lowered = text.toLowerCase();
    if (
      lowered.includes("internal server error") ||
      lowered.includes("econnrefused") ||
      lowered.includes("bad gateway")
    ) {
      throw new Error(
        "Could not reach the API. Ensure the backend is running (default port 5000) and restart the Next.js dev server if you changed PORT."
      );
    }
    throw new Error(text.slice(0, 200));
  }
}

export async function fetchApplication() {
  const res = await fetch(`${getApiBase()}/api/application`, {
    headers: authHeaders(),
  });
  if (res.status === 401) {
    clearUserToken();
    return null;
  }
  if (!res.ok) return null;
  const data = await res.json();
  return data.application ?? null;
}

export async function saveStep(payload: Record<string, unknown>) {
  const res = await fetch(`${getApiBase()}/api/application/step`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const { data, ok } = await parseApiJson(res);
  if (res.status === 401) {
    clearUserToken();
    throw new Error(
      typeof data.error === "string"
        ? data.error
        : "Session expired. Please register again."
    );
  }
  if (!ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Failed to save"
    );
  }
  return data.application;
}

export async function requestSaveResume() {
  const res = await fetch(`${getApiBase()}/api/application/save-resume`, {
    method: "POST",
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Failed");
  return data;
}

export async function pollPaymentStatus(options?: {
  maxAttempts?: number;
  delayMs?: number;
}) {
  const maxAttempts = options?.maxAttempts ?? 15;
  const delayMs = options?.delayMs ?? 1000;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const application = await fetchApplication();
    if (application?.paymentStatus === "PAID") return true;
    if (attempt < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return false;
}

export async function confirmStripePayment(paymentIntentId?: string) {
  const res = await fetch(`${getApiBase()}/api/payment/stripe/confirm`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(
      paymentIntentId ? { paymentIntentId } : {}
    ),
  });
  const { data, ok } = await parseApiJson(res);
  if (res.status === 401) {
    clearUserToken();
    throw new Error(
      typeof data.error === "string"
        ? data.error
        : "Session expired. Please register again."
    );
  }
  if (!ok) {
    if (res.status === 404) {
      throw new Error(
        "Payment confirmation is unavailable on the server. Redeploy the latest backend, then try again."
      );
    }
    throw new Error(
      typeof data.error === "string"
        ? data.error
        : "Could not confirm Stripe payment."
    );
  }
  return data;
}

export async function createStripeIntent(
  membershipFee: number,
  options?: { confirmStub?: boolean }
) {
  const res = await fetch(`${getApiBase()}/api/payment/stripe/create-intent`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      membershipFee,
      confirmStub: options?.confirmStub ?? false,
    }),
  });
  const { data, ok } = await parseApiJson(res);
  if (res.status === 401) {
    clearUserToken();
    throw new Error(
      typeof data.error === "string"
        ? data.error
        : "Session expired. Please register again."
    );
  }
  if (!ok) {
    throw new Error(
      typeof data.error === "string" ? data.error : "Could not start Stripe payment."
    );
  }
  return data;
}

export function getPaymentReturnBaseUrl() {
  if (typeof window === "undefined") return "";
  return window.location.origin;
}

export async function createPaypalOrder(
  membershipFee: number,
  options?: { returnBaseUrl?: string }
) {
  const returnBaseUrl = options?.returnBaseUrl || getPaymentReturnBaseUrl();
  const res = await fetch(`${getApiBase()}/api/payment/paypal/create-order`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      membershipFee,
      ...(returnBaseUrl ? { returnBaseUrl } : {}),
    }),
  });
  const { data, ok } = await parseApiJson(res);
  if (!ok) throw new Error(data.error ?? "PayPal failed");
  return data;
}

export async function capturePaypalOrder(orderId: string) {
  const res = await fetch(`${getApiBase()}/api/payment/paypal/capture-order`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ orderId }),
  });
  const { data, ok } = await parseApiJson(res);
  if (!ok) throw new Error(data.error ?? "Capture failed");
  return data;
}

export async function uploadEvidenceFile(file: File, uploadKey: string) {
  const presignRes = await fetch(`${getApiBase()}/api/application/evidence/presign`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      fileName: file.name,
      mimeType: file.type || "application/octet-stream",
      fileSize: file.size,
      uploadKey,
    }),
  });
  const { data: target, ok: presignOk } = await parseApiJson(presignRes);
  if (presignRes.status === 401) {
    clearUserToken();
    throw new Error("Session expired. Please sign in again.");
  }
  if (!presignOk || !target.fileKey) {
    throw new Error(typeof target.error === "string" ? target.error : "Failed to prepare upload");
  }

  const uploadUrl = String(target.uploadUrl).startsWith("http")
    ? String(target.uploadUrl)
    : `${getApiBase()}${target.uploadUrl}`;

  const uploadHeaders: Record<string, string> = {
    ...(target.headers || {}),
  };
  const usesApiUpload =
    !String(target.uploadUrl).startsWith("http") ||
    target.storage === "local" ||
    target.storage === "spaces" ||
    target.stub;
  if (usesApiUpload) {
    const token = getUserToken();
    if (token) uploadHeaders.Authorization = `Bearer ${token}`;
  }

  const uploadRes = await fetch(uploadUrl, {
    method: target.method || "PUT",
    headers: uploadHeaders,
    body: file,
  });
  if (!uploadRes.ok) {
    const uploadError = await uploadRes.text().catch(() => "");
    throw new Error(uploadError || "File upload to storage failed");
  }

  return saveEvidenceFile({
    fileName: file.name,
    fileKey: target.fileKey,
    uploadKey: String(target.uploadKey || uploadKey),
    fileSize: file.size,
    mimeType: file.type || "application/octet-stream",
  });
}

export async function saveEvidenceFile(file: {
  fileName: string;
  fileUrl?: string;
  fileKey?: string;
  uploadKey?: string;
  fileSize: number;
  mimeType: string;
}) {
  const res = await fetch(`${getApiBase()}/api/application/evidence`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(file),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Upload failed");
  return data.file;
}

export async function deleteEvidenceFile(fileId: string) {
  const res = await fetch(`${getApiBase()}/api/application/evidence/${encodeURIComponent(fileId)}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (res.status === 401) {
    clearUserToken();
    throw new Error("Session expired. Please sign in again.");
  }
  if (!res.ok && res.status !== 204) {
    const { data } = await parseApiJson(res);
    throw new Error(typeof data.error === "string" ? data.error : "Failed to delete file");
  }
}

export type DocusignStatusResponse = {
  envelopeId?: string | null;
  status?: string | null;
  completedDateTime?: string | null;
  allSignersCompleted?: boolean;
  legalSignedAt?: string | null;
  rateLimited?: boolean;
  webhookConfigured?: boolean;
  configured?: boolean;
  signerEmail?: string | null;
  signers?: { name?: string; email?: string; status?: string; roleName?: string | null; routingOrder?: string | null }[];
  multipleSigners?: boolean;
  pendingSigners?: { name?: string; email?: string; status?: string }[];
};

export async function fetchDocusignStatus(options?: {
  refresh?: boolean;
}): Promise<DocusignStatusResponse> {
  const endpoint = `${getApiBase()}/api/docusign/status${
    options?.refresh ? "?refresh=1" : ""
  }`;
  const res = await fetch(endpoint, {
    headers: authHeaders(),
    cache: "no-store",
  });
  const { data, ok } = await parseApiJson(res);
  if (res.status === 401) {
    clearUserToken();
    throw new Error("Session expired. Please sign in again.");
  }
  if (!ok) {
    throw new Error(typeof data.error === "string" ? data.error : "Failed to load signing status");
  }
  return data as DocusignStatusResponse;
}

export type StartDocusignResponse = {
  envelopeId?: string;
  signingUrl?: string | null;
  docusignStatus?: string;
  stub?: boolean;
  alreadyCompleted?: boolean;
  message?: string;
  consentUrl?: string;
  error?: string;
  hint?: string;
};

export async function startDocusignSigning(
  returnBaseUrl: string,
  options?: { forceNew?: boolean; attachPmiEvidence?: boolean; returnContext?: string }
): Promise<StartDocusignResponse> {
  const res = await fetch(`${getApiBase()}/api/docusign/send`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      returnBaseUrl,
      forceNew: options?.forceNew === true,
      attachPmiEvidence: options?.attachPmiEvidence !== false,
      returnContext: options?.returnContext,
    }),
  });
  const { data, ok } = await parseApiJson(res);
  if (res.status === 401) {
    clearUserToken();
    throw new Error("Session expired. Please sign in again.");
  }
  if (!ok) {
    const err = new Error(
      typeof data.error === "string" ? data.error : "Failed to start DocuSign signing"
    ) as Error & { consentUrl?: string; hint?: string };
    if (typeof data.consentUrl === "string") err.consentUrl = data.consentUrl;
    if (typeof data.hint === "string") err.hint = data.hint;
    throw err;
  }
  return data as StartDocusignResponse;
}

export async function startWitnessDocusignSigning(
  returnBaseUrl: string,
  witness: { email: string; name: string; address?: string }
): Promise<
  StartDocusignResponse & {
    witnessStatus?: string;
    alreadyCompleted?: boolean;
    emailSent?: boolean;
    message?: string;
  }
> {
  const res = await fetch(`${getApiBase()}/api/docusign/witness/send`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      returnBaseUrl,
      witnessEmail: witness.email,
      witnessName: witness.name,
      witnessAddress: witness.address || "",
    }),
  });
  const { data, ok } = await parseApiJson(res);
  if (res.status === 401) {
    clearUserToken();
    throw new Error("Session expired. Please sign in again.");
  }
  if (!ok) {
    let message =
      typeof data.error === "string" ? data.error : "Failed to start witness signing";
    if (Array.isArray(data.availableRoles) && data.availableRoles.length > 0) {
      message += ` Available template roles: ${data.availableRoles.join(", ")}.`;
    }
    const err = new Error(message) as Error & {
      hint?: string;
      availableRoles?: string[];
      code?: string;
    };
    if (typeof data.hint === "string") err.hint = data.hint;
    if (Array.isArray(data.availableRoles)) err.availableRoles = data.availableRoles;
    if (typeof data.code === "string") err.code = data.code;
    if (
      !err.code &&
      /invalid envelope status/i.test(message)
    ) {
      err.code = "ENVELOPE_ALREADY_COMPLETED";
    }
    throw err;
  }
  return data as StartDocusignResponse & {
    witnessStatus?: string;
    alreadyCompleted?: boolean;
    emailSent?: boolean;
    message?: string;
  };
}

export async function fetchSignedDocusignPdf(): Promise<Blob> {
  const token = getUserToken();
  const res = await fetch(`${getApiBase()}/api/docusign/download`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    cache: "no-store",
  });
  if (res.status === 401) {
    clearUserToken();
    throw new Error("Session expired. Please sign in again.");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(
      typeof data.error === "string" ? data.error : "Could not load signed PDF"
    );
  }
  return res.blob();
}

export async function openSignedDocusignPdf() {
  const blob = await fetchSignedDocusignPdf();
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export async function downloadSignedDocusignPdf(
  fileName = "fipo-engagement-signed.pdf"
) {
  const blob = await fetchSignedDocusignPdf();
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}

export function isDocusignComplete(status: string | null | undefined) {
  return status === "COMPLETED";
}

export function isSignerStatusDone(status: string | null | undefined) {
  const normalised = String(status || "").toLowerCase();
  return (
    normalised === "completed" ||
    normalised === "signed" ||
    normalised === "autoresponded"
  );
}

export function pickPrimarySigner(
  signers: DocusignStatusResponse["signers"] | undefined
) {
  if (!signers?.length) return undefined;
  return signers.find((s) => s.routingOrder === "1") ?? signers[0];
}

export function pickWitnessSigner(
  signers: DocusignStatusResponse["signers"] | undefined,
  options?: { witnessEmail?: string; witnessRoleName?: string }
) {
  if (!signers?.length) return undefined;
  const primary = pickPrimarySigner(signers);
  const candidates = signers.filter((signer) => {
    if (signers.length <= 1) return false;
    if (signer.routingOrder === "1") return false;
    if (
      primary?.email &&
      signer.email &&
      primary.email.toLowerCase() === signer.email.toLowerCase()
    ) {
      return false;
    }
    return true;
  });
  if (!candidates.length) return undefined;

  const witnessEmail = options?.witnessEmail?.trim().toLowerCase();
  if (witnessEmail) {
    const byEmail = candidates.find(
      (signer) => signer.email?.toLowerCase() === witnessEmail
    );
    if (byEmail) return byEmail;
  }

  const witnessRoleName = options?.witnessRoleName;
  return (
    candidates.find((signer) => witnessRoleName && signer.roleName === witnessRoleName) ||
    candidates.find((signer) => /witness/i.test(signer.roleName || "")) ||
    candidates.find((signer) => signer.routingOrder === "2") ||
    candidates[0]
  );
}

export function isWitnessSigningComplete(
  data: Pick<DocusignStatusResponse, "signers">,
  witnessEmail?: string
) {
  const witness = pickWitnessSigner(data.signers, { witnessEmail });
  if (!witness || !isSignerStatusDone(witness.status)) return false;

  // Placeholder recipients from Stage 1 are not a real witness signature.
  const email = String(witness.email || "").toLowerCase();
  if (email.includes("@fipo-sign.local")) return false;
  if (/^witness\s*\(pending\)$/i.test(String(witness.name || "").trim())) {
    return false;
  }

  return true;
}

/** Stage 2 success: envelope completed with a real second signer finished. */
export function isStage2EnvelopeComplete(
  data: Pick<
    DocusignStatusResponse,
    "status" | "signers" | "allSignersCompleted"
  >,
  witnessEmail?: string
) {
  if (!isDocusignComplete(data.status)) return false;
  if (isWitnessSigningComplete(data, witnessEmail)) return true;
  if (data.allSignersCompleted && (data.signers?.length ?? 0) >= 2) {
    const witness = pickWitnessSigner(data.signers, { witnessEmail });
    const email = String(witness?.email || "").toLowerCase();
    if (!witness || email.includes("@fipo-sign.local")) return false;
    return true;
  }
  const signers = data.signers ?? [];
  if (
    signers.length >= 2 &&
    signers.every((signer) => isSignerStatusDone(signer.status))
  ) {
    const witness = pickWitnessSigner(signers, { witnessEmail });
    const email = String(witness?.email || "").toLowerCase();
    if (!witness || email.includes("@fipo-sign.local")) return false;
    return true;
  }
  return false;
}

/** True only for legacy broken envelopes — not when Stage 1 is done and witness is pending (SENT). */
export function isClaimantSigningComplete(
  data: Pick<DocusignStatusResponse, "signers">
) {
  const primary = pickPrimarySigner(data.signers);
  return !!primary && isSignerStatusDone(primary.status);
}

export function shouldOfferStage1Restart(
  data: Pick<DocusignStatusResponse, "status" | "signers" | "allSignersCompleted">,
  witnessEmail?: string,
  _options?: { stage1MarkedComplete?: boolean }
) {
  const status = data.status;
  const signers = data.signers ?? [];

  // SENT/DELIVERED = claimant done, witness pending — normal Stage 2, never restart.
  if (isDocusignInProgress(status)) {
    return false;
  }

  if (!isDocusignComplete(status)) {
    return false;
  }

  // Witness flow finished successfully — never show Sign again.
  if (isStage2EnvelopeComplete(data, witnessEmail)) {
    return false;
  }

  // Wait for signer details before deciding — avoids a false "Sign again" flash.
  if (!signers.length) {
    return false;
  }

  // COMPLETED without a verified witness signature — Stage 2 cannot proceed.
  return true;
}

export function describeEnvelopeSignerProgress(
  data: Pick<DocusignStatusResponse, "signers" | "allSignersCompleted" | "pendingSigners">,
  witnessEmail?: string
) {
  const signers = data.signers;
  if (!signers?.length) return [];

  const activeWitnessEmail = witnessEmail?.trim().toLowerCase();

  return signers.map((signer) => {
    const label =
      signer.roleName ||
      (activeWitnessEmail &&
      signer.email?.toLowerCase() === activeWitnessEmail
        ? "Witness"
        : signer.routingOrder === "1"
          ? "Claimant"
          : signer.name || signer.email || "Signer");

    return {
      label,
      status: signer.status || "pending",
      done: isSignerStatusDone(signer.status),
      email: signer.email || undefined,
    };
  });
}

export function isDocusignInProgress(status: string | null | undefined) {
  return status === "SENT" || status === "DELIVERED";
}

export function docusignStatusMessage(
  status: string | null | undefined,
  context?: Pick<DocusignStatusResponse, "signerEmail" | "signers" | "multipleSigners" | "pendingSigners">
) {
  if (isDocusignComplete(status)) return null;

  if (context?.multipleSigners && context.pendingSigners?.length) {
    const waitingOn = context.pendingSigners
      .map((signer) => signer.email || signer.name || "another signer")
      .join(", ");
    if (context.signerEmail && context.pendingSigners.some((signer) => signer.email === context.signerEmail)) {
      return "Your signing session was created with an extra signer from the DocuSign template. Click Restart signing to create a fresh envelope with only your account.";
    }
    return `This envelope is waiting for ${waitingOn} to sign before it can complete. Click Restart signing to create a fresh envelope for your account only.`;
  }

  if (status === "DELIVERED") {
    return "You opened the documents but have not finished signing. Click Continue signing, open document 1 (the declaration), complete every Sign tab, then click Finish in DocuSign.";
  }
  if (status === "SENT") {
    return "Your signing session is ready. Click Continue signing, sign document 1 (the declaration), then click Finish in DocuSign. Your PMI uploads are attached for review only.";
  }
  return "Signing is not complete yet. Click Continue signing to open DocuSign again, or Restart signing if the session looks wrong.";
}

export function docusignReturnEventMessage(event: string | null | undefined) {
  switch (event) {
    case "signing_complete":
      return null;
    case "viewing_complete":
      return "You returned from DocuSign without finishing. Open document 1 (the declaration), click every Sign tab, then click Finish.";
    case "cancel":
      return "You closed DocuSign before finishing. Click Continue signing to complete every Sign tab, then click Finish.";
    case "decline":
      return "Signing was declined. Contact support if you need help.";
    case "session_timeout":
    case "ttl_expired":
      return "Your DocuSign session expired. Click Continue signing to try again.";
    default:
      return null;
  }
}

export async function pollDocusignStatus(options?: {
  maxAttempts?: number;
  delayMs?: number;
  refresh?: boolean;
}) {
  const maxAttempts = options?.maxAttempts ?? 2;
  const delayMs = options?.delayMs ?? 2000;
  let last = await fetchDocusignStatus({ refresh: options?.refresh });
  for (let attempt = 1; attempt < maxAttempts && !isDocusignComplete(last.status); attempt++) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    last = await fetchDocusignStatus({ refresh: options?.refresh });
  }
  return last;
}

export type EvidenceFileRecord = {
  id?: string;
  fileName: string;
  fileUrl: string;
  uploadKey?: string;
  fileSize?: number;
  mimeType?: string;
  uploadedAt?: string;
};

export const PMI_EVIDENCE_UPLOAD_KEYS = ["pmi-evidence-a", "pmi-evidence-b"] as const;

export function isPmiEvidenceUploadKey(uploadKey: string | null | undefined) {
  return PMI_EVIDENCE_UPLOAD_KEYS.includes(
    String(uploadKey || "") as (typeof PMI_EVIDENCE_UPLOAD_KEYS)[number]
  );
}

export function isPmiEvidenceFileKey(fileKey: string | null | undefined) {
  const key = String(fileKey || "");
  return key.includes("/pmi-evidence-a/") || key.includes("/pmi-evidence-b/");
}

export function isPmiEvidenceFile(file: EvidenceFileRecord) {
  if (isPmiEvidenceUploadKey(file.uploadKey)) return true;
  return isPmiEvidenceFileKey(file.fileUrl);
}

export function getPmiEvidenceFiles(
  application: Record<string, unknown> | null | undefined
): EvidenceFileRecord[] {
  const files = application?.evidenceFiles;
  if (!Array.isArray(files)) return [];
  return files.filter((file) => isPmiEvidenceFile(file as EvidenceFileRecord)) as EvidenceFileRecord[];
}

export const WITNESS_EVIDENCE_UPLOAD_KEYS = {
  photoId: "witness-photo-id",
  proofOfAddress: "witness-proof-of-address",
} as const;

export function isWitnessEvidenceUploadKey(uploadKey: string | null | undefined) {
  const key = String(uploadKey || "");
  return (
    key === WITNESS_EVIDENCE_UPLOAD_KEYS.photoId ||
    key === WITNESS_EVIDENCE_UPLOAD_KEYS.proofOfAddress
  );
}

export function getWitnessEvidenceFiles(
  application: Record<string, unknown> | null | undefined
): {
  photoId: EvidenceFileRecord | null;
  proofOfAddress: EvidenceFileRecord | null;
} {
  const files = application?.evidenceFiles;
  if (!Array.isArray(files)) {
    return { photoId: null, proofOfAddress: null };
  }

  let photoId: EvidenceFileRecord | null = null;
  let proofOfAddress: EvidenceFileRecord | null = null;

  for (const raw of files) {
    const file = raw as EvidenceFileRecord;
    const uploadKey = String(file.uploadKey || "");
    if (uploadKey === WITNESS_EVIDENCE_UPLOAD_KEYS.photoId) {
      photoId = file;
    } else if (uploadKey === WITNESS_EVIDENCE_UPLOAD_KEYS.proofOfAddress) {
      proofOfAddress = file;
    }
  }

  return { photoId, proofOfAddress };
}

export function evidenceUploadLabel(uploadKey: string | null | undefined) {
  switch (String(uploadKey || "")) {
    case WITNESS_EVIDENCE_UPLOAD_KEYS.photoId:
      return "Witness photo ID";
    case WITNESS_EVIDENCE_UPLOAD_KEYS.proofOfAddress:
      return "Witness proof of address";
    case "pmi-evidence-a":
      return "PMI evidence A";
    case "pmi-evidence-b":
      return "PMI evidence B";
    case "relationship":
      return "Relationship evidence";
    case "fee-level":
      return "Fee level evidence";
    case "income":
      return "Income evidence";
    case "additional":
      return "Additional evidence";
    default:
      return uploadKey ? String(uploadKey) : "Upload";
  }
}
