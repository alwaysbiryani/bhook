import { z } from "zod";

/* ------------------------------------------------------------------ *
 *  Core enums
 * ------------------------------------------------------------------ */

export const Diet = z.enum(["veg", "nonveg", "egg"]);
export type Diet = z.infer<typeof Diet>;

/** Illustration category — drives the generated SVG dish art. */
export const ArtKind = z.enum([
  "biryani",
  "curry",
  "kebab",
  "bread",
  "dosa",
  "snack",
  "roll",
  "sweet",
  "chai",
  "thali",
  "rice",
]);
export type ArtKind = z.infer<typeof ArtKind>;

/* ------------------------------------------------------------------ *
 *  City
 * ------------------------------------------------------------------ */

export const CitySchema = z.object({
  slug: z.string(),
  name: z.string(),
  nameDeva: z.string().optional(),
  state: z.string(),
  /** Localities used by the "Deliver to" address sheet. */
  areas: z.array(z.string()).min(1),
});
export type City = z.infer<typeof CitySchema>;

/* ------------------------------------------------------------------ *
 *  Restaurant
 * ------------------------------------------------------------------ */

export const RestaurantSchema = z.object({
  slug: z.string(),
  name: z.string(),
  nameDeva: z.string().optional(),
  citySlug: z.string(),
  area: z.string(),
  cuisines: z.array(z.string()).min(1),
  serves: z.enum(["veg", "nonveg", "both"]),
  since: z.number().int().optional(),
  rating: z.number().min(1).max(5),
  ratingCount: z.string(), // "12k+", "48k+"
  priceForTwo: z.number().int(), // ₹, informational
  prepMins: z.number().int(),
  /** Food-writer one-liner. */
  tagline: z.string(),
  /** Hue (deg) that seeds this restaurant's illustrated art. */
  hue: z.number().int(),
  bestFor: z.string().optional(), // "Biryani", "Haleem"
  /** True for generated "cloud kitchen" filler (not a real establishment). */
  fictional: z.boolean().default(false),
});
export type Restaurant = z.infer<typeof RestaurantSchema>;
export type RestaurantInput = z.input<typeof RestaurantSchema>;

/* ------------------------------------------------------------------ *
 *  Customisation
 * ------------------------------------------------------------------ */

export const OptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  priceDelta: z.number().int().default(0),
});
export type Option = z.infer<typeof OptionSchema>;

export const OptionGroupSchema = z.object({
  key: z.string(),
  label: z.string(),
  type: z.enum(["single", "multi"]),
  required: z.boolean().default(false),
  defaultId: z.string().optional(),
  options: z.array(OptionSchema).min(1),
});
export type OptionGroup = z.infer<typeof OptionGroupSchema>;

/* ------------------------------------------------------------------ *
 *  Dish
 * ------------------------------------------------------------------ */

export const DishSchema = z.object({
  slug: z.string(),
  name: z.string(),
  nameDeva: z.string().optional(),
  restaurantSlug: z.string(),
  citySlug: z.string(),
  diet: Diet,
  jainPossible: z.boolean().default(false),
  noOnionGarlicPossible: z.boolean().default(false),
  /** 0 mild → 4 "doctor ki salah nahi hai". -1 = not a spicy dish. */
  spiceDefault: z.number().int().min(-1).max(4),
  basePrice: z.number().int(),
  mrp: z.number().int(), // struck-through fake MRP, > basePrice
  prepMins: z.number().int(),
  calories: z.number().int(),
  description: z.string(),
  art: ArtKind,
  tags: z.array(z.string()).default([]),
  bestseller: z.boolean().default(false),
  /** Keys into the shared option-group registry (data/options.ts). */
  optionGroups: z.array(z.string()).default([]),
  /** Whether the spice slider applies. */
  spicy: z.boolean().default(false),
});
export type Dish = z.infer<typeof DishSchema>;
/** Authoring type: fields with defaults may be omitted in the data files. */
export type DishInput = z.input<typeof DishSchema>;

/* ------------------------------------------------------------------ *
 *  Coupons (built out in Phase 3)
 * ------------------------------------------------------------------ */

export const CouponSchema = z.object({
  code: z.string(),
  kind: z.enum(["percent", "flat", "freebie"]),
  value: z.number(), // % or ₹
  cap: z.number().optional(), // max ₹ off for percent
  label: z.string(),
  blurb: z.string(),
  stackable: z.boolean().default(true),
  hero: z.boolean().default(false),
});
export type Coupon = z.infer<typeof CouponSchema>;
export type CouponInput = z.input<typeof CouponSchema>;

/* ------------------------------------------------------------------ *
 *  Rider (built out in Phase 5)
 * ------------------------------------------------------------------ */

export const RiderSchema = z.object({
  id: z.string(),
  name: z.string(),
  vehicle: z.string(),
  rating: z.number(),
  avatarHue: z.number().int(),
});
export type Rider = z.infer<typeof RiderSchema>;

/* ------------------------------------------------------------------ *
 *  Build-time validation helper
 * ------------------------------------------------------------------ */

export function validateAll(input: {
  cities: unknown[];
  restaurants: unknown[];
  dishes: unknown[];
}) {
  const cities = z.array(CitySchema).parse(input.cities);
  const restaurants = z.array(RestaurantSchema).parse(input.restaurants);
  const dishes = z.array(DishSchema).parse(input.dishes);

  const citySlugs = new Set(cities.map((c) => c.slug));
  const restaurantSlugs = new Set(restaurants.map((r) => r.slug));

  for (const r of restaurants) {
    if (!citySlugs.has(r.citySlug)) {
      throw new Error(`Restaurant "${r.slug}" references unknown city "${r.citySlug}"`);
    }
  }
  for (const d of dishes) {
    if (!restaurantSlugs.has(d.restaurantSlug)) {
      throw new Error(`Dish "${d.slug}" references unknown restaurant "${d.restaurantSlug}"`);
    }
    if (d.mrp < d.basePrice) {
      throw new Error(`Dish "${d.slug}" has MRP below base price`);
    }
  }
  return { cities, restaurants, dishes };
}
