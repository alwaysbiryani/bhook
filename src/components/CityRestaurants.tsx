"use client";

import { useMemo, useState } from "react";
import type { Restaurant } from "@/data/schema";
import { RestaurantCard } from "@/components/RestaurantCard";

export interface CityItem {
  r: Restaurant;
  facts: { jain: boolean; nog: boolean; mild: boolean };
}

type Key = "veg" | "jain" | "nog" | "fast" | "mild" | "p1" | "p2" | "p3";

const FILTERS: { key: Key; label: string }[] = [
  { key: "veg", label: "Pure Veg" },
  { key: "jain", label: "Jain" },
  { key: "nog", label: "No onion-garlic" },
  { key: "mild", label: "Mild options" },
  { key: "fast", label: "Under 30 min" },
  { key: "p1", label: "₹" },
  { key: "p2", label: "₹₹" },
  { key: "p3", label: "₹₹₹" },
];

function priceBucket(priceForTwo: number): "p1" | "p2" | "p3" {
  if (priceForTwo < 300) return "p1";
  if (priceForTwo <= 800) return "p2";
  return "p3";
}

export function CityRestaurants({ items }: { items: CityItem[] }) {
  const [active, setActive] = useState<Set<Key>>(new Set());

  const toggle = (k: Key) =>
    setActive((prev) => {
      const next = new Set(prev);
      next.has(k) ? next.delete(k) : next.add(k);
      return next;
    });

  const shown = useMemo(() => {
    const priceKeys = (["p1", "p2", "p3"] as Key[]).filter((k) => active.has(k));
    return items.filter(({ r, facts }) => {
      if (active.has("veg") && r.serves !== "veg") return false;
      if (active.has("jain") && !facts.jain) return false;
      if (active.has("nog") && !facts.nog) return false;
      if (active.has("mild") && !facts.mild) return false;
      if (active.has("fast") && r.prepMins >= 30) return false;
      if (priceKeys.length > 0 && !priceKeys.includes(priceBucket(r.priceForTwo))) return false;
      return true;
    });
  }, [items, active]);

  return (
    <div>
      <div className="no-scrollbar -mx-5 mb-5 flex gap-2 overflow-x-auto px-5">
        {FILTERS.map((f) => {
          const on = active.has(f.key);
          return (
            <button
              key={f.key}
              type="button"
              onClick={() => toggle(f.key)}
              aria-pressed={on}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-sm transition ${
                on
                  ? "border-bandhani bg-bandhani/15 text-fg"
                  : "border-line/15 text-muted hover:border-line/30"
              }`}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {shown.length === 0 ? (
        <p className="py-16 text-center text-dim">
          No place matches all that. Loosen a filter — the food still won&rsquo;t come.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map(({ r }, i) => (
            <RestaurantCard key={r.slug} r={r} priority={i < 3} />
          ))}
        </div>
      )}
    </div>
  );
}
