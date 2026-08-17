import type { OptionGroup } from "./schema";

/** Spice ladder — the labels are the joke, delivered with a straight face. */
export const SPICE_LEVELS = [
  "Bilkul mild",
  "Ghar wali",
  "Andhra style",
  "Chettinad",
  "Doctor ki salah nahi hai",
] as const;

/** Universal add-ons offered on most dishes. */
export const ADDON_GROUP: OptionGroup = {
  key: "addons",
  label: "Add something on the side",
  type: "multi",
  required: false,
  options: [
    { id: "papad", label: "Roasted papad", priceDelta: 15 },
    { id: "achaar", label: "Ghar ka achaar", priceDelta: 20 },
    { id: "raita", label: "Boondi raita", priceDelta: 40 },
    { id: "salad", label: "Laccha onion salad", priceDelta: 25 },
    { id: "gulab-jamun", label: "Gulab jamun (2 pc)", priceDelta: 29 },
  ],
};

/** Registry of reusable option groups, keyed for dishes to reference. */
export const OPTION_GROUPS: Record<string, OptionGroup> = {
  portion: {
    key: "portion",
    label: "Portion",
    type: "single",
    required: true,
    defaultId: "full",
    options: [
      { id: "half", label: "Half", priceDelta: 0 },
      { id: "full", label: "Full", priceDelta: 0 }, // deltas set per-dish via override where needed
    ],
  },
  biryaniPortion: {
    key: "biryaniPortion",
    label: "How much biryani",
    type: "single",
    required: true,
    defaultId: "single",
    options: [
      { id: "single", label: "Single (serves 1)", priceDelta: 0 },
      { id: "jumbo", label: "Jumbo (serves 2)", priceDelta: 180 },
      { id: "family", label: "Family pack (serves 4)", priceDelta: 460 },
    ],
  },
  gravyDry: {
    key: "gravyDry",
    label: "Gravy or dry",
    type: "single",
    required: true,
    defaultId: "gravy",
    options: [
      { id: "gravy", label: "Gravy", priceDelta: 0 },
      { id: "dry", label: "Dry / roast", priceDelta: 0 },
      { id: "extra-gravy", label: "Extra gravy (doubled)", priceDelta: 40 },
    ],
  },
  breadBase: {
    key: "breadBase",
    label: "Have it with",
    type: "single",
    required: true,
    defaultId: "roti",
    options: [
      { id: "roti", label: "Tandoori roti (2)", priceDelta: 0 },
      { id: "rumali", label: "Rumali roti (2)", priceDelta: 20 },
      { id: "naan", label: "Butter naan", priceDelta: 30 },
      { id: "rice", label: "Steamed rice", priceDelta: 20 },
      { id: "paratha", label: "Lachha paratha", priceDelta: 35 },
    ],
  },
  richness: {
    key: "richness",
    label: "Make it richer",
    type: "multi",
    required: false,
    options: [
      { id: "malai", label: "Extra malai", priceDelta: 30 },
      { id: "butter", label: "Loaded with butter", priceDelta: 25 },
      { id: "boneless", label: "Boneless", priceDelta: 50 },
      { id: "cut-pieces", label: "Cut into pieces", priceDelta: 0 },
    ],
  },
  eggCheese: {
    key: "eggCheese",
    label: "Load it up",
    type: "multi",
    required: false,
    options: [
      { id: "egg", label: "Double egg", priceDelta: 25 },
      { id: "cheese", label: "Cheese", priceDelta: 30 },
      { id: "extra-masala", label: "Extra masala", priceDelta: 10 },
    ],
  },
  doubleUp: {
    key: "doubleUp",
    label: "Make it a plate",
    type: "single",
    required: true,
    defaultId: "one",
    options: [
      { id: "one", label: "Single plate", priceDelta: 0 },
      { id: "double", label: "Double (2 plates)", priceDelta: 0 }, // per-dish delta
    ],
  },
};

export function getOptionGroup(key: string): OptionGroup | undefined {
  if (key === "addons") return ADDON_GROUP;
  return OPTION_GROUPS[key];
}
