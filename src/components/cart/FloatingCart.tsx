"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { CartGraphic } from "./CartGraphic";
import { PriceTicker } from "@/components/PriceTicker";
import { useStore } from "@/store/useStore";
import { useUI } from "@/store/useUI";
import { cartTotals } from "@/lib/cart";

/** The persistent floating mini-cart. Appears when the cart has items, pulses on
 *  each add, and taps through to the full cart (/cart). Hidden on cart/checkout. */
export function FloatingCart() {
  const lines = useStore((s) => s.lines);
  const pulse = useUI((s) => s.cartPulse);
  const pathname = usePathname();

  const { itemTotal, count } = cartTotals(lines);

  const hidden = count === 0 || pathname === "/cart" || pathname === "/checkout";

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4"
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: "spring", damping: 26, stiffness: 320 }}
        >
          <Link
            href="/cart"
            className="flex w-full max-w-md items-center gap-3 rounded-2xl border border-line/15 bg-leaf/95 px-3 py-2.5 shadow-pop backdrop-blur-md"
          >
            <motion.div
              key={pulse}
              initial={{ scale: 0.8, rotate: -6 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", damping: 10, stiffness: 400 }}
              className="h-12 w-12 shrink-0"
            >
              <CartGraphic count={count} className="h-full w-full" />
            </motion.div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-chalk">
                {count} {count === 1 ? "item" : "items"} in your cart
              </p>
              <p className="text-xs text-chalk/70">Tap to see the bill climb</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-xl bg-chalk px-4 py-2 text-sm font-bold text-bandhani">
              <PriceTicker value={itemTotal} />
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden>
                <path d="M9 6l6 6-6 6" />
              </svg>
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
