"use client";

import { useEffect, useState } from "react";
import { useUI } from "@/store/useUI";
import { useStore } from "@/store/useStore";
import { getCity } from "@/data/client";

/** A prominent "deliver to" CTA for the top of the feed. City selection already
 *  lives in the header, so this stays focused on the one thing left to do — drop
 *  an address. The food still won't come, but at least it knows exactly where
 *  not to arrive. */
export function LocationBar({ cityName }: { cityName?: string }) {
  const [mounted, setMounted] = useState(false);
  const citySlug = useStore((s) => s.citySlug);
  const address = useStore((s) => s.address);
  const openAddress = useUI((s) => s.openAddress);

  useEffect(() => setMounted(true), []);

  const cityLabel = mounted
    ? getCity(citySlug)?.name ?? cityName ?? "Hyderabad"
    : cityName ?? "Hyderabad";
  const addressLabel = mounted && address ? `${address.line} · ${address.area}` : null;

  return (
    <button
      type="button"
      onClick={openAddress}
      aria-label={addressLabel ? "Change delivery address" : "Add a delivery address"}
      className="flex min-h-16 w-full items-center gap-3 rounded-2xl border border-line/15 bg-card/60 p-3 text-left shadow-card transition hover:border-bandhani/60 sm:p-3.5"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-bandhani/15 text-bandhani">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
          <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
          <circle cx="12" cy="10" r="2.5" />
        </svg>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-[11px] font-semibold uppercase tracking-wide text-dim">
          Deliver to <span className="text-muted">· {cityLabel}</span>
        </span>
        <span className="block truncate text-base font-semibold text-fg">
          {addressLabel ?? "Add your address"}
        </span>
      </span>
      <span className="shrink-0 rounded-lg bg-bandhani px-3.5 py-2 text-sm font-semibold text-fg">
        {addressLabel ? "Change" : "Add"}
      </span>
    </button>
  );
}
