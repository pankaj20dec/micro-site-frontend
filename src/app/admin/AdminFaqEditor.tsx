"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { fetchAdminFaqContent, saveFaqContent } from "@/lib/admin-faq-api";
import { clearAdminToken, getAdminToken } from "@/lib/admin-auth";
import {
  slugifyFaqId,
  type FaqItemContent,
  type FaqPageContent,
} from "@/lib/faq-content-defaults";

const fieldCls =
  "mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 outline-none focus:border-[#660066] focus:ring-2 focus:ring-[#660066]/20";

function ParagraphList({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-zinc-700">{label}</label>
      <div className="mt-2 space-y-2">
        {values.map((value, index) => (
          <div key={index} className="flex gap-2">
            <textarea
              value={value}
              rows={4}
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

function moveItem(items: FaqItemContent[], index: number, direction: -1 | 1) {
  const newIndex = index + direction;
  if (newIndex < 0 || newIndex >= items.length) return items;
  const next = [...items];
  [next[index], next[newIndex]] = [next[newIndex], next[index]];
  return next;
}

function prepareContentForSave(content: FaqPageContent): FaqPageContent {
  return {
    intro: { eyebrow: content.intro.eyebrow.trim() },
    items: content.items
      .map((item) => ({
        id: item.id.trim() || slugifyFaqId(item.question),
        question: item.question.trim(),
        answerParagraphs: item.answerParagraphs.map((p) => p.trim()).filter(Boolean),
      }))
      .filter((item) => item.question && item.answerParagraphs.length > 0),
    contact: {
      eyebrow: content.contact.eyebrow.trim(),
      legal: {
        title: content.contact.legal.title.trim(),
        description: content.contact.legal.description.trim(),
        email: content.contact.legal.email.trim(),
      },
      admin: {
        title: content.contact.admin.title.trim(),
        description: content.contact.admin.description.trim(),
        email: content.contact.admin.email.trim(),
      },
      disclaimer: content.contact.disclaimer.trim(),
    },
  };
}

export function AdminFaqEditor() {
  const router = useRouter();
  const [content, setContent] = useState<FaqPageContent | null>(null);
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
      const data = await fetchAdminFaqContent();
      setContent(data);
    } catch (e) {
      const status = (e as { status?: number }).status;
      if (status === 401 || status === 403) {
        clearAdminToken();
        router.replace("/admin/login");
        return;
      }
      setError(e instanceof Error ? e.message : "Failed to load FAQ content");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  function updateItem(index: number, patch: Partial<FaqItemContent>) {
    if (!content) return;
    const items = [...content.items];
    items[index] = { ...items[index], ...patch };
    setContent({ ...content, items });
  }

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    if (!content) return;

    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const prepared = prepareContentForSave(content);
      if (prepared.items.length === 0) {
        throw new Error("Add at least one FAQ item with a question and answer.");
      }
      const saved = await saveFaqContent(prepared);
      setContent(saved);
      setSuccess("FAQ page saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-zinc-600">Loading FAQ content…</p>;
  }

  if (!content) {
    return <p className="text-sm text-red-600">Unable to load FAQ content.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">FAQ page</h1>
          <p className="mt-1 text-sm text-zinc-600">
            Edit the public FAQ page intro, questions, answers, and contact section.
          </p>
        </div>
        <Link
          href="/faq"
          target="_blank"
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
        >
          View live page ↗
        </Link>
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
          <h2 className="text-lg font-semibold text-zinc-900">Page intro</h2>
          <div className="mt-4">
            <label htmlFor="faq-intro" className="block text-sm font-medium text-zinc-700">
              Eyebrow heading
            </label>
            <input
              id="faq-intro"
              required
              value={content.intro.eyebrow}
              onChange={(e) =>
                setContent({ ...content, intro: { eyebrow: e.target.value } })
              }
              className={fieldCls}
            />
          </div>
        </section>

        <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-zinc-900">FAQ items</h2>
            <button
              type="button"
              onClick={() =>
                setContent({
                  ...content,
                  items: [
                    ...content.items,
                    {
                      id: `faq-${Date.now()}`,
                      question: "",
                      answerParagraphs: [""],
                    },
                  ],
                })
              }
              className="rounded-lg border border-dashed border-zinc-300 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:border-[#660066] hover:text-[#660066]"
            >
              + Add FAQ item
            </button>
          </div>

          {content.items.map((item, index) => (
            <div
              key={`${item.id}-${index}`}
              className="space-y-4 rounded-lg border border-zinc-200 bg-zinc-50/50 p-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-zinc-800">
                  Item {index + 1}
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setContent({
                        ...content,
                        items: moveItem(content.items, index, -1),
                      })
                    }
                    disabled={index === 0}
                    className="rounded-lg border border-zinc-300 px-2 py-1 text-xs text-zinc-600 hover:bg-white disabled:opacity-40"
                  >
                    Move up
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setContent({
                        ...content,
                        items: moveItem(content.items, index, 1),
                      })
                    }
                    disabled={index === content.items.length - 1}
                    className="rounded-lg border border-zinc-300 px-2 py-1 text-xs text-zinc-600 hover:bg-white disabled:opacity-40"
                  >
                    Move down
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setContent({
                        ...content,
                        items: content.items.filter((_, i) => i !== index),
                      })
                    }
                    disabled={content.items.length <= 1}
                    className="rounded-lg border border-red-200 px-2 py-1 text-xs text-red-700 hover:bg-red-50 disabled:opacity-40"
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700">Question</label>
                <input
                  required
                  value={item.question}
                  onChange={(e) => updateItem(index, { question: e.target.value })}
                  className={fieldCls}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Anchor ID
                </label>
                <p className="mt-1 text-xs text-zinc-500">
                  Used for accordion links. Leave blank to auto-generate from the question.
                </p>
                <input
                  value={item.id}
                  onChange={(e) => updateItem(index, { id: e.target.value })}
                  placeholder={slugifyFaqId(item.question) || "faq-item"}
                  className={fieldCls}
                />
              </div>

              <ParagraphList
                label="Answer paragraphs"
                values={item.answerParagraphs}
                onChange={(answerParagraphs) => updateItem(index, { answerParagraphs })}
              />
            </div>
          ))}
        </section>

        <section className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-zinc-900">Contact section</h2>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Section heading</label>
            <input
              required
              value={content.contact.eyebrow}
              onChange={(e) =>
                setContent({
                  ...content,
                  contact: { ...content.contact, eyebrow: e.target.value },
                })
              }
              className={fieldCls}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-3 rounded-lg border border-zinc-200 p-4">
              <h3 className="text-sm font-semibold text-zinc-800">Legal enquiries</h3>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Title</label>
                <input
                  required
                  value={content.contact.legal.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: {
                        ...content.contact,
                        legal: { ...content.contact.legal, title: e.target.value },
                      },
                    })
                  }
                  className={fieldCls}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Description</label>
                <textarea
                  required
                  rows={3}
                  value={content.contact.legal.description}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: {
                        ...content.contact,
                        legal: { ...content.contact.legal, description: e.target.value },
                      },
                    })
                  }
                  className={fieldCls}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Email</label>
                <input
                  required
                  type="email"
                  value={content.contact.legal.email}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: {
                        ...content.contact,
                        legal: { ...content.contact.legal, email: e.target.value },
                      },
                    })
                  }
                  className={fieldCls}
                />
              </div>
            </div>

            <div className="space-y-3 rounded-lg border border-zinc-200 p-4">
              <h3 className="text-sm font-semibold text-zinc-800">Administrative enquiries</h3>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Title</label>
                <input
                  required
                  value={content.contact.admin.title}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: {
                        ...content.contact,
                        admin: { ...content.contact.admin, title: e.target.value },
                      },
                    })
                  }
                  className={fieldCls}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Description</label>
                <textarea
                  required
                  rows={3}
                  value={content.contact.admin.description}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: {
                        ...content.contact,
                        admin: { ...content.contact.admin, description: e.target.value },
                      },
                    })
                  }
                  className={fieldCls}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-700">Email</label>
                <input
                  required
                  type="email"
                  value={content.contact.admin.email}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      contact: {
                        ...content.contact,
                        admin: { ...content.contact.admin, email: e.target.value },
                      },
                    })
                  }
                  className={fieldCls}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-700">Disclaimer</label>
            <textarea
              required
              rows={3}
              value={content.contact.disclaimer}
              onChange={(e) =>
                setContent({
                  ...content,
                  contact: { ...content.contact, disclaimer: e.target.value },
                })
              }
              className={fieldCls}
            />
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-[#660066] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#550055] disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save FAQ page"}
          </button>
        </div>
      </form>
    </div>
  );
}
