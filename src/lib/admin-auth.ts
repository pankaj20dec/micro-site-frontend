const KEY = "fipo_admin_token";

export interface AdminPayload {
  sub: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
  iat: number;
  exp: number;
}

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(KEY);
}

export function setAdminToken(token: string) {
  window.localStorage.setItem(KEY, token);
}

export function clearAdminToken() {
  window.localStorage.removeItem(KEY);
}

export function getAdmin(): AdminPayload | null {
  const token = getAdminToken();
  if (!token) return null;
  try {
    const [, payload] = token.split(".");
    const decoded = JSON.parse(atob(payload)) as AdminPayload;
    if (decoded.exp * 1000 < Date.now()) {
      clearAdminToken();
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}
