"use client";

import { useEffect, useRef, useState } from "react";
import { inr } from "@/lib/format";

/** A ₹ number that tweens to its new value instead of snapping. Tabular mono so
 *  digits tick in place. Honours prefers-reduced-motion. */
export function PriceTicker({
  value,
  className = "",
  prefix = "₹",
  duration = 340,
}: {
  value: number;
  className?: string;
  prefix?: string;
  duration?: number;
}) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const from = fromRef.current;
    const to = value;
    if (reduce || from === to) {
      fromRef.current = to;
      setDisplay(to);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const cur = Math.round(from + (to - from) * eased);
      setDisplay(cur);
      if (t < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        fromRef.current = to;
      }
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      fromRef.current = to;
    };
  }, [value, duration]);

  return (
    <span className={`tnum ${className}`}>
      {prefix}
      {inr(display)}
    </span>
  );
}
