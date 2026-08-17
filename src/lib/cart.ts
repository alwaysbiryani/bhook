import type { CartLine } from "@/store/useStore";
import type { Dish, Restaurant } from "@/data/schema";
import { getDish, getRestaurant } from "@/data";
import {
  computeUnitPrice,
  computeUnitMrp,
  selectionSummary,
} from "@/lib/pricing";

export interface HydratedLine {
  line: CartLine;
  dish: Dish;
  restaurant: Restaurant;
  unit: number;
  unitMrp: number;
  lineTotal: number;
  lineMrp: number;
  summary: string;
}

export function hydrateLine(line: CartLine): HydratedLine | null {
  const dish = getDish(line.dishSlug);
  if (!dish) return null;
  const restaurant = getRestaurant(dish.restaurantSlug);
  if (!restaurant) return null;
  const unit = computeUnitPrice(dish, line.selection);
  const unitMrp = computeUnitMrp(dish, line.selection);
  return {
    line,
    dish,
    restaurant,
    unit,
    unitMrp,
    lineTotal: unit * line.qty,
    lineMrp: unitMrp * line.qty,
    summary: selectionSummary(dish, line.selection),
  };
}

export function hydrateCart(lines: CartLine[]): HydratedLine[] {
  return lines.map(hydrateLine).filter((x): x is HydratedLine => x !== null);
}

export function cartTotals(lines: CartLine[]) {
  const hydrated = hydrateCart(lines);
  const itemTotal = hydrated.reduce((s, h) => s + h.lineTotal, 0);
  const itemMrp = hydrated.reduce((s, h) => s + h.lineMrp, 0);
  const count = lines.reduce((n, l) => n + l.qty, 0);
  return { itemTotal, itemMrp, count, hydrated };
}
