import type { City, RestaurantInput, DishInput, ArtKind, Diet } from "./schema";

/**
 * Deterministic "cloud kitchen" filler so every city feels full (~50 places).
 * These are FICTIONAL — invented generic names, not real establishments — and are
 * flagged `fictional: true` and disclaimed in the UI. Seeded so they're stable
 * across builds.
 */

function rng(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = <T>(r: () => number, xs: T[]) => xs[Math.floor(r() * xs.length)];

const PREFIX = ["The", "Daily", "Midnight", "Royal", "Urban", "Desi", "Hungry", "Little", "Big", "Spice", "Cloud", "Corner", "Namaste", "Zaika", "Tadka", "Bombay", "Delhi", ""];
const CORE = ["Biryani", "Curry", "Tandoor", "Dosa", "Thali", "Kebab", "Tiffin", "Masala", "Chaat", "Wok", "Grill", "Bowl", "Dabba", "Roll", "Handi", "Sizzler"];
const SUFFIX = ["Co.", "Company", "Kitchen", "House", "Club", "Bros", "Express", "Junction", "Adda", "Factory", "Stories", "Cafe", "Point", "Hub"];

const CUISINE_POOL = [
  "North Indian", "Chinese", "Biryani", "South Indian", "Mughlai", "Street food",
  "Fast food", "Rolls", "Tandoor", "Chaat", "Desserts", "Momos", "Continental", "Beverages",
];

const TAGLINES = [
  "Fast, hot, and gone before you knew it — same as always, nothing arrives.",
  "A cloud kitchen with big dreams and a rider who's perpetually five minutes away.",
  "Comfort food for people who like the idea of eating more than the eating.",
  "Everything's a bestseller when nothing gets delivered.",
  "Reliable flavours, unreliable arrival. Mostly the second one.",
  "The neighbourhood favourite of people who never actually receive food.",
  "Big portions, bigger promises, zero dabbas out the door.",
  "Where the menu is real and the delivery is aspirational.",
];

interface DishTpl {
  n: string;
  art: ArtKind;
  diet: Diet;
  base: [number, number];
  spicy?: boolean;
  deva?: string;
}

const TEMPLATES: Record<string, DishTpl[]> = {
  Biryani: [
    { n: "Chicken Biryani", art: "biryani", diet: "nonveg", base: [200, 320], spicy: true },
    { n: "Mutton Biryani", art: "biryani", diet: "nonveg", base: [280, 420], spicy: true },
    { n: "Veg Dum Biryani", art: "biryani", diet: "veg", base: [160, 240], spicy: true },
    { n: "Egg Biryani", art: "biryani", diet: "egg", base: [160, 220], spicy: true },
  ],
  "North Indian": [
    { n: "Butter Chicken", art: "curry", diet: "nonveg", base: [260, 380], spicy: true },
    { n: "Paneer Butter Masala", art: "curry", diet: "veg", base: [220, 320], spicy: true },
    { n: "Dal Makhani", art: "curry", diet: "veg", base: [180, 260] },
    { n: "Butter Naan", art: "bread", diet: "veg", base: [40, 70] },
    { n: "Kadai Chicken", art: "curry", diet: "nonveg", base: [260, 360], spicy: true },
  ],
  Mughlai: [
    { n: "Chicken Korma", art: "curry", diet: "nonveg", base: [240, 340], spicy: true },
    { n: "Mutton Rogan Josh", art: "curry", diet: "nonveg", base: [300, 420], spicy: true },
    { n: "Chicken Changezi", art: "curry", diet: "nonveg", base: [260, 360], spicy: true },
  ],
  Tandoor: [
    { n: "Tandoori Chicken", art: "kebab", diet: "nonveg", base: [240, 360], spicy: true },
    { n: "Paneer Tikka", art: "kebab", diet: "veg", base: [220, 300], spicy: true },
    { n: "Chicken Malai Tikka", art: "kebab", diet: "nonveg", base: [240, 340] },
    { n: "Seekh Kebab", art: "kebab", diet: "nonveg", base: [200, 300], spicy: true },
  ],
  Chinese: [
    { n: "Chicken Fried Rice", art: "rice", diet: "nonveg", base: [160, 240] },
    { n: "Hakka Noodles", art: "rice", diet: "veg", base: [140, 220] },
    { n: "Chilli Chicken", art: "kebab", diet: "nonveg", base: [200, 300], spicy: true },
    { n: "Veg Manchurian", art: "curry", diet: "veg", base: [160, 240], spicy: true },
    { n: "Schezwan Fried Rice", art: "rice", diet: "veg", base: [160, 240], spicy: true },
  ],
  "South Indian": [
    { n: "Masala Dosa", art: "dosa", diet: "veg", base: [90, 150], deva: "मसाला डोसा" },
    { n: "Idli (2 pc)", art: "snack", diet: "veg", base: [60, 100] },
    { n: "Ghee Roast", art: "dosa", diet: "veg", base: [120, 180] },
    { n: "Filter Coffee", art: "chai", diet: "veg", base: [30, 60] },
  ],
  Rolls: [
    { n: "Chicken Roll", art: "roll", diet: "nonveg", base: [120, 190], spicy: true },
    { n: "Paneer Roll", art: "roll", diet: "veg", base: [100, 160] },
    { n: "Egg Roll", art: "roll", diet: "egg", base: [90, 150] },
  ],
  "Street food": [
    { n: "Pav Bhaji", art: "curry", diet: "veg", base: [100, 170], spicy: true },
    { n: "Vada Pav", art: "snack", diet: "veg", base: [30, 60], spicy: true },
    { n: "Samosa (2 pc)", art: "snack", diet: "veg", base: [30, 60], spicy: true },
  ],
  Chaat: [
    { n: "Pani Puri", art: "snack", diet: "veg", base: [60, 100], spicy: true },
    { n: "Dahi Puri", art: "snack", diet: "veg", base: [70, 110] },
    { n: "Aloo Tikki Chaat", art: "snack", diet: "veg", base: [70, 120], spicy: true },
  ],
  "Fast food": [
    { n: "Veg Burger", art: "snack", diet: "veg", base: [90, 150] },
    { n: "Chicken Burger", art: "snack", diet: "nonveg", base: [120, 190] },
    { n: "Peri Peri Fries", art: "snack", diet: "veg", base: [80, 140], spicy: true },
  ],
  Momos: [
    { n: "Veg Momos (6 pc)", art: "snack", diet: "veg", base: [90, 150] },
    { n: "Chicken Momos (6 pc)", art: "snack", diet: "nonveg", base: [110, 180] },
    { n: "Schezwan Momos", art: "snack", diet: "veg", base: [110, 180], spicy: true },
  ],
  Continental: [
    { n: "Grilled Chicken Steak", art: "kebab", diet: "nonveg", base: [280, 400] },
    { n: "Alfredo Pasta", art: "rice", diet: "veg", base: [220, 320] },
  ],
  Desserts: [
    { n: "Gulab Jamun (2 pc)", art: "sweet", diet: "veg", base: [50, 90] },
    { n: "Chocolate Brownie", art: "sweet", diet: "veg", base: [90, 150] },
    { n: "Gajar Halwa", art: "sweet", diet: "veg", base: [90, 150] },
  ],
  Beverages: [
    { n: "Sweet Lassi", art: "chai", diet: "veg", base: [50, 90] },
    { n: "Masala Chai", art: "chai", diet: "veg", base: [20, 40] },
    { n: "Cold Coffee", art: "chai", diet: "veg", base: [90, 150] },
  ],
};

const OPTS_FOR: Partial<Record<ArtKind, string[]>> = {
  biryani: ["biryaniPortion", "addons"],
  curry: ["breadBase", "addons"],
  kebab: ["richness", "addons"],
  chai: ["doubleUp"],
  bread: ["doubleUp"],
  rice: ["addons"],
};

function makeName(r: () => number): string {
  const p = pick(r, PREFIX);
  const c = pick(r, CORE);
  const s = pick(r, SUFFIX);
  return [p, c, s].filter(Boolean).join(" ");
}

function fillerDishes(rest: RestaurantInput): DishInput[] {
  const r = rng(rest.slug + "-dishes");
  // pull the template lists for this restaurant's cuisines (+ a dessert/beverage)
  const pools = rest.cuisines.flatMap((c) => TEMPLATES[c] ?? []);
  const extras = [...(TEMPLATES.Desserts ?? []), ...(TEMPLATES.Beverages ?? [])];
  const chosen: DishTpl[] = [];
  const seen = new Set<string>();
  const source = [...pools, ...extras];
  // shuffle-ish pick 5–7 unique
  const count = 5 + Math.floor(r() * 3);
  let guard = 0;
  while (chosen.length < count && guard++ < 60) {
    const t = pick(r, source);
    if (seen.has(t.n)) continue;
    seen.add(t.n);
    chosen.push(t);
  }
  return chosen.map((t, i): DishInput => {
    const base = Math.round(t.base[0] + r() * (t.base[1] - t.base[0]));
    return {
      slug: `${rest.slug}-d${i}`,
      name: t.n,
      nameDeva: t.deva,
      restaurantSlug: rest.slug,
      citySlug: rest.citySlug,
      diet: t.diet,
      spiceDefault: t.spicy ? 2 : t.art === "sweet" || t.art === "chai" ? -1 : 1,
      spicy: !!t.spicy,
      basePrice: base,
      mrp: Math.round(base * (1.3 + r() * 0.3)),
      prepMins: 20 + Math.floor(r() * 25),
      calories: 200 + Math.floor(r() * 600),
      description:
        "A dependable rendition from a cloud kitchen that cooks it, plates it, and then — as ever — never sends it.",
      art: t.art,
      bestseller: i === 0,
      optionGroups: OPTS_FOR[t.art] ?? ["addons"],
    };
  });
}

/** Top each city up to `target` restaurants with fictional cloud kitchens. */
export function buildFiller(cities: City[], realRestaurants: RestaurantInput[], target = 50) {
  const restaurants: RestaurantInput[] = [];
  const dishes: DishInput[] = [];

  for (const city of cities) {
    const realCount = realRestaurants.filter((r) => r.citySlug === city.slug).length;
    const need = Math.max(0, target - realCount);
    for (let n = 0; n < need; n++) {
      const r = rng(`${city.slug}-fk-${n}`);
      const cuisines = [pick(r, CUISINE_POOL)];
      const c2 = pick(r, CUISINE_POOL);
      if (c2 !== cuisines[0]) cuisines.push(c2);
      const serves = pick(r, ["both", "both", "veg", "nonveg"] as const);
      const rest: RestaurantInput = {
        slug: `fk-${city.slug}-${n}`,
        name: makeName(r),
        citySlug: city.slug,
        area: pick(r, city.areas),
        cuisines,
        serves,
        // capped below the marquee real restaurants so "Top rated" leads with the legends
        rating: Math.round((3.6 + r() * 0.6) * 10) / 10,
        ratingCount: `${1 + Math.floor(r() * 40)}k+`,
        priceForTwo: pick(r, [150, 200, 250, 300, 350, 400, 500, 600]),
        prepMins: 24 + Math.floor(r() * 22),
        tagline: pick(r, TAGLINES),
        hue: Math.floor(r() * 360),
        bestFor: cuisines[0],
        fictional: true,
      };
      restaurants.push(rest);
      dishes.push(...fillerDishes(rest));
    }
  }
  return { restaurants, dishes };
}
