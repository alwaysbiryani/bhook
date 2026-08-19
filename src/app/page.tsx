import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { DishImage } from "@/components/DishImage";
import { VegMark } from "@/components/ui/VegMark";
import { HeroTagline } from "@/components/HeroTagline";
import { SearchTrigger } from "@/components/SearchTrigger";
import { LocationBar } from "@/components/LocationBar";
import { CuisineFeed } from "@/components/CuisineFeed";
import {
  getCity,
  restaurantsInCity,
  bestsellersInCity,
  cuisinesInCity,
  getRestaurant,
} from "@/data";
import { DEFAULT_CITY } from "@/lib/brand";
import { rupee } from "@/lib/format";

export default function Home() {
  const city = getCity(DEFAULT_CITY)!;
  const restaurants = restaurantsInCity(city.slug);
  const trending = bestsellersInCity(city.slug, 8);
  const cuisines = cuisinesInCity(city.slug).slice(0, 10);

  return (
    <>
      <SiteHeader cityName={city.name} />
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto w-full max-w-5xl px-5 pt-10 pb-8 sm:pt-14">
          <HeroTagline />
          <h1 className="mt-3 max-w-2xl font-display text-4xl leading-[1.05] text-fg sm:text-6xl">
            Order the feeling.
            <br />
            <span className="text-bandhani">Skip the food.</span>
          </h1>
          <p className="mt-4 max-w-lg text-lg text-muted">
            Real dishes from {city.name}&rsquo;s most iconic kitchens. Fill your cart, stack every
            coupon, pay <span className="tnum">₹0</span>, and track a rider who never quite arrives.
          </p>

          <div className="mt-6">
            <LocationBar cityName={city.name} />
          </div>

          <SearchTrigger />
        </section>

        {/* Trending dishes */}
        <section className="mx-auto w-full max-w-5xl px-5 py-6">
          <h2 className="mb-4 font-display text-2xl text-fg">Trending in {city.name}</h2>
          <div className="no-scrollbar -mx-5 flex gap-4 overflow-x-auto px-5 pb-2">
            {trending.map((d) => {
              const r = getRestaurant(d.restaurantSlug)!;
              return (
                <Link
                  key={d.slug}
                  href={`/dish/${d.slug}`}
                  className="group w-44 shrink-0"
                >
                  <div className="aspect-square overflow-hidden rounded-xl border border-line/10">
                    <DishImage art={d.art} hue={r.hue} seed={d.slug} alt={d.name} className="h-full w-full transition duration-500 group-hover:scale-105" />
                  </div>
                  <div className="mt-2 flex items-center gap-1.5">
                    <VegMark diet={d.diet} size={13} />
                    <span className="line-clamp-1 text-sm font-medium text-fg">{d.name}</span>
                  </div>
                  <div className="mt-0.5 flex items-center gap-2">
                    <span className="tnum text-sm font-semibold text-fg">{rupee(d.basePrice)}</span>
                    <span className="tnum text-xs text-dim line-through">{rupee(d.mrp)}</span>
                  </div>
                  <p className="line-clamp-1 text-xs text-dim">{r.name}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Restaurant feed with working cuisine tags */}
        <CuisineFeed restaurants={restaurants} cuisines={cuisines} citySlug={city.slug} />
      </main>
      <Footer />
    </>
  );
}
