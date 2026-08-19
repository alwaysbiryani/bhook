"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useStore, selectCartCount } from "@/store/useStore";
import { useUI } from "@/store/useUI";
import { getCity } from "@/data/client";

export function SiteHeader({ cityName }: { cityName?: string }) {
  const [mounted, setMounted] = useState(false);
  const citySlug = useStore((s) => s.citySlug);
  const address = useStore((s) => s.address);
  const count = useStore(selectCartCount);
  const openCity = useUI((s) => s.openCity);
  const openSearch = useUI((s) => s.openSearch);

  useEffect(() => setMounted(true), []);

  const cityLabel = mounted ? getCity(citySlug)?.name ?? cityName ?? "Hyderabad" : cityName ?? "Hyderabad";
  // Lead with the saved address (Swiggy/Zomato-style) once the user has one.
  const primary = mounted && address ? address.label : cityLabel;
  const secondary = mounted && address ? `${address.area}, ${cityLabel}` : null;

  return (
    <header className="safe-top sticky top-0 z-40 border-b border-line/10 bg-page/85 backdrop-blur-md">
      <div className="safe-x mx-auto flex w-full max-w-5xl items-center gap-3 px-5 py-3">
        <Link href="/" aria-label="Dabba Never Comes — home" className="shrink-0">
          <Logo full className="text-lg sm:text-xl" />
        </Link>
        <span className="mx-1 h-5 w-px shrink-0 bg-steel/15" />
        <button
          type="button"
          onClick={openCity}
          className="flex min-h-11 min-w-0 items-center gap-1.5 text-sm text-muted hover:text-fg"
          aria-label={secondary ? `Delivering to ${primary}, ${secondary}. Change location` : `${primary}, change location`}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0" aria-hidden>
            <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          <span className="flex min-w-0 items-center gap-1.5">
            <span className="flex min-w-0 flex-col leading-tight">
              <span className="truncate font-semibold text-fg">{primary}</span>
              {secondary && <span className="truncate text-[11px] text-dim">{secondary}</span>}
            </span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0" aria-hidden>
              <path d="M6 9l6 6 6-6" />
            </svg>
          </span>
        </button>

        <div className="ml-auto flex shrink-0 items-center gap-1 sm:gap-3">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search"
            className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-muted hover:text-fg"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>
          <ThemeToggle />
          <Link href="/orders" className="hidden text-sm text-muted hover:text-fg sm:block">
            Orders
          </Link>
          <Link
            href="/cart"
            className="relative rounded-lg border border-line/15 px-3 py-1.5 text-sm text-fg hover:border-line/30"
          >
            Cart
            {mounted && count > 0 && (
              <span className="tnum absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-bandhani px-1 text-[11px] font-bold text-fg">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
