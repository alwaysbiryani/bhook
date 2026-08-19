"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { CartGraphic } from "@/components/cart/CartGraphic";
import { DishImage } from "@/components/DishImage";
import { VegMark } from "@/components/ui/VegMark";
import { BillBreakdown } from "@/components/BillBreakdown";
import { useStore } from "@/store/useStore";
import { useUI } from "@/store/useUI";
import { cartTotals } from "@/lib/cart";
import { useCatalogue } from "@/lib/catalogue";
import { rupee } from "@/lib/format";

export default function CartPage() {
  const router = useRouter();
  const lines = useStore((s) => s.lines);
  const cartRestaurant = useStore((s) => s.cartRestaurant);
  const address = useStore((s) => s.address);
  const incLine = useStore((s) => s.incLine);
  const decLine = useStore((s) => s.decLine);
  const openAddress = useUI((s) => s.openAddress);

  const catalogue = useCatalogue(lines.length > 0);
  const { count, hydrated } = cartTotals(lines);
  const restaurant = catalogue && cartRestaurant ? catalogue.getRestaurant(cartRestaurant) : undefined;

  if (count === 0) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-20 text-center">
          <div className="h-40 w-40 opacity-90">
            <CartGraphic count={0} className="h-full w-full" />
          </div>
          <h1 className="mt-6 font-display text-3xl text-fg">Cart khaali hai.</h1>
          <p className="mt-2 text-dim">Nothing added yet. Go stare at some biryani you won&rsquo;t receive.</p>
          <Link
            href="/"
            className="mt-8 rounded-xl bg-bandhani px-6 py-3 font-medium text-fg shadow-pop transition active:scale-95"
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
        {/* Cart + restaurant */}
        <div className="flex items-center gap-4 rounded-2xl border border-line/10 bg-card/60 p-4">
          <div className="h-24 w-24 shrink-0">
            <CartGraphic count={count} className="h-full w-full" />
          </div>
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-wider text-dim">Your order from</p>
            <h1 className="truncate font-display text-2xl text-fg">{restaurant?.name}</h1>
            <p className="text-sm text-dim">
              {count} {count === 1 ? "item" : "items"} · {restaurant?.area}
            </p>
          </div>
        </div>

        {/* Deliver to */}
        <button
          type="button"
          onClick={openAddress}
          className="mt-4 flex w-full items-center gap-3 rounded-xl border border-line/10 bg-card/40 px-4 py-3 text-left hover:border-line/25"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-bandhani)" strokeWidth="2" aria-hidden>
            <path d="M12 21s-7-6.2-7-11a7 7 0 1 1 14 0c0 4.8-7 11-7 11z" />
            <circle cx="12" cy="10" r="2.5" />
          </svg>
          <div className="min-w-0 flex-1">
            {address ? (
              <>
                <p className="text-sm font-medium text-fg">Deliver to {address.label}</p>
                <p className="truncate text-xs text-dim">{address.line}, {address.area}</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium text-fg">Add a delivery address</p>
                <p className="text-xs text-dim">Drop a pin. It won&rsquo;t matter, but still.</p>
              </>
            )}
          </div>
          <span className="text-sm font-semibold text-bandhani">{address ? "Change" : "Add"}</span>
        </button>

        {/* Line items */}
        <section className="mt-5 rounded-2xl border border-line/10 bg-card/40">
          {hydrated.map(({ line, dish, restaurant: r, unit, lineTotal, summary }) => (
            <div key={line.key} className="flex gap-3 border-b border-line/10 p-4 last:border-0">
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-lg border border-line/10">
                <DishImage art={dish.art} hue={r.hue} seed={dish.slug} alt={dish.name} variant="thumb" className="h-full w-full" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <VegMark diet={dish.diet} size={13} />
                  <h3 className="truncate text-sm font-medium text-fg">{dish.name}</h3>
                </div>
                {summary && <p className="mt-0.5 line-clamp-1 text-xs text-dim">{summary}</p>}
                <p className="tnum mt-1 text-xs text-dim">{rupee(unit)} each</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <div className="flex items-center rounded-lg border border-line/20">
                  <button onClick={() => decLine(line.key)} className="inline-flex min-h-11 min-w-11 items-center justify-center text-bandhani active:bg-bandhani/10" aria-label="Decrease quantity">−</button>
                  <span className="tnum w-5 text-center text-sm text-fg">{line.qty}</span>
                  <button onClick={() => incLine(line.key)} className="inline-flex min-h-11 min-w-11 items-center justify-center text-bandhani active:bg-bandhani/10" aria-label="Increase quantity">+</button>
                </div>
                <span className="tnum mt-2 text-sm font-semibold text-fg">{rupee(lineTotal)}</span>
              </div>
            </div>
          ))}
        </section>

        {/* Full bill with coupon drawer + count-up savings */}
        <div className="mt-5">
          <BillBreakdown />
        </div>

        <button
          type="button"
          onClick={() => router.push("/checkout")}
          className="mt-5 mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-bandhani px-5 py-4 text-base font-semibold text-fg shadow-pop transition active:scale-[0.99]"
        >
          Proceed to pay
          <span className="opacity-60">·</span>
          <span className="tnum">₹0</span>
        </button>
      </main>
      <Footer />
    </>
  );
}
