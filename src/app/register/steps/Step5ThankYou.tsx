"use client";

import Link from "next/link";
import type { Application } from "../page";

interface Props {
  application: Application | null;
}

export default function Step5ThankYou({ application }: Props) {
  const isClaimant = application?.applicationType === "CLAIMANT";

  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-lg text-center">
      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full text-3xl"
        style={{ backgroundColor: "#f3eef6" }}>
        🎉
      </div>
      <h2 className="text-2xl font-bold text-[#223645]">
        {isClaimant ? "Payment received!" : "Welcome to FIPO!"}
      </h2>
      <p className="mt-3 text-zinc-600">
        {isClaimant
          ? "Your membership payment has been confirmed. Now let's complete your claimant registration."
          : "Your membership is confirmed. Thank you for supporting the FIPO Fair Pay Action Group."}
      </p>

      <div className="mt-6 rounded-xl bg-[#f3eef6] p-4 text-left">
        <div className="text-sm font-medium text-zinc-700">Membership details</div>
        <div className="mt-2 space-y-1 text-sm text-zinc-600">
          <div className="flex justify-between">
            <span>Type</span>
            <span className="font-medium capitalize">
              {String(application?.membershipType ?? "").toLowerCase()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Annual fee</span>
            <span className="font-medium">£{String(application?.membershipFee ?? "—")}</span>
          </div>
          <div className="flex justify-between">
            <span>Payment status</span>
            <span className="font-medium text-green-600">Paid ✓</span>
          </div>
        </div>
      </div>

      {isClaimant ? (
        <Link
          href="/register"
          className="mt-6 inline-block w-full rounded-lg py-3 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: "#802B7D" }}
        >
          Continue claimant registration →
        </Link>
      ) : (
        <Link
          href="/dashboard"
          className="mt-6 inline-block w-full rounded-lg py-3 text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: "#802B7D" }}
        >
          Go to my dashboard →
        </Link>
      )}
    </div>
  );
}
