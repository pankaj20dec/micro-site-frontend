"use client";

import { useState } from "react";
import type { AdminApplication, AdminEvidenceFile } from "@/lib/admin-users-api";
import { evidenceUploadLabel, isWitnessEvidenceUploadKey } from "@/lib/application-api";
import { getApiBase } from "@/lib/api";
import { getAdminToken } from "@/lib/admin-auth";

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (typeof value === "object") return JSON.stringify(value, null, 2);
  return String(value);
}

function statusBadge(value: string | null | undefined, type: "status" | "payment" | "default" = "default") {
  if (!value) return <span className="text-slate-400">—</span>;

  const normalized = value.toUpperCase();
  const styles: Record<string, string> = {
    DRAFT: "bg-slate-100 text-slate-700 ring-1 ring-slate-200/80",
    PENDING: "bg-amber-50 text-amber-700 ring-1 ring-amber-200/80",
    SUBMITTED: "bg-blue-50 text-blue-700 ring-1 ring-blue-200/80",
    COMPLETED: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80",
    PAID: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/80",
    FAILED: "bg-red-50 text-red-700 ring-1 ring-red-200/80",
    SUPPORTER: "bg-purple-50 text-[#660066] ring-1 ring-[#660066]/20",
    CLAIMANT: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-200/80",
  };

  const fallback =
    type === "payment"
      ? "bg-amber-50 text-amber-700 ring-1 ring-amber-200/80"
      : type === "status"
        ? "bg-slate-100 text-slate-700 ring-1 ring-slate-200/80"
        : "bg-slate-100 text-slate-700 ring-1 ring-slate-200/80";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[normalized] ?? fallback}`}
    >
      {value.replace(/_/g, " ")}
    </span>
  );
}

function DataSection({
  title,
  description,
  rows,
}: {
  title: string;
  description?: string;
  rows: { label: string; value: unknown; badge?: boolean; mono?: boolean }[];
}) {
  const visibleRows = rows.filter(
    (row) => row.value !== null && row.value !== undefined && row.value !== ""
  );
  if (visibleRows.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white">
      <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-3.5">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        {description && <p className="mt-0.5 text-xs text-slate-500">{description}</p>}
      </div>
      <dl className="divide-y divide-slate-100">
        {visibleRows.map((row) => (
          <div
            key={row.label}
            className="grid gap-2 px-5 py-3.5 sm:grid-cols-[minmax(180px,220px)_1fr] sm:items-start"
          >
            <dt className="text-sm font-medium text-slate-500">{row.label}</dt>
            <dd className="text-sm text-slate-900">
              {row.badge && typeof row.value === "string" ? (
                statusBadge(
                  row.value,
                  row.label.toLowerCase().includes("payment") ? "payment" : "status"
                )
              ) : (
                <span
                  className={`whitespace-pre-wrap break-words ${row.mono ? "font-mono text-xs text-slate-600" : ""}`}
                >
                  {formatValue(row.value)}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function JsonSection({
  title,
  data,
}: {
  title: string;
  data: Record<string, unknown> | null | undefined;
}) {
  if (!data || Object.keys(data).length === 0) return null;

  const rows = Object.entries(data).map(([key, value]) => ({
    label: key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase())
      .trim(),
    value:
      typeof value === "object" && value !== null && !Array.isArray(value)
        ? JSON.stringify(value, null, 2)
        : value,
    mono: typeof value === "object",
  }));

  return <DataSection title={title} rows={rows} />;
}

function DocusignSignedSection({
  applicationId,
  envelopeId,
  docusignStatus,
  legalSignedAt,
}: {
  applicationId: string;
  envelopeId: string | null;
  docusignStatus: string | null;
  legalSignedAt: string | null;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canDownload =
    !!envelopeId &&
    !envelopeId.startsWith("stub_") &&
    String(docusignStatus || "").toUpperCase() === "COMPLETED";

  if (!envelopeId) return null;

  async function openSignedPdf(download = false) {
    setLoading(true);
    setError(null);
    try {
      const token = getAdminToken();
      const res = await fetch(
        `${getApiBase()}/api/admin/applications/${applicationId}/docusign/download`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          typeof data.error === "string" ? data.error : "Could not load signed PDF"
        );
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (download) {
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `fipo-signed-${applicationId.slice(0, 8)}.pdf`;
        anchor.click();
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      } else {
        window.open(url, "_blank", "noopener,noreferrer");
        setTimeout(() => URL.revokeObjectURL(url), 60_000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load signed PDF");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white">
      <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-3.5">
        <h3 className="text-sm font-semibold text-slate-900">Signed DocuSign documents</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          Combined PDF from DocuSign (declaration + uploaded PMI evidence)
        </p>
      </div>
      <div className="px-5 py-4">
        <dl className="grid gap-2 text-sm sm:grid-cols-[minmax(140px,180px)_1fr]">
          <dt className="font-medium text-slate-500">Envelope ID</dt>
          <dd className="break-all font-mono text-xs text-slate-700">{envelopeId}</dd>
          <dt className="font-medium text-slate-500">Signed at</dt>
          <dd className="text-slate-700">{formatDate(legalSignedAt)}</dd>
        </dl>

        {canDownload ? (
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => openSignedPdf(false)}
              disabled={loading}
              className="inline-flex items-center gap-1 rounded-lg border border-[#660066]/20 bg-[#660066]/5 px-3 py-1.5 text-xs font-medium text-[#660066] transition hover:bg-[#660066]/10 disabled:opacity-60"
            >
              {loading ? "Loading…" : "View signed PDF ↗"}
            </button>
            <button
              type="button"
              onClick={() => openSignedPdf(true)}
              disabled={loading}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-60"
            >
              Download PDF
            </button>
          </div>
        ) : (
          <p className="mt-4 text-sm text-slate-500">
            Signed PDF will be available when DocuSign status is{" "}
            <strong>COMPLETED</strong>
            {docusignStatus ? ` (currently ${docusignStatus})` : ""}.
          </p>
        )}

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
        )}
      </div>
    </section>
  );
}

function AdminEvidenceFileList({
  applicationId,
  files,
}: {
  applicationId: string;
  files: AdminEvidenceFile[];
}) {
  async function openFile(fileId: string) {
    const token = getAdminToken();
    const res = await fetch(
      `${getApiBase()}/api/admin/applications/${applicationId}/evidence/${fileId}/download`,
      { headers: token ? { Authorization: `Bearer ${token}` } : {} }
    );
    if (!res.ok) throw new Error("Could not open file");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank", "noopener,noreferrer");
    setTimeout(() => URL.revokeObjectURL(url), 60_000);
  }

  return (
    <ul className="divide-y divide-slate-100">
      {files.map((file) => (
        <li key={file.id} className="flex flex-wrap items-start justify-between gap-3 px-5 py-4">
          <div className="min-w-0">
            <p className="font-medium text-slate-900">{file.fileName}</p>
            <p className="mt-1 text-xs text-slate-500">
              {evidenceUploadLabel(file.uploadKey)} · {file.mimeType} ·{" "}
              {(file.fileSize / 1024).toFixed(1)} KB · {formatDate(file.uploadedAt)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => openFile(file.id).catch(() => null)}
            className="inline-flex shrink-0 items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-[#660066] transition hover:border-[#660066]/30 hover:bg-[#660066]/5"
          >
            Open file ↗
          </button>
        </li>
      ))}
    </ul>
  );
}

function WitnessProofsSection({
  applicationId,
  files,
}: {
  applicationId: string;
  files: AdminEvidenceFile[];
}) {
  if (files.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white">
      <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-3.5">
        <h3 className="text-sm font-semibold text-slate-900">Witness Proofs</h3>
        <p className="mt-0.5 text-xs text-slate-500">
          {files.length} witness document{files.length === 1 ? "" : "s"} uploaded
        </p>
      </div>
      <AdminEvidenceFileList applicationId={applicationId} files={files} />
    </section>
  );
}

function EvidenceSection({
  applicationId,
  files,
}: {
  applicationId: string;
  files: AdminEvidenceFile[];
}) {
  if (files.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white">
      <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-3.5">
        <h3 className="text-sm font-semibold text-slate-900">
          Evidence &amp; uploads
        </h3>
        <p className="mt-0.5 text-xs text-slate-500">{files.length} file{files.length === 1 ? "" : "s"} attached</p>
      </div>
      <AdminEvidenceFileList applicationId={applicationId} files={files} />
    </section>
  );
}

const SUPPORTER_FIELDS: { key: string; label: string }[] = [
  { key: "title", label: "Title" },
  { key: "forename", label: "Forename" },
  { key: "surname", label: "Surname" },
  { key: "gmcNumber", label: "GMC number" },
  { key: "address", label: "Address" },
  { key: "dob", label: "Date of birth" },
  { key: "phone", label: "Phone" },
  { key: "confirmedPractitioner", label: "Confirmed practitioner" },
  { key: "confirmedIndependentDecision", label: "Confirmed independent decision" },
];

const PRACTICE_FIELDS: { key: string; label: string }[] = [
  { key: "fullName", label: "Full name" },
  { key: "practiceEmail", label: "Practice email" },
  { key: "practicePhone", label: "Practice phone" },
  { key: "specialty", label: "Specialty" },
  { key: "deanery", label: "Deanery" },
  { key: "annualIncome", label: "Annual income" },
  { key: "yearStartedPrivatePractice", label: "Year started private practice" },
  { key: "yearEndedPrivatePractice", label: "Year ended private practice" },
  { key: "bupaNumber", label: "BUPA number" },
  { key: "axaNumber", label: "AXA number" },
  { key: "recognisedByOtherInsurers", label: "Recognised by other insurers" },
  { key: "pmiPercentage", label: "PMI percentage" },
];

const PMI_FIELDS: { key: string; label: string }[] = [
  { key: "incomeSource", label: "Income source" },
  { key: "paidDirectlyAxa", label: "Paid directly by AXA" },
  { key: "axaYears", label: "AXA years" },
  { key: "paidDirectlyBupa", label: "Paid directly by BUPA" },
  { key: "bupaYears", label: "BUPA years" },
  { key: "paidThroughCompany", label: "Paid through company" },
  { key: "companyName", label: "Company name" },
  { key: "companyNumber", label: "Company number" },
  { key: "companyDirectors", label: "Company directors" },
  { key: "paidThroughLlp", label: "Paid through LLP" },
  { key: "llpName", label: "LLP name" },
  { key: "llpRegistrationNumber", label: "LLP registration number" },
  { key: "llpMembers", label: "LLP members" },
  { key: "paidThroughAlternative", label: "Paid through alternative" },
];

const WITNESS_FIELDS: { key: string; label: string }[] = [
  { key: "fullName", label: "Full name" },
  { key: "email", label: "Email" },
  { key: "address", label: "Address" },
];

function pickFields(
  data: Record<string, unknown> | null | undefined,
  fields: { key: string; label: string }[]
) {
  if (!data) return [];
  return fields.map(({ key, label }) => ({
    label,
    value: data[key],
  }));
}

export function AdminApplicationViewer({
  application,
}: {
  application: AdminApplication;
}) {
  const stage1 =
    application.stage1Data && typeof application.stage1Data === "object"
      ? (application.stage1Data as Record<string, unknown>)
      : null;
  const pmi =
    stage1?.pmi && typeof stage1.pmi === "object"
      ? (stage1.pmi as Record<string, unknown>)
      : null;
  const stage2 =
    application.stage2Data && typeof application.stage2Data === "object"
      ? (application.stage2Data as Record<string, unknown>)
      : null;
  const witness =
    stage2?.witness && typeof stage2.witness === "object"
      ? (stage2.witness as Record<string, unknown>)
      : null;
  const witnessProofFiles = application.evidenceFiles.filter((file) =>
    isWitnessEvidenceUploadKey(file.uploadKey)
  );
  const otherEvidenceFiles = application.evidenceFiles.filter(
    (file) => !isWitnessEvidenceUploadKey(file.uploadKey)
  );

  return (
    <div className="space-y-4">
      <DataSection
        title="Application overview"
        description="Status, payment, and progress"
        rows={[
          { label: "Application ID", value: application.id, mono: true },
          { label: "Type", value: application.applicationType, badge: true },
          { label: "Status", value: application.status, badge: true },
          { label: "Current step", value: application.currentStep },
          { label: "Membership type", value: application.membershipType },
          { label: "Membership fee", value: application.membershipFee },
          { label: "Payment provider", value: application.paymentProvider },
          { label: "Payment status", value: application.paymentStatus, badge: true },
          { label: "DocuSign status", value: application.docusignStatus, badge: true },
          {
            label: "DocuSign envelope",
            value: application.docusignEnvelopeId,
            mono: true,
          },
          { label: "ID verified at", value: formatDate(application.idVerifiedAt) },
          { label: "Legal signed at", value: formatDate(application.legalSignedAt) },
          { label: "Risk accepted at", value: formatDate(application.riskAcceptedAt) },
          { label: "Created", value: formatDate(application.createdAt) },
          { label: "Last updated", value: formatDate(application.updatedAt) },
        ]}
      />

      <DataSection
        title="Supporter registration"
        description="Personal and practitioner details"
        rows={pickFields(stage1, SUPPORTER_FIELDS)}
      />

      <DataSection
        title="Practice information"
        description="Professional practice details"
        rows={pickFields(stage1, PRACTICE_FIELDS)}
      />

      <DataSection
        title="PMI relationship"
        description="Private medical insurance arrangements"
        rows={pickFields(pmi, PMI_FIELDS)}
      />

      <DataSection
        title="Witness details"
        description="Claimant stage 2 witness information"
        rows={pickFields(witness, WITNESS_FIELDS)}
      />

      <WitnessProofsSection
        applicationId={application.id}
        files={witnessProofFiles}
      />

      {stage2 &&
        Object.keys(stage2).some((key) => key !== "witness") && (
          <JsonSection
            title="Other stage 2 / claimant data"
            data={Object.fromEntries(
              Object.entries(stage2).filter(([key]) => key !== "witness")
            )}
          />
        )}

      <DocusignSignedSection
        applicationId={application.id}
        envelopeId={application.docusignEnvelopeId}
        docusignStatus={application.docusignStatus}
        legalSignedAt={application.legalSignedAt}
      />

      <EvidenceSection applicationId={application.id} files={otherEvidenceFiles} />

      {application.paymentEvents.length > 0 && (
        <section className="overflow-hidden rounded-xl border border-slate-200/80 bg-white">
          <div className="border-b border-slate-100 bg-slate-50/80 px-5 py-3.5">
            <h3 className="text-sm font-semibold text-slate-900">Payment events</h3>
            <p className="mt-0.5 text-xs text-slate-500">
              {application.paymentEvents.length} recorded event
              {application.paymentEvents.length === 1 ? "" : "s"}
            </p>
          </div>
          <ul className="divide-y divide-slate-100">
            {application.paymentEvents.map((event) => (
              <li key={event.id} className="px-5 py-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-medium text-slate-900">{event.provider}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-sm text-slate-600">{event.type}</span>
                  {statusBadge(event.status, "payment")}
                </div>
                <p className="mt-1 text-sm text-slate-500">
                  {event.amount} {event.currency} · {formatDate(event.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
