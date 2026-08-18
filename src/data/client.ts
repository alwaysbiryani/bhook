/**
 * Client-safe data slice — the small, always-needed bits that global chrome
 * (header, city picker, address sheet, coupon drawer) reads on every page.
 *
 * Crucially this module imports ONLY the light leaf data (14 cities, a handful
 * of coupons, the option registry). It never touches restaurants.ts, dishes.ts
 * or filler.ts, so importing it does NOT drag the full ~4000-item dataset (or
 * the filler generator, or zod) into a route's first-load JS. Components that
 * genuinely need the whole catalogue (search, dish sheet) load `./core`
 * lazily, on interaction, instead.
 */
import { CITIES } from "./cities";
import { COUPONS_RAW } from "./coupons";
import { normCoupon } from "./normalize";
import type { City, Coupon } from "./schema";

export const cities: City[] = CITIES;

export const COUPONS: Coupon[] = COUPONS_RAW.map(normCoupon);

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export { SPICE_LEVELS, OPTION_GROUPS, ADDON_GROUP, getOptionGroup } from "./options";
export type { City, Restaurant, Dish, Coupon } from "./schema";
