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
