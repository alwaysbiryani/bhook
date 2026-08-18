"use client";

import { useUI } from "@/store/useUI";

/** The hero search bar — a button that opens the search overlay. */
export function SearchTrigger() {
  const openSearch = useUI((s) => s.openSearch);
  return (
    <button
      type="button"
      onClick={openSearch}
      className="mt-6 flex w-full max-w-lg items-center gap-2 rounded-xl border border-line/15 bg-card/60 px-4 py-3 text-left text-dim hover:border-line/30"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="11" cy="11" r="7" />
        <path d="M21 21l-4.3-4.3" />
      </svg>
      <span className="text-sm">Search &ldquo;biryani&rdquo;, &ldquo;haleem&rdquo;, &ldquo;chai&rdquo;…</span>
    </button>
  );
}
