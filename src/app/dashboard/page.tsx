"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getUserToken, getUser, clearUserToken } from "@/lib/user-auth";
import { fetchApplication } from "@/lib/application-api";

type Application = Record<string, unknown>;

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: "Draft", color: "bg-zinc-100 text-zinc-700" },
  AWAITING_PAYMENT: { label: "Awaiting Payment", color: "bg-amber-100 text-amber-700" },
  PAID: { label: "Paid", color: "bg-blue-100 text-blue-700" },
  UNDER_REVIEW: { label: "Under Review", color: "bg-purple-100 text-purple-700" },
  APPROVED: { label: "Approved", color: "bg-green-100 text-green-700" },
  REJECTED: { label: "Rejected", color: "bg-red-100 text-red-700" },
  COMPLETE: { label: "Complete", color: "bg-green-100 text-green-700" },
};

const DOCUSIGN_LABELS: Record<string, string> = {
  PENDING: "Not yet signed",
  SENT: "Sent for signature",
  DELIVERED: "Delivered",
  COMPLETED: "Signed ✓",
  SIGNED: "Signed ✓",
  DECLINED: "Declined",
  VOIDED: "Voided",
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS_LABELS[status] ?? { label: status, color: "bg-zinc-100 text-zinc-600" };
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${s.color}`}>
      {s.label}
    </span>
  );
}

function ProgressStep({
  label,
  done,
  active,
}: {
  label: string;
  done: boolean;
  active: boolean;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${
          done
            ? "bg-green-500"
            : active
            ? "bg-[#802B7D]"
            : "bg-zinc-200 text-zinc-500"
        }`}
      >
        {done ? "✓" : ""}
      </div>
      <span className={`text-sm ${done ? "text-zinc-600" : active ? "font-semibold text-[#223645]" : "text-zinc-400"}`}>
        {label}
      </span>
    </div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);

  const user = getUser();

  useEffect(() => {
    if (!getUserToken()) {
      router.replace("/login");
      return;
    }
    fetchApplication()
      .then((app) => setApplication(app))
      .finally(() => setLoading(false));
  }, [router]);

  function handleLogout() {
    clearUserToken();
    router.replace("/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f3eef6]">
        <p className="text-sm text-zinc-400">Loading…</p>
      </main>
    );
  }

  const isClaimant = application?.applicationType === "CLAIMANT";
  const status = String(application?.status ?? "DRAFT");
  const step = Number(application?.currentStep ?? 1);
  const docStatus = String(application?.docusignStatus ?? "PENDING");

  const supporterSteps = [
    { label: "Account created", done: true },
    { label: "Path selected", done: step >= 3 },
    { label: "Membership & payment", done: step >= 5 },
    { label: "Registration complete", done: status === "COMPLETE" || status === "APPROVED" },
  ];

  const claimantSteps = [
    { label: "Account created", done: true },
    { label: "Path selected", done: step >= 3 },
    { label: "Membership & payment", done: step >= 5 },
    { label: "Identity verification", done: step >= 7 },
    { label: "Legal documents signed", done: docStatus === "SIGNED" || docStatus === "COMPLETED" },
    { label: "PMI details", done: step >= 9 },
    { label: "Evidence uploads", done: step >= 11 },
    { label: "Stage 1 details", done: step >= 13 },
    { label: "Stage 2 details", done: step >= 14 },
    { label: "Final confirmation", done: status === "COMPLETE" || status === "APPROVED" },
  ];

  const steps = isClaimant ? claimantSteps : supporterSteps;
  const completedCount = steps.filter((s) => s.done).length;
  const activeIdx = steps.findIndex((s) => !s.done);

  const isIncomplete = status !== "COMPLETE" && status !== "APPROVED" && status !== "REJECTED";

  return (
    <main className="min-h-screen bg-[#f3eef6] px-4 py-10">
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#223645]">My Dashboard</h1>
            <p className="text-sm text-zinc-500">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm text-zinc-600 transition hover:bg-zinc-50"
          >
            Sign out
          </button>
        </div>

        {/* Application card */}
        {application ? (
          <>
            <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-lg">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-zinc-400">
                    {isClaimant ? "Claimant Application" : "Supporter Membership"}
                  </div>
                  <div className="mt-1 flex items-center gap-3">
                    <StatusBadge status={status} />
                    {isClaimant && docStatus !== "PENDING" && (
                      <span className="text-xs text-zinc-500">
                        Documents: {DOCUSIGN_LABELS[docStatus] ?? docStatus}
                      </span>
                    )}
                  </div>
                </div>
                {isIncomplete && (
                  <Link
                    href="/register"
                    className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                    style={{ backgroundColor: "#802B7D" }}
                  >
                    Continue →
                  </Link>
                )}
              </div>

              {/* Membership summary */}
              {application.membershipType ? (
                <div className="mt-4 rounded-xl bg-[#f3eef6] p-4">
                  <div className="grid grid-cols-3 gap-4 text-center text-sm">
                    <div>
                      <div className="text-xs text-zinc-500">Membership</div>
                      <div className="mt-1 font-semibold text-[#223645] capitalize">
                        {String(application.membershipType).toLowerCase()}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500">Annual fee</div>
                      <div className="mt-1 font-semibold text-[#223645]">
                        {application.membershipFee ? `£${application.membershipFee}` : "—"}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500">Payment</div>
                      <div className={`mt-1 font-semibold ${
                        application.paymentStatus === "PAID" ? "text-green-600" : "text-amber-600"
                      }`}>
                        {String(application.paymentStatus ?? "Pending")}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Progress */}
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="font-medium text-zinc-700">Registration progress</span>
                  <span className="text-zinc-400">{completedCount} / {steps.length} steps</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-purple-100">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${(completedCount / steps.length) * 100}%`,
                      backgroundColor: "#802B7D",
                    }}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  {steps.map((s, i) => (
                    <ProgressStep
                      key={s.label}
                      label={s.label}
                      done={s.done}
                      active={i === activeIdx}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Next action */}
            {isIncomplete && (
              <div className="rounded-2xl border border-purple-100 bg-white p-6 shadow-sm">
                <h2 className="font-semibold text-[#223645]">Next step</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {steps[activeIdx]?.label
                    ? `Complete: ${steps[activeIdx].label}`
                    : "Continue your registration"}
                </p>
                <Link
                  href="/register"
                  className="mt-4 inline-block rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
                  style={{ backgroundColor: "#802B7D" }}
                >
                  Resume registration →
                </Link>
              </div>
            )}

            {status === "APPROVED" && (
              <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
                <div className="text-3xl">🎉</div>
                <h2 className="mt-2 font-semibold text-green-800">
                  Your application has been approved!
                </h2>
                <p className="mt-1 text-sm text-green-700">
                  The FIPO legal team will be in touch with next steps.
                </p>
              </div>
            )}

            {status === "UNDER_REVIEW" && (
              <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6">
                <h2 className="font-semibold text-blue-800">Application under review</h2>
                <p className="mt-1 text-sm text-blue-700">
                  Your application is being reviewed by the FIPO legal team.
                  This usually takes 5–10 working days. You will receive an
                  email once a decision has been made.
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-purple-100 bg-white p-8 text-center shadow-lg">
            <div className="text-4xl">📋</div>
            <h2 className="mt-3 text-lg font-semibold text-[#223645]">No application yet</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Start your FIPO registration to join the Fair Pay Action Group.
            </p>
            <Link
              href="/register"
              className="mt-5 inline-block rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: "#802B7D" }}
            >
              Start registration →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
