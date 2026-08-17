import type { Rider } from "./schema";

export const RIDERS: Rider[] = [
  { id: "ramesh", name: "Ramesh", vehicle: "Splendor Plus", rating: 4.9, avatarHue: 28 },
  { id: "suresh", name: "Suresh", vehicle: "Activa 6G", rating: 4.8, avatarHue: 200 },
  { id: "imran", name: "Imran", vehicle: "Pulsar 150", rating: 4.9, avatarHue: 150 },
  { id: "lakshmi", name: "Lakshmi", vehicle: "Jupiter", rating: 5.0, avatarHue: 330 },
  { id: "vijay", name: "Vijay", vehicle: "Shine 125", rating: 4.7, avatarHue: 42 },
];

/** Chat pings that arrive on a timer during tracking (Phase 5). */
export const RIDER_PINGS: string[] = [
  "Sir order pick kar liya 🙏",
  "Nikal gaya, 2 minute",
  "Sir gate number kya hai?",
  "Bahar hoon aapke",
  "OTP batao please",
  "Building ke neeche khada hoon",
];
