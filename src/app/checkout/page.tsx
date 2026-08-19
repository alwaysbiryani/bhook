"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { PriceTicker } from "@/components/PriceTicker";
import { PaySequence } from "@/components/checkout/PaySequence";
import { RewardScreen } from "@/components/checkout/RewardScreen";
import { useStore, type Order } from "@/store/useStore";
import { useUI } from "@/store/useUI";
import { computeBill } from "@/lib/bill";
import { useCatalogue } from "@/lib/catalogue";
import { RIDERS } from "@/data/riders";
import { primeAudio } from "@/lib/sound";

type Method = "upi" | "card" | "cod";
type Phase = "form" | "paying" | "reward";

const METHODS: { id: Method; label: string; sub: string }[] = [
  { id: "upi", label: "UPI", sub: "Pay by any UPI app" },
  { id: "card", label: "Card", sub: "We won't actually read it" },
  { id: "cod", label: "Cash on Delivery", sub: "There is no cash and no delivery" },
];

function newOrderId() {
  return `o${Date.now().toString(36)}${Math.floor(Math.random() * 1e4).toString(36)}`;
}

export default function CheckoutPage() {
  const lines = useStore((s) => s.lines);
  const cartRestaurant = useStore((s) => s.cartRestaurant);
  const address = useStore((s) => s.address);
  const citySlug = useStore((s) => s.citySlug);
  const appliedCoupons = useStore((s) => s.appliedCoupons);
  const addOrder = useStore((s) => s.addOrder);
  const openAddress = useUI((s) => s.openAddress);

  const [method, setMethod] = useState<Method>("upi");
  const [phase, setPhase] = useState<Phase>("form");
  const [placed, setPlaced] = useState<Order | null>(null);

  const catalogue = useCatalogue(lines.length > 0);
  const restaurant = catalogue && cartRestaurant ? catalogue.getRestaurant(cartRestaurant) : undefined;
  const bill = useMemo(() => computeBill(lines, appliedCoupons), [lines, appliedCoupons, catalogue]);

  const startPay = () => {
    if (!restaurant || lines.length === 0) return;
    primeAudio();
    const order: Order = {
      id: newOrderId(),
      placedAt: Date.now(),
      restaurantSlug: restaurant.slug,
      restaurantName: restaurant.name,
      citySlug,
      lines,
      itemTotal: bill.itemTotal,
      saved: bill.saved,
      coupons: appliedCoupons,
      address,
      riderId: RIDERS[Math.floor(Math.random() * RIDERS.length)].id,
      otp: String(Math.floor(1000 + Math.random() * 9000)),
      status: "cooking",
    };
    setPlaced(order);
    addOrder(order); // clears the cart, bumps lifetime savings + streak
    setPhase("paying");
  };

  if (phase === "paying" && placed) {
    return <PaySequence payee={placed.restaurantName} onDone={() => setPhase("reward")} />;
  }

  if (phase === "reward" && placed) {
    return (
      <>
        <SiteHeader />
        <RewardScreen orderId={placed.id} saved={placed.saved} itemTotal={placed.itemTotal} restaurantName={placed.restaurantName} />
      </>
    );
  }

  if (lines.length === 0 || !restaurant) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-6 py-24 text-center">
          <h1 className="font-display text-3xl text-fg">Nothing to pay for.</h1>
          <p className="mt-2 text-dim">Your cart is empty. Which is, admittedly, on brand.</p>
          <Link href="/" className="mt-8 rounded-xl bg-bandhani px-6 py-3 font-medium text-fg">
            Browse restaurants
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-md flex-1 px-5 py-6">
        <h1 className="font-display text-3xl text-fg">Checkout</h1>

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
              <p className="text-sm font-medium text-fg">Add a delivery address</p>
            )}
          </div>
          <span className="text-sm font-semibold text-bandhani">{address ? "Change" : "Add"}</span>
        </button>

        {/* Order line */}
        <div className="mt-4 flex items-center justify-between rounded-xl border border-line/10 bg-card/40 px-4 py-3">
          <div>
            <p className="text-sm font-medium text-fg">{restaurant.name}</p>
            <p className="text-xs text-dim">{bill.count} items · {restaurant.area}</p>
          </div>
          <Link href="/cart" className="text-sm font-semibold text-bandhani">Edit</Link>
        </div>

        {/* Payment method — our own UPI-app visual language */}
        <h2 className="mt-6 mb-2 text-sm font-bold uppercase tracking-wider text-dim">Pay using</h2>
        <div className="space-y-2">
          {METHODS.map((m) => {
            const on = method === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id)}
                aria-pressed={on}
                className={`flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition ${
                  on ? "border-bandhani bg-bandhani/10" : "border-line/12 hover:border-line/25"
                }`}
              >
                <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${on ? "border-bandhani" : "border-line/30"}`}>
                  {on && <span className="h-2.5 w-2.5 rounded-full bg-bandhani" />}
                </span>
                <span className="flex-1">
                  <span className="block text-sm font-medium text-fg">{m.label}</span>
                  <span className="block text-xs text-dim">{m.sub}</span>
                </span>
              </button>
            );
          })}
        </div>

        {/* method detail */}
        <div className="mt-3 rounded-xl border border-line/10 bg-card/40 p-4">
          {method === "upi" && (
            <div>
              <p className="text-xs text-dim">Paying from</p>
              <p className="tnum mt-1 text-fg">bhookha@dabba</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Dabba Pay", "Any UPI", "Scan QR"].map((x) => (
                  <span key={x} className="rounded-lg border border-line/15 px-3 py-1.5 text-xs text-muted">{x}</span>
                ))}
              </div>
            </div>
          )}
          {method === "card" && (
            <div>
              <p className="tnum text-fg">•••• •••• •••• 0000</p>
              <p className="mt-1 text-xs text-dim">A card we invented. We never asked for yours, and never will.</p>
            </div>
          )}
          {method === "cod" && (
            <p className="text-sm text-muted">
              You&rsquo;ll pay <span className="tnum text-fg">₹0</span> in cash to a rider who isn&rsquo;t coming, for food that isn&rsquo;t real. Deal?
            </p>
          )}
        </div>

        {/* Savings + pay */}
        <div className="mt-5 flex items-center justify-between rounded-xl bg-turmeric/12 px-4 py-3">
          <span className="text-sm font-medium text-turmeric-text">You&rsquo;re saving</span>
          <PriceTicker value={bill.saved} className="text-lg font-bold text-turmeric-text" />
        </div>

        <button
          type="button"
          onClick={startPay}
          className="mt-4 mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-bandhani px-5 py-4 text-lg font-semibold text-fg shadow-pop transition active:scale-[0.99]"
        >
          Pay <span className="tnum">₹0</span>
        </button>
        <p className="text-center text-xs text-dim">
          By paying nothing you agree that nothing will arrive.
        </p>
      </main>
    </>
  );
}
