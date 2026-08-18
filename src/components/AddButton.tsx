"use client";

import { useUI } from "@/store/useUI";
import { primeAudio } from "@/lib/sound";

export function AddButton({
  dishSlug,
  className = "",
  label = "Add",
}: {
  dishSlug: string;
  className?: string;
  label?: string;
}) {
  const openDish = useUI((s) => s.openDish);
  return (
    <button
      type="button"
      onClick={() => {
        primeAudio(); // unlock audio within the gesture
        openDish(dishSlug);
      }}
      className={
        className ||
        "absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-lg border border-bandhani/40 bg-card px-6 py-1.5 text-sm font-bold uppercase tracking-wide text-bandhani shadow-pop transition active:scale-95"
      }
    >
      {label}
    </button>
  );
}
