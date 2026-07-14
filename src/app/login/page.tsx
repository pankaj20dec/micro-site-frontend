"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getApiBase } from "@/lib/api";
import { setUserToken, getUser } from "@/lib/user-auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${getApiBase()}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.error === "string" ? data.error : "Login failed");
        return;
      }
      setUserToken(data.token);
      const user = getUser();
      if (user?.role === "ADMIN" || user?.role === "SUPER_ADMIN") {
        router.replace("/admin");
      } else {
        // Regular users go straight into the multi-step application form,
        // which resumes at their saved step and exposes all the steps.
        router.replace("/register");
      }
    } catch {
      setError("Network error — is the API running?");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-4 py-8">
      {/* Card */}
      <div className="flex w-full max-w-[960px] overflow-hidden rounded-2xl border border-zinc-200 bg-white">

        {/* ── Left panel ── */}
        <div
          className="relative hidden w-[440px] shrink-0 flex-col px-12 py-10 md:flex"
          style={{ backgroundColor: "#f7f2f8" }}
        >
          {/* Logo */}
          <div className="flex flex-col">
            <Image
              src="/images/logo.png"
              alt="FIPO"
              width={96}
              height={44}
              className="object-contain object-left"
            />
            <div
              className="mt-2 h-[3px] w-14"
              style={{ backgroundColor: "#802B7D" }}
            />
          </div>

          {/* Tagline */}
          <h2 className="mt-10 text-[26px] font-medium leading-snug text-[#263238]">
            Fighting for Fair Pay in Private Practice.
          </h2>

          {/* Illustration */}
          <div className="relative mt-6 flex flex-1 items-center justify-center">
            <Image
              src="/images/secure-login.png"
              alt="Secure login illustration"
              width={360}
              height={360}
              priority
              className="w-full max-w-[340px] object-contain"
            />
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className="flex flex-1 flex-col justify-center px-8 py-12 sm:px-14">
          <div className="mx-auto w-full max-w-[320px]">
          <h1 className="text-2xl font-bold" style={{ color: "#802B7D" }}>
            Sign In
          </h1>

          <form onSubmit={onSubmit} className="mt-6 space-y-5">
            {/* Login ID */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Login ID
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="4" width="20" height="16" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </span>
                <input
                  id="email"
                  type="email"
                  autoComplete="username"
                  required
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-4 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#802B7D] focus:ring-2 focus:ring-[#802B7D]/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-zinc-700"
              >
                Password
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-zinc-400">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg border border-zinc-300 py-2.5 pl-10 pr-10 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-[#802B7D] focus:ring-2 focus:ring-[#802B7D]/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-zinc-400 hover:text-zinc-600"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Forgot password */}
            <div className="-mt-2 text-left">
              <Link
                href="/forgot-password"
                className="text-sm font-medium hover:underline"
                style={{ color: "#802B7D" }}
              >
                Forgot password?
              </Link>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            )}

            {/* Login button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg py-3 text-sm font-bold uppercase tracking-widest text-white transition hover:opacity-90 disabled:opacity-60"
              style={{ backgroundColor: "#802B7D" }}
            >
              {loading ? "Signing in…" : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-zinc-200" />
            <span className="text-xs text-zinc-400">or Sign in with</span>
            <div className="h-px flex-1 bg-zinc-200" />
          </div>

          {/* Google button */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-zinc-300 bg-white py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#4285F4" d="M47.532 24.552c0-1.636-.132-3.208-.388-4.72H24.48v9.027h13.024c-.572 2.968-2.24 5.48-4.748 7.16v5.948h7.68c4.496-4.14 7.096-10.236 7.096-17.416z" />
              <path fill="#34A853" d="M24.48 48c6.48 0 11.924-2.148 15.9-5.832l-7.68-5.948c-2.148 1.44-4.896 2.292-8.22 2.292-6.324 0-11.672-4.272-13.584-10.016H3.024v6.14C6.984 42.884 15.14 48 24.48 48z" />
              <path fill="#FBBC05" d="M10.896 28.496A14.577 14.577 0 0 1 10.08 24c0-1.568.272-3.092.816-4.496V13.364H3.024A23.88 23.88 0 0 0 .48 24c0 3.852.924 7.5 2.544 10.636l7.872-6.14z" />
              <path fill="#EA4335" d="M24.48 9.488c3.564 0 6.76 1.224 9.276 3.636l6.948-6.948C36.4 2.396 30.956 0 24.48 0 15.14 0 6.984 5.116 3.024 13.364l7.872 6.14C12.808 13.76 18.156 9.488 24.48 9.488z" />
            </svg>
            Google
          </button>

          {/* Sign up */}
          <p className="mt-6 text-center text-sm text-zinc-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register?form=1"
              className="font-semibold underline"
              style={{ color: "#802B7D" }}
            >
              Sign Up
            </Link>
          </p>
          </div>
        </div>
      </div>
    </main>
  );
}
