import { ImageResponse } from "next/og";
import { getDish, getRestaurant, getCity } from "@/data";

export const alt = "Dabba Never Comes";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const d = getDish(slug);
  const r = d ? getRestaurant(d.restaurantSlug) : undefined;
  const c = r ? getCity(r.citySlug) : undefined;
  const hue = r?.hue ?? 28;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0c1512",
          padding: 72,
          color: "#faf8f3",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, color: "#dcdfda", fontSize: 30 }}>
          <div style={{ width: 44, height: 44, borderRadius: 999, background: `hsl(${hue} 58% 50%)` }} />
          Dabba Never Comes
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 34, color: "#f5b301", marginBottom: 8 }}>
            {(r?.name ?? "") + (c ? " · " + c.name : "")}
          </div>
          <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.05, maxWidth: 980 }}>
            {d?.name ?? "This dish also never came"}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: 40, color: "#dcdfda" }}>Order the feeling. Skip the food.</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 30, color: "#9aa39c", textDecoration: "line-through" }}>
              {d ? "₹" + d.mrp : ""}
            </div>
            <div style={{ fontSize: 56, fontWeight: 700, color: "#d6336c" }}>₹0</div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
