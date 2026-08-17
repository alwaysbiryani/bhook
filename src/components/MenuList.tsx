"use client";

import { useMemo, useState } from "react";
import type { Dish } from "@/data/schema";
import { DishRow } from "@/components/DishRow";

export function MenuList({
  dishes,
  hue,
  restaurantName,
}: {
  dishes: Dish[];
  hue: number;
  restaurantName: string;
}) {
  const [vegOnly, setVegOnly] = useState(false);

  const shown = useMemo(
    () => (vegOnly ? dishes.filter((d) => d.diet === "veg") : dishes),
    [dishes, vegOnly],
  );

  const bestsellers = shown.filter((d) => d.bestseller);
  const rest = shown.filter((d) => !d.bestseller);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-xl text-chalk">Menu</h2>
        <label className="flex cursor-pointer items-center gap-2 text-sm text-steel">
          <span className="text-veg">Veg only</span>
          <button
            type="button"
            role="switch"
            aria-checked={vegOnly}
            aria-label="Veg only"
            onClick={() => setVegOnly((v) => !v)}
            className={`relative h-6 w-11 rounded-full border transition-colors ${
              vegOnly ? "border-veg bg-veg/25" : "border-steel/25 bg-ink-2"
            }`}
          >
            <span
              className={`absolute top-0.5 h-4.5 w-4.5 rounded-full transition-transform ${
                vegOnly ? "translate-x-5 bg-veg" : "translate-x-0.5 bg-steel"
              }`}
              style={{ width: 18, height: 18 }}
            />
          </button>
        </label>
      </div>

      {bestsellers.length > 0 && (
        <section>
          <h3 className="mt-4 text-xs font-bold uppercase tracking-wider text-turmeric">
            Bestsellers
          </h3>
          <div className="divide-y divide-steel/10">
            {bestsellers.map((d) => (
              <DishRow key={d.slug} dish={d} hue={hue} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h3 className="mt-6 text-xs font-bold uppercase tracking-wider text-steel-dim">
          Everything else at {restaurantName}
        </h3>
        <div className="divide-y divide-steel/10">
          {rest.map((d) => (
            <DishRow key={d.slug} dish={d} hue={hue} />
          ))}
        </div>
        {shown.length === 0 && (
          <p className="py-10 text-center text-steel-dim">
            No veg options here. Some kitchens just don&rsquo;t.
          </p>
        )}
      </section>
    </div>
  );
}
