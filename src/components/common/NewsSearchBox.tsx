"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
import { brand } from "@/lib/brand";

function SearchIcon() {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

export function NewsSearchBox() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/news?q=${encodeURIComponent(q)}` : "/news");
  }

  return (
    <form
      onSubmit={onSubmit}
      className="flex overflow-hidden rounded border border-neutral-200"
    >
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search Here..."
        className="min-w-0 flex-1 bg-white px-3 py-2 text-sm text-neutral-700 outline-none placeholder:text-neutral-400"
      />
      <button
        type="submit"
        className="flex shrink-0 items-center justify-center px-3 py-2 text-white transition hover:opacity-90"
        style={{ backgroundColor: brand.purple }}
        aria-label="Search"
      >
        <SearchIcon />
      </button>
    </form>
  );
}
