"use client";

import { useEffect, useState } from "react";
import { heroLine, DEFAULT_KICKER } from "@/lib/heroCopy";

/** Renders a time-aware Hinglish kicker. Uses a stable default on the server, then
 *  swaps to the viewer's local-time line after mount (no hydration mismatch). */
export function HeroTagline() {
  const [kicker, setKicker] = useState(DEFAULT_KICKER);
  useEffect(() => setKicker(heroLine().kicker), []);
  return <p className="text-sm font-medium text-turmeric-text">{kicker}</p>;
}
