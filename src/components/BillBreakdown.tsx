"use client";

import { PriceTicker } from "@/components/PriceTicker";
import { useStore } from "@/store/useStore";
import { useUI } from "@/store/useUI";
import { computeBill } from "@/lib/bill";
import { rupee } from "@/lib/format";

function Row({
  label,
  children,
  muted,
  strong,
}: {
  label: React.ReactNode;
  children: React.ReactNode;
  muted?: boolean;
  strong?: boolean;
}) {
  return (
    <div className={`flex items-center justify-between py-1.5 text-sm ${strong ? "font-semibold" : ""}`}>
      <span className={muted ? "text-dim" : "text-muted"}>{label}</span>
      <span className={muted ? "text-dim" : "text-fg"}>{children}</span>
    </div>
  );
}

export function BillBreakdown({ showCouponButton = true }: { showCouponButton?: boolean }) {
  const lines = useStore((s) => s.lines);
  const applied = useStore((s) => s.appliedCoupons);
  const openCoupon = useUI((s) => s.openCoupon);
  const bill = computeBill(lines, applied);

  if (bill.count === 0) return null;

  return (
    <div className="rounded-2xl border border-line/10 bg-card/60 p-4">
      {/* Savings banner */}
      <div className="mb-3 flex items-center justify-between rounded-xl bg-turmeric/12 px-3.5 py-2.5">
        <span className="text-sm font-medium text-turmeric-text">You saved</span>
        <PriceTicker value={bill.saved} className="text-xl font-bold text-turmeric-text" />
      </div>

      {showCouponButton && (
        <button
          type="button"
          onClick={openCoupon}
          className="mb-3 flex w-full items-center gap-2 rounded-xl border border-dashed border-turmeric/40 bg-turmeric/5 px-3.5 py-2.5 text-left"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-turmeric)" strokeWidth="2" aria-hidden>
            <path d="M4 8V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 0 0 4v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2a2 2 0 0 0 0-4z" />
            <path d="M9 4v16" strokeDasharray="2 3" />
          </svg>
          <span className="flex-1 text-sm font-medium text-turmeric-text">
            {applied.length > 0 ? `${applied.length} coupon${applied.length > 1 ? "s" : ""} applied · stack more` : "Apply coupons — they all work"}
          </span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-turmeric)" strokeWidth="2.5" aria-hidden>
            <path d="M9 6l6 6-6 6" />
          </svg>
        </button>
      )}

      {/* Itemised bill */}
      <div className="border-t border-line/10 pt-2">
        <Row label="Item total">
          <span className="tnum">{rupee(bill.itemTotal)}</span>
          {bill.mrpSaving > 0 && (
            <span className="tnum ml-2 text-xs text-dim line-through">{rupee(bill.itemMrp)}</span>
          )}
        </Row>

        {bill.coupons.map((c) => (
          <div key={c.code} className="flex items-center justify-between py-1.5 text-sm">
            <span className="text-turmeric-text">
              {c.kind === "freebie" ? "Free delivery" : "Coupon"} <span className="tnum font-medium">{c.code}</span>
            </span>
            <span className="tnum text-turmeric-text">
              {c.amount > 0 ? `−${rupee(c.amount)}` : "applied"}
            </span>
          </div>
        ))}

        <Row label="Delivery fee">
          <span className="tnum mr-2 text-xs text-dim line-through">{rupee(bill.deliveryOrig)}</span>
          <span className="font-semibold text-veg">FREE</span>
        </Row>
        <Row label="Platform fee">
          <span className="tnum mr-2 text-xs text-dim line-through">{rupee(bill.platformOrig)}</span>
          <span className="font-semibold text-veg">WAIVED</span>
        </Row>
        <Row label={<>GST <span className="text-xs text-dim">(imaginary)</span></>} muted>
          <span className="tnum">{rupee(bill.gst)}</span>
        </Row>
        <Row label={<>Dabba covers the rest <span className="text-xs text-dim">(kyunki aana nahi hai)</span></>}>
          <span className="tnum text-turmeric-text">−{rupee(bill.treat)}</span>
        </Row>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-line/15 pt-3">
        <span className="font-display text-lg text-fg">To pay</span>
        <span className="tnum font-display text-2xl text-bandhani">₹0</span>
      </div>
    </div>
  );
}
