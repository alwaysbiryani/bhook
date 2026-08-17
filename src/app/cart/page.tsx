"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { Thali } from "@/components/thali/Thali";
import { DishImage } from "@/components/DishImage";
import { VegMark } from "@/components/ui/VegMark";
import { PriceTicker } from "@/components/PriceTicker";
import { useStore } from "@/store/useStore";
import { useUI } from "@/store/useUI";
import { cartTotals } from "@/lib/cart";
import { getRestaurant } from "@/data";
import { rupee } from "@/lib/format";

export default function CartPage() {
  const router = useRouter();
  const lines = useStore((s) => s.lines);
  const cartRestaurant = useStore((s) => s.cartRestaurant);
  const address = useStore((s) => s.address);
  const incLine = useStore((s) => s.incLine);
  const decLine = useStore((s) => s.decLine);
  const openAddress = useUI((s) => s.openAddress);

  const { itemTotal, itemMrp, count, hydrated } = cartTotals(lines);
  const restaurant = cartRestaurant ? getRestaurant(cartRestaurant) : undefined;
  const saved = itemMrp - itemTotal;

  if (count === 0) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-20 text-center">
          <div className="h-40 w-40 opacity-90">
            <Thali filled={0} weight={0} className="h-full w-full" />
          </div>
          <h1 className="mt-6 font-display text-3xl text-chalk">Thali khaali hai.</h1>
          <p className="mt-2 text-steel-dim">Nothing added yet. Go stare at some biryani you won&rsquo;t receive.</p>
          <Link
            href="/"
            className="mt-8 rounded-xl bg-bandhani px-6 py-3 font-medium text-chalk shadow-pop transition active:scale-95"
          >
            Browse restaurants
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-6">
        {/* Thali + restaurant */}
        <div className="flex items-center gap-4 rounded-2xl border border-steel/10 bg-ink-2/60 p-4">
          <div className="h-24 w-24 shrink-0">
            <Thali filled={Math.min(7, hydrated.length)} weight={Math.min(1, count / 8)} className="h-full w-full" />
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-steel-dim">Your thali from</p>
            <h1 className="truncate font-display text-2xl text-chalk">{restaurant?.name}</h1>
            <p className="text-sm text-steel-dim">
              {count} {count === 1 ? "item" : "items"} · {restaurant?.area}
            </p>
          </div>
        </div>

        {/* Deliver to */}
        <button
          type="button"
          onClick={openAddress}
          className="mt-4 flex w-full items-center gap-3 rounded-xl border border-steel/10 bg-ink-2/40 px-4 py-3 text-left hover:border-steel/25"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-bandhani)" strokeWidth="2" aria-hidden>
            <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          <div className="min-w-0 flex-1">
            {address ? (
              <>
                <p className="text-sm font-medium text-chalk">Deliver to {address.label}</p>
                <p className="truncate text-xs text-steel-dim">{address.line}, {address.area}</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-chalk">Add a delivery address</p>
                <p className="text-xs text-steel-dim">Drop a pin. It won&rsquo;t matter, but still.</p>
              </>
            )}
          </div>
          <span className="text-sm font-semibold text-bandhani">{address ? "Change" : "Add"}</span>
        </button>

        {/* Line items */}
        <section className="mt-5 rounded-2xl border border-steel/10 bg-ink-2/40">
          {hydrated.map(({ line, dish, restaurant: r, unit, lineTotal, summary }) => (
            <div key={line.key} className="flex gap-3 border-b border-steel/10 p-4 last:border-0">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-steel/10">
                <DishImage art={dish.art} hue={r.hue} seed={dish.slug} alt={dish.name} className="h-full w-full" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <VegMark diet={dish.diet} size={13} />
                  <h3 className="truncate text-sm font-medium text-chalk">{dish.name}</h3>
                </div>
                {summary && <p className="mt-0.5 line-clamp-1 text-xs text-steel-dim">{summary}</p>}
                <p className="tnum mt-1 text-xs text-steel-dim">{rupee(unit)} each</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <div className="flex items-center rounded-lg border border-steel/20">
                  <button onClick={() => decLine(line.key)} className="px-2.5 py-1 text-bandhani" aria-label="Decrease">−</button>
                  <span className="tnum w-5 text-center text-sm text-chalk">{line.qty}</span>
                  <button onClick={() => incLine(line.key)} className="px-2.5 py-1 text-bandhani" aria-label="Increase">+</button>
                </div>
                <span className="tnum mt-2 text-sm font-semibold text-chalk">{rupee(lineTotal)}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Subtotal preview (full bill + coupons arrive in Phase 3) */}
        <section className="mt-5 rounded-2xl border border-steel/10 bg-ink-2/60 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-steel">Item total</span>
            <PriceTicker value={itemTotal} className="font-semibold text-chalk" />
          </div>
          {saved > 0 && (
            <div className="mt-2 flex items-center justify-between text-sm">
              <span className="text-turmeric">Saved vs MRP</span>
              <PriceTicker value={saved} className="font-semibold text-turmeric" prefix="−₹" />
            </div>
          )}
          <p className="mt-3 text-xs text-steel-dim">Coupons, free delivery and the full bill on the next screen.</p>
        </section>

        <button
          type="button"
          onClick={() => router.push("/checkout")}
          className="mt-5 mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-bandhani px-5 py-4 text-base font-semibold text-chalk shadow-pop transition active:scale-[0.99]"
        >
          Proceed to pay
          <span className="opacity-60">·</span>
          <PriceTicker value={itemTotal} />
        </button>
      </main>
      <Footer />
    </>
  );
}
