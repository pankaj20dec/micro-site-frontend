import Link from "next/link";
import { fetchPublishedPages } from "@/lib/api";

export default async function PagesIndex() {
  let pages: Awaited<ReturnType<typeof fetchPublishedPages>> = [];
  let error: string | null = null;
  try {
    pages = await fetchPublishedPages();
  } catch {
    error = "Could not reach the API. Start the backend and set NEXT_PUBLIC_API_URL.";
  }

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Published pages</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        Content served from MongoDB via{" "}
        <code className="rounded bg-zinc-200 px-1 py-0.5 text-sm dark:bg-zinc-800">GET /api/pages</code>
      </p>
      {error ? (
        <p className="mt-8 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          {error}
        </p>
      ) : pages.length === 0 ? (
        <p className="mt-8 text-zinc-600 dark:text-zinc-400">
          No published pages yet. Log into admin and publish a page.
        </p>
      ) : (
        <ul className="mt-8 divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900/40">
          {pages.map((p) => (
            <li key={p._id}>
              <Link
                href={`/pages/${p.slug}`}
                className="flex flex-col gap-0.5 px-4 py-4 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/60 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="font-medium text-zinc-900 dark:text-zinc-100">{p.title}</span>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">/{p.slug}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
