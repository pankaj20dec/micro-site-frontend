import Image from "next/image";
import Link from "next/link";
import type { PageSummary } from "@/lib/api";
import { brand } from "@/lib/brand";

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

function formatDate(dateStr?: string): string {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export function NewsCard({ page }: { page: PageSummary }) {
  const date = formatDate(page.publishedAt ?? page.updatedAt);

  return (
    <article className="flex flex-col gap-4 border-b border-neutral-100 pb-8 last:border-0 sm:flex-row sm:gap-5">
      <Link
        href={`/news/${page.slug}`}
        className="shrink-0"
        tabIndex={-1}
        aria-hidden
      >
        <div className="relative h-44 w-full overflow-hidden rounded sm:h-[140px] sm:w-[200px]">
          {page.featuredImage ? (
            <Image
              src={page.featuredImage}
              alt={page.title}
              fill
              sizes="(max-width: 640px) 100vw, 200px"
              className="object-cover"
            />
          ) : (
            <div
              className="flex h-full w-full flex-col items-center justify-center gap-1"
              style={{ backgroundColor: brand.lavender }}
            >
              <span
                className="text-lg font-black tracking-tight leading-none"
                style={{ color: brand.purple }}
              >
                FIPO
              </span>
              <span className="text-[9px] font-medium uppercase tracking-widest" style={{ color: brand.purple }}>
                News
              </span>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col gap-2">
        <Link href={`/news/${page.slug}`}>
          <h2
            className="text-[15px] font-bold leading-snug transition-colors hover:opacity-75 sm:text-base"
            style={{ color: brand.text }}
          >
            {page.title}
          </h2>
        </Link>

        {page.excerpt && (
          <p className="line-clamp-3 text-sm leading-relaxed text-neutral-500">
            {page.excerpt}
          </p>
        )}

        {date && (
          <div
            className="mt-auto flex items-center gap-1.5 pt-1 text-[11px] font-medium"
            style={{ color: brand.purple }}
          >
            <CalendarIcon />
            <span>{date}</span>
          </div>
        )}
      </div>
    </article>
  );
}
