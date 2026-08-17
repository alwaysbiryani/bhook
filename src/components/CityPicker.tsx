"use client";

import { useRouter } from "next/navigation";
import { Sheet } from "@/components/sheet/Sheet";
import { useUI } from "@/store/useUI";
import { useStore } from "@/store/useStore";
import { cities } from "@/data";

/** All 14 cities ship in Phase 6; for now two are live and the rest are teased. */
const COMING_SOON = [
  "Mumbai", "Kolkata", "Lucknow", "Amritsar", "Chennai",
  "Bengaluru", "Jaipur", "Indore", "Ahmedabad", "Kozhikode", "Goa", "Shillong",
];

export function CityPicker() {
  const open = useUI((s) => s.cityOpen);
  const close = useUI((s) => s.closeCity);
  const setCity = useStore((s) => s.setCity);
  const router = useRouter();

  return (
    <Sheet open={open} onClose={close} labelledBy="city-title">
      <div className="px-5 pb-8 pt-2">
        <h2 id="city-title" className="font-display text-2xl text-ink">
          Where are you not eating today?
        </h2>
        <p className="mt-1 text-sm text-ink/55">Pick a city. The food won&rsquo;t come to any of them.</p>

        <div className="mt-5 grid grid-cols-2 gap-2.5">
          {cities.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => {
                setCity(c.slug);
                close();
                router.push(`/${c.slug}`);
              }}
              className="rounded-xl border border-ink/15 px-4 py-3 text-left transition hover:border-bandhani hover:bg-bandhani/5"
            >
              <span className="block font-semibold text-ink">{c.name}</span>
              <span className="font-deva block text-sm text-ink/45">{c.nameDeva}</span>
            </button>
          ))}
        </div>

        <p className="mt-6 mb-2 text-xs font-bold uppercase tracking-wider text-ink/40">
          Coming soon
        </p>
        <div className="flex flex-wrap gap-2">
          {COMING_SOON.map((n) => (
            <span key={n} className="rounded-full border border-ink/10 px-3 py-1 text-sm text-ink/35">
              {n}
            </span>
          ))}
        </div>
      </div>
    </Sheet>
  );
}
