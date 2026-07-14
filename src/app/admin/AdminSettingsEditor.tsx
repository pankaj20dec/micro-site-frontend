"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  fetchAdminLayoutContent,
  saveAuthHeaderContent,
  saveSiteFooterContent,
  saveSiteHeaderContent,
} from "@/lib/admin-layout-content-api";
import { clearAdminToken, getAdminToken } from "@/lib/admin-auth";
import {
  mergeSiteHeader,
  type AuthHeaderContent,
  type QuickLink,
  type SiteFooterContent,
  type SiteHeaderContent,
} from "@/lib/layout-content-defaults";

type Tab = "site-header" | "auth-header" | "footer";

const fieldCls =
  "mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[#660066] focus:ring-2 focus:ring-[#660066]/20";

function QuickLinksEditor({
  links,
  onChange,
}: {
  links: QuickLink[];
  onChange: (links: QuickLink[]) => void;
}) {
  return (
    <div className="space-y-2">
      {links.map((link, index) => (
        <div key={index} className="flex flex-col gap-2 rounded-lg border border-zinc-200 p-3 sm:flex-row">
          <input
            value={link.label}
            placeholder="Label"
            onChange={(e) => {
              const next = [...links];
              next[index] = { ...next[index], label: e.target.value };
              onChange(next);
            }}
            className={fieldCls}
          />
          <input
            value={link.href}
            placeholder="/path"
            onChange={(e) => {
              const next = [...links];
              next[index] = { ...next[index], href: e.target.value };
              onChange(next);
            }}
            className={fieldCls}
          />
          <button
            type="button"
            onClick={() => onChange(links.filter((_, i) => i !== index))}
            className="shrink-0 rounded-lg border border-zinc-300 px-3 py-2 text-xs text-zinc-600 hover:bg-zinc-50"
            disabled={links.length <= 1}
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...links, { label: "", href: "" }])}
        className="rounded-lg border border-dashed border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:border-[#660066] hover:text-[#660066]"
      >
        + Add link
      </button>
    </div>
  );
}

export function AdminSettingsEditor() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("site-header");
  const [siteHeader, setSiteHeader] = useState<SiteHeaderContent | null>(null);
  const [authHeader, setAuthHeader] = useState<AuthHeaderContent | null>(null);
  const [siteFooter, setSiteFooter] = useState<SiteFooterContent | null>(null);
  const [addressText, setAddressText] = useState("");
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
      const data = await fetchAdminLayoutContent();
      setSiteHeader(mergeSiteHeader(data.siteHeader));
      setAuthHeader(data.authHeader);
      setSiteFooter(data.siteFooter);
      setAddressText(data.siteFooter.addressLines.join("\n"));
    } catch (e) {
      const status = (e as { status?: number }).status;
      if (status === 401 || status === 403) {
        clearAdminToken();
        router.replace("/admin/login");
        return;
      }
      setError(e instanceof Error ? e.message : "Failed to load settings");
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
      if (tab === "site-header" && siteHeader) {
        const saved = await saveSiteHeaderContent({
          ...siteHeader,
          navLinks: siteHeader.navLinks.filter(
            (link) => link.label.trim() && link.href.trim()
          ),
        });
        setSiteHeader(mergeSiteHeader(saved));
        setSuccess("Site header saved.");
      } else if (tab === "auth-header" && authHeader) {
        const saved = await saveAuthHeaderContent(authHeader);
        setAuthHeader(saved);
        setSuccess("Login/register header saved.");
      } else if (tab === "footer" && siteFooter) {
        const saved = await saveSiteFooterContent({
          ...siteFooter,
          addressLines: addressText
            .split("\n")
            .map((line) => line.trim())
            .filter(Boolean),
          quickLinks: siteFooter.quickLinks.filter((link) => link.label.trim() && link.href.trim()),
        });
        setSiteFooter(saved);
        setAddressText(saved.addressLines.join("\n"));
        setSuccess("Footer saved.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-zinc-600">Loading settings…</p>;
  }

  if (!siteHeader || !authHeader || !siteFooter) {
    return <p className="text-sm text-red-600">Unable to load settings.</p>;
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "site-header", label: "Site header" },
    { id: "auth-header", label: "Login/register header" },
    { id: "footer", label: "Footer" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900">Site settings</h1>
        <p className="mt-1 text-sm text-zinc-600">
          Manage the public site header, login/register header, and footer content.
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

      <form onSubmit={handleSave} className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        {tab === "site-header" && (
          <>
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Navigation menu
              </label>
              <p className="mt-1 text-xs text-zinc-500">
                Links shown in the desktop and mobile site header.
              </p>
              <div className="mt-2">
                <QuickLinksEditor
                  links={siteHeader.navLinks}
                  onChange={(navLinks) => setSiteHeader({ ...siteHeader, navLinks })}
                />
              </div>
            </div>

            <div>
              <label htmlFor="cta-label" className="block text-sm font-medium text-zinc-700">
                CTA button label
              </label>
              <input
                id="cta-label"
                required
                value={siteHeader.ctaLabel}
                onChange={(e) => setSiteHeader({ ...siteHeader, ctaLabel: e.target.value })}
                className={fieldCls}
              />
            </div>
            <div>
              <label htmlFor="cta-href" className="block text-sm font-medium text-zinc-700">
                CTA button link
              </label>
              <input
                id="cta-href"
                required
                value={siteHeader.ctaHref}
                onChange={(e) => setSiteHeader({ ...siteHeader, ctaHref: e.target.value })}
                className={fieldCls}
              />
            </div>
          </>
        )}

        {tab === "auth-header" && (
          <>
            <div>
              <label htmlFor="auth-email" className="block text-sm font-medium text-zinc-700">
                Email address
              </label>
              <input
                id="auth-email"
                required
                value={authHeader.email}
                onChange={(e) => setAuthHeader({ ...authHeader, email: e.target.value })}
                className={fieldCls}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="auth-helpline" className="block text-sm font-medium text-zinc-700">
                  Helpline number
                </label>
                <input
                  id="auth-helpline"
                  required
                  value={authHeader.helpline}
                  onChange={(e) => setAuthHeader({ ...authHeader, helpline: e.target.value })}
                  className={fieldCls}
                />
              </div>
              <div>
                <label htmlFor="auth-hours" className="block text-sm font-medium text-zinc-700">
                  Helpline hours
                </label>
                <input
                  id="auth-hours"
                  value={authHeader.helplineHours}
                  onChange={(e) => setAuthHeader({ ...authHeader, helplineHours: e.target.value })}
                  className={fieldCls}
                />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="auth-faq-label" className="block text-sm font-medium text-zinc-700">
                  FAQs link label
                </label>
                <input
                  id="auth-faq-label"
                  required
                  value={authHeader.faqLabel}
                  onChange={(e) => setAuthHeader({ ...authHeader, faqLabel: e.target.value })}
                  className={fieldCls}
                />
              </div>
              <div>
                <label htmlFor="auth-faq-href" className="block text-sm font-medium text-zinc-700">
                  FAQs link URL
                </label>
                <input
                  id="auth-faq-href"
                  required
                  value={authHeader.faqHref}
                  onChange={(e) => setAuthHeader({ ...authHeader, faqHref: e.target.value })}
                  className={fieldCls}
                />
              </div>
            </div>
          </>
        )}

        {tab === "footer" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="card-label" className="block text-sm font-medium text-zinc-700">
                  Contact card label
                </label>
                <input
                  id="card-label"
                  required
                  value={siteFooter.contactCardLabel}
                  onChange={(e) =>
                    setSiteFooter({ ...siteFooter, contactCardLabel: e.target.value })
                  }
                  className={fieldCls}
                />
              </div>
              <div>
                <label htmlFor="card-email" className="block text-sm font-medium text-zinc-700">
                  Contact card email
                </label>
                <input
                  id="card-email"
                  required
                  value={siteFooter.contactCardEmail}
                  onChange={(e) =>
                    setSiteFooter({ ...siteFooter, contactCardEmail: e.target.value })
                  }
                  className={fieldCls}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-700">Quick links</label>
              <div className="mt-2">
                <QuickLinksEditor
                  links={siteFooter.quickLinks}
                  onChange={(quickLinks) => setSiteFooter({ ...siteFooter, quickLinks })}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="footer-email" className="block text-sm font-medium text-zinc-700">
                  Contact info email
                </label>
                <input
                  id="footer-email"
                  required
                  value={siteFooter.contactEmail}
                  onChange={(e) => setSiteFooter({ ...siteFooter, contactEmail: e.target.value })}
                  className={fieldCls}
                />
              </div>
              <div>
                <label htmlFor="footer-phone" className="block text-sm font-medium text-zinc-700">
                  Contact info phone
                </label>
                <input
                  id="footer-phone"
                  required
                  value={siteFooter.contactPhone}
                  onChange={(e) => setSiteFooter({ ...siteFooter, contactPhone: e.target.value })}
                  className={fieldCls}
                />
              </div>
            </div>

            <div>
              <label htmlFor="footer-address" className="block text-sm font-medium text-zinc-700">
                Address (one line per row)
              </label>
              <textarea
                id="footer-address"
                rows={4}
                value={addressText}
                onChange={(e) => setAddressText(e.target.value)}
                className={fieldCls}
              />
            </div>

            <div>
              <label htmlFor="partner-url" className="block text-sm font-medium text-zinc-700">
                Partner logo link
              </label>
              <input
                id="partner-url"
                value={siteFooter.partnerUrl}
                onChange={(e) => setSiteFooter({ ...siteFooter, partnerUrl: e.target.value })}
                className={fieldCls}
              />
            </div>

            <div>
              <label htmlFor="legal-1" className="block text-sm font-medium text-zinc-700">
                Legal line 1
              </label>
              <textarea
                id="legal-1"
                rows={2}
                value={siteFooter.legalLine1}
                onChange={(e) => setSiteFooter({ ...siteFooter, legalLine1: e.target.value })}
                className={fieldCls}
              />
            </div>
            <div>
              <label htmlFor="legal-2" className="block text-sm font-medium text-zinc-700">
                Legal line 2
              </label>
              <textarea
                id="legal-2"
                rows={2}
                value={siteFooter.legalLine2}
                onChange={(e) => setSiteFooter({ ...siteFooter, legalLine2: e.target.value })}
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
