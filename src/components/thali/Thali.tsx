"use client";

import { motion, useReducedMotion } from "framer-motion";

/** A stainless-steel thali. `filled` katoris hold food; `weight` (0..1) sags the
 *  plate a little. Empty state is a clean single plate. Pure presentation. */
export function Thali({
  filled = 0,
  weight = 0,
  className = "",
}: {
  filled?: number;
  weight?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const sag = reduce ? 0 : Math.min(1, weight);

  // 6 katoris around a central one; fill center first, then clockwise.
  const katoris = [
    { cx: 100, cy: 100, r: 22 }, // center
    { cx: 100, cy: 56, r: 17 },
    { cx: 138, cy: 78, r: 17 },
    { cx: 138, cy: 122, r: 17 },
    { cx: 100, cy: 144, r: 17 },
    { cx: 62, cy: 122, r: 17 },
    { cx: 62, cy: 78, r: 17 },
  ];
  const hues = [28, 150, 320, 200, 42, 260, 96];

  return (
    <motion.svg
      viewBox="0 0 200 210"
      className={className}
      role="img"
      aria-label={`Steel thali with ${filled} ${filled === 1 ? "dish" : "dishes"}`}
      animate={{ y: sag * 6, scaleY: 1 - sag * 0.04 }}
      transition={{ type: "spring", damping: 18, stiffness: 200 }}
    >
      <defs>
        <radialGradient id="thaliPlate" cx="42%" cy="34%" r="72%">
          <stop offset="0%" stopColor="#f4f6f2" />
          <stop offset="52%" stopColor="#d2d6cd" />
          <stop offset="82%" stopColor="#a9afa6" />
          <stop offset="100%" stopColor="#7f857c" />
        </radialGradient>
        <linearGradient id="thaliRim" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#5f645c" stopOpacity="0.4" />
        </linearGradient>
        <radialGradient id="katoriSteel" cx="40%" cy="32%" r="80%">
          <stop offset="0%" stopColor="#eef1ec" />
          <stop offset="70%" stopColor="#c0c5bd" />
          <stop offset="100%" stopColor="#8f958c" />
        </radialGradient>
      </defs>

      {/* soft shadow that deepens with weight */}
      <ellipse cx="100" cy="196" rx={72} ry={9 + sag * 5} fill="#000" opacity={0.18 + sag * 0.14} />

      {/* the plate */}
      <circle cx="100" cy="105" r="92" fill="url(#thaliPlate)" />
      <circle cx="100" cy="105" r="92" fill="url(#thaliRim)" />
      <circle cx="100" cy="105" r="80" fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="1.5" />
      <ellipse cx="78" cy="70" rx="34" ry="16" fill="#ffffff" opacity="0.18" transform="rotate(-24 78 70)" />

      {/* katoris */}
      {katoris.map((k, i) => {
        const on = i < filled;
        return (
          <g key={i}>
            <circle cx={k.cx} cy={k.cy} r={k.r} fill="url(#katoriSteel)" />
            <circle cx={k.cx} cy={k.cy} r={k.r - 3} fill={on ? `hsl(${hues[i]} 58% 46%)` : "#e7eae4"} />
            {on && (
              <>
                <ellipse
                  cx={k.cx - k.r * 0.28}
                  cy={k.cy - k.r * 0.3}
                  rx={k.r * 0.34}
                  ry={k.r * 0.2}
                  fill="#ffffff"
                  opacity="0.35"
                />
                <circle cx={k.cx + k.r * 0.25} cy={k.cy + k.r * 0.1} r="2" fill="#2f7d54" opacity="0.8" />
              </>
            )}
          </g>
        );
      })}
    </motion.svg>
  );
}
