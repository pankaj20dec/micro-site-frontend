"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchAdminSeoSettings, saveSeoSettings } from "@/lib/admin-seo-api";
import { clearAdminToken, getAdminToken } from "@/lib/admin-auth";
import {
  SEO_PAGE_KEYS,
  SEO_PAGE_LABELS,
  SEO_PAGE_PATHS,
  type PageSeoFields,
  type SeoPageKey,
  type SiteSeoSettings,
} from "@/lib/seo-content-defaults";

type Tab = "global" | SeoPageKey;

const fieldCls =
  "mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[#660066] focus:ring-2 focus:ring-[#660066]/20";

function PageSeoFieldsEditor({
  pageKey,
  fields,
  onChange,
}: {
  pageKey: SeoPageKey;
  fields: PageSeoFields;
  onChange: (fields: PageSeoFields) => void;
}) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-zinc-600">
        Public URL:{" "}
        <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">{SEO_PAGE_PATHS[pageKey]}</code>
      </p>

      <div>
        <label htmlFor={`${pageKey}-title`} className="block text-sm font-medium text-zinc-700">
          Page title
        </label>
        <input
          id={`${pageKey}-title`}
          required
          value={fields.title}
          onChange={(e) => onChange({ ...fields, title: e.target.value })}
          className={fieldCls}
        />
        <p className="mt-1 text-xs text-zinc-500">
          Shown in the browser tab and search results.
        </p>
      </div>

      <div>
        <label
          htmlFor={`${pageKey}-description`}
          className="block text-sm font-medium text-zinc-700"
        >
          Meta description
        </label>
        <textarea
          id={`${pageKey}-description`}
          required
          rows={4}
          value={fields.description}
          onChange={(e) => onChange({ ...fields, description: e.target.value })}
          className={fieldCls}
        />
        <p className="mt-1 text-xs text-zinc-500">
          {fields.description.length} characters — aim for 120–160 for search snippets.
        </p>
      </div>

      <label className="flex items-center gap-2 text-sm text-zinc-700">
        <input
          type="checkbox"
          checked={fields.noIndex}
          onChange={(e) => onChange({ ...fields, noIndex: e.target.checked })}
          className="rounded border-zinc-300 text-[#660066] focus:ring-[#660066]/20"
        />
        Hide from search engines (noindex)
      </label>

      {pageKey === "faq" && (
        <p className="rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-600">
          FAQ structured data (JSON-LD) is still generated automatically from the FAQ page
          content. Edit questions and answers under{" "}
          <a href="/admin/faq" className="font-medium text-[#660066] hover:underline">
            FAQ page
          </a>
          .
        </p>
      )}
    </div>
  );
}

export function AdminSeoEditor() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("global");
  const [settings, setSettings] = useState<SiteSeoSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    const token = getAdminToken();
    if (!token) {
      router.replace("/admin/login");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await fetchAdminSeoSettings();
      setSettings(data);
    } catch (e) {
      const status = (e as { status?: number }).status;
      if (status === 401 || status === 403) {
        clearAdminToken();
        router.replace("/admin/login");
        return;
      }
      setError(e instanceof Error ? e.message : "Failed to load SEO settings");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  function updatePage(pageKey: SeoPageKey, fields: PageSeoFields) {
    if (!settings) return;
    setSettings({
      ...settings,
      pages: { ...settings.pages, [pageKey]: fields },
    });
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!settings) return;

    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const saved = await saveSeoSettings(settings);
      setSettings(saved);
      setSuccess("SEO settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-zinc-600">Loading SEO settings…</p>;
  }

  if (!settings) {
    return <p className="text-sm text-red-600">Unable to load SEO settings.</p>;
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "global", label: "Global" },
    ...SEO_PAGE_KEYS.map((key) => ({ id: key as Tab, label: SEO_PAGE_LABELS[key] })),
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">SEO</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Manage page titles, meta descriptions, indexing, and site-wide SEO defaults.
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-zinc-200">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            onClick={() => {
              setTab(id);
              setSuccess(null);
              setError(null);
            }}
            className={`border-b-2 px-4 py-2 text-sm font-medium transition ${
              tab === id
                ? "border-[#660066] text-[#660066]"
                : "border-transparent text-zinc-600 hover:text-zinc-900"
            }`}
          >
            {label}
          </button>
        ))}
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

      <form onSubmit={handleSave} className="space-y-6">
        <section className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          {tab === "global" ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-zinc-900">Site-wide settings</h2>

              <div>
                <label htmlFor="site-name" className="block text-sm font-medium text-zinc-700">
                  Site name
                </label>
                <input
                  id="site-name"
                  required
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className={fieldCls}
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Used in the default title template for pages that only set a short title.
                </p>
              </div>

              <div>
                <label htmlFor="site-url" className="block text-sm font-medium text-zinc-700">
                  Site URL
                </label>
                <input
                  id="site-url"
                  type="url"
                  value={settings.siteUrl}
                  onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                  placeholder="https://www.example.com"
                  className={fieldCls}
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Used for absolute canonical URLs and Open Graph links. Leave blank to use
                  relative paths.
                </p>
              </div>

              <div>
                <label htmlFor="og-image" className="block text-sm font-medium text-zinc-700">
                  Default Open Graph image
                </label>
                <input
                  id="og-image"
                  value={settings.defaultOgImage}
                  onChange={(e) =>
                    setSettings({ ...settings, defaultOgImage: e.target.value })
                  }
                  placeholder="/images/og-default.jpg or https://..."
                  className={fieldCls}
                />
                <p className="mt-1 text-xs text-zinc-500">
                  Shared preview image for social sharing on pages that do not set their own.
                </p>
              </div>
            </div>
          ) : (
            <PageSeoFieldsEditor
              pageKey={tab}
              fields={settings.pages[tab]}
              onChange={(fields) => updatePage(tab, fields)}
            />
          )}
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#660066] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#550055] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save SEO settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
