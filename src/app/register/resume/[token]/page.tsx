"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { getApiBase } from "@/lib/api";
import { setUserToken } from "@/lib/user-auth";

const PURPLE = "#802B7D";

export default function ResumePage() {
  const router = useRouter();
  const params = useParams<{ token: string }>();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = params?.token;
    if (!token) {
      setError("This resume link is invalid.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const res = await fetch(
          `${getApiBase()}/api/application/resume/${token}`
        );
        const data = await res.json().catch(() => ({}));

        if (cancelled) return;

        if (!res.ok || !data.token) {
          setError(
            typeof data.error === "string"
              ? data.error
              : "This resume link is invalid or has expired."
          );
          return;
        }

        // Log the user in with the fresh token and continue the form.
        setUserToken(data.token);
        router.replace("/register?form=1");
      } catch {
        if (!cancelled) {
          setError("Could not reach the server. Please try again.");
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params, router]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f7f7f7] px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center">
        {error ? (
          <>
            <h1 className="text-lg font-bold text-[#263238]">
              Resume link unavailable
            </h1>
            <p className="mt-2 text-sm text-zinc-600">{error}</p>
            <p className="mt-6 text-sm text-zinc-500">
              You can sign in to continue your application.
            </p>
            <Link
              href="/login"
              className="mt-4 inline-block rounded-lg px-5 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: PURPLE }}
            >
              Go to Sign In
            </Link>
          </>
        ) : (
          <>
            <div
              className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-zinc-200"
              style={{ borderTopColor: PURPLE }}
            />
            <p className="mt-4 text-sm text-zinc-500">
              Restoring your application…
            </p>
          </>
        )}
      </div>
    </main>
  );
}
