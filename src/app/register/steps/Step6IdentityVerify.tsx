"use client";

import { useRef, useState } from "react";
import type { Application } from "../page";
import { saveEvidenceFile } from "@/lib/application-api";

interface Props {
  application: Application | null;
  advance: (data?: Record<string, unknown>) => Promise<void>;
}

export default function Step6IdentityVerify({ advance }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onContinue() {
    if (!file) return;
    setError(null);
    setUploading(true);
    try {
      // For dev: upload to /api/application/evidence with a local URL placeholder
      await saveEvidenceFile({
        fileName: file.name,
        fileUrl: `/uploads/identity/${file.name}`,
        fileSize: file.size,
        mimeType: file.type,
      });
      await advance({ idVerifiedAt: new Date().toISOString() });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-lg">
      <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#802B7D]">
        Step 1 of 10 — Claimant registration
      </div>
      <h2 className="text-2xl font-bold text-[#223645]">Identity Verification</h2>
      <p className="mt-2 text-sm text-zinc-500">
        Please upload a clear photo of a government-issued ID — passport,
        driving licence, or national identity card.
      </p>

      <div
        onClick={() => inputRef.current?.click()}
        className="mt-6 flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-purple-200 bg-[#f3eef6] p-10 transition hover:border-[#802B7D]"
      >
        <span className="text-4xl">{file ? "📄" : "🪪"}</span>
        <p className="mt-3 text-sm font-medium text-zinc-700">
          {file ? file.name : "Click to upload your ID document"}
        </p>
        <p className="mt-1 text-xs text-zinc-400">
          JPG, PNG or PDF — max 10 MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      <button
        onClick={onContinue}
        disabled={!file || uploading}
        className="mt-6 w-full rounded-lg py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
        style={{ backgroundColor: "#802B7D" }}
      >
        {uploading ? "Uploading…" : "Continue →"}
      </button>
    </div>
  );
}
