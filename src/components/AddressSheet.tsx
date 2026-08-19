"use client";

import { useRef, useState } from "react";
import { Sheet } from "@/components/sheet/Sheet";
import { useUI } from "@/store/useUI";
import { useStore } from "@/store/useStore";
import { getCity } from "@/data/client";

const LABELS = ["Home", "Work", "Other"] as const;

/** "Deliver to" — a straight-faced address form. A hand-drawn map with a draggable
 *  pin, label + flat/landmark fields. Stored locally, never validated, never sent. */
export function AddressSheet() {
  const open = useUI((s) => s.addressOpen);
  const close = useUI((s) => s.closeAddress);
  const citySlug = useStore((s) => s.citySlug);
  const existing = useStore((s) => s.address);
  const setAddress = useStore((s) => s.setAddress);

  const city = getCity(citySlug);
  const [label, setLabel] = useState<string>(existing?.label ?? "Home");
  const [line, setLine] = useState(existing?.line ?? "");
  const [area, setArea] = useState(existing?.area ?? city?.areas[0] ?? "");
  const [pin, setPin] = useState(existing?.pin ?? { x: 0.5, y: 0.46 });
  const mapRef = useRef<SVGSVGElement>(null);
  const dragging = useRef(false);

  const movePin = (clientX: number, clientY: number) => {
    const el = mapRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    const y = Math.min(0.9, Math.max(0.1, (clientY - r.top) / r.height));
    setPin({ x, y });
  };

  const save = () => {
    setAddress({ label, line: line.trim() || "Somewhere in " + (city?.name ?? ""), area, pin });
    close();
  };

  return (
    <Sheet open={open} onClose={close} labelledBy="addr-title">
      <div className="px-5 pb-8 pt-2">
        <h2 id="addr-title" className="font-display text-2xl text-fg">
          Deliver to
        </h2>
        <p className="mt-1 text-sm text-fg/55">
          Drop the pin anywhere. Ramesh will find it, then not come.
        </p>

        {/* hand-drawn map */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-line/10">
          <svg
            ref={mapRef}
            viewBox="0 0 320 180"
            className="h-44 w-full touch-none select-none"
            onPointerDown={(e) => {
              dragging.current = true;
              (e.target as Element).setPointerCapture?.(e.pointerId);
              movePin(e.clientX, e.clientY);
            }}
            onPointerMove={(e) => dragging.current && movePin(e.clientX, e.clientY)}
            onPointerUp={() => (dragging.current = false)}
          >
            <rect width="320" height="180" fill="#eef1ec" />
            {/* blocks */}
            {[24, 96, 168, 240].map((x) =>
              [16, 84, 132].map((y) => (
                <rect key={`${x}-${y}`} x={x} y={y} width="56" height="40" rx="3" fill="#dfe4db" />
              )),
            )}
            {/* roads */}
            <g stroke="#c7ccc3" strokeWidth="6">
              <line x1="0" y1="70" x2="320" y2="70" />
              <line x1="0" y1="120" x2="320" y2="120" />
              <line x1="86" y1="0" x2="86" y2="180" />
              <line x1="230" y1="0" x2="230" y2="180" />
            </g>
            <path d="M0 96 q80 -30 160 0 t160 -6" stroke="#bcd0c2" strokeWidth="4" fill="none" />
            {/* pin */}
            <g transform={`translate(${pin.x * 320} ${pin.y * 180})`} style={{ cursor: "grab" }}>
              <ellipse cx="0" cy="2" rx="7" ry="3" fill="#00000022" />
              <path d="M0 -26 C10 -26 14 -18 14 -12 C14 -4 0 4 0 4 C0 4 -14 -4 -14 -12 C-14 -18 -10 -26 0 -26 Z" fill="#d6336c" />
              <circle cx="0" cy="-13" r="4.5" fill="#faf8f3" />
            </g>
          </svg>
        </div>

        {/* label */}
        <div className="mt-4 flex gap-2">
          {LABELS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLabel(l)}
              aria-pressed={label === l}
              className={`rounded-xl border px-4 py-2 text-sm transition ${
                label === l
                  ? "border-bandhani bg-bandhani/10 text-[color:var(--color-bandhani-ink)]"
                  : "border-line/15 text-fg/70"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <label className="mt-4 block">
          <span className="text-sm font-medium text-fg/70">Flat / building / landmark</span>
          <input
            value={line}
            onChange={(e) => setLine(e.target.value)}
            placeholder="Flat 402, Rose Apartments, near the temple"
            className="mt-1 w-full rounded-xl border border-line/15 bg-card-2 px-4 py-2.5 text-fg outline-none focus:border-bandhani"
          />
        </label>

        <label className="mt-3 block">
          <span className="text-sm font-medium text-fg/70">Area</span>
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="mt-1 w-full rounded-xl border border-line/15 bg-card-2 px-4 py-2.5 text-fg outline-none focus:border-bandhani"
          >
            {city?.areas.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={save}
          className="mt-6 w-full rounded-xl bg-bandhani py-3.5 font-semibold text-fg shadow-pop transition active:scale-[0.99]"
        >
          Save address
        </button>
      </div>
    </Sheet>
  );
}
