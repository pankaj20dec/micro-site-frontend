"use client";

import { useEffect, useState } from "react";
import type { Application } from "../page";
import { getApiBase } from "@/lib/api";
import { getUserToken } from "@/lib/user-auth";

interface Props {
  application: Application | null;
  advance: (data?: Record<string, unknown>) => Promise<void>;
}

export default function Step7LegalDocuSign({ application, advance }: Props) {
  const [signingUrl, setSigningUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signed, setSigned] = useState(
    (application?.docusignStatus as string) === "SIGNED"
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (signed) return;
    // Fetch embedded signing URL from backend
    setLoading(true);
    fetch(`${getApiBase()}/api/application/docusign/start`, {
      headers: { Authorization: `Bearer ${getUserToken()}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.signingUrl) setSigningUrl(d.signingUrl);
        if (d.stub) {
          // Dev: no real DocuSign — allow skipping
          setSigningUrl("STUB");
        }
      })
      .catch(() => setError("Could not load signing document."))
      .finally(() => setLoading(false));
  }, [signed]);

  async function markSigned() {
    await advance({ docusignStatus: "SIGNED" });
    setSigned(true);
  }

  return (
    <div className="rounded-2xl border border-purple-100 bg-white p-8 shadow-lg">
      <div className="mb-1 text-xs font-semibold uppercase tracking-widest text-[#802B7D]">
        Step 2 of 10 — Claimant registration
      </div>
      <h2 className="text-2xl font-bold text-[#223645]">Legal Documents</h2>
      <p className="mt-2 text-sm text-zinc-500">
        You must read and sign the Terms of Engagement and Conditional Fee
        Agreement before proceeding.
      </p>

      {loading && (
        <p className="mt-6 text-sm text-zinc-400">Loading document…</p>
      )}

      {error && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {signingUrl && signingUrl !== "STUB" && (
        <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200">
          <iframe
            src={signingUrl}
            title="DocuSign Document"
            className="h-[500px] w-full"
          />
        </div>
      )}

      {signingUrl === "STUB" && (
        <div className="mt-6 rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
          <strong>Dev mode:</strong> DocuSign is not configured. Click below
          to simulate a successful signing.
        </div>
      )}

      {signed && (
        <div className="mt-6 rounded-xl bg-green-50 p-4 text-center text-sm font-medium text-green-700">
          ✓ Document signed successfully
        </div>
      )}

      <div className="mt-6 flex gap-3">
        {!signed && signingUrl && (
          <button
            onClick={markSigned}
            className="flex-1 rounded-lg py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: "#802B7D" }}
          >
            {signingUrl === "STUB" ? "Simulate signing →" : "I have signed the document →"}
          </button>
        )}
        {signed && (
          <button
            onClick={() => advance()}
            className="flex-1 rounded-lg py-3 text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: "#802B7D" }}
          >
            Continue →
          </button>
        )}
      </div>
    </div>
  );
}
