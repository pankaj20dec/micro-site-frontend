"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchAdminModalContents,
  saveRegisterDisclaimerContent,
  saveSiteDisclaimerContent,
} from "@/lib/admin-modal-content-api";
import { clearAdminToken, getAdminToken } from "@/lib/admin-auth";
import type {
  RegisterDisclaimerContent,
  SiteDisclaimerContent,
} from "@/lib/modal-content-defaults";

type Tab = "site" | "register";

const fieldCls =
  "mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[#660066] focus:ring-2 focus:ring-[#660066]/20";

function ParagraphList({
  label,
  values,
  onChange,
  hint,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
  hint?: string;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700">{label}</label>
      {hint && <p className="mt-1 text-xs text-zinc-500">{hint}</p>}
      <div className="mt-2 space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <textarea
              value={value}
              rows={3}
              onChange={(e) => {
                const next = [...values];
                next[index] = e.target.value;
                onChange(next);
              }}
              className={fieldCls}
            />
            <button
              type="button"
              onClick={() => onChange(values.filter((_, i) => i !== index))}
              className="shrink-0 self-start rounded-lg border border-zinc-300 px-2 py-1 text-xs text-zinc-600 hover:bg-zinc-50"
              disabled={values.length <= 1}
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => onChange([...values, ""])}
          className="rounded-lg border border-dashed border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:border-[#660066] hover:text-[#660066]"
        >
          + Add paragraph
        </button>
      </div>
    </div>
  );
}

export function AdminModalsEditor() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("site");
  const [siteContent, setSiteContent] = useState<SiteDisclaimerContent | null>(null);
  const [registerContent, setRegisterContent] = useState<RegisterDisclaimerContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadContent = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminModalContents();
      setSiteContent(data.siteDisclaimer);
      setRegisterContent(data.registerDisclaimer);
    } catch (e) {
      const status = (e as { status?: number }).status;
      if (status === 401 || status === 403) {
        clearAdminToken();
        router.replace("/admin/login");
        return;
      }
      setError(e instanceof Error ? e.message : "Failed to load modal content");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      if (tab === "site" && siteContent) {
        const saved = await saveSiteDisclaimerContent({
          ...siteContent,
          paragraphs: siteContent.paragraphs.map((p) => p.trim()).filter(Boolean),
        });
        setSiteContent(saved);
        setSuccess("Site disclaimer saved.");
      } else if (tab === "register" && registerContent) {
        const saved = await saveRegisterDisclaimerContent({
          ...registerContent,
          paragraphs: registerContent.paragraphs.map((p) => p.trim()).filter(Boolean),
          competitionLaw: {
            ...registerContent.competitionLaw,
            paragraphs: registerContent.competitionLaw.paragraphs
              .map((p) => p.trim())
              .filter(Boolean),
          },
        });
        setRegisterContent(saved);
        setSuccess("Register disclaimer saved.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-zinc-600">Loading modal content…</p>;
  }

  if (!siteContent || !registerContent) {
    return <p className="text-sm text-red-600">Unable to load modal content.</p>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Modal popups</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Edit the site-wide disclaimer and register page popup shown to visitors.
        </p>
      </div>

      <div className="flex gap-2 border-b border-zinc-200">
        <button
          type="button"
          onClick={() => {
            setTab("site");
            setSuccess(null);
            setError(null);
          }}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
            tab === "site"
              ? "border-[#660066] text-[#660066]"
              : "border-transparent text-zinc-600 hover:text-zinc-900"
          }`}
        >
          Site disclaimer
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("register");
            setSuccess(null);
            setError(null);
          }}
          className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
            tab === "register"
              ? "border-[#660066] text-[#660066]"
              : "border-transparent text-zinc-600 hover:text-zinc-900"
          }`}
        >
          Register disclaimer
        </button>
      </div>

      {error && (
        <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900">
          {error}
        </p>
      )}
      {success && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
          {success}
        </p>
      )}

      <form onSubmit={handleSave} className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        {tab === "site" ? (
          <>
            <div>
              <label htmlFor="site-title" className="block text-sm font-medium text-zinc-700">
                Title
              </label>
              <input
                id="site-title"
                required
                value={siteContent.title}
                onChange={(e) => setSiteContent({ ...siteContent, title: e.target.value })}
                className={fieldCls}
              />
            </div>

            <ParagraphList
              label="Paragraphs"
              values={siteContent.paragraphs}
              onChange={(paragraphs) => setSiteContent({ ...siteContent, paragraphs })}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="site-exit-label" className="block text-sm font-medium text-zinc-700">
                  Exit button label
                </label>
                <input
                  id="site-exit-label"
                  value={siteContent.exitButtonLabel}
                  onChange={(e) =>
                    setSiteContent({ ...siteContent, exitButtonLabel: e.target.value })
                  }
                  className={fieldCls}
                />
              </div>
              <div>
                <label htmlFor="site-confirm-label" className="block text-sm font-medium text-zinc-700">
                  Confirm button label
                </label>
                <input
                  id="site-confirm-label"
                  value={siteContent.confirmButtonLabel}
                  onChange={(e) =>
                    setSiteContent({ ...siteContent, confirmButtonLabel: e.target.value })
                  }
                  className={fieldCls}
                />
              </div>
            </div>

            <div>
              <label htmlFor="site-exit-url" className="block text-sm font-medium text-zinc-700">
                Exit URL
              </label>
              <input
                id="site-exit-url"
                value={siteContent.exitUrl}
                onChange={(e) => setSiteContent({ ...siteContent, exitUrl: e.target.value })}
                className={fieldCls}
              />
            </div>
          </>
        ) : (
          <>
            <div>
              <label htmlFor="register-title" className="block text-sm font-medium text-zinc-700">
                Title
              </label>
              <input
                id="register-title"
                required
                value={registerContent.title}
                onChange={(e) => setRegisterContent({ ...registerContent, title: e.target.value })}
                className={fieldCls}
              />
            </div>

            <ParagraphList
              label="Main paragraphs"
              values={registerContent.paragraphs}
              onChange={(paragraphs) => setRegisterContent({ ...registerContent, paragraphs })}
              hint='Use [Explanations] in a paragraph to insert a link to the Explanations page.'
            />

            <div>
              <label
                htmlFor="competition-title"
                className="block text-sm font-medium text-zinc-700"
              >
                Competition law section title
              </label>
              <input
                id="competition-title"
                required
                value={registerContent.competitionLaw.title}
                onChange={(e) =>
                  setRegisterContent({
                    ...registerContent,
                    competitionLaw: {
                      ...registerContent.competitionLaw,
                      title: e.target.value,
                    },
                  })
                }
                className={fieldCls}
              />
            </div>

            <ParagraphList
              label="Competition law paragraphs"
              values={registerContent.competitionLaw.paragraphs}
              onChange={(paragraphs) =>
                setRegisterContent({
                  ...registerContent,
                  competitionLaw: {
                    ...registerContent.competitionLaw,
                    paragraphs,
                  },
                })
              }
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="register-exit-label" className="block text-sm font-medium text-zinc-700">
                  Exit button label
                </label>
                <input
                  id="register-exit-label"
                  value={registerContent.exitButtonLabel}
                  onChange={(e) =>
                    setRegisterContent({ ...registerContent, exitButtonLabel: e.target.value })
                  }
                  className={fieldCls}
                />
              </div>
              <div>
                <label
                  htmlFor="register-confirm-label"
                  className="block text-sm font-medium text-zinc-700"
                >
                  Confirm button label
                </label>
                <input
                  id="register-confirm-label"
                  value={registerContent.confirmButtonLabel}
                  onChange={(e) =>
                    setRegisterContent({
                      ...registerContent,
                      confirmButtonLabel: e.target.value,
                    })
                  }
                  className={fieldCls}
                />
              </div>
            </div>

            <div>
              <label htmlFor="register-exit-url" className="block text-sm font-medium text-zinc-700">
                Exit URL
              </label>
              <input
                id="register-exit-url"
                value={registerContent.exitUrl}
                onChange={(e) => setRegisterContent({ ...registerContent, exitUrl: e.target.value })}
                className={fieldCls}
              />
            </div>
          </>
        )}

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#660066] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#550055] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
