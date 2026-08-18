import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { DishImage } from "@/components/DishImage";
import { VegMark } from "@/components/ui/VegMark";
import { AddButton } from "@/components/AddButton";
import { dishes, getDish, getRestaurant, getCity } from "@/data";
import { SPICE_LEVELS } from "@/data/options";
import { rupee, pct } from "@/lib/format";
import { BRAND } from "@/lib/brand";

export function generateStaticParams() {
  return dishes.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const d = getDish(slug);
  if (!d) return {};
  const r = getRestaurant(d.restaurantSlug);
  return {
    title: `${d.name} from ${r?.name}`,
    description: `${d.description} Order the feeling on ${BRAND.name} — ${rupee(d.basePrice)}, and ₹0 to pay.`,
    openGraph: { title: `${d.name} · ${r?.name}`, description: d.description },
  };
}

const RECIPE = [
  "Marinate, simmer, or fry — depending on who you ask and which grandmother is in the kitchen.",
  "Let it rest, plate it up, and photograph it obsessively.",
  "Hand it to a rider named Ramesh who is definitely, definitely on his way.",
  "Wait. Keep waiting. The dabba never comes. That was always the recipe.",
];

export default async function DishPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDish(slug);
  if (!d) notFound();
  const r = getRestaurant(d.restaurantSlug);
  const c = r ? getCity(r.citySlug) : undefined;
  if (!r || !c) notFound();
  const off = pct(d.basePrice, d.mrp);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MenuItem",
    name: d.name,
    description: d.description,
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SiteHeader cityName={c.name} />
      <main className="mx-auto w-full max-w-2xl flex-1 px-5 py-6">
        <nav className="mb-3 flex flex-wrap items-center gap-1.5 text-xs text-steel-dim">
          <Link href={`/${c.slug}`} className="hover:text-chalk">{c.name}</Link>
          <span>/</span>
          <Link href={`/${c.slug}/${r.slug}`} className="hover:text-chalk">{r.name}</Link>
          <span>/</span>
          <span className="text-steel">{d.name}</span>
        </nav>

        <div className="overflow-hidden rounded-2xl border border-steel/10">
          <div className="aspect-[16/9] w-full">
            <DishImage art={d.art} hue={r.hue} seed={d.slug} alt={d.name} className="h-full w-full" />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2">
          <VegMark diet={d.diet} />
          {d.bestseller && (
            <span className="rounded bg-turmeric/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-turmeric">★ Bestseller</span>
          )}
        </div>
        <h1 className="mt-1.5 font-display text-4xl leading-tight text-chalk">
          {d.name}
          {d.nameDeva && <span className="font-deva ml-3 text-2xl text-steel-dim">{d.nameDeva}</span>}
        </h1>
        <Link href={`/${c.slug}/${r.slug}`} className="mt-1 inline-block text-sm text-bandhani hover:underline">
          {r.name} · {r.area}, {c.name}
        </Link>

        <div className="mt-3 flex items-center gap-2">
          <span className="tnum text-2xl font-semibold text-chalk">{rupee(d.basePrice)}</span>
          <span className="tnum text-steel-dim line-through">{rupee(d.mrp)}</span>
          {off > 0 && <span className="text-sm font-semibold text-turmeric">{off}% off</span>}
        </div>

        <p className="mt-4 text-lg leading-relaxed text-steel">{d.description}</p>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-steel-dim">
          <span className="tnum">{d.prepMins} min · never</span>
          <span className="tnum">{d.calories} kcal (imaginary)</span>
          {d.spicy && d.spiceDefault >= 0 && <span className="text-bandhani/80">🌶 {SPICE_LEVELS[d.spiceDefault]}</span>}
          {d.jainPossible && <span className="text-veg">Jain possible</span>}
        </div>

        <div className="mt-6">
          <AddButton
            dishSlug={d.slug}
            label="Add to cart"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-bandhani px-5 py-4 text-lg font-semibold text-chalk shadow-pop transition active:scale-[0.99]"
          />
        </div>

        {/* Recipe stub — SEO + the joke */}
        <section className="mt-10">
          <h2 className="font-display text-2xl text-chalk">How it&rsquo;s (not) made</h2>
          <ol className="mt-3 space-y-3">
            {RECIPE.map((step, i) => (
              <li key={i} className="flex gap-3 text-steel">
                <span className="tnum grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink-2 text-sm text-turmeric">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-8 rounded-2xl border border-steel/10 bg-ink-2/50 p-5 text-center">
          <p className="text-steel">More from <span className="text-chalk">{r.name}</span>?</p>
          <Link href={`/${c.slug}/${r.slug}`} className="mt-3 inline-block rounded-xl border border-steel/20 px-5 py-2.5 text-sm font-semibold text-chalk hover:border-steel/40">
            See the full menu
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
