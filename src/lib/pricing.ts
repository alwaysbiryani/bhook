import type { Dish } from "@/data/schema";
import { getOptionGroup } from "@/data/options";

/** A user's customisation of a dish. `choices` maps optionGroup key -> chosen option ids
 *  (one id for single groups, many for multi). `spice` is the 0–4 ladder (-1 = n/a). */
export interface Selection {
  choices: Record<string, string[]>;
  spice: number;
}

/** Default selection: required single-groups pick their default, spice at dish default. */
export function defaultSelection(dish: Dish): Selection {
  const choices: Record<string, string[]> = {};
  for (const key of dish.optionGroups) {
    const g = getOptionGroup(key);
    if (!g) continue;
    if (g.type === "single") {
      choices[key] = [g.defaultId ?? g.options[0].id];
    } else {
      choices[key] = [];
    }
  }
  return { choices, spice: dish.spiceDefault };
}

/** Unit price = base + sum of chosen option deltas. Spice never costs anything. */
export function computeUnitPrice(dish: Dish, sel: Selection): number {
  let total = dish.basePrice;
  for (const key of dish.optionGroups) {
    const g = getOptionGroup(key);
    if (!g) continue;
    const chosen = sel.choices[key] ?? [];
    for (const id of chosen) {
      const opt = g.options.find((o) => o.id === id);
      if (opt) total += opt.priceDelta;
    }
  }
  return total;
}

/** Original (struck-through) unit price using MRP as the base. */
export function computeUnitMrp(dish: Dish, sel: Selection): number {
  return computeUnitPrice(dish, sel) - dish.basePrice + dish.mrp;
}

/** A stable key so identical customisations merge into one cart line. */
export function selectionKey(dishSlug: string, sel: Selection): string {
  const parts = Object.keys(sel.choices)
    .sort()
    .map((k) => `${k}:${[...sel.choices[k]].sort().join(",")}`)
    .join("|");
  return `${dishSlug}#${parts}#s${sel.spice}`;
}

/** Human-readable one-line summary of a selection, for the cart. */
export function selectionSummary(dish: Dish, sel: Selection): string {
  const bits: string[] = [];
  for (const key of dish.optionGroups) {
    const g = getOptionGroup(key);
    if (!g) continue;
    for (const id of sel.choices[key] ?? []) {
      const opt = g.options.find((o) => o.id === id);
      // Skip the zero-delta "default" single options that read as noise.
      if (opt && !(g.type === "single" && opt.id === g.defaultId)) bits.push(opt.label);
    }
  }
  return bits.join(" · ");
}
