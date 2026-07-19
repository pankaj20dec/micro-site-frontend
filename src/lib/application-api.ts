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
    throw new Error(
      text.startsWith("Internal")
        ? "Server error — check the backend console and ensure the API is running on port 5000."
        : text.slice(0, 200)
    );
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
  const data = await res.json();
  if (!res.ok) throw new Error(data.error ?? "Payment failed");
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
  if (target.storage === "local" || target.stub) {
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

export type DocusignStatusResponse = {
  envelopeId?: string | null;
  status?: string | null;
  legalSignedAt?: string | null;
  configured?: boolean;
  signerEmail?: string | null;
  signers?: { name?: string; email?: string; status?: string }[];
  multipleSigners?: boolean;
  pendingSigners?: { name?: string; email?: string; status?: string }[];
};

export async function fetchDocusignStatus(): Promise<DocusignStatusResponse> {
  const res = await fetch(`${getApiBase()}/api/docusign/status`, {
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
  options?: { forceNew?: boolean }
): Promise<StartDocusignResponse> {
  const res = await fetch(`${getApiBase()}/api/docusign/send`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({
      returnBaseUrl,
      forceNew: options?.forceNew === true,
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

export function isDocusignComplete(status: string | null | undefined) {
  return status === "COMPLETED";
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
}) {
  const maxAttempts = options?.maxAttempts ?? 5;
  const delayMs = options?.delayMs ?? 2000;
  let last = await fetchDocusignStatus();
  for (let attempt = 1; attempt < maxAttempts && !isDocusignComplete(last.status); attempt++) {
    await new Promise((resolve) => setTimeout(resolve, delayMs));
    last = await fetchDocusignStatus();
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
