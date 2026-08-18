"use client";

import { DishSheet } from "@/components/DishSheet";
import { FloatingThali } from "@/components/thali/FloatingThali";
import { CityPicker } from "@/components/CityPicker";
import { AddressSheet } from "@/components/AddressSheet";
import { CouponDrawer } from "@/components/CouponDrawer";
import { SearchOverlay } from "@/components/SearchOverlay";
import { PWARegister } from "@/components/PWARegister";

/** All globally-mounted interactive overlays. Rendered once in the root layout. */
export function AppChrome() {
  return (
    <>
      <DishSheet />
      <FloatingThali />
      <CityPicker />
      <AddressSheet />
      <CouponDrawer />
      <SearchOverlay />
      <PWARegister />
    </>
  );
}
