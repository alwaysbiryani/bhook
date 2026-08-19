import type {
  City,
  Coupon,
  CouponInput,
  Dish,
  DishInput,
  Restaurant,
  RestaurantInput,
} from "./schema";

/**
 * Runtime data normalisers — the plain-JS equivalent of the zod schemas'
 * `.default(...)` transforms, without pulling zod (and its ~13KB) into the
 * shipped bundle. The authoring/input types omit fields that have defaults;
 * these apply exactly those defaults so the output matches `z.infer<Schema>`.
 *
 * The zod schemas still exist (see schema.ts) and validate the whole dataset
 * at build time via index.ts — but that runs server-side only, so no browser
 * ever downloads or executes zod.
 */

export function normCity(c: City): City {
  return c; // Cities are authored fully-specified (no defaulted fields).
}

export function normRestaurant(r: RestaurantInput): Restaurant {
  return { ...r, fictional: r.fictional ?? false };
}

export function normDish(d: DishInput): Dish {
  return {
    ...d,
    jainPossible: d.jainPossible ?? false,
    noOnionGarlicPossible: d.noOnionGarlicPossible ?? false,
    tags: d.tags ?? [],
    bestseller: d.bestseller ?? false,
    optionGroups: d.optionGroups ?? [],
    spicy: d.spicy ?? false,
  };
}

export function normCoupon(c: CouponInput): Coupon {
  return { ...c, stackable: c.stackable ?? true, hero: c.hero ?? false };
}
