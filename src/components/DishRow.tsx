import type { Dish } from "@/data/schema";
import { VegMark } from "@/components/ui/VegMark";
import { DishImage } from "@/components/DishImage";
import { AddButton } from "@/components/AddButton";
import { rupee, pct } from "@/lib/format";
import { SPICE_LEVELS } from "@/data/options";

export function DishRow({ dish, hue }: { dish: Dish; hue: number }) {
  const off = pct(dish.basePrice, dish.mrp);
  return (
    <article className="dish-row flex gap-4 py-5" data-diet={dish.diet}>
      <div className="min-w-0 flex-1">
        <div className="mb-1.5 flex items-center gap-2">
          <VegMark diet={dish.diet} />
          {dish.bestseller && (
            <span className="rounded bg-turmeric/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-turmeric">
              ★ Bestseller
            </span>
          )}
        </div>
        <h3 className="font-medium leading-tight text-chalk">
          {dish.name}
          {dish.nameDeva && (
            <span className="font-deva ml-2 text-sm text-steel-dim">{dish.nameDeva}</span>
          )}
        </h3>
        <div className="mt-1 flex items-center gap-2">
          <span className="tnum font-semibold text-chalk">{rupee(dish.basePrice)}</span>
          <span className="tnum text-sm text-steel-dim line-through">{rupee(dish.mrp)}</span>
          {off > 0 && <span className="text-xs font-semibold text-turmeric">{off}% off</span>}
        </div>
        <p className="mt-2 line-clamp-2 max-w-md text-sm leading-relaxed text-steel-dim">
          {dish.description}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-steel-dim">
          <span className="tnum">{dish.prepMins} min</span>
          <span className="tnum">{dish.calories} kcal</span>
          {dish.spicy && dish.spiceDefault >= 0 && (
            <span className="text-[color:var(--color-bandhani-text)]">🌶 {SPICE_LEVELS[dish.spiceDefault]}</span>
          )}
        </div>
      </div>

      <div className="relative w-28 shrink-0 sm:w-32">
        <div className="aspect-square overflow-hidden rounded-xl border border-steel/10">
          <DishImage art={dish.art} hue={hue} seed={dish.slug} alt={dish.name} variant="thumb" className="h-full w-full" />
        </div>
        <AddButton dishSlug={dish.slug} />
      </div>
    </article>
  );
}
