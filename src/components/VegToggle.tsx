"use client";

import { useState } from "react";

/** A veg-only switch that filters the menu with CSS only — it toggles a class on
 *  the `#menu-root` container, so the dish list itself stays server-rendered
 *  (no client hydration of every row). */
export function VegToggle() {
  const [on, setOn] = useState(false);

  const toggle = () => {
    const root = document.getElementById("menu-root");
    if (root) root.classList.toggle("veg-only");
    setOn((v) => !v);
  };

  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-muted">
      <span className="text-[color:var(--color-veg-text)]">Veg only</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label="Veg only"
        onClick={toggle}
        className={`relative h-6 w-11 rounded-full border transition-colors ${
          on ? "border-veg bg-veg/25" : "border-line/25 bg-card"
        }`}
      >
        <span
          className={`absolute top-0.5 rounded-full transition-transform ${
            on ? "translate-x-5 bg-veg" : "translate-x-0.5 bg-steel"
          }`}
          style={{ width: 18, height: 18 }}
        />
      </button>
    </label>
  );
}
