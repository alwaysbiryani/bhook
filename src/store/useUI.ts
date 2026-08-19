"use client";

import { create } from "zustand";

/** Which step of the unified location flow the sheet opens on. */
export type LocationStage = "search" | "pin";

interface UIState {
  dishSlug: string | null;
  /** The single "Deliver to" sheet (search → map pin). Replaces the old
   *  separate city-picker and address sheets. */
  locationOpen: boolean;
  locationStage: LocationStage;
  couponOpen: boolean;
  searchOpen: boolean;
  /** bumps each add-to-cart so the floating cart can pulse. */
  cartPulse: number;

  openDish: (slug: string) => void;
  closeDish: () => void;
  /** Open the location sheet on the search step (change city / area). */
  openCity: () => void;
  /** Open the location sheet straight on the map-pin step (fine-tune address). */
  openAddress: () => void;
  setLocationStage: (stage: LocationStage) => void;
  closeLocation: () => void;
  openCoupon: () => void;
  closeCoupon: () => void;
  openSearch: () => void;
  closeSearch: () => void;
  pulseCart: () => void;
}

export const useUI = create<UIState>((set) => ({
  dishSlug: null,
  locationOpen: false,
  locationStage: "search",
  couponOpen: false,
  searchOpen: false,
  cartPulse: 0,

  openDish: (slug) => set({ dishSlug: slug }),
  closeDish: () => set({ dishSlug: null }),
  openCity: () => set({ locationOpen: true, locationStage: "search" }),
  openAddress: () => set({ locationOpen: true, locationStage: "pin" }),
  setLocationStage: (stage) => set({ locationStage: stage }),
  closeLocation: () => set({ locationOpen: false }),
  openCoupon: () => set({ couponOpen: true }),
  closeCoupon: () => set({ couponOpen: false }),
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  pulseCart: () => set((s) => ({ cartPulse: s.cartPulse + 1 })),
}));
