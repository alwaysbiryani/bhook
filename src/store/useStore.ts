"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Selection } from "@/lib/pricing";
import { selectionKey } from "@/lib/pricing";
import { DEFAULT_CITY } from "@/lib/brand";

export interface CartLine {
  key: string;
  dishSlug: string;
  qty: number;
  selection: Selection;
}

export interface Address {
  label: string; // "Home", "Work", "Other"
  line: string; // "Flat 402, Rose Apartments"
  area: string; // locality
  pin?: { x: number; y: number }; // map-pin position, 0..1
}

/** A placed order — the twist writes these in Phase 5. */
export interface Order {
  id: string;
  placedAt: number;
  restaurantSlug: string;
  restaurantName: string;
  citySlug: string;
  lines: CartLine[];
  itemTotal: number;
  saved: number;
  coupons: string[];
  address: Address | null;
  riderId: string;
  otp: string;
  status: "cooking" | "onway" | "delivered";
}

interface StoreState {
  citySlug: string;
  address: Address | null;
  soundOn: boolean;

  lines: CartLine[];
  cartRestaurant: string | null; // enforce one restaurant per cart

  appliedCoupons: string[];

  orders: Order[];
  lifetimeSaved: number;
  streak: number;

  // actions
  setCity: (slug: string) => void;
  setAddress: (a: Address) => void;
  toggleSound: () => void;

  addLine: (dishSlug: string, restaurantSlug: string, selection: Selection, qty?: number) => void;
  incLine: (key: string) => void;
  decLine: (key: string) => void;
  removeLine: (key: string) => void;
  clearCart: () => void;

  applyCoupon: (code: string) => void;
  removeCoupon: (code: string) => void;

  addOrder: (o: Order) => void;
  markDelivered: (id: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      citySlug: DEFAULT_CITY,
      address: null,
      soundOn: true,

      lines: [],
      cartRestaurant: null,
      appliedCoupons: [],

      orders: [],
      lifetimeSaved: 0,
      streak: 0,

      setCity: (slug) => set({ citySlug: slug }),
      setAddress: (a) => set({ address: a }),
      toggleSound: () => set((s) => ({ soundOn: !s.soundOn })),

      addLine: (dishSlug, restaurantSlug, selection, qty = 1) =>
        set((s) => {
          // One restaurant per cart — switching clears the old thali.
          const differentPlace = s.cartRestaurant && s.cartRestaurant !== restaurantSlug;
          const base = differentPlace ? [] : s.lines;
          const key = selectionKey(dishSlug, selection);
          const idx = base.findIndex((l) => l.key === key);
          let lines: CartLine[];
          if (idx >= 0) {
            lines = base.map((l, i) => (i === idx ? { ...l, qty: l.qty + qty } : l));
          } else {
            lines = [...base, { key, dishSlug, qty, selection }];
          }
          return {
            lines,
            cartRestaurant: restaurantSlug,
            appliedCoupons: differentPlace ? [] : s.appliedCoupons,
          };
        }),

      incLine: (key) =>
        set((s) => ({ lines: s.lines.map((l) => (l.key === key ? { ...l, qty: l.qty + 1 } : l)) })),

      decLine: (key) =>
        set((s) => {
          const lines = s.lines
            .map((l) => (l.key === key ? { ...l, qty: l.qty - 1 } : l))
            .filter((l) => l.qty > 0);
          return {
            lines,
            cartRestaurant: lines.length ? s.cartRestaurant : null,
            appliedCoupons: lines.length ? s.appliedCoupons : [],
          };
        }),

      removeLine: (key) =>
        set((s) => {
          const lines = s.lines.filter((l) => l.key !== key);
          return {
            lines,
            cartRestaurant: lines.length ? s.cartRestaurant : null,
            appliedCoupons: lines.length ? s.appliedCoupons : [],
          };
        }),

      clearCart: () => set({ lines: [], cartRestaurant: null, appliedCoupons: [] }),

      applyCoupon: (code) =>
        set((s) =>
          s.appliedCoupons.includes(code)
            ? s
            : { appliedCoupons: [...s.appliedCoupons, code] },
        ),
      removeCoupon: (code) =>
        set((s) => ({ appliedCoupons: s.appliedCoupons.filter((c) => c !== code) })),

      addOrder: (o) =>
        set((s) => ({
          orders: [o, ...s.orders],
          lifetimeSaved: s.lifetimeSaved + o.saved,
          streak: s.streak + 1,
          lines: [],
          cartRestaurant: null,
          appliedCoupons: [],
        })),

      markDelivered: (id) =>
        set((s) => ({
          orders: s.orders.map((o) => (o.id === id ? { ...o, status: "delivered" } : o)),
        })),
    }),
    {
      name: "dnc-store-v1",
      version: 1,
    },
  ),
);

/** Total quantity of items in the cart. */
export const selectCartCount = (s: StoreState) => s.lines.reduce((n, l) => n + l.qty, 0);
