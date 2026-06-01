import Image from "next/image";
import Link from "next/link";
import type { PageDoc } from "@/lib/api";
import { brand } from "@/lib/brand";
import { Container } from "@/components/ui";

function CalendarIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function NewsArticlePage({ page }: { page: PageDoc }) {
  const date = formatDate(page.publishedAt ?? page.updatedAt);

  return (
    <div className="bg-white py-12">
      <Container max="5xl">
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
          style={{ color: brand.purple }}
        >
          <ArrowLeftIcon />
          Back to News
        </Link>

        {page.featuredImage && (
          <div className="relative mt-7 h-56 w-full overflow-hidden rounded-lg sm:h-72 lg:h-[380px]">
            <Image
              src={page.featuredImage}
              alt={page.title}
              fill
              priority
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover"
            />
          </div>
        )}

        <div className="mt-7 max-w-3xl">
          {page.category && (
            <span
              className="mb-3 inline-block rounded px-2.5 py-1 text-[11px] font-bold uppercase tracking-widest text-white"
              style={{ backgroundColor: brand.purple }}
            >
              {page.category}
            </span>
          )}

          <h1
            className="text-2xl font-bold leading-tight sm:text-3xl lg:text-[2rem]"
            style={{ color: brand.text }}
          >
            {page.title}
          </h1>

          {date && (
            <div
              className="mt-3 flex items-center gap-1.5 text-xs font-medium"
              style={{ color: brand.purple }}
            >
              <CalendarIcon />
              <span>{date}</span>
            </div>
          )}

          <div className="mt-8 whitespace-pre-wrap text-[15px] leading-relaxed text-neutral-700">
            {page.body || (
              <span className="text-neutral-400">No content yet.</span>
            )}
          </div>
        </div>

        <div className="mt-12 border-t border-neutral-100 pt-6">
          <Link
            href="/news"
            className="inline-flex items-center gap-1.5 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: brand.purple }}
          >
            <ArrowLeftIcon />
            Back to News
          </Link>
        </div>
      </Container>
    </div>
  );
}
