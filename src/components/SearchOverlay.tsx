"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Sheet } from "@/components/sheet/Sheet";
import { DishImage } from "@/components/DishImage";
import { VegMark } from "@/components/ui/VegMark";
import { useUI } from "@/store/useUI";
import { useCatalogue } from "@/lib/catalogue";
import { rupee } from "@/lib/format";

const POPULAR = ["Biryani", "Haleem", "Dosa", "Chai", "Butter chicken", "Vada pav", "Kulcha"];

export function SearchOverlay() {
  const open = useUI((s) => s.searchOpen);
  const close = useUI((s) => s.closeSearch);
  const openDish = useUI((s) => s.openDish);
  const router = useRouter();
  const [q, setQ] = useState("");
  // Catalogue loads lazily once the overlay opens (usually already warming from
  // the tap that opened it).
  const catalogue = useCatalogue(open);
  const getCity = catalogue?.getCity;
  const getRestaurant = catalogue?.getRestaurant;

  const query = q.trim().toLowerCase();

  const results = useMemo(() => {
    if (!catalogue || query.length < 2) return { rests: [], dish: [] };
    const rests = catalogue.restaurants
      .filter((r) => {
        const city = catalogue.getCity(r.citySlug)?.name ?? "";
        return `${r.name} ${r.cuisines.join(" ")} ${r.area} ${city}`.toLowerCase().includes(query);
      })
      .slice(0, 6);
    const dish = catalogue.dishes
      .filter((d) => `${d.name} ${d.tags.join(" ")}`.toLowerCase().includes(query))
      .slice(0, 10);
    return { rests, dish };
  }, [query, catalogue]);

  const searching = query.length >= 2 && !catalogue;

  const go = (href: string) => {
    close();
    router.push(href);
  };

  return (
    <Sheet open={open} onClose={close} labelledBy="search-title">
      <div className="px-5 pb-8 pt-2">
        <h2 id="search-title" className="sr-only">Search</h2>
        <div className="flex items-center gap-2 rounded-xl border border-line/15 bg-card-2 px-4 py-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-bandhani)" strokeWidth="2" aria-hidden>
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" />
          </svg>
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search dishes, restaurants, cuisines…"
            className="flex-1 bg-transparent text-fg outline-none placeholder:text-fg/40"
            aria-label="Search"
          />
          {q && (
            <button onClick={() => setQ("")} className="-mr-2 inline-flex min-h-11 min-w-11 items-center justify-center text-fg/40 active:text-fg" aria-label="Clear search">✕</button>
          )}
        </div>

        {query.length < 2 ? (
          <div className="mt-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-fg/40">Try</p>
            <div className="flex flex-wrap gap-2">
              {POPULAR.map((p) => (
                <button key={p} onClick={() => setQ(p)} className="rounded-full border border-line/15 px-3.5 py-1.5 text-sm text-fg/70 hover:border-bandhani">
                  {p}
                </button>
              ))}
            </div>
          </div>
        ) : searching ? (
          <p className="mt-8 text-center text-fg/50">Searching…</p>
        ) : results.rests.length === 0 && results.dish.length === 0 ? (
          <p className="mt-8 text-center text-fg/50">
            Nothing matches &ldquo;{q}&rdquo;. It never came either.
          </p>
        ) : (
          <div className="mt-4 space-y-5">
            {results.rests.length > 0 && (
              <section>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-fg/40">Restaurants</p>
                <div className="space-y-1">
                  {results.rests.map((r) => (
                    <button
                      key={r.slug}
                      onClick={() => go(`/${r.citySlug}/${r.slug}`)}
                      className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-page/5"
                    >
                      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                        <DishImage art="thali" hue={r.hue} seed={r.slug} alt={r.name} variant="thumb" className="h-full w-full" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-fg">{r.name}</p>
                        <p className="truncate text-xs text-fg/50">{r.cuisines.slice(0, 3).join(" · ")} · {getCity?.(r.citySlug)?.name}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}
            {results.dish.length > 0 && (
              <section>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-fg/40">Dishes</p>
                <div className="space-y-1">
                  {results.dish.map((d) => {
                    const r = getRestaurant?.(d.restaurantSlug);
                    if (!r) return null;
                    return (
                      <button
                        key={d.slug}
                        onClick={() => { close(); openDish(d.slug); }}
                        className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-page/5"
                      >
                        <div className="h-11 w-11 shrink-0 overflow-hidden rounded-lg">
                          <DishImage art={d.art} hue={r.hue} seed={d.slug} alt={d.name} variant="thumb" className="h-full w-full" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <VegMark diet={d.diet} size={12} />
                            <p className="truncate text-sm font-medium text-fg">{d.name}</p>
                          </div>
                          <p className="truncate text-xs text-fg/50">{r.name} · {getCity?.(d.citySlug)?.name}</p>
                        </div>
                        <span className="tnum shrink-0 text-sm font-semibold text-fg">{rupee(d.basePrice)}</span>
                      </button>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </Sheet>
  );
}
