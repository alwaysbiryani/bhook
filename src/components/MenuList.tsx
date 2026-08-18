import type { Dish } from "@/data/schema";
import { DishRow } from "@/components/DishRow";
import { VegToggle } from "@/components/VegToggle";

/** Server-rendered menu. The veg filter is CSS-only (see VegToggle + globals.css),
 *  so the dish list ships as static HTML — only the toggle and each Add button are
 *  client islands, keeping the page light. */
export function MenuList({
  dishes,
  hue,
  restaurantName,
}: {
  dishes: Dish[];
  hue: number;
  restaurantName: string;
}) {
  const bestsellers = dishes.filter((d) => d.bestseller);
  const rest = dishes.filter((d) => !d.bestseller);

  return (
    <div id="menu-root">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-display text-xl text-chalk">Menu</h2>
        <VegToggle />
      </div>

      {bestsellers.length > 0 && (
        <section className="menu-section">
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

      <section className="menu-section">
        <h3 className="mt-6 text-xs font-bold uppercase tracking-wider text-steel-dim">
          Everything else at {restaurantName}
        </h3>
        <div className="divide-y divide-steel/10">
          {rest.map((d) => (
            <DishRow key={d.slug} dish={d} hue={hue} />
          ))}
        </div>
      </section>

      {/* shown only when veg-only hides everything on offer */}
      <p className="veg-empty hidden py-10 text-center text-steel-dim">
        No veg options here. Some kitchens just don&rsquo;t.
      </p>
    </div>
  );
}
