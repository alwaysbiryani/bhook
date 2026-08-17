import type { Diet } from "@/data/schema";

const MAP: Record<Diet, { color: string; label: string }> = {
  veg: { color: "var(--color-veg)", label: "Veg" },
  nonveg: { color: "var(--color-nonveg)", label: "Non-veg" },
  egg: { color: "var(--color-egg)", label: "Egg" },
};

/** FSSAI-style dietary mark: a square outline with a centred dot/triangle. */
export function VegMark({ diet, size = 16 }: { diet: Diet; size?: number }) {
  const { color, label } = MAP[diet];
  return (
    <span
      className="inline-grid shrink-0 place-items-center rounded-[3px] border"
      style={{ width: size, height: size, borderColor: color }}
      role="img"
      aria-label={label}
      title={label}
    >
      {diet === "nonveg" ? (
        <span
          style={{
            width: 0,
            height: 0,
            borderLeft: `${size * 0.28}px solid transparent`,
            borderRight: `${size * 0.28}px solid transparent`,
            borderBottom: `${size * 0.48}px solid ${color}`,
          }}
        />
      ) : (
        <span
          className="rounded-full"
          style={{ width: size * 0.42, height: size * 0.42, background: color }}
        />
      )}
    </span>
  );
}
