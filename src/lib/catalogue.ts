"use client";

import { useEffect, useState } from "react";

/**
 * Lazy access to the full catalogue (`@/data/core` — every restaurant + dish,
 * including generated cloud kitchens). It's ~100KB of JS plus the filler
 * generator, needed only by the search overlay and the dish sheet, both of
 * which are interaction-gated. Loading it on demand keeps the whole dataset out
 * of every route's first-load JS.
 */
type Catalogue = typeof import("@/data/core");

let cached: Catalogue | null = null;
let pending: Promise<Catalogue> | null = null;

/** Load the catalogue once; subsequent calls reuse the cached module. */
export function loadCatalogue(): Promise<Catalogue> {
  if (cached) return Promise.resolve(cached);
  if (!pending) {
    pending = import("@/data/core").then((m) => {
      cached = m;
      return m;
    });
  }
  return pending;
}

/** Whatever's already loaded, synchronously (for state initialisers). */
export function catalogueNow(): Catalogue | null {
  return cached;
}

/**
 * Subscribe to the catalogue, kicking off the load the first time `active`
 * turns true (i.e. the overlay opens). Returns the module once ready, or null
 * while it's still loading.
 */
export function useCatalogue(active: boolean): Catalogue | null {
  const [cat, setCat] = useState<Catalogue | null>(cached);
  useEffect(() => {
    if (active && !cat) {
      let alive = true;
      loadCatalogue().then((m) => alive && setCat(m));
      return () => {
        alive = false;
      };
    }
  }, [active, cat]);
  return cat;
}
