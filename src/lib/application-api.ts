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

export async function createPaypalOrder(membershipFee: number) {
  const res = await fetch(`${getApiBase()}/api/payment/paypal/create-order`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ membershipFee }),
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

export async function saveEvidenceFile(file: {
  fileName: string;
  fileUrl: string;
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
