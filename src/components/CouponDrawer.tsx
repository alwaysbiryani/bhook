"use client";

import { useState } from "react";
import { Sheet } from "@/components/sheet/Sheet";
import { PriceTicker } from "@/components/PriceTicker";
import { useUI } from "@/store/useUI";
import { useStore } from "@/store/useStore";
import { COUPONS } from "@/data";
import { computeBill, resolveCoupon, couponAmount } from "@/lib/bill";
import { play } from "@/lib/sound";

export function CouponDrawer() {
  const open = useUI((s) => s.couponOpen);
  const close = useUI((s) => s.closeCoupon);
  const lines = useStore((s) => s.lines);
  const applied = useStore((s) => s.appliedCoupons);
  const applyCoupon = useStore((s) => s.applyCoupon);
  const removeCoupon = useStore((s) => s.removeCoupon);
  const [code, setCode] = useState("");

  const bill = computeBill(lines, applied);
  const itemTotal = bill.itemTotal;

  const apply = (c: string) => {
    const norm = c.trim().toUpperCase();
    if (!norm || applied.includes(norm)) return;
    applyCoupon(norm);
    play("coupon");
    if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([8, 30, 8]);
  };

  return (
    <Sheet open={open} onClose={close} labelledBy="coupon-title">
      <div className="px-5 pb-8 pt-2">
        <h2 id="coupon-title" className="font-display text-2xl text-fg">
          Coupons
        </h2>
        <p className="mt-1 text-sm text-fg/55">They all work. They all stack. Go on.</p>

        {/* running saved */}
        <div className="mt-4 flex items-center justify-between rounded-xl bg-turmeric/15 px-4 py-3">
          <span className="text-sm font-medium text-[color:var(--color-bandhani-ink)]">Saved so far</span>
          <PriceTicker value={bill.saved} className="text-xl font-bold text-[color:var(--color-bandhani-ink)]" />
        </div>

        {/* manual code */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            apply(code);
            setCode("");
          }}
          className="mt-4 flex gap-2"
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            placeholder="Type any code…"
            className="tnum flex-1 rounded-xl border border-line/15 bg-card-2 px-4 py-2.5 uppercase text-fg outline-none placeholder:normal-case placeholder:text-fg/35 focus:border-bandhani"
            aria-label="Coupon code"
          />
          <button type="submit" className="rounded-xl bg-page px-5 py-2.5 text-sm font-semibold text-fg">
            Apply
          </button>
        </form>

        {/* coupon list */}
        <div className="mt-5 space-y-2.5">
          {COUPONS.map((c) => {
            const on = applied.includes(c.code);
            const amt = couponAmount(c, itemTotal);
            return (
              <div
                key={c.code}
                className={`flex items-center gap-3 rounded-2xl border p-3.5 transition ${
                  on ? "border-turmeric bg-turmeric/8" : "border-line/12"
                }`}
              >
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-page text-turmeric-text">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="tnum font-bold text-fg">{c.code}</span>
                    <span className="rounded bg-bandhani/10 px-1.5 py-0.5 text-[11px] font-bold text-[color:var(--color-bandhani-ink)]">
                      {c.label}
                    </span>
                  </div>
                  <p className="mt-0.5 line-clamp-1 text-xs text-fg/55">{c.blurb}</p>
                </div>
                <button
                  type="button"
                  onClick={() => (on ? removeCoupon(c.code) : apply(c.code))}
                  className={`shrink-0 rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                    on
                      ? "text-fg/50 hover:text-fg"
                      : "bg-bandhani text-fg active:scale-95"
                  }`}
                >
                  {on ? "Remove" : amt > 0 ? "Apply" : "Add"}
                </button>
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={close}
          className="mt-6 w-full rounded-xl bg-page py-3.5 font-semibold text-fg"
        >
          Done — {applied.length} applied
        </button>
      </div>
    </Sheet>
  );
}
