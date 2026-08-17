"use client";

import { create } from "zustand";

interface UIState {
  dishSlug: string | null;
  addressOpen: boolean;
  cityOpen: boolean;
  couponOpen: boolean;
  /** bumps each add-to-cart so the floating thali can pulse. */
  thaliPulse: number;

  openDish: (slug: string) => void;
  closeDish: () => void;
  openAddress: () => void;
  closeAddress: () => void;
  openCity: () => void;
  closeCity: () => void;
  openCoupon: () => void;
  closeCoupon: () => void;
  pulseThali: () => void;
}

export const useUI = create<UIState>((set) => ({
  dishSlug: null,
  addressOpen: false,
  cityOpen: false,
  couponOpen: false,
  thaliPulse: 0,

  openDish: (slug) => set({ dishSlug: slug }),
  closeDish: () => set({ dishSlug: null }),
  openAddress: () => set({ addressOpen: true }),
  closeAddress: () => set({ addressOpen: false }),
  openCity: () => set({ cityOpen: true }),
  closeCity: () => set({ cityOpen: false }),
  openCoupon: () => set({ couponOpen: true }),
  closeCoupon: () => set({ couponOpen: false }),
  pulseThali: () => set((s) => ({ thaliPulse: s.thaliPulse + 1 })),
}));
