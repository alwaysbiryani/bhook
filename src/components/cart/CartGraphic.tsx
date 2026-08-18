"use client";

import { motion, useReducedMotion } from "framer-motion";

/** A standard shopping-bag cart visual in the Steel-Thali palette. Empty state is a
 *  clean bag; as `count` grows, food peeks over the rim. Replaces the old thali plate. */
export function CartGraphic({
  count = 0,
  className = "",
}: {
  count?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const items = Math.min(3, count);
  const hues = [28, 150, 320];

  return (
    <motion.svg
      viewBox="0 0 200 210"
      className={className}
      role="img"
      aria-label={count > 0 ? `Cart with ${count} ${count === 1 ? "item" : "items"}` : "Empty cart"}
      initial={false}
      animate={reduce ? {} : { y: [0, -1.5, 0] }}
      transition={reduce ? {} : { duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id="bagBody" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef1ec" />
          <stop offset="55%" stopColor="#d2d6cd" />
          <stop offset="100%" stopColor="#aab0a7" />
        </linearGradient>
        <linearGradient id="bagShine" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* shadow */}
      <ellipse cx="100" cy="196" rx="60" ry="8" fill="#000" opacity="0.16" />

      {/* food peeking over the rim */}
      {Array.from({ length: items }).map((_, i) => (
        <circle
          key={i}
          cx={72 + i * 28}
          cy={62 - (i % 2) * 6}
          r={16}
          fill={`hsl(${hues[i]} 58% 52%)`}
        />
      ))}
      {items > 0 && (
        <rect x="52" y="58" width="96" height="16" rx="8" fill="#c7ccc4" />
      )}

      {/* handles */}
      <path
        d="M74 66 C74 40 92 30 100 30 C108 30 126 40 126 66"
        fill="none"
        stroke="#9aa199"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* bag body */}
      <path d="M54 66 L146 66 L156 176 a8 8 0 0 1 -8 9 L52 185 a8 8 0 0 1 -8 -9 Z" fill="url(#bagBody)" />
      <path d="M54 66 L146 66 L156 176 a8 8 0 0 1 -8 9 L52 185 a8 8 0 0 1 -8 -9 Z" fill="url(#bagShine)" />

      {/* fold + brand accent */}
      <line x1="50" y1="92" x2="150" y2="92" stroke="#ffffff" strokeOpacity="0.4" strokeWidth="2" />
      <circle cx="100" cy="132" r="14" fill="#0c1512" opacity="0.9" />
      <circle cx="100" cy="130" r="5" fill="#d6336c" />
    </motion.svg>
  );
}
