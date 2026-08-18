"use client";

import { useRouter } from "next/navigation";
import { Sheet } from "@/components/sheet/Sheet";
import { useUI } from "@/store/useUI";
import { useStore } from "@/store/useStore";
import { cities } from "@/data";

export function CityPicker() {
  const open = useUI((s) => s.cityOpen);
  const close = useUI((s) => s.closeCity);
  const setCity = useStore((s) => s.setCity);
  const router = useRouter();

  return (
    <Sheet open={open} onClose={close} labelledBy="city-title">
      <div className="px-5 pb-8 pt-2">
        <h2 id="city-title" className="font-display text-2xl text-fg">
          Where are you not eating today?
        </h2>
        <p className="mt-1 text-sm text-fg/55">Pick a city. The food won&rsquo;t come to any of them.</p>

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
              className="rounded-xl border border-line/15 px-4 py-3 text-left transition hover:border-bandhani hover:bg-bandhani/5"
            >
              <span className="block font-semibold text-fg">{c.name}</span>
              <span className="font-deva block text-sm text-fg/45">{c.nameDeva}</span>
            </button>
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-fg/40">
          14 cities. 86 legendary kitchens. Zero deliveries.
        </p>
      </div>
    </Sheet>
  );
}
