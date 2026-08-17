import type { CouponInput } from "./schema";

/** Every coupon works. Coupons stack. That is the whole point. */
export const COUPONS_RAW: CouponInput[] = [
  {
    code: "BHOOK60",
    kind: "percent",
    value: 60,
    cap: 900,
    label: "60% OFF",
    blurb: "Because you're hungry and we're generous with money that isn't real.",
    stackable: true,
    hero: true,
  },
  {
    code: "FIRSTBITE",
    kind: "flat",
    value: 150,
    label: "₹150 OFF",
    blurb: "First order? First of many you'll never receive.",
    stackable: true,
  },
  {
    code: "PAISAVASOOL",
    kind: "percent",
    value: 30,
    cap: 400,
    label: "30% OFF",
    blurb: "Paisa vasool, minus the paisa and the vasool.",
    stackable: true,
  },
  {
    code: "BIRYANI100",
    kind: "flat",
    value: 100,
    label: "₹100 OFF biryani",
    blurb: "A hundred rupees off a biryani that stays imaginary.",
    stackable: true,
  },
  {
    code: "FREEDEL",
    kind: "freebie",
    value: 0,
    label: "Free delivery",
    blurb: "Free delivery of nothing, to nowhere. Applied automatically.",
    stackable: true,
  },
  {
    code: "LATENIGHT",
    kind: "percent",
    value: 40,
    cap: 300,
    label: "40% OFF after 11pm",
    blurb: "The 3am tax, refunded. Maggi ya biryani?",
    stackable: true,
  },
];
