import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { CityRestaurants, type CityItem } from "@/components/CityRestaurants";
import { RestaurantCard } from "@/components/RestaurantCard";
import { cities, getCity, restaurantsInCity, dishesOfRestaurant, topRatedInCity } from "@/data";

export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string }>;
}): Promise<Metadata> {
  const { city } = await params;
  const c = getCity(city);
  if (!c) return {};
  return {
    title: `Food delivery in ${c.name} that never arrives`,
    description: `Browse ${c.name}'s most iconic restaurants. Order the feeling, pay ₹0.`,
  };
}

export default async function CityPage({
  params,
}: {
  params: Promise<{ city: string }>;
}) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) notFound();
  const restaurants = restaurantsInCity(c.slug);
  const topRated = topRatedInCity(c.slug);

  const items: CityItem[] = restaurants.map((r) => {
    const ds = dishesOfRestaurant(r.slug);
    return {
      r,
      facts: {
        jain: ds.some((d) => d.jainPossible),
        nog: ds.some((d) => d.noOnionGarlicPossible),
        mild: ds.some((d) => d.spiceDefault >= 0 && d.spiceDefault <= 1),
      },
    };
  });

  return (
    <>
      <SiteHeader cityName={c.name} />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-5xl px-5 pt-8 pb-4">
          <p className="text-sm text-dim">{restaurants.length} restaurants</p>
          <h1 className="mt-1 font-display text-3xl text-fg sm:text-4xl">
            Never eat in {c.name}
            {c.nameDeva && <span className="font-deva ml-3 text-2xl text-dim">{c.nameDeva}</span>}
          </h1>
          <p className="mt-2 max-w-lg text-muted">
            The city&rsquo;s legends, from {c.state}. Fill your cart, watch the bill climb, pay nothing.
          </p>
        </section>
        {/* Top rated rail */}
        <section className="mx-auto w-full max-w-5xl px-5 py-4">
          <h2 className="mb-3 font-display text-2xl text-fg">Top rated in {c.name}</h2>
          <div className="no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5 pb-2">
            {topRated.map((r, i) => (
              <div key={r.slug} className="w-64 shrink-0">
                {/* The first rail card is the above-the-fold LCP on this route. */}
                <RestaurantCard r={r} priority={i < 2} />
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-5xl px-5 py-6">
          <h2 className="mb-4 font-display text-2xl text-fg">All {restaurants.length} places</h2>
          <CityRestaurants items={items} />
        </section>
      </main>
      <Footer />
    </>
  );
}
