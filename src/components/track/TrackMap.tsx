"use client";

import { useEffect, useRef, useState } from "react";

/** A hand-drawn SVG street map with a bezier route. A scooter marker rides the
 *  route via getPointAtLength(progress). No map API, no key. */
export function TrackMap({
  progress,
  riderHue = 28,
  className = "",
}: {
  progress: number; // 0..1
  riderHue?: number;
  className?: string;
}) {
  const routeRef = useRef<SVGPathElement>(null);
  const [pos, setPos] = useState({ x: 40, y: 250, angle: 0 });

  useEffect(() => {
    const path = routeRef.current;
    if (!path) return;
    const len = path.getTotalLength();
    const p = Math.max(0, Math.min(1, progress));
    const pt = path.getPointAtLength(len * p);
    const pt2 = path.getPointAtLength(Math.min(len, len * p + 1));
    const angle = (Math.atan2(pt2.y - pt.y, pt2.x - pt.x) * 180) / Math.PI;
    setPos({ x: pt.x, y: pt.y, angle });
  }, [progress]);

  return (
    <svg viewBox="0 0 360 300" className={className} role="img" aria-label="Live delivery map">
      <defs>
        <linearGradient id="mapBg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#12241c" />
          <stop offset="100%" stopColor="#0c1512" />
        </linearGradient>
      </defs>
      <rect width="360" height="300" fill="url(#mapBg)" />

      {/* blocks */}
      {[20, 120, 220, 300].map((x) =>
        [20, 110, 200].map((y) => (
          <rect key={`${x}-${y}`} x={x} y={y} width="66" height="62" rx="4" fill="#152a20" stroke="#1e3a2c" strokeWidth="1" />
        )),
      )}
      {/* roads */}
      <g stroke="#20402f" strokeWidth="10" strokeLinecap="round">
        <line x1="0" y1="95" x2="360" y2="95" />
        <line x1="0" y1="185" x2="360" y2="185" />
        <line x1="102" y1="0" x2="102" y2="300" />
        <line x1="202" y1="0" x2="202" y2="300" />
      </g>
      {/* a river/curve for character */}
      <path d="M0 265 q90 -22 180 0 t180 -8" stroke="#1c3b4a" strokeWidth="7" fill="none" opacity="0.7" />

      {/* the route */}
      <path
        ref={routeRef}
        d="M40 250 C 90 250 100 150 160 150 S 250 60 320 60"
        fill="none"
        stroke={`hsl(${riderHue} 70% 55%)`}
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="2 8"
        opacity="0.9"
      />

      {/* restaurant pin (start) */}
      <g transform="translate(40 250)">
        <circle r="9" fill="#1b4d3e" stroke="#dcdfda" strokeWidth="2" />
        <circle r="3" fill="#dcdfda" />
      </g>
      {/* home pin (end) */}
      <g transform="translate(320 60)">
        <path d="M0 -20 C8 -20 12 -13 12 -8 C12 -1 0 6 0 6 C0 6 -12 -1 -12 -8 C-12 -13 -8 -20 0 -20 Z" fill="#d6336c" />
        <circle cy="-9" r="4" fill="#faf8f3" />
      </g>

      {/* scooter marker */}
      <g transform={`translate(${pos.x} ${pos.y})`} style={{ transition: "transform 0.25s linear" }}>
        <circle r="15" fill={`hsl(${riderHue} 70% 55%)`} opacity="0.2" />
        <circle r="11" fill="#faf8f3" />
        <g stroke="#0c1512" strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="-5" cy="3" r="2.6" fill="#0c1512" />
          <circle cx="5" cy="3" r="2.6" fill="#0c1512" />
          <path d="M-5 3 L-3 -3 L3 -3 L4 1" />
          <path d="M3 -3 L6 -5" />
          <path d="M-3 -3 L-1 -3" />
        </g>
      </g>
    </svg>
  );
}
