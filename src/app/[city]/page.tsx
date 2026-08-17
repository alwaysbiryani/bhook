import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { RestaurantCard } from "@/components/RestaurantCard";
import { cities, getCity, restaurantsInCity } from "@/data";

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

  return (
    <>
      <SiteHeader cityName={c.name} />
      <main className="flex-1">
        <section className="mx-auto w-full max-w-5xl px-5 pt-8 pb-4">
          <p className="text-sm text-steel-dim">{restaurants.length} restaurants</p>
          <h1 className="mt-1 font-display text-3xl text-chalk sm:text-4xl">
            Never eat in {c.name}
            {c.nameDeva && <span className="font-deva ml-3 text-2xl text-steel-dim">{c.nameDeva}</span>}
          </h1>
          <p className="mt-2 max-w-lg text-steel">
            The city&rsquo;s legends, from {c.state}. Fill a thali, watch the bill climb, pay nothing.
          </p>
        </section>
        <section className="mx-auto w-full max-w-5xl px-5 py-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {restaurants.map((r) => (
              <RestaurantCard key={r.slug} r={r} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
