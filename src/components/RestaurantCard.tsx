import Link from "next/link";
import type { Restaurant } from "@/data/schema";
import type { ArtKind } from "@/data/schema";
import { StarRating } from "@/components/ui/StarRating";
import { DishImage } from "@/components/DishImage";

/** Pick a representative illustration for the card from the place's signature. */
function cardArt(r: Restaurant): ArtKind {
  const s = `${r.bestFor ?? ""} ${r.cuisines.join(" ")}`.toLowerCase();
  if (s.includes("chai") || s.includes("irani")) return "chai";
  if (s.includes("dosa")) return "dosa";
  if (s.includes("biryani")) return "biryani";
  if (s.includes("chole") || s.includes("bhature") || s.includes("street")) return "snack";
  if (s.includes("paratha") || s.includes("naan") || s.includes("bread")) return "bread";
  if (s.includes("kebab") || s.includes("tandoor")) return "kebab";
  if (s.includes("sweet") || s.includes("bakery")) return "sweet";
  return "curry";
}

export function RestaurantCard({ r, priority = false }: { r: Restaurant; priority?: boolean }) {
  return (
    <Link
      href={`/${r.citySlug}/${r.slug}`}
      className="group block overflow-hidden rounded-xl border border-line/10 bg-card/60 shadow-card transition hover:border-line/25 hover:shadow-pop"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        <DishImage
          art={cardArt(r)}
          hue={r.hue}
          seed={r.slug}
          priority={priority}
          alt={`${r.name} — illustrated`}
          className="h-full w-full transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-page to-transparent" />
        <span className="absolute bottom-2.5 left-3 rounded-md bg-page/85 px-2 py-0.5 text-[11px] font-bold text-fg backdrop-blur-sm">
          {r.prepMins}–{r.prepMins + 8} min
        </span>
        {r.fictional && (
          <span className="absolute right-3 top-3 rounded-md bg-page/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted backdrop-blur-sm">
            Cloud kitchen
          </span>
        )}
      </div>
      <div className="p-3.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium leading-tight text-fg">{r.name}</h3>
          <StarRating rating={r.rating} className="mt-0.5" />
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-dim">
          {r.cuisines.slice(0, 3).join(" · ")}
        </p>
        <div className="mt-2 flex items-center gap-2 text-xs text-dim">
          <span>{r.area}</span>
          <span className="h-1 w-1 rounded-full bg-steel/30" />
          <span className="tnum">₹{r.priceForTwo} for two</span>
        </div>
      </div>
    </Link>
  );
}
