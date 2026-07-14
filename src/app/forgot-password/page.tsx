"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { getApiBase } from "@/lib/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${getApiBase()}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Something went wrong");
        return;
      }
      setSent(true);
    } catch {
      setError("Network error — is the API running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 sm:p-10">
        <h1 className="text-2xl font-bold" style={{ color: "#802B7D" }}>
          Forgot password
        </h1>

        {sent ? (
          <div className="mt-6">
            <div className="rounded-lg bg-[#f7f2f8] px-4 py-5 text-sm text-[#263238]">
              If an account exists for <strong>{email}</strong>, we&apos;ve sent a
              password reset link to that address. The link expires in 1 hour.
            </div>
            <Link
              href="/login"
              className="mt-6 inline-block text-sm font-medium hover:underline"
              style={{ color: "#802B7D" }}
            >
              ← Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-2 text-sm text-zinc-500">
              Enter your email address and we&apos;ll send you a link to reset
              your password.
            </p>

            <form onSubmit={onSubmit} className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-sm font-medium text-zinc-700"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 px-4 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#802B7D] focus:ring-2 focus:ring-[#802B7D]/20"
                />
              </div>

              {error && (
                <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-lg py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:opacity-90 disabled:opacity-60"
                style={{ backgroundColor: "#802B7D" }}
              >
                {loading ? "Sending…" : "Send reset link"}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-zinc-500">
              Remembered it?{" "}
              <Link
                href="/login"
                className="font-semibold hover:underline"
                style={{ color: "#802B7D" }}
              >
                Sign in
              </Link>
            </p>
          </>
        )}
      </div>
    </main>
  );
}
