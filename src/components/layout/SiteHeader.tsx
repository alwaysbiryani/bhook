"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { useStore, selectCartCount } from "@/store/useStore";
import { useUI } from "@/store/useUI";
import { getCity } from "@/data";
import { setMuted } from "@/lib/sound";

export function SiteHeader({ cityName }: { cityName?: string }) {
  const [mounted, setMounted] = useState(false);
  const citySlug = useStore((s) => s.citySlug);
  const soundOn = useStore((s) => s.soundOn);
  const toggleSound = useStore((s) => s.toggleSound);
  const count = useStore(selectCartCount);
  const openCity = useUI((s) => s.openCity);
  const openSearch = useUI((s) => s.openSearch);

  useEffect(() => setMounted(true), []);
  useEffect(() => setMuted(!soundOn), [soundOn]);

  const label = mounted ? getCity(citySlug)?.name ?? cityName ?? "Hyderabad" : cityName ?? "Hyderabad";

  return (
    <header className="sticky top-0 z-40 border-b border-steel/10 bg-ink/85 backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-3 px-5 py-3">
        <Link href="/" aria-label="Dabba Never Comes — home">
          <Logo className="text-xl" />
        </Link>
        <span className="mx-1 h-5 w-px bg-steel/15" />
        <button
          type="button"
          onClick={openCity}
          className="flex items-center gap-1.5 text-sm text-steel hover:text-chalk"
          aria-label="Change city"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
            <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          <span className="font-medium text-chalk">{label}</span>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openSearch}
            aria-label="Search"
            className="rounded-lg p-1.5 text-steel hover:text-chalk"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
          </button>
          <button
            type="button"
            onClick={toggleSound}
            aria-label={soundOn ? "Mute sounds" : "Unmute sounds"}
            aria-pressed={!soundOn}
            className="rounded-lg p-1.5 text-steel hover:text-chalk"
            title={soundOn ? "Sound on" : "Sound off"}
          >
            {soundOn ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M11 5 6 9H3v6h3l5 4z" />
                <path d="M16 9a4 4 0 0 1 0 6M19 6a8 8 0 0 1 0 12" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M11 5 6 9H3v6h3l5 4z" />
                <path d="M22 9l-6 6M16 9l6 6" />
              </svg>
            )}
          </button>
          <Link href="/orders" className="hidden text-sm text-steel hover:text-chalk sm:block">
            Orders
          </Link>
          <Link
            href="/cart"
            className="relative rounded-lg border border-steel/15 px-3 py-1.5 text-sm text-chalk hover:border-steel/30"
          >
            Cart
            {mounted && count > 0 && (
              <span className="tnum absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-bandhani px-1 text-[11px] font-bold text-chalk">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
