"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useStore, selectCartCount } from "@/store/useStore";
import { useUI } from "@/store/useUI";
import { getCity } from "@/data/client";

/** The tappable "deliver to" control. Rendered twice: as a full-width bar on
 *  its own row on mobile, and inline in the top row from `sm` up. */
function LocationButton({
  primary,
  secondary,
  onClick,
  variant,
}: {
  primary: string;
  secondary: string | null;
  onClick: () => void;
  variant: "bar" | "inline";
}) {
  const aria = secondary
    ? `Delivering to ${primary}, ${secondary}. Change location`
    : `${primary}, change location`;

  if (variant === "bar") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={aria}
        className="flex min-h-11 w-full items-center gap-2 border-t border-line/10 py-2 text-left text-muted"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-bandhani" aria-hidden>
          <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
        <span className="flex min-w-0 flex-1 items-baseline gap-1.5">
          <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wide text-dim">
            {secondary ? "To" : "City"}
          </span>
          <span className="truncate font-semibold text-fg">{primary}</span>
          {secondary && <span className="truncate text-sm text-dim">· {secondary}</span>}
        </span>
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0" aria-hidden>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={aria}
      className="hidden min-h-11 min-w-0 items-center gap-1.5 text-sm text-muted hover:text-fg sm:flex"
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
  );
}

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
      <div className="safe-x mx-auto w-full max-w-5xl px-5">
        {/* Top row — brand + actions. Location lives inline only from sm up. */}
        <div className="flex items-center gap-3 py-3">
          <Link href="/" aria-label="Dabba Never Comes — home" className="shrink-0">
            <Logo full className="text-base sm:text-xl" />
          </Link>
          <span className="mx-1 hidden h-5 w-px shrink-0 bg-steel/15 sm:block" />
          <LocationButton primary={primary} secondary={secondary} onClick={openCity} variant="inline" />

          <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-3">
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
              aria-label={mounted && count > 0 ? `Cart, ${count} items` : "Cart"}
              className="relative inline-flex min-h-11 min-w-11 items-center justify-center gap-1.5 rounded-lg text-fg hover:text-bandhani-text sm:min-w-0 sm:border sm:border-line/15 sm:px-3 sm:py-1.5 sm:text-sm sm:hover:border-line/30"
            >
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:hidden" aria-hidden>
                <path d="M6 6h15l-1.5 9h-12z" />
                <path d="M6 6L5 3H2" strokeLinecap="round" />
                <circle cx="9" cy="20" r="1.4" />
                <circle cx="18" cy="20" r="1.4" />
              </svg>
              <span className="hidden sm:inline">Cart</span>
              {mounted && count > 0 && (
                <span className="tnum absolute right-0 top-1 grid h-5 min-w-5 place-items-center rounded-full bg-bandhani px-1 text-[11px] font-bold text-fg sm:-right-2 sm:-top-2">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile-only location row — full-width, prominent, one tap to change. */}
        <div className="sm:hidden">
          <LocationButton primary={primary} secondary={secondary} onClick={openCity} variant="bar" />
        </div>
      </div>
    </header>
  );
}
