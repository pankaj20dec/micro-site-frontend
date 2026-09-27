const KEY = "fipo_user_token";

export interface UserPayload {
  sub: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  iat: number;
  exp: number;
}

export function getUserToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function setUserToken(token: string) {
  window.localStorage.setItem(KEY, token);
}

export function clearUserToken() {
  window.localStorage.removeItem(KEY);
}

const IMPERSONATE_KEY = "fipo_impersonating";

export type ImpersonationInfo = {
  email: string;
  name: string;
};

export function setImpersonation(info: ImpersonationInfo) {
  window.localStorage.setItem(IMPERSONATE_KEY, JSON.stringify(info));
}

export function getImpersonation(): ImpersonationInfo | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(IMPERSONATE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ImpersonationInfo;
    if (!parsed?.email) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearImpersonation() {
  window.localStorage.removeItem(IMPERSONATE_KEY);
}

export function stopImpersonation() {
  clearUserToken();
  clearImpersonation();
}

export function getUser(): UserPayload | null {
  const token = getUserToken();
  if (!token) return null;
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload)) as UserPayload;
    if (decoded.exp * 1000 < Date.now()) {
      clearUserToken();
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}
