import type { ArtKind } from "@/data/schema";

/**
 * Original illustrated dish art — layered SVG in the Steel Thali palette, tinted
 * per dish by `hue`. Rendered as an <img> with an inline SVG data-URI so the
 * browser decodes it off the main thread (many of these on one page would be
 * expensive as inline SVG DOM). No external images — photo hosts are blocked by
 * the egress policy, and this stays on-brand, tiny, and theme-consistent.
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

const round = (n: number) => Math.round(n * 10) / 10;

function defs(hue: number) {
  return (
    `<defs>` +
    `<radialGradient id="bg" cx="38%" cy="30%" r="90%"><stop offset="0%" stop-color="hsl(${hue} 34% 24%)"/><stop offset="100%" stop-color="#0c1512"/></radialGradient>` +
    `<linearGradient id="steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eef1ec"/><stop offset="55%" stop-color="#c2c7bf"/><stop offset="100%" stop-color="#9aa199"/></linearGradient>` +
    `<linearGradient id="steelInner" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.7"/><stop offset="60%" stop-color="#ffffff" stop-opacity="0"/></linearGradient>` +
    `<radialGradient id="riceTex" cx="50%" cy="40%" r="70%"><stop offset="0%" stop-color="#fffdf5"/><stop offset="100%" stop-color="#e7dcbf"/></radialGradient>` +
    `<linearGradient id="bread" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f2d79a"/><stop offset="100%" stop-color="#cf9f52"/></linearGradient>` +
    `</defs>`
  );
}

function plate() {
  return (
    `<rect x="0" y="0" width="200" height="200" fill="url(#bg)"/>` +
    `<ellipse cx="100" cy="118" rx="82" ry="60" fill="#c7ccc4"/>` +
    `<ellipse cx="100" cy="114" rx="82" ry="60" fill="url(#steel)"/>` +
    `<ellipse cx="100" cy="112" rx="64" ry="46" fill="#e9ece7"/>` +
    `<ellipse cx="100" cy="112" rx="64" ry="46" fill="url(#steelInner)"/>` +
    `<ellipse cx="100" cy="110" rx="52" ry="37" fill="#f4f6f2" opacity="0.5"/>`
  );
}

function garnish(n: number, cx: number, cy: number, spread: number, rnd: () => number) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2;
    const r = rnd() * spread;
    s += `<circle cx="${round(cx + Math.cos(a) * r)}" cy="${round(cy + Math.sin(a) * r * 0.6)}" r="${round(1.1 + rnd() * 1.3)}" fill="#2f7d54" opacity="0.85"/>`;
  }
  return s;
}

function motif(art: ArtKind, hue: number, rnd: () => number) {
  const food = `hsl(${hue} 62% 46%)`;
  const foodDeep = `hsl(${hue} 66% 34%)`;
  const foodLite = `hsl(${hue} 70% 62%)`;
  const cream = "#f3ead2";

  switch (art) {
    case "biryani":
    case "rice":
      return (
        `<ellipse cx="100" cy="112" rx="58" ry="40" fill="${cream}"/>` +
        `<ellipse cx="100" cy="112" rx="58" ry="40" fill="url(#riceTex)"/>` +
        (art === "biryani"
          ? `<path d="M70 108 q10 -14 24 -6 q14 -12 30 2 q10 8 -2 16 q-26 10 -52 -2 z" fill="${food}" opacity="0.9"/>` +
            `<ellipse cx="120" cy="100" rx="10" ry="7" fill="${foodDeep}"/>` +
            `<ellipse cx="84" cy="120" rx="9" ry="6" fill="${foodLite}" opacity="0.8"/>`
          : "") +
        garnish(10, 100, 112, 46, rnd)
      );
    case "curry":
      return (
        `<ellipse cx="100" cy="112" rx="46" ry="31" fill="${foodDeep}"/>` +
        `<ellipse cx="100" cy="110" rx="46" ry="31" fill="${food}"/>` +
        `<path d="M64 108 q36 -18 72 0" stroke="${foodLite}" stroke-width="3" fill="none" opacity="0.7" stroke-linecap="round"/>` +
        `<ellipse cx="100" cy="107" rx="20" ry="9" fill="${foodLite}" opacity="0.35"/>` +
        garnish(7, 100, 108, 34, rnd)
      );
    case "kebab": {
      let g = "";
      for (let i = 0; i < 3; i++) {
        const y = 96 + i * 13;
        g += `<line x1="52" y1="${y}" x2="150" y2="${y - 4}" stroke="#8a8f88" stroke-width="2"/>`;
        for (let j = 0; j < 4; j++)
          g += `<ellipse cx="${68 + j * 22}" cy="${y - j - 1}" rx="11" ry="8" fill="${j % 2 ? foodDeep : food}"/>`;
      }
      return g + garnish(5, 100, 110, 40, rnd);
    }
    case "bread": {
      let spots = "";
      for (let i = 0; i < 9; i++)
        spots += `<circle cx="${round(62 + rnd() * 76)}" cy="${round(90 + rnd() * 34)}" r="${round(1.6 + rnd() * 2)}" fill="#7a5322" opacity="0.5"/>`;
      return (
        `<ellipse cx="100" cy="110" rx="52" ry="34" fill="#e8c98c"/>` +
        `<ellipse cx="100" cy="108" rx="52" ry="34" fill="url(#bread)"/>` +
        spots +
        `<ellipse cx="88" cy="100" rx="10" ry="5" fill="#fff3d6" opacity="0.6"/>`
      );
    }
    case "dosa":
      return (
        `<path d="M46 128 Q100 70 156 128 Q100 118 46 128 Z" fill="#e6c583"/>` +
        `<path d="M46 128 Q100 74 156 128" fill="none" stroke="url(#bread)" stroke-width="10" stroke-linecap="round"/>` +
        `<circle cx="60" cy="132" r="10" fill="${cream}"/>` +
        `<circle cx="140" cy="132" r="10" fill="${food}" opacity="0.8"/>`
      );
    case "snack": {
      let s = "";
      for (let i = 0; i < 2; i++)
        s += `<path d="M${72 + i * 34} 128 l-16 -30 l32 0 z" fill="${i ? foodDeep : "#dcae63"}" transform="rotate(${i ? 8 : -6} ${80 + i * 34} 112)"/>`;
      return s + `<ellipse cx="100" cy="130" rx="44" ry="8" fill="#00000022"/>` + garnish(4, 100, 118, 30, rnd);
    }
    case "roll":
      return (
        `<rect x="72" y="86" width="24" height="52" rx="12" fill="#ecd39a" transform="rotate(18 84 112)"/>` +
        `<rect x="104" y="86" width="24" height="52" rx="12" fill="#e6c583" transform="rotate(18 116 112)"/>` +
        `<rect x="88" y="92" width="10" height="40" rx="5" fill="${food}" transform="rotate(18 93 112)"/>`
      );
    case "sweet": {
      let s = `<ellipse cx="100" cy="114" rx="40" ry="26" fill="hsl(${hue} 40% 60%)" opacity="0.35"/>`;
      for (let i = 0; i < 3; i++) s += `<circle cx="${82 + i * 18}" cy="${108 + (i % 2) * 8}" r="12" fill="hsl(${hue} 55% 48%)"/>`;
      for (let i = 0; i < 3; i++) s += `<circle cx="${82 + i * 18}" cy="${104 + (i % 2) * 8}" r="4" fill="#ffffff" opacity="0.5"/>`;
      return s;
    }
    case "chai":
      return (
        `<path d="M96 78 q4 -12 -2 -20 M104 78 q6 -12 0 -22" stroke="#cfd3cc" stroke-width="3" fill="none" opacity="0.6" stroke-linecap="round"/>` +
        `<path d="M70 92 h60 l-6 34 a24 12 0 0 1 -48 0 z" fill="#eef0ec"/>` +
        `<ellipse cx="100" cy="94" rx="30" ry="9" fill="hsl(${hue} 45% 42%)"/>` +
        `<path d="M130 100 q18 2 14 18 q-3 10 -16 8" stroke="#cfd3cc" stroke-width="5" fill="none"/>`
      );
    case "thali": {
      let s = "";
      const pos = [
        [72, 104],
        [100, 98],
        [128, 104],
        [86, 124],
        [114, 124],
      ];
      pos.forEach(([cx, cy], i) => {
        s += `<ellipse cx="${cx}" cy="${cy}" rx="13" ry="9" fill="#d6dad2"/>`;
        s += `<ellipse cx="${cx}" cy="${cy - 1}" rx="10" ry="7" fill="hsl(${(hue + i * 40) % 360} 55% 50%)"/>`;
      });
      return s;
    }
  }
}

function fullSvg(art: ArtKind, hue: number, seed: string) {
  const rnd = seeded(seed);
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">` +
    defs(hue) +
    plate() +
    motif(art, hue, rnd) +
    `</svg>`
  );
}

function thumbSvg(art: ArtKind, hue: number) {
  const food =
    art === "chai"
      ? `hsl(${hue} 42% 44%)`
      : art === "sweet"
        ? `hsl(${hue} 46% 56%)`
        : art === "bread" || art === "dosa"
          ? "#e6c583"
          : `hsl(${hue} 60% 46%)`;
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">` +
    `<rect width="200" height="200" fill="hsl(${hue} 30% 16%)"/>` +
    `<ellipse cx="100" cy="114" rx="72" ry="54" fill="#c1c6bd"/>` +
    `<ellipse cx="100" cy="110" rx="54" ry="40" fill="#eef1ec"/>` +
    `<ellipse cx="100" cy="106" rx="36" ry="23" fill="${food}"/>` +
    `<ellipse cx="86" cy="98" rx="10" ry="5" fill="#ffffff" opacity="0.4"/>` +
    `</svg>`
  );
}

export function DishImage({
  art,
  hue,
  seed,
  className,
  alt,
  variant = "full",
  priority = false,
}: {
  art: ArtKind;
  hue: number;
  seed: string;
  className?: string;
  alt: string;
  variant?: "full" | "thumb";
  /** Above-the-fold LCP images (a dish hero) load eagerly; everything else lazy. */
  priority?: boolean;
}) {
  const svg = variant === "thumb" ? thumbSvg(art, hue) : fullSvg(art, hue, seed);
  const src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  // Only explicitly-prioritised (above-the-fold LCP) images load eagerly;
  // everything else is lazy so off-screen art never competes for the main thread.
  const eager = priority;
  // eslint-disable-next-line @next/next/no-img-element -- inline data-URI, no network fetch
  return (
    <img
      src={src}
      alt={alt}
      className={`object-cover ${className ?? ""}`}
      loading={eager ? "eager" : "lazy"}
      // Above-the-fold hero art is usually the LCP element — hint the browser to
      // decode/paint it first instead of letting it queue behind everything else.
      fetchPriority={eager ? "high" : "auto"}
      decoding="async"
      draggable={false}
    />
  );
}
