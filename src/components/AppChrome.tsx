"use client";

import { DishSheet } from "@/components/DishSheet";
import { FloatingThali } from "@/components/thali/FloatingThali";
import { CityPicker } from "@/components/CityPicker";
import { AddressSheet } from "@/components/AddressSheet";

/** All globally-mounted interactive overlays. Rendered once in the root layout. */
export function AppChrome() {
  return (
    <>
      <DishSheet />
      <FloatingThali />
      <CityPicker />
      <AddressSheet />
    </>
  );
}
