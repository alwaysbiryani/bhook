const TIERS = [
  { name: "Bhookha", min: 0 },
  { name: "Regular", min: 3 },
  { name: "Dabba Elite", min: 10 },
] as const;

export function tierFor(orders: number): (typeof TIERS)[number] {
  let t: (typeof TIERS)[number] = TIERS[0];
  for (const tier of TIERS) if (orders >= tier.min) t = tier;
  return t;
}

/** A tier ladder that unlocks nothing, which is the joke. */
export function TierLadder({ orders }: { orders: number }) {
  const current = tierFor(orders);
  const next = TIERS.find((t) => t.min > orders);
  const toNext = next ? next.min - orders : 0;

  return (
    <div className="rounded-2xl border border-steel/10 bg-ink-2/60 p-4">
      <div className="flex items-center justify-between">
        {TIERS.map((t, i) => {
          const active = t.name === current.name;
          const reached = orders >= t.min;
          return (
            <div key={t.name} className="flex flex-1 flex-col items-center gap-1.5">
              <div
                className={`grid h-9 w-9 place-items-center rounded-full text-sm font-bold ${
                  active
                    ? "bg-turmeric text-ink"
                    : reached
                      ? "bg-turmeric/25 text-turmeric"
                      : "bg-steel/10 text-steel-dim"
                }`}
              >
                {i + 1}
              </div>
              <span className={`text-[11px] ${active ? "font-semibold text-turmeric" : "text-steel-dim"}`}>
                {t.name}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-xs text-steel-dim">
        {next
          ? `${toNext} more never-delivered order${toNext > 1 ? "s" : ""} to reach ${next.name}. It unlocks nothing.`
          : "Peak Dabba Elite. Your reward is knowing you spent nothing."}
      </p>
    </div>
  );
}
