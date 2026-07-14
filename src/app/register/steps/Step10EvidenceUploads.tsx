"use client";

import { useRef, useState } from "react";
import type { Application } from "../page";
import { saveEvidenceFile } from "@/lib/application-api";

interface Props {
  application: Application | null;
  advance: (data?: Record<string, unknown>) => Promise<void>;
}

interface UploadedFile {
  name: string;
  size: number;
  status: "uploading" | "done" | "error";
  error?: string;
}

export default function Step10EvidenceUploads({ advance }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploads, setUploads] = useState<UploadedFile[]>([]);
  const [submitting, setSubmitting] = useState(false);

  function updateFile(name: string, patch: Partial<UploadedFile>) {
    setUploads((prev) =>
      prev.map((f) => (f.name === name ? { ...f, ...patch } : f))
    );
  }

  async function handleFiles(files: FileList) {
    for (const file of Array.from(files)) {
      if (uploads.some((u) => u.name === file.name)) continue;
      setUploads((prev) => [
        ...prev,
        { name: file.name, size: file.size, status: "uploading" },
      ]);
      try {
        await saveEvidenceFile({
          fileName: file.name,
          fileUrl: `/uploads/evidence/${file.name}`,
          fileSize: file.size,
          mimeType: file.type,
        });
        updateFile(file.name, { status: "done" });
      } catch (err) {
        updateFile(file.name, {
          status: "error",
          error: err instanceof Error ? err.message : "Upload failed",
        });
      }
    }
  }

  function formatSize(bytes: number) {
    return bytes < 1024 * 1024
      ? `${(bytes / 1024).toFixed(0)} KB`
      : `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  }

  async function onContinue() {
    setSubmitting(true);
    await advance();
    setSubmitting(false);
  }

  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-lg">
      <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#802B7D]">
        Step 5 of 10 — Claimant registration
      </div>
      <h2 className="text-2xl font-bold text-[#223645]">Evidence Uploads</h2>
      <p className="mt-2 text-sm text-zinc-500">
        Upload supporting documents for your claim. Accepted types: invoices,
        contracts, correspondence, payment schedules.
      </p>

      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
        }}
        className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-purple-200 bg-[#f3eef6] p-10 transition hover:border-[#802B7D]"
      >
        <span className="text-4xl">📂</span>
        <p className="mt-3 text-sm font-medium text-zinc-700">
          Click or drag &amp; drop files here
        </p>
        <p className="mt-1 text-xs text-zinc-400">
          PDF, JPG, PNG, DOCX — max 20 MB each
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,.pdf,.doc,.docx"
          className="hidden"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
      </div>

      {uploads.length > 0 && (
        <ul className="mt-4 space-y-2">
          {uploads.map((f) => (
            <li
              key={f.name}
              className="flex items-center justify-between rounded-lg border border-zinc-200 px-3 py-2 text-sm"
            >
              <div className="flex items-center gap-2 truncate">
                <span>
                  {f.status === "uploading"
                    ? "⏳"
                    : f.status === "done"
                    ? "✅"
                    : "❌"}
                </span>
                <span className="truncate text-zinc-700">{f.name}</span>
                <span className="text-xs text-zinc-400">{formatSize(f.size)}</span>
              </div>
              {f.error && (
                <span className="ml-2 shrink-0 text-xs text-red-600">{f.error}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={onContinue}
        disabled={submitting || uploads.some((u) => u.status === "uploading")}
        className="mt-6 w-full rounded-lg py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: "#802B7D" }}
      >
        {submitting ? "Saving…" : "Continue →"}
      </button>

      {uploads.length === 0 && (
        <button
          onClick={() => advance()}
          className="mt-3 w-full rounded-lg py-2 text-sm text-zinc-400 hover:text-zinc-600"
        >
          Skip — I will upload evidence later
        </button>
      )}
    </div>
  );
}
