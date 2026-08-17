import { z } from "zod";
import { CITIES } from "./cities";
import { RESTAURANTS } from "./restaurants";
import { DISHES } from "./dishes";
import { COUPONS_RAW } from "./coupons";
import {
  validateAll,
  CouponSchema,
  type City,
  type Restaurant,
  type Dish,
  type Coupon,
} from "./schema";

/**
 * Validate the whole dataset once, at module load (i.e. build time for static
 * pages). A bad reference or an MRP below base price fails the build.
 */
const validated = validateAll({ cities: CITIES, restaurants: RESTAURANTS, dishes: DISHES });

export const cities: City[] = validated.cities;
export const restaurants: Restaurant[] = validated.restaurants;
export const dishes: Dish[] = validated.dishes;

export const COUPONS: Coupon[] = z.array(CouponSchema).parse(COUPONS_RAW);

export { RIDERS, RIDER_PINGS } from "./riders";
export { SPICE_LEVELS, OPTION_GROUPS, ADDON_GROUP, getOptionGroup } from "./options";
export type { City, Restaurant, Dish } from "./schema";

/* --------------------------------- lookups -------------------------------- */

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug);
}

export function getRestaurant(slug: string): Restaurant | undefined {
  return restaurants.find((r) => r.slug === slug);
}

export function getDish(slug: string): Dish | undefined {
  return dishes.find((d) => d.slug === slug);
}

export function restaurantsInCity(citySlug: string): Restaurant[] {
  return restaurants.filter((r) => r.citySlug === citySlug);
}

export function dishesOfRestaurant(restaurantSlug: string): Dish[] {
  return dishes.filter((d) => d.restaurantSlug === restaurantSlug);
}

export function restaurantOfDish(dish: Dish): Restaurant | undefined {
  return getRestaurant(dish.restaurantSlug);
}

export function bestsellersInCity(citySlug: string, limit = 12): Dish[] {
  return dishes
    .filter((d) => d.citySlug === citySlug && d.bestseller)
    .slice(0, limit);
}

/** Cuisines available in a city, most common first. */
export function cuisinesInCity(citySlug: string): string[] {
  const counts = new Map<string, number>();
  for (const r of restaurantsInCity(citySlug)) {
    for (const c of r.cuisines) counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c);
}
