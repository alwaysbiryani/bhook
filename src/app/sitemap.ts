import type { MetadataRoute } from "next";
import { cities, restaurants, dishes } from "@/data";

const BASE = "https://dabbanevercomes.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/credits", "/contact", "/orders"].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.5,
  }));

  const cityRoutes = cities.map((c) => ({
    url: `${BASE}/${c.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const restaurantRoutes = restaurants.map((r) => ({
    url: `${BASE}/${r.citySlug}/${r.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const dishRoutes = dishes.map((d) => ({
    url: `${BASE}/dish/${d.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...cityRoutes, ...restaurantRoutes, ...dishRoutes];
}
