"use client";

import { useEffect, useState } from "react";
import { useUI } from "@/store/useUI";
import { useStore } from "@/store/useStore";
import { getCity } from "@/data/client";

/** A prominent "deliver to" bar for the top of the feed: pick a city, then drop
 *  an address. Both are one tap away — the food still won't come, but at least
 *  it knows exactly where not to arrive. */
export function LocationBar({ cityName }: { cityName?: string }) {
  const [mounted, setMounted] = useState(false);
  const citySlug = useStore((s) => s.citySlug);
  const address = useStore((s) => s.address);
  const openCity = useUI((s) => s.openCity);
  const openAddress = useUI((s) => s.openAddress);

  useEffect(() => setMounted(true), []);

  const cityLabel = mounted
    ? getCity(citySlug)?.name ?? cityName ?? "Hyderabad"
    : cityName ?? "Hyderabad";
  const addressLabel = mounted && address ? `${address.line} · ${address.area}` : null;

  return (
    <div className="rounded-2xl border border-line/15 bg-card/60 p-3 shadow-card sm:p-3.5">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-stretch">
        {/* City */}
        <button
          type="button"
          onClick={openCity}
          aria-label={`Delivering to ${cityLabel}, change city`}
          className="flex min-h-14 flex-1 items-center gap-3 rounded-xl border border-line/10 bg-page/40 px-4 py-2.5 text-left transition hover:border-bandhani/60"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-bandhani/15 text-bandhani">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
              <circle cx="12" cy="10" r="2.5" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-dim">City</span>
            <span className="block truncate text-base font-semibold text-fg">{cityLabel}</span>
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 text-muted" aria-hidden>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {/* Address */}
        <button
          type="button"
          onClick={openAddress}
          aria-label={addressLabel ? "Change delivery address" : "Add a delivery address"}
          className="flex min-h-14 flex-[1.4] items-center gap-3 rounded-xl border border-line/10 bg-page/40 px-4 py-2.5 text-left transition hover:border-bandhani/60"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-turmeric/20 text-turmeric-text">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M3 11l18-8-8 18-2-8-8-2z" />
            </svg>
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-[11px] font-semibold uppercase tracking-wide text-dim">Deliver to</span>
            <span className="block truncate text-base font-semibold text-fg">
              {addressLabel ?? "Add your address"}
            </span>
          </span>
          <span className="shrink-0 rounded-lg bg-bandhani px-3 py-1.5 text-sm font-semibold text-fg">
            {addressLabel ? "Change" : "Add"}
          </span>
        </button>
      </div>
    </div>
  );
}
