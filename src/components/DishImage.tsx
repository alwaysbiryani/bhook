import type { ArtKind } from "@/data/schema";

/**
 * Original illustrated dish art — layered SVG in the Steel Thali palette,
 * tinted per dish by `hue`. No external images (photo hosts are blocked by
 * the egress policy, and this stays on-brand, tiny, and theme-consistent).
 */

function seeded(seed: string) {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Plate({ hue }: { hue: number }) {
  return (
    <>
      {/* warm backdrop */}
      <rect x="0" y="0" width="200" height="200" fill={`url(#bg-${hue})`} />
      {/* steel plate */}
      <ellipse cx="100" cy="118" rx="82" ry="60" fill="#c7ccc4" />
      <ellipse cx="100" cy="114" rx="82" ry="60" fill="url(#steel)" />
      <ellipse cx="100" cy="112" rx="64" ry="46" fill="#e9ece7" />
      <ellipse cx="100" cy="112" rx="64" ry="46" fill="url(#steelInner)" />
      <ellipse cx="100" cy="110" rx="52" ry="37" fill="#f4f6f2" opacity="0.5" />
    </>
  );
}

function Motif({ art, hue, rnd }: { art: ArtKind; hue: number; rnd: () => number }) {
  const food = `hsl(${hue} 62% 46%)`;
  const foodDeep = `hsl(${hue} 66% 34%)`;
  const foodLite = `hsl(${hue} 70% 62%)`;
  const green = "#2f7d54";
  const cream = "#f3ead2";

  const garnish = (n: number, cx: number, cy: number, spread: number) =>
    Array.from({ length: n }).map((_, i) => {
      const a = rnd() * Math.PI * 2;
      const r = rnd() * spread;
      return (
        <circle
          key={i}
          cx={cx + Math.cos(a) * r}
          cy={cy + Math.sin(a) * r * 0.6}
          r={1.1 + rnd() * 1.3}
          fill={green}
          opacity={0.85}
        />
      );
    });

  switch (art) {
    case "biryani":
    case "rice":
      return (
        <g>
          <ellipse cx="100" cy="112" rx="58" ry="40" fill={cream} />
          <ellipse cx="100" cy="112" rx="58" ry="40" fill="url(#riceTex)" />
          {art === "biryani" && (
            <>
              <path d="M70 108 q10 -14 24 -6 q14 -12 30 2 q10 8 -2 16 q-26 10 -52 -2 z" fill={food} opacity="0.9" />
              <ellipse cx="120" cy="100" rx="10" ry="7" fill={foodDeep} />
              <ellipse cx="84" cy="120" rx="9" ry="6" fill={foodLite} opacity="0.8" />
            </>
          )}
          {garnish(10, 100, 112, 46)}
        </g>
      );
    case "curry":
      return (
        <g>
          <ellipse cx="100" cy="112" rx="46" ry="31" fill={foodDeep} />
          <ellipse cx="100" cy="110" rx="46" ry="31" fill={food} />
          <path d="M64 108 q36 -18 72 0" stroke={foodLite} strokeWidth="3" fill="none" opacity="0.7" strokeLinecap="round" />
          <ellipse cx="100" cy="107" rx="20" ry="9" fill={foodLite} opacity="0.35" />
          {garnish(7, 100, 108, 34)}
        </g>
      );
    case "kebab":
      return (
        <g>
          {[0, 1, 2].map((i) => {
            const y = 96 + i * 13;
            return (
              <g key={i}>
                <line x1="52" y1={y} x2="150" y2={y - 4} stroke="#8a8f88" strokeWidth="2" />
                {[0, 1, 2, 3].map((j) => (
                  <ellipse key={j} cx={68 + j * 22} cy={y - j - 1} rx="11" ry="8" fill={j % 2 ? foodDeep : food} />
                ))}
              </g>
            );
          })}
          {garnish(5, 100, 110, 40)}
        </g>
      );
    case "bread":
      return (
        <g>
          <ellipse cx="100" cy="110" rx="52" ry="34" fill="#e8c98c" />
          <ellipse cx="100" cy="108" rx="52" ry="34" fill="url(#bread)" />
          {Array.from({ length: 9 }).map((_, i) => (
            <circle key={i} cx={62 + rnd() * 76} cy={90 + rnd() * 34} r={1.6 + rnd() * 2} fill="#7a5322" opacity="0.5" />
          ))}
          <ellipse cx="88" cy="100" rx="10" ry="5" fill="#fff3d6" opacity="0.6" />
        </g>
      );
    case "dosa":
      return (
        <g>
          <path d="M46 128 Q100 70 156 128 Q100 118 46 128 Z" fill="#e6c583" />
          <path d="M46 128 Q100 74 156 128" fill="none" stroke="url(#bread)" strokeWidth="10" strokeLinecap="round" />
          <circle cx="60" cy="132" r="10" fill={cream} />
          <circle cx="140" cy="132" r="10" fill={food} opacity="0.8" />
        </g>
      );
    case "snack":
      return (
        <g>
          {[0, 1].map((i) => (
            <path
              key={i}
              d={`M${72 + i * 34} 128 l-16 -30 l32 0 z`}
              fill={i ? foodDeep : "#dcae63"}
              transform={`rotate(${i ? 8 : -6} ${80 + i * 34} 112)`}
            />
          ))}
          <ellipse cx="100" cy="130" rx="44" ry="8" fill="#00000022" />
          {garnish(4, 100, 118, 30)}
        </g>
      );
    case "roll":
      return (
        <g>
          <rect x="72" y="86" width="24" height="52" rx="12" fill="#ecd39a" transform="rotate(18 84 112)" />
          <rect x="104" y="86" width="24" height="52" rx="12" fill="#e6c583" transform="rotate(18 116 112)" />
          <rect x="88" y="92" width="10" height="40" rx="5" fill={food} transform="rotate(18 93 112)" />
        </g>
      );
    case "sweet":
      return (
        <g>
          <ellipse cx="100" cy="114" rx="40" ry="26" fill={`hsl(${hue} 40% 60%)`} opacity="0.35" />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={82 + i * 18} cy={108 + (i % 2) * 8} r="12" fill={`hsl(${hue} 55% 48%)`} />
          ))}
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={82 + i * 18} cy={104 + (i % 2) * 8} r="4" fill="#ffffff" opacity="0.5" />
          ))}
        </g>
      );
    case "chai":
      return (
        <g>
          <path d="M96 78 q4 -12 -2 -20 M104 78 q6 -12 0 -22" stroke="#cfd3cc" strokeWidth="3" fill="none" opacity="0.6" strokeLinecap="round" />
          <path d="M70 92 h60 l-6 34 a24 12 0 0 1 -48 0 z" fill="#eef0ec" />
          <ellipse cx="100" cy="94" rx="30" ry="9" fill={`hsl(${hue} 45% 42%)`} />
          <path d="M130 100 q18 2 14 18 q-3 10 -16 8" stroke="#cfd3cc" strokeWidth="5" fill="none" />
        </g>
      );
    case "thali":
      return (
        <g>
          {[
            [72, 104],
            [100, 98],
            [128, 104],
            [86, 124],
            [114, 124],
          ].map(([cx, cy], i) => (
            <g key={i}>
              <ellipse cx={cx} cy={cy} rx="13" ry="9" fill="#d6dad2" />
              <ellipse cx={cx} cy={cy - 1} rx="10" ry="7" fill={`hsl(${(hue + i * 40) % 360} 55% 50%)`} />
            </g>
          ))}
        </g>
      );
  }
}

export function DishImage({
  art,
  hue,
  seed,
  className,
  alt,
}: {
  art: ArtKind;
  hue: number;
  seed: string;
  className?: string;
  alt: string;
}) {
  const rnd = seeded(seed);
  return (
    <svg
      viewBox="0 0 200 200"
      className={className}
      role="img"
      aria-label={alt}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`bg-${hue}`} cx="38%" cy="30%" r="90%">
          <stop offset="0%" stopColor={`hsl(${hue} 34% 24%)`} />
          <stop offset="100%" stopColor="#0c1512" />
        </radialGradient>
        <linearGradient id="steel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#eef1ec" />
          <stop offset="55%" stopColor="#c2c7bf" />
          <stop offset="100%" stopColor="#9aa199" />
        </linearGradient>
        <linearGradient id="steelInner" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
          <stop offset="60%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="riceTex" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#fffdf5" />
          <stop offset="100%" stopColor="#e7dcbf" />
        </radialGradient>
        <linearGradient id="bread" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f2d79a" />
          <stop offset="100%" stopColor="#cf9f52" />
        </linearGradient>
      </defs>
      <Plate hue={hue} />
      <Motif art={art} hue={hue} rnd={rnd} />
    </svg>
  );
}
