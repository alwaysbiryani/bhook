import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { MenuList } from "@/components/MenuList";
import { StarRating } from "@/components/ui/StarRating";
import {
  restaurants,
  getRestaurant,
  getCity,
  dishesOfRestaurant,
} from "@/data";

export function generateStaticParams() {
  return restaurants.map((r) => ({ city: r.citySlug, restaurant: r.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ city: string; restaurant: string }>;
}): Promise<Metadata> {
  const { restaurant } = await params;
  const r = getRestaurant(restaurant);
  if (!r) return {};
  return {
    title: `${r.name}, ${r.area} — menu (that never comes)`,
    description: r.tagline,
  };
}

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ city: string; restaurant: string }>;
}) {
  const { city, restaurant } = await params;
  const r = getRestaurant(restaurant);
  const c = getCity(city);
  if (!r || !c || r.citySlug !== c.slug) notFound();
  const dishes = dishesOfRestaurant(r.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: r.name,
    servesCuisine: r.cuisines,
    address: { "@type": "PostalAddress", addressLocality: r.area, addressRegion: c.name },
    aggregateRating: { "@type": "AggregateRating", ratingValue: r.rating, ratingCount: 1000 },
    priceRange: r.priceForTwo < 400 ? "₹" : r.priceForTwo <= 900 ? "₹₹" : "₹₹₹",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader cityName={c.name} />
      <main className="flex-1">
        {/* Restaurant header */}
        <section className="mx-auto w-full max-w-3xl px-5 pt-6">
          <nav className="mb-3 flex items-center gap-1.5 text-xs text-steel-dim">
            <Link href={`/${c.slug}`} className="hover:text-chalk">
              {c.name}
            </Link>
            <span>/</span>
            <span className="text-steel">{r.area}</span>
          </nav>

          <div className="rounded-2xl border border-steel/10 bg-ink-2/60 p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="font-display text-3xl leading-tight text-chalk">{r.name}</h1>
                <p className="mt-1 text-sm text-steel-dim">
                  {r.cuisines.join(" · ")}
                  {r.since && <> · since <span className="tnum">{r.since}</span></>}
                </p>
                <p className="mt-0.5 text-sm text-steel-dim">{r.area}, {c.name}</p>
              </div>
              <StarRating rating={r.rating} count={r.ratingCount} />
            </div>

            <p className="mt-4 border-l-2 border-turmeric/50 pl-3 text-sm italic leading-relaxed text-steel">
              {r.tagline}
            </p>

            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-steel-dim">
              <span className="tnum">{r.prepMins}–{r.prepMins + 8} min · never</span>
              <span className="tnum">₹{r.priceForTwo} for two</span>
              {r.bestFor && <span>Famous for {r.bestFor}</span>}
            </div>
          </div>
        </section>

        {/* Menu */}
        <section className="mx-auto w-full max-w-3xl px-5 py-6">
          <MenuList dishes={dishes} hue={r.hue} restaurantName={r.name} />
        </section>
      </main>
      <Footer />
    </>
  );
}
