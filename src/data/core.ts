/**
 * The full catalogue and every lookup over it — real, web-verified restaurants
 * topped up per city with deterministic fictional "cloud kitchens" (filler.ts)
 * so each city feels full.
 *
 * This module is zod-free: the dataset is assembled with the plain-JS
 * normalisers (normalize.ts), not `z.parse`, so when a client overlay loads it
 * lazily on interaction there's no zod in the chunk. Structural validation of
 * the raw data still happens at build time — see index.ts, which is the entry
 * server components import and which runs the zod safety net server-side only.
 */
import { CITIES } from "./cities";
import { RESTAURANTS } from "./restaurants";
import { DISHES } from "./dishes";
import { buildFiller } from "./filler";
import { normDish, normRestaurant } from "./normalize";
import type { City, Restaurant, Dish } from "./schema";

const filler = buildFiller(CITIES, RESTAURANTS, 50);

export const cities: City[] = CITIES;
export const restaurants: Restaurant[] = [
  ...RESTAURANTS.map(normRestaurant),
  ...filler.restaurants.map(normRestaurant),
];
export const dishes: Dish[] = [
  ...DISHES.map(normDish),
  ...filler.dishes.map(normDish),
];

/* -------------------------------- lookups -------------------------------- */

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

/** Top-rated restaurants in a city — the top `pct` by rating (min 4, max 12). */
export function topRatedInCity(citySlug: string, pct = 0.2): Restaurant[] {
  const all = restaurantsInCity(citySlug).slice().sort((a, b) => b.rating - a.rating);
  const n = Math.min(12, Math.max(4, Math.round(all.length * pct)));
  return all.slice(0, n);
}

/** Cuisines available in a city, most common first. */
export function cuisinesInCity(citySlug: string): string[] {
  const counts = new Map<string, number>();
  for (const r of restaurantsInCity(citySlug)) {
    for (const c of r.cuisines) counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([c]) => c);
}

/** Only the real, web-verified restaurants — used for static generation + sitemap. */
export const realRestaurants: Restaurant[] = restaurants.filter((r) => !r.fictional);
export const realDishes: Dish[] = dishes.filter((d) => {
  const r = getRestaurant(d.restaurantSlug);
  return r ? !r.fictional : true;
});

/* Light, always-needed slices re-exported so `@/data/core` is a superset of
   `@/data/client` — callers that already have core don't need both. */
export { COUPONS } from "./client";
export { RIDERS, RIDER_PINGS } from "./riders";
export { SPICE_LEVELS, OPTION_GROUPS, ADDON_GROUP, getOptionGroup } from "./options";
export type { City, Restaurant, Dish, Coupon } from "./schema";
