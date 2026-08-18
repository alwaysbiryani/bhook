"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Footer } from "@/components/layout/Footer";
import { CartGraphic } from "@/components/cart/CartGraphic";
import { useStore } from "@/store/useStore";
import { inr, rupee } from "@/lib/format";

export default function OrdersPage() {
  const router = useRouter();
  const orders = useStore((s) => s.orders);
  const lifetimeSaved = useStore((s) => s.lifetimeSaved);
  const addLine = useStore((s) => s.addLine);

  const reorder = (id: string) => {
    const o = orders.find((x) => x.id === id);
    if (!o) return;
    for (const l of o.lines) addLine(l.dishSlug, o.restaurantSlug, l.selection, l.qty);
    router.push("/cart");
  };

  if (orders.length === 0) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-24 text-center">
          <div className="h-36 w-36 opacity-90">
            <CartGraphic count={0} className="h-full w-full" />
          </div>
          <h1 className="mt-6 font-display text-3xl text-chalk">No orders yet.</h1>
          <p className="mt-2 text-steel-dim">Nothing ordered, nothing delivered. Perfectly balanced.</p>
          <Link href="/" className="mt-8 rounded-xl bg-bandhani px-6 py-3 font-medium text-chalk">Start not ordering</Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-xl flex-1 px-5 py-6">
        {/* lifetime */}
        <section className="rounded-2xl border border-turmeric/20 bg-turmeric/8 p-5 text-center">
          <p className="text-xs uppercase tracking-wider text-turmeric/80">Lifetime not spent</p>
          <p className="tnum mt-1 font-display text-4xl text-turmeric">₹{inr(lifetimeSaved)}</p>
          <p className="mt-1 text-sm text-steel-dim">
            <span className="tnum">{orders.length}</span> order{orders.length === 1 ? "" : "s"} never delivered
          </p>
        </section>

        <h1 className="mt-6 mb-3 font-display text-2xl text-chalk">Your orders</h1>
        <div className="space-y-3">
          {orders.map((o) => {
            const count = o.lines.reduce((n, l) => n + l.qty, 0);
            const isDelivered = o.status === "delivered";
            return (
              <div key={o.id} className="flex gap-3 rounded-2xl border border-steel/10 bg-ink-2/50 p-4">
                {/* empty photo */}
                <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-lg border border-dashed border-steel/20 bg-ink">
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="var(--color-steel-dim)" strokeWidth="1.2" aria-label="No photo — nothing arrived">
                    <circle cx="12" cy="12" r="8" />
                    <path d="M7 15c2-2 8-2 10 0" opacity="0.5" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="truncate font-medium text-chalk">{o.restaurantName}</h3>
                    <span className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] font-semibold ${isDelivered ? "bg-veg/15 text-veg" : "bg-bandhani/15 text-bandhani"}`}>
                      {isDelivered ? "Delivered" : "On the way"}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-steel-dim">
                    {count} item{count === 1 ? "" : "s"} · {new Date(o.placedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · saved{" "}
                    <span className="tnum text-turmeric">{rupee(o.saved)}</span>
                  </p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => reorder(o.id)} className="rounded-lg bg-bandhani px-3.5 py-1.5 text-sm font-semibold text-chalk active:scale-95">
                      Reorder
                    </button>
                    {!isDelivered && (
                      <Link href={`/track/${o.id}`} className="rounded-lg border border-steel/20 px-3.5 py-1.5 text-sm text-chalk">
                        Track
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </>
  );
}
