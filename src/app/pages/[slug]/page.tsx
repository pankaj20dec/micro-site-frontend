import Link from "next/link";
import { notFound } from "next/navigation";
import { fetchPublishedPage } from "@/lib/api";

type Props = { params: Promise<{ slug: string }> };

export default async function DynamicPage({ params }: Props) {
  const { slug } = await params;
  const page = await fetchPublishedPage(slug);
  if (!page) notFound();

  return (
    <article className="mx-auto w-full max-w-3xl flex-1 px-6 py-12">
      <Link
        href="/pages"
        className="text-sm text-teal-700 hover:underline dark:text-teal-400"
      >
        ← All pages
      </Link>
      <h1 className="mt-6 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
        {page.title}
      </h1>
      <div className="mt-8 max-w-none whitespace-pre-wrap text-base leading-relaxed text-zinc-700 dark:text-zinc-300">
        {page.body || <span className="text-zinc-400">No body yet.</span>}
      </div>
    </article>
  );
}
