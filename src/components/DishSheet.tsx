"use client";

import { useEffect, useMemo, useState } from "react";
import { Sheet } from "@/components/sheet/Sheet";
import { DishImage } from "@/components/DishImage";
import { VegMark } from "@/components/ui/VegMark";
import { PriceTicker } from "@/components/PriceTicker";
import { useUI } from "@/store/useUI";
import { useStore } from "@/store/useStore";
import { getDish, getRestaurant } from "@/data";
import { getOptionGroup, SPICE_LEVELS } from "@/data/options";
import {
  defaultSelection,
  computeUnitPrice,
  computeUnitMrp,
  type Selection,
} from "@/lib/pricing";
import { play } from "@/lib/sound";
import { rupee } from "@/lib/format";

export function DishSheet() {
  const dishSlug = useUI((s) => s.dishSlug);
  const closeDish = useUI((s) => s.closeDish);
  const pulseCart = useUI((s) => s.pulseCart);
  const addLine = useStore((s) => s.addLine);

  const dish = dishSlug ? getDish(dishSlug) : undefined;
  const restaurant = dish ? getRestaurant(dish.restaurantSlug) : undefined;

  const [sel, setSel] = useState<Selection>(() =>
    dish ? defaultSelection(dish) : { choices: {}, spice: 0 },
  );
  const [qty, setQty] = useState(1);

  // reset local state whenever a new dish opens
  useEffect(() => {
    if (dish) {
      setSel(defaultSelection(dish));
      setQty(1);
    }
  }, [dishSlug]); // eslint-disable-line react-hooks/exhaustive-deps

  const unit = useMemo(() => (dish ? computeUnitPrice(dish, sel) : 0), [dish, sel]);
  const unitMrp = useMemo(() => (dish ? computeUnitMrp(dish, sel) : 0), [dish, sel]);
  const total = unit * qty;

  if (!dish || !restaurant) return <Sheet open={false} onClose={closeDish}>{null}</Sheet>;

  const toggleSingle = (key: string, id: string) =>
    setSel((s) => ({ ...s, choices: { ...s.choices, [key]: [id] } }));

  const toggleMulti = (key: string, id: string) =>
    setSel((s) => {
      const cur = s.choices[key] ?? [];
      const next = cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id];
      return { ...s, choices: { ...s.choices, [key]: next } };
    });

  const onAdd = () => {
    addLine(dish.slug, dish.restaurantSlug, sel, qty);
    play("pop");
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate(12);
    pulseCart();
    closeDish();
  };

  return (
    <Sheet open={!!dishSlug} onClose={closeDish} labelledBy="dish-title">
      {/* Hero */}
      <div className="relative">
        <div className="mx-auto mt-1 aspect-[16/9] w-full overflow-hidden">
          <DishImage art={dish.art} hue={restaurant.hue} seed={dish.slug} alt={dish.name} className="h-full w-full" />
        </div>
      </div>

      <div className="px-5 pb-32 pt-4">
        <div className="flex items-center gap-2">
          <VegMark diet={dish.diet} />
          {dish.bestseller && (
            <span className="rounded bg-turmeric/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[color:var(--color-bandhani-ink)]">
              ★ Bestseller
            </span>
          )}
        </div>
        <h2 id="dish-title" className="mt-1.5 font-display text-2xl leading-tight text-ink">
          {dish.name}
          {dish.nameDeva && <span className="font-deva ml-2 text-lg text-ink/50">{dish.nameDeva}</span>}
        </h2>
        <p className="mt-0.5 text-sm text-ink/55">{restaurant.name} · {restaurant.area}</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="tnum text-lg font-semibold text-ink">{rupee(dish.basePrice)}</span>
          <span className="tnum text-sm text-ink/40 line-through">{rupee(dish.mrp)}</span>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-ink/70">{dish.description}</p>

        {/* Option groups */}
        {dish.optionGroups.map((key) => {
          const g = getOptionGroup(key);
          if (!g) return null;
          const chosen = sel.choices[key] ?? [];
          return (
            <fieldset key={key} className="mt-6">
              <legend className="flex items-baseline gap-2 text-sm font-semibold text-ink">
                {g.label}
                <span className="text-xs font-normal text-ink/45">
                  {g.type === "single" ? (g.required ? "Pick one" : "Optional") : "Add any"}
                </span>
              </legend>
              <div className="mt-2 flex flex-wrap gap-2">
                {g.options.map((o) => {
                  const on = chosen.includes(o.id);
                  return (
                    <button
                      key={o.id}
                      type="button"
                      onClick={() =>
                        g.type === "single" ? toggleSingle(key, o.id) : toggleMulti(key, o.id)
                      }
                      aria-pressed={on}
                      className={`rounded-xl border px-3.5 py-2 text-sm transition ${
                        on
                          ? "border-bandhani bg-bandhani/10 text-[color:var(--color-bandhani-ink)]"
                          : "border-ink/15 text-ink/75 hover:border-ink/30"
                      }`}
                    >
                      {o.label}
                      {o.priceDelta > 0 && (
                        <span className="tnum ml-1.5 text-xs text-ink/50">+₹{o.priceDelta}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}

        {/* Spice slider */}
        {dish.spicy && dish.spiceDefault >= 0 && (
          <fieldset className="mt-6">
            <legend className="text-sm font-semibold text-ink">How much heat?</legend>
            <input
              type="range"
              min={0}
              max={4}
              step={1}
              value={sel.spice < 0 ? 0 : sel.spice}
              onChange={(e) => setSel((s) => ({ ...s, spice: Number(e.target.value) }))}
              className="mt-3 w-full accent-[color:var(--color-bandhani)]"
              aria-label="Spice level"
            />
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-xs text-ink/40">🌶</span>
              <span className="text-sm font-medium text-[color:var(--color-bandhani-ink)]">
                {SPICE_LEVELS[Math.max(0, sel.spice)]}
              </span>
              <span className="text-xs text-ink/40">🌶🌶🌶</span>
            </div>
          </fieldset>
        )}
      </div>

      {/* Sticky footer */}
      <div className="fixed inset-x-0 bottom-0 z-10 mx-auto w-full max-w-lg border-t border-ink/10 bg-chalk px-5 py-3.5">
        <div className="flex items-center gap-3">
          <div className="flex items-center rounded-xl border border-ink/15">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="px-3.5 py-2 text-lg text-bandhani"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="tnum w-6 text-center text-ink">{qty}</span>
            <button
              type="button"
              onClick={() => setQty((q) => q + 1)}
              className="px-3.5 py-2 text-lg text-bandhani"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <button
            type="button"
            onClick={onAdd}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-bandhani px-5 py-3 font-semibold text-chalk shadow-pop transition active:scale-[0.98]"
          >
            <span>Add to cart</span>
            <span className="opacity-60">·</span>
            <PriceTicker value={total} />
            {unitMrp > unit && (
              <span className="tnum text-xs text-chalk/60 line-through">{rupee(unitMrp * qty)}</span>
            )}
          </button>
        </div>
      </div>
    </Sheet>
  );
}
