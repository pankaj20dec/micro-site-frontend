import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import type { PageSummary } from "@/lib/api";
import { brand } from "@/lib/brand";
import { NewsSearchBox } from "./NewsSearchBox";

const NEWS_CATEGORIES = [
  "Homepage",
  "Uncategorized",
  "Health Awareness",
  "Patient Information",
  "Treatments & Procedures",
  "Doctor Insights",
  "Healthcare Policies",
  "Wellness & Prevention",
  "Medical Industry Updates",
  "Practitioner Support",
  "Fair Pay / Industry Issues",
];

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

function SidebarPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded border border-neutral-200 bg-white">
      <div
        className="border-b border-neutral-100 px-5 py-3"
      >
        <h3
          className="text-sm font-bold tracking-wide"
          style={{ color: brand.text }}
        >
          {title}
        </h3>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function FeaturedPostItem({ page }: { page: PageSummary }) {
  const date = formatDate(page.publishedAt ?? page.updatedAt);
  return (
    <Link
      href={`/news/${page.slug}`}
      className="flex gap-3 border-b border-neutral-100 py-3 last:border-0 last:pb-0 first:pt-0 transition-opacity hover:opacity-75"
    >
      <div className="relative h-14 w-[60px] shrink-0 overflow-hidden rounded">
        {page.featuredImage ? (
          <Image
            src={page.featuredImage}
            alt={page.title}
            fill
            sizes="60px"
            className="object-cover"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ backgroundColor: brand.lavender }}
          >
            <span className="text-[9px] font-black" style={{ color: brand.purple }}>
              FIPO
            </span>
          </div>
        )}
      </div>
      <div className="min-w-0">
        <p
          className="line-clamp-2 text-xs font-semibold leading-snug"
          style={{ color: brand.text }}
        >
          {page.title}
        </p>
        {date && (
          <p className="mt-1 text-[11px] text-neutral-400">{date}</p>
        )}
      </div>
    </Link>
  );
}

export function NewsSidebar({ featuredPages }: { featuredPages: PageSummary[] }) {
  const topFeatured = featuredPages.slice(0, 4);

  return (
    <aside className="flex flex-col gap-5">
      <SidebarPanel title="Search">
        <Suspense>
          <NewsSearchBox />
        </Suspense>
      </SidebarPanel>

      {topFeatured.length > 0 && (
        <SidebarPanel title="Featured Posts">
          <div>
            {topFeatured.map((page) => (
              <FeaturedPostItem key={page.id} page={page} />
            ))}
          </div>
        </SidebarPanel>
      )}

      <SidebarPanel title="Categories">
        <ul className="space-y-2.5">
          {NEWS_CATEGORIES.map((cat) => (
            <li key={cat} className="flex items-center gap-2.5">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: brand.purple }}
              />
              <span className="text-sm text-neutral-600">{cat}</span>
            </li>
          ))}
        </ul>
      </SidebarPanel>
    </aside>
  );
}
