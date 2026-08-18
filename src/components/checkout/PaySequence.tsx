"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { play } from "@/lib/sound";

type Phase = "spin" | "done";

/** The ~2.4s pay moment: spinner → two-tone chime + a tick that draws itself →
 *  "₹0 paid to {payee}". Haptic on success. Calls onDone when finished. */
export function PaySequence({ payee, onDone }: { payee: string; onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("spin");
  const reduce = useReducedMotion();

  useEffect(() => {
    const spinMs = reduce ? 400 : 1000;
    const holdMs = reduce ? 500 : 1400;
    const t1 = setTimeout(() => {
      setPhase("done");
      play("success");
      if (typeof navigator !== "undefined" && navigator.vibrate) navigator.vibrate([18, 40, 60]);
    }, spinMs);
    const t2 = setTimeout(onDone, spinMs + holdMs);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reduce, onDone]);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-page px-6 text-center">
      {phase === "spin" ? (
        <>
          <div className="h-16 w-16 animate-spin rounded-full border-[3px] border-line/20 border-t-bandhani" />
          <p className="mt-6 text-muted">Paying <span className="tnum text-fg">₹0</span>…</p>
          <p className="mt-1 text-xs text-dim">Securely doing absolutely nothing</p>
        </>
      ) : (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", damping: 18, stiffness: 260 }}
          className="flex flex-col items-center"
        >
          <svg width="108" height="108" viewBox="0 0 108 108" aria-hidden>
            <motion.circle
              cx="54" cy="54" r="48" fill="none" stroke="var(--color-veg)" strokeWidth="5"
              initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              style={{ rotate: -90, transformOrigin: "center" }}
            />
            <motion.path
              d="M34 55 l13 13 l27 -29" fill="none" stroke="var(--color-veg)" strokeWidth="6"
              strokeLinecap="round" strokeLinejoin="round"
              initial={reduce ? { pathLength: 1 } : { pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.35, delay: 0.35, ease: "easeOut" }}
            />
          </svg>
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
            className="mt-6 font-display text-3xl text-fg"
          >
            <span className="tnum text-veg">₹0</span> paid
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
            className="mt-1 text-muted"
          >
            to {payee}
          </motion.p>
        </motion.div>
      )}
    </div>
  );
}
