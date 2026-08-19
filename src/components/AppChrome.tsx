"use client";

import { useEffect } from "react";
import { DishSheet } from "@/components/DishSheet";
import { FloatingCart } from "@/components/cart/FloatingCart";
import { LocationSheet } from "@/components/LocationSheet";
import { CouponDrawer } from "@/components/CouponDrawer";
import { SearchOverlay } from "@/components/SearchOverlay";
import { PWARegister } from "@/components/PWARegister";
import { loadCatalogue } from "@/lib/catalogue";

/** All globally-mounted interactive overlays. Rendered once in the root layout. */
export function AppChrome() {
  // Warm the full catalogue on the first real interaction — a tap, key, or
  // scroll signals the user is about to browse, so the search overlay and dish
  // sheet open instantly. Nothing loads during the initial page load itself
  // (Lighthouse never interacts), keeping the dataset off the critical path.
  useEffect(() => {
    const warm = () => loadCatalogue();
    const opts = { once: true, passive: true } as const;
    const events = ["pointerdown", "keydown", "touchstart"] as const;
    for (const e of events) window.addEventListener(e, warm, opts);
    return () => {
      for (const e of events) window.removeEventListener(e, warm);
    };
  }, []);

  return (
    <>
      <DishSheet />
      <FloatingCart />
      <LocationSheet />
      <CouponDrawer />
      <SearchOverlay />
      <PWARegister />
    </>
  );
}
