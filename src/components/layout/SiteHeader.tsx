import Link from "next/link";
import { BRAND } from "@/lib/brand";

/** Presentational header for Phase 1. The city chip + cart become interactive
 *  islands in Phase 2. */
export function SiteHeader({ cityName = "Hyderabad" }: { cityName?: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-steel/10 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-5 py-3">
        <Link href="/" className="font-display text-xl leading-none text-chalk">
          {BRAND.short}
        </Link>
        <span className="mx-1 h-5 w-px bg-steel/15" />
        <button
          type="button"
          className="flex items-center gap-1.5 text-sm text-steel hover:text-chalk"
          aria-label="Change location"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          <span className="font-medium text-chalk">{cityName}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        <div className="ml-auto flex items-center gap-3">
          <Link href="/orders" className="text-sm text-steel hover:text-chalk">
            Orders
          </Link>
          <Link
            href="/cart"
            className="rounded-lg border border-steel/15 px-3 py-1.5 text-sm text-chalk hover:border-steel/30"
          >
            Thali
          </Link>
        </div>
      </div>
    </header>
  );
}
