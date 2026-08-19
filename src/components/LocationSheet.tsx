"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Sheet } from "@/components/sheet/Sheet";
import { useUI } from "@/store/useUI";
import { useStore } from "@/store/useStore";
import { cities, getCity } from "@/data/client";

const LABELS = ["Home", "Work", "Other"] as const;

/** A flattened "area, city" row for the type-ahead. */
interface AreaHit {
  citySlug: string;
  cityName: string;
  state: string;
  area: string;
}

const ALL_AREAS: AreaHit[] = cities.flatMap((c) =>
  c.areas.map((area) => ({ citySlug: c.slug, cityName: c.name, state: c.state, area })),
);

/**
 * The unified "Deliver to" sheet — one Swiggy/Zomato-style flow that replaces the
 * old city grid + separate address sheet.
 *
 *  1. **Search** — type-ahead across every city + locality, a playful "Detect my
 *     location" GPS button, and a quick-pick for the saved address.
 *  2. **Pin** — the hand-drawn map with a draggable pin folded in as the
 *     fine-tune step, then "Confirm location".
 */
export function LocationSheet() {
  const open = useUI((s) => s.locationOpen);
  const stage = useUI((s) => s.locationStage);
  const setStage = useUI((s) => s.setLocationStage);
  const close = useUI((s) => s.closeLocation);

  const citySlug = useStore((s) => s.citySlug);
  const existing = useStore((s) => s.address);
  const setCity = useStore((s) => s.setCity);
  const setAddress = useStore((s) => s.setAddress);
  const router = useRouter();

  // The city being edited in this flow (may differ from the store until confirm).
  const [pendingCity, setPendingCity] = useState(citySlug);
  const [query, setQuery] = useState("");
  const [browse, setBrowse] = useState(citySlug); // which city's areas the empty state shows
  const [locating, setLocating] = useState(false);

  // Pin-stage fields.
  const [label, setLabel] = useState<string>(existing?.label ?? "Home");
  const [line, setLine] = useState(existing?.line ?? "");
  const [area, setArea] = useState(existing?.area ?? "");
  const [pin, setPin] = useState(existing?.pin ?? { x: 0.5, y: 0.46 });

  const mapRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset local state each time the sheet opens so it reflects the current store.
  useEffect(() => {
    if (!open) return;
    setPendingCity(citySlug);
    setBrowse(citySlug);
    setQuery("");
    setLocating(false);
    setLabel(existing?.label ?? "Home");
    setLine(existing?.line ?? "");
    setArea(existing?.area ?? getCity(citySlug)?.areas[0] ?? "");
    setPin(existing?.pin ?? { x: 0.5, y: 0.46 });
  }, [open, citySlug, existing]);

  // Focus the search box when the search step appears.
  useEffect(() => {
    if (open && stage === "search") {
      const t = setTimeout(() => inputRef.current?.focus(), 250);
      return () => clearTimeout(t);
    }
  }, [open, stage]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [] as AreaHit[];
    return ALL_AREAS.filter(
      (a) =>
        a.area.toLowerCase().includes(q) ||
        a.cityName.toLowerCase().includes(q) ||
        a.state.toLowerCase().includes(q),
    ).slice(0, 40);
  }, [query]);

  const browseCity = getCity(browse);

  /** Move to the map step with a chosen city + area. */
  const pickArea = (slug: string, a: string) => {
    setPendingCity(slug);
    setArea(a);
    setPin({ x: 0.5, y: 0.46 });
    setStage("pin");
  };

  /** Fake "GPS" — pretends to locate, then drops you somewhere plausible. */
  const detect = () => {
    if (locating) return;
    setLocating(true);
    setTimeout(() => {
      const hit = ALL_AREAS[Math.floor(Math.random() * ALL_AREAS.length)];
      setLocating(false);
      pickArea(hit.citySlug, hit.area);
    }, 1200);
  };

  const movePin = (clientX: number, clientY: number) => {
    const el = mapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    const y = Math.min(0.9, Math.max(0.1, (clientY - r.top) / r.height));
    setPin({ x, y });
  };

  const confirm = () => {
    const city = getCity(pendingCity);
    setCity(pendingCity);
    setAddress({
      label,
      line: line.trim() || "Somewhere in " + (city?.name ?? ""),
      area: area || city?.areas[0] || "",
      pin,
    });
    close();
    router.push(`/${pendingCity}`);
  };

  return (
    <Sheet open={open} onClose={close} labelledBy="loc-title">
      {stage === "search" ? (
        <div className="px-5 pb-8 pt-1">
          <h2 id="loc-title" className="font-display text-2xl text-fg">
            Where should we not deliver?
          </h2>
          <p className="mt-1 text-sm text-fg/55">
            Search a city or locality. Ramesh will memorise it, then not come.
          </p>

          {/* Search box */}
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-line/15 bg-card-2 px-3.5 focus-within:border-bandhani">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-dim" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="M21 21l-4.3-4.3" />
            </svg>
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search area, street or city…"
              aria-label="Search for a delivery location"
              className="min-w-0 flex-1 bg-transparent py-3 text-fg outline-none placeholder:text-dim"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search" className="shrink-0 text-dim hover:text-fg">
                ✕
              </button>
            )}
          </div>

          {/* Detect location */}
          <button
            type="button"
            onClick={detect}
            aria-busy={locating}
            className="mt-3 flex w-full items-center gap-3 rounded-xl border border-bandhani/40 bg-bandhani/5 px-4 py-3 text-left transition hover:bg-bandhani/10"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-bandhani/15 text-bandhani">
              {locating ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="animate-spin" aria-hidden>
                  <path d="M12 3a9 9 0 1 0 9 9" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
                  <circle cx="12" cy="12" r="4" />
                </svg>
              )}
            </span>
            <span className="min-w-0">
              <span className="block font-semibold text-bandhani-text">
                {locating ? "Pinpointing you…" : "Detect my location"}
              </span>
              <span className="block text-xs text-dim">
                {locating ? "Triangulating three towers and a pigeon" : "Using precise, definitely-real GPS"}
              </span>
            </span>
          </button>

          {/* Saved address quick-pick */}
          {existing && (
            <div className="mt-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-dim">Saved address</p>
              <button
                type="button"
                onClick={() => setStage("pin")}
                className="flex w-full items-start gap-3 rounded-xl border border-line/12 bg-card-2 px-4 py-3 text-left transition hover:border-bandhani/50"
              >
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-turmeric/20 text-turmeric-text">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M3 11l9-8 9 8" />
                    <path d="M5 10v10h14V10" />
                  </svg>
                </span>
                <span className="min-w-0">
                  <span className="block font-semibold text-fg">{existing.label}</span>
                  <span className="block truncate text-sm text-dim">
                    {existing.line} · {existing.area}
                  </span>
                </span>
              </button>
            </div>
          )}

          {query ? (
            /* Type-ahead results */
            <div className="mt-5">
              {results.length === 0 ? (
                <p className="py-10 text-center text-sm text-dim">
                  No such place in our 14 cities. The food wouldn&rsquo;t have come anyway.
                </p>
              ) : (
                <ul className="divide-y divide-line/8">
                  {results.map((r) => (
                    <li key={`${r.citySlug}-${r.area}`}>
                      <button
                        type="button"
                        onClick={() => pickArea(r.citySlug, r.area)}
                        className="flex w-full items-center gap-3 py-3 text-left"
                      >
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-dim" aria-hidden>
                          <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
                          <circle cx="12" cy="10" r="2.5" />
                        </svg>
                        <span className="min-w-0">
                          <span className="block truncate font-medium text-fg">{r.area}</span>
                          <span className="block truncate text-xs text-dim">
                            {r.cityName}, {r.state}
                          </span>
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            /* Browse-by-city empty state */
            <div className="mt-5">
              <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-dim">Popular cities</p>
              <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
                {cities.map((c) => {
                  const on = c.slug === browse;
                  return (
                    <button
                      key={c.slug}
                      type="button"
                      onClick={() => setBrowse(c.slug)}
                      aria-pressed={on}
                      className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition ${
                        on ? "border-bandhani bg-bandhani/15 text-fg" : "border-line/15 text-muted hover:border-line/30"
                      }`}
                    >
                      {c.name}
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-dim">
                  Localities in {browseCity?.name}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setCity(browse);
                    close();
                    router.push(`/${browse}`);
                  }}
                  className="text-xs font-semibold text-bandhani hover:underline"
                >
                  Browse all {browseCity?.name} →
                </button>
              </div>
              <ul className="mt-1 grid grid-cols-2 gap-x-4">
                {browseCity?.areas.map((a) => (
                  <li key={a}>
                    <button
                      type="button"
                      onClick={() => pickArea(browse, a)}
                      className="flex w-full items-center gap-2 py-2.5 text-left"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0 text-dim" aria-hidden>
                        <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
                        <circle cx="12" cy="10" r="2.5" />
                      </svg>
                      <span className="truncate text-sm text-fg">{a}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ) : (
        /* ------------------------------- Pin step ------------------------------- */
        <div className="px-5 pb-8 pt-1">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setStage("search")}
              aria-label="Back to search"
              className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-line/15 text-muted hover:text-fg"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <path d="M15 6l-6 6 6 6" />
              </svg>
            </button>
            <div className="min-w-0">
              <h2 id="loc-title" className="font-display text-2xl leading-tight text-fg">
                Drop the pin
              </h2>
              <p className="truncate text-sm text-fg/55">
                {area ? `${area}, ` : ""}
                {getCity(pendingCity)?.name}
              </p>
            </div>
          </div>

          {/* hand-drawn map */}
          <div className="mt-4 overflow-hidden rounded-2xl border border-line/10">
            <svg
              ref={mapRef}
              viewBox="0 0 320 180"
              className="h-44 w-full touch-none select-none"
              onPointerDown={(e) => {
                dragging.current = true;
                (e.target as Element).setPointerCapture?.(e.pointerId);
                movePin(e.clientX, e.clientY);
              }}
              onPointerMove={(e) => dragging.current && movePin(e.clientX, e.clientY)}
              onPointerUp={() => (dragging.current = false)}
            >
              <rect width="320" height="180" fill="#eef1ec" />
              {[24, 96, 168, 240].map((x) =>
                [16, 84, 132].map((y) => (
                  <rect key={`${x}-${y}`} x={x} y={y} width="56" height="40" rx="3" fill="#dfe4db" />
                )),
              )}
              <g stroke="#c7ccc3" strokeWidth="6">
                <line x1="0" y1="70" x2="320" y2="70" />
                <line x1="0" y1="120" x2="320" y2="120" />
                <line x1="86" y1="0" x2="86" y2="180" />
                <line x1="230" y1="0" x2="230" y2="180" />
              </g>
              <path d="M0 96 q80 -30 160 0 t160 -6" stroke="#bcd0c2" strokeWidth="4" fill="none" />
              <g transform={`translate(${pin.x * 320} ${pin.y * 180})`} style={{ cursor: "grab" }}>
                <ellipse cx="0" cy="2" rx="7" ry="3" fill="#00000022" />
                <path d="M0 -26 C10 -26 14 -18 14 -12 C14 -4 0 4 0 4 C0 4 -14 -4 -14 -12 C-14 -18 -10 -26 0 -26 Z" fill="#d6336c" />
                <circle cx="0" cy="-13" r="4.5" fill="#faf8f3" />
              </g>
            </svg>
          </div>

          {/* label */}
          <div className="mt-4 flex gap-2">
            {LABELS.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLabel(l)}
                aria-pressed={label === l}
                className={`rounded-xl border px-4 py-2 text-sm transition ${
                  label === l
                    ? "border-bandhani bg-bandhani/10 text-[color:var(--color-bandhani-ink)]"
                    : "border-line/15 text-fg/70"
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-medium text-fg/70">Flat / building / landmark</span>
            <input
              value={line}
              onChange={(e) => setLine(e.target.value)}
              placeholder="Flat 402, Rose Apartments, near the temple"
              className="mt-1 w-full rounded-xl border border-line/15 bg-card-2 px-4 py-2.5 text-fg outline-none focus:border-bandhani"
            />
          </label>

          <label className="mt-3 block">
            <span className="text-sm font-medium text-fg/70">Area</span>
            <select
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="mt-1 w-full rounded-xl border border-line/15 bg-card-2 px-4 py-2.5 text-fg outline-none focus:border-bandhani"
            >
              {getCity(pendingCity)?.areas.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={confirm}
            className="mt-6 w-full rounded-xl bg-bandhani py-3.5 font-semibold text-fg shadow-pop transition active:scale-[0.99]"
          >
            Confirm location
          </button>
        </div>
      )}
    </Sheet>
  );
}
