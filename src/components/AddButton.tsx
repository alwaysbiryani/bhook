"use client";

import { useUI } from "@/store/useUI";
import { primeAudio } from "@/lib/sound";

export function AddButton({ dishSlug, className = "" }: { dishSlug: string; className?: string }) {
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
        "absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-lg border border-bandhani/40 bg-chalk px-6 py-1.5 text-sm font-bold uppercase tracking-wide text-bandhani shadow-pop transition active:scale-95"
      }
    >
      Add
    </button>
  );
}
