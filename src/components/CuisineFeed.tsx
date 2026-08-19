"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Restaurant } from "@/data/schema";
import { RestaurantCard } from "@/components/RestaurantCard";

/** The restaurant feed with a working cuisine filter rail on top. Tapping a tag
 *  (Mughlai, Street Food, Biryani…) narrows the grid to places that serve it;
 *  "All" clears it. Filtering is client-side over the city's restaurants. */
export function CuisineFeed({
  restaurants,
  cuisines,
  citySlug,
}: {
  restaurants: Restaurant[];
  cuisines: string[];
  citySlug: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  const shown = useMemo(
    () =>
      active
        ? restaurants.filter((r) => r.cuisines.includes(active))
        : restaurants,
    [restaurants, active],
  );

  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-6">
      {/* Working cuisine tags */}
      <div className="no-scrollbar -mx-5 mb-5 flex gap-2 overflow-x-auto px-5 pb-1">
        <button
          type="button"
          onClick={() => setActive(null)}
          aria-pressed={active === null}
          className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition ${
            active === null
              ? "border-bandhani bg-bandhani/15 text-fg"
              : "border-line/15 text-muted hover:border-line/30"
          }`}
        >
          All
        </button>
        {cuisines.map((c) => {
          const on = active === c;
          return (
            <button
              key={c}
              type="button"
              onClick={() => setActive(on ? null : c)}
              aria-pressed={on}
              className={`shrink-0 whitespace-nowrap rounded-full border px-4 py-1.5 text-sm transition ${
                on
                  ? "border-bandhani bg-bandhani/15 text-fg"
                  : "border-line/15 text-muted hover:border-line/30"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="font-display text-2xl text-fg">
          {active
            ? `${shown.length} ${active} ${shown.length === 1 ? "place" : "places"}`
            : `${shown.length} places that never deliver`}
        </h2>
        <Link href={`/${citySlug}`} className="text-sm text-bandhani hover:underline">
          See all
        </Link>
      </div>

      {shown.length === 0 ? (
        <p className="py-16 text-center text-dim">
          Nothing tagged {active} here. Pick another — the food still won&rsquo;t come.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((r, i) => (
            <RestaurantCard key={r.slug} r={r} priority={i < 3} />
          ))}
        </div>
      )}
    </section>
  );
}
