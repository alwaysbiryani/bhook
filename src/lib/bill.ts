import type { CartLine } from "@/store/useStore";
import type { Coupon } from "@/data/schema";
import { COUPONS } from "@/data/client";
import { cartTotals } from "@/lib/cart";

const DELIVERY_ORIG = 49;
const PLATFORM_ORIG = 10;
const GST_RATE = 0.05;

/** Every coupon works — even ones you make up. Known codes resolve to their real
 *  definition; anything else becomes a deterministic flat discount so the drawer
 *  never says "invalid". */
export function resolveCoupon(code: string): Coupon {
  const norm = code.trim().toUpperCase();
  const known = COUPONS.find((c) => c.code === norm);
  if (known) return known;
  // synthesize a flat discount from the string so it's stable per code
  let h = 0;
  for (let i = 0; i < norm.length; i++) h = (h * 31 + norm.charCodeAt(i)) >>> 0;
  const value = 40 + (h % 12) * 10; // ₹40–₹150
  return {
    code: norm,
    kind: "flat",
    value,
    label: `₹${value} OFF`,
    blurb: "Never heard of it. Works anyway.",
    stackable: true,
    hero: false,
  };
}

/** Monetary effect (₹ off) of one coupon against the current item total. */
export function couponAmount(coupon: Coupon, itemTotal: number): number {
  switch (coupon.kind) {
    case "percent": {
      const raw = Math.round((itemTotal * coupon.value) / 100);
      return coupon.cap ? Math.min(raw, coupon.cap) : raw;
    }
    case "flat":
      return coupon.value;
    case "freebie":
      return 0;
  }
}

export interface BillCouponLine {
  code: string;
  label: string;
  amount: number;
  kind: Coupon["kind"];
}

export interface Bill {
  count: number;
  itemTotal: number;
  itemMrp: number;
  mrpSaving: number;
  coupons: BillCouponLine[];
  couponDiscount: number;
  afterCoupons: number;
  deliveryOrig: number;
  platformOrig: number;
  gst: number;
  treat: number; // amount "Dabba" covers to reach ₹0
  toPay: number; // always 0
  saved: number; // headline, counts up
}

export function computeBill(lines: CartLine[], couponCodes: string[]): Bill {
  const { itemTotal, itemMrp, count } = cartTotals(lines);
  const mrpSaving = Math.max(0, itemMrp - itemTotal);

  const coupons: BillCouponLine[] = couponCodes.map((code) => {
    const c = resolveCoupon(code);
    return { code: c.code, label: c.label, amount: couponAmount(c, itemTotal), kind: c.kind };
  });

  const rawDiscount = coupons.reduce((s, c) => s + c.amount, 0);
  const couponDiscount = Math.min(rawDiscount, itemTotal);
  const afterCoupons = Math.max(0, itemTotal - couponDiscount);
  const gst = Math.round(afterCoupons * GST_RATE);
  const treat = afterCoupons + gst;

  const hasFreeDelivery = true; // delivery is always free here
  const saved =
    mrpSaving +
    couponDiscount +
    (hasFreeDelivery ? DELIVERY_ORIG : 0) +
    PLATFORM_ORIG;

  return {
    count,
    itemTotal,
    itemMrp,
    mrpSaving,
    coupons,
    couponDiscount,
    afterCoupons,
    deliveryOrig: DELIVERY_ORIG,
    platformOrig: PLATFORM_ORIG,
    gst,
    treat,
    toPay: 0,
    saved,
  };
}
