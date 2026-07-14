"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { getApiBase } from "@/lib/api";
import { setUserToken } from "@/lib/user-auth";

interface Props {
  onSuccess: (application: Record<string, unknown>) => void;
}

export default function Step2Register({ onSuccess }: Props) {
  const [mode, setMode] = useState<"register" | "login">("register");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [organisation, setOrganisation] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const endpoint = mode === "register" ? "/api/auth/register" : "/api/auth/login";
      const body =
        mode === "register"
          ? { firstName, lastName, email, password, phone, organisation }
          : { email, password };

      const res = await fetch(`${getApiBase()}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Failed — please try again");
        return;
      }
      setUserToken(data.token);

      // Fetch application created by register, or existing one for login
      const appRes = await fetch(`${getApiBase()}/api/application`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const appData = await appRes.json().catch(() => ({}));
      onSuccess(appData.application ?? {});
    } catch {
      setError("Network error — is the API running?");
    } finally {
      setLoading(false);
    }
  }

  const field =
    "mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2.5 text-zinc-900 outline-none transition focus:border-[#802B7D] focus:ring-2 focus:ring-[#802B7D]/20";

  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-[#223645]">
        {mode === "register" ? "Create your account" : "Sign in to continue"}
      </h2>
      <p className="mt-1 text-sm text-zinc-500">
        {mode === "register" ? (
          <>
            Already registered?{" "}
            <button
              onClick={() => setMode("login")}
              className="font-medium text-[#802B7D] hover:underline"
            >
              Sign in instead
            </button>
          </>
        ) : (
          <>
            New here?{" "}
            <button
              onClick={() => setMode("register")}
              className="font-medium text-[#802B7D] hover:underline"
            >
              Create an account
            </button>
          </>
        )}
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {mode === "register" && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700">First name</label>
                <input required className={field} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Last name</label>
                <input required className={field} value={lastName} onChange={(e) => setLastName(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">Phone number</label>
              <input type="tel" className={field} value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">Organisation / practice name</label>
              <input className={field} value={organisation} onChange={(e) => setOrganisation(e.target.value)} />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-zinc-700">Email address</label>
          <input type="email" required autoComplete="username" className={field} value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">Password</label>
          <input type="password" required autoComplete={mode === "register" ? "new-password" : "current-password"} className={field} value={password} onChange={(e) => setPassword(e.target.value)} />
          {mode === "register" && (
            <p className="mt-1 text-xs text-zinc-400">Minimum 8 characters</p>
          )}
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
          style={{ backgroundColor: "#802B7D" }}
        >
          {loading ? "Please wait…" : mode === "register" ? "Create account & continue →" : "Sign in & continue →"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-zinc-400">
        <Link href="/login" className="hover:underline">Sign in to an existing account instead</Link>
      </p>
    </div>
  );
}
