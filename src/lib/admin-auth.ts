const KEY = "fipo_admin_token";

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
