"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getApiBase } from "@/lib/api";
import {
  clearAdminToken,
  getAdmin,
  getAdminToken,
} from "@/lib/admin-auth";
import { createAdminUser } from "@/lib/admin-users-api";

const fieldCls =
  "mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-zinc-900 outline-none ring-teal-500/30 focus:border-teal-500 focus:ring-2 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100";

type Mode = "loading" | "bootstrap" | "register" | "login_required" | "forbidden";

export default function AdminRegisterPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("loading");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "SUPER_ADMIN">("ADMIN");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(`${getApiBase()}/api/admin/setup/status`);
        const data = await res.json().catch(() => ({}));

        if (cancelled) return;

        if (data.needsSetup) {
          setMode("bootstrap");
          return;
        }

        const admin = getAdmin();
        if (!getAdminToken()) {
          setMode("login_required");
          return;
        }
        if (admin?.role === "SUPER_ADMIN") {
          setMode("register");
          return;
        }
        setMode("forbidden");
      } catch {
        if (!cancelled) setError("Could not reach the server.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  function resetForm() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRole("ADMIN");
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      setError("Please complete all required fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "bootstrap") {
        const res = await fetch(`${getApiBase()}/api/admin/setup/setup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.toLowerCase().trim(),
            password,
          }),
        });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(typeof data.error === "string" ? data.error : "Setup failed");
          return;
        }
        setSuccess(
          `Super Admin account created for ${data.user.email}. You can sign in now.`
        );
        resetForm();
        setTimeout(() => router.push("/admin/login"), 2000);
        return;
      }

      const user = await createAdminUser({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.toLowerCase().trim(),
        password,
        role,
      });
      setSuccess(
        `${user.firstName} ${user.lastName} (${user.email}) registered as ${user.role.replace("_", " ")}.`
      );
      resetForm();
    } catch (err) {
      const status = (err as { status?: number }).status;
      if (status === 401 || status === 403) {
        clearAdminToken();
        setMode("login_required");
        setError("Your session expired. Please sign in as Super Admin.");
        return;
      }
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  if (mode === "loading") {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-center text-sm text-zinc-500">Loading…</p>
      </div>
    );
  }

  if (mode === "login_required") {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Register admin
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Sign in as Super Admin to create new Admin or Super Admin accounts.
        </p>
        {error && (
          <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
            {error}
          </p>
        )}
        <Link
          href="/admin/login?redirect=/admin/register"
          className="mt-6 block w-full rounded-lg bg-[#660066] py-2.5 text-center text-sm font-medium text-white hover:bg-[#550055]"
        >
          Sign in as Super Admin
        </Link>
        <p className="mt-6 text-center text-sm text-zinc-500">
          <Link href="/admin/login" className="hover:underline">
            ← Back to sign in
          </Link>
        </p>
      </div>
    );
  }

  if (mode === "forbidden") {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Access restricted
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Only Super Admin can register new admin accounts. Contact your Super Admin.
        </p>
        <Link
          href="/admin"
          className="mt-6 block w-full rounded-lg border border-zinc-300 py-2.5 text-center text-sm font-medium dark:border-zinc-700"
        >
          Go to dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
        {mode === "bootstrap" ? "Create Super Admin" : "Register admin"}
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        {mode === "bootstrap"
          ? "Set up the first Super Admin account for this installation."
          : "Create a new Admin or Super Admin account."}
      </p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              First name
            </label>
            <input
              id="firstName"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className={fieldCls}
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Last name
            </label>
            <input
              id="lastName"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className={fieldCls}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={fieldCls}
          />
        </div>

        {mode === "register" && (
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value as "ADMIN" | "SUPER_ADMIN")}
              className={fieldCls}
            >
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>
        )}

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={fieldCls}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={fieldCls}
          />
        </div>

        {error && (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/50 dark:text-red-200">
            {error}
          </p>
        )}
        {success && (
          <p className="rounded-lg bg-teal-50 px-3 py-2 text-sm text-teal-900 dark:bg-teal-950/40 dark:text-teal-100">
            {success}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#660066] py-2.5 text-sm font-medium text-white transition hover:bg-[#550055] disabled:opacity-60"
        >
          {loading
            ? "Please wait…"
            : mode === "bootstrap"
              ? "Create Super Admin"
              : "Register admin"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Link href="/admin/login" className="font-semibold text-[#660066] hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}
