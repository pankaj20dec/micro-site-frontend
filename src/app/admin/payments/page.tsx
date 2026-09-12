"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  clearAdminToken,
  getAdmin,
  getAdminToken,
} from "@/lib/admin-auth";
import { useMounted } from "@/hooks/use-mounted";
import {
  fetchRefundableApplications,
  refundAdminApplication,
  type RefundableApplication,
} from "@/lib/admin-applications-api";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatFee(fee: string | number | null | undefined) {
  if (fee === null || fee === undefined || fee === "") return "—";
  const n = Number(fee);
  if (Number.isNaN(n)) return String(fee);
  return `£${n.toFixed(0)}`;
}

export default function AdminPaymentsPage() {
  const router = useRouter();
  const mounted = useMounted();
  const [applications, setApplications] = useState<RefundableApplication[]>([]);
  const [windowDays, setWindowDays] = useState(15);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [refundingId, setRefundingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const token = getAdminToken();
    const admin = getAdmin();
    if (!token) {
      router.replace("/admin/login");
      return;
    }
    if (admin?.role !== "SUPER_ADMIN") {
      setError("Stripe refunds are available to Super Admin only.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchRefundableApplications();
      setApplications(data.applications);
      setWindowDays(data.windowDays ?? 15);
    } catch (e) {
      const status = (e as { status?: number }).status;
      if (status === 401 || status === 403) {
        clearAdminToken();
        router.replace("/admin/login");
        return;
      }
      setError(e instanceof Error ? e.message : "Failed to load payments");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!mounted) return;
    void load();
  }, [mounted, load]);

  async function handleRefund(application: RefundableApplication) {
    const fee = formatFee(application.membershipFee);
    const name = `${application.user.firstName} ${application.user.lastName}`.trim();
    const ok = window.confirm(
      `Refund ${fee} Stripe payment for ${name || application.user.email}?\n\nThis cannot be undone and must be within ${windowDays} days of payment.`
    );
    if (!ok) return;

    setRefundingId(application.id);
    setMessage(null);
    setError(null);
    try {
      const result = await refundAdminApplication(application.id);
      setMessage(result.message || "Payment refunded.");
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to refund payment");
    } finally {
      setRefundingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          Stripe refunds
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Super Admin can refund paid Stripe memberships within {windowDays} days
          of payment.
        </p>
      </div>

      {message && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-800">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-800">
          {error}
        </div>
      )}

      <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4">
          <h2 className="font-semibold text-slate-900">Refundable payments</h2>
          <p className="mt-0.5 text-sm text-slate-500">
            {loading
              ? "Loading…"
              : `${applications.length} payment${applications.length === 1 ? "" : "s"} still inside the refund window`}
          </p>
        </div>

        {loading ? (
          <div className="animate-pulse space-y-3 p-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="px-5 py-14 text-center">
            <p className="font-medium text-slate-900">No refundable Stripe payments</p>
            <p className="mt-1 text-sm text-slate-500">
              Paid Stripe payments appear here for {windowDays} days after payment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-3">Member</th>
                  <th className="px-5 py-3">Fee</th>
                  <th className="px-5 py-3">Paid</th>
                  <th className="px-5 py-3">Days left</th>
                  <th className="px-5 py-3">Intent</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((application) => (
                  <tr key={application.id} className="align-middle">
                    <td className="px-5 py-4">
                      <Link
                        href={`/admin/users/${application.user.id}`}
                        className="font-medium text-slate-900 hover:text-[#660066]"
                      >
                        {application.user.firstName} {application.user.lastName}
                      </Link>
                      <p className="text-xs text-slate-500">{application.user.email}</p>
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {formatFee(application.membershipFee)}
                    </td>
                    <td className="px-5 py-4 text-slate-600">
                      {formatDate(application.paidAt)}
                    </td>
                    <td className="px-5 py-4">
                      <span className="inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-200/80">
                        {application.daysRemaining} day
                        {application.daysRemaining === 1 ? "" : "s"}
                      </span>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-500">
                      {application.stripePaymentIntentId}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        disabled={refundingId === application.id}
                        onClick={() => void handleRefund(application)}
                        className="rounded-lg bg-[#660066] px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-[#520052] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {refundingId === application.id ? "Refunding…" : "Refund"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
