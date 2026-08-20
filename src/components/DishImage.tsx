import type { ArtKind } from "@/data/schema";

/**
 * Original illustrated dish art — a committed flat-illustration style (not a
 * faked photo) rendered as layered SVG in the Steel Thali palette. Every plate
 * is seeded per dish, so garnish, grain scatter, piece placement and rotation
 * vary: no two dishes wear the same picture. Delivered as an <img> with an
 * inline SVG data-URI so the browser decodes it off the main thread. No external
 * images — photo hosts are blocked by the egress policy, and this stays
 * on-brand, tiny, and theme-consistent.
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

const r1 = (n: number) => Math.round(n * 10) / 10;
/** value in [lo, hi) */
const span = (rnd: () => number, lo: number, hi: number) => lo + rnd() * (hi - lo);

/* ------------------------------------------------------------------ *
 *  Food colour anchors — kept in the edible warm band so nothing ever
 *  renders as a "pink curry". `hue` (per restaurant) nudges tone only.
 * ------------------------------------------------------------------ */
const RICE_BED = "#efe3c1";
const RICE_LIGHT = "#fff8ea";
const RICE_SAFFRON = "#e79a3a";
const RICE_AMBER = "#dcb877";
const CORIANDER = "#2f7d54";
const CREAM = "#f3ead2";

function warm(hue: number) {
  // clamp restaurant hue into a food-safe warm range (deep saffron → chilli)
  const h = Math.max(8, Math.min(38, hue));
  return {
    deep: `hsl(${h} 60% 34%)`,
    mid: `hsl(${h} 66% 46%)`,
    lite: `hsl(${h} 72% 60%)`,
  };
}

function defs(hue: number) {
  const h = Math.max(8, Math.min(38, hue));
  return (
    `<defs>` +
    `<radialGradient id="bg" cx="36%" cy="26%" r="95%"><stop offset="0%" stop-color="hsl(${h} 30% 22%)"/><stop offset="100%" stop-color="#0b1310"/></radialGradient>` +
    `<linearGradient id="steel" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#eef1ec"/><stop offset="52%" stop-color="#c2c7bf"/><stop offset="100%" stop-color="#969d94"/></linearGradient>` +
    `<linearGradient id="sheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#ffffff" stop-opacity="0.72"/><stop offset="55%" stop-color="#ffffff" stop-opacity="0"/></linearGradient>` +
    `<radialGradient id="well" cx="46%" cy="38%" r="72%"><stop offset="0%" stop-color="#fffdf6"/><stop offset="100%" stop-color="#e9dcbb"/></radialGradient>` +
    `<linearGradient id="bread" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f3d99c"/><stop offset="100%" stop-color="#cb9a4c"/></linearGradient>` +
    `</defs>`
  );
}

/** Enlarged steel thali that fills the frame — food sits in the bright well. */
function plate() {
  return (
    `<rect x="0" y="0" width="200" height="200" fill="url(#bg)"/>` +
    `<ellipse cx="100" cy="118" rx="94" ry="66" fill="#000000" opacity="0.22"/>` +
    `<ellipse cx="100" cy="106" rx="94" ry="70" fill="#c7ccc4"/>` +
    `<ellipse cx="100" cy="102" rx="94" ry="70" fill="url(#steel)"/>` +
    `<ellipse cx="100" cy="100" rx="74" ry="54" fill="#e9ece7"/>` +
    `<ellipse cx="100" cy="100" rx="74" ry="54" fill="url(#well)"/>` +
    `<ellipse cx="100" cy="98" rx="74" ry="54" fill="url(#sheen)" opacity="0.5"/>`
  );
}

/** Coriander leaf specks scattered over the food. */
function coriander(rnd: () => number, cx: number, cy: number, spread: number, n: number) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const a = rnd() * Math.PI * 2;
    const rr = rnd() * spread;
    const x = r1(cx + Math.cos(a) * rr);
    const y = r1(cy + Math.sin(a) * rr * 0.62);
    s += `<circle cx="${x}" cy="${y}" r="${r1(1.1 + rnd() * 1.2)}" fill="${CORIANDER}" opacity="0.9"/>`;
  }
  return s;
}

/** A single red chilli with a green stem. */
function chilli(x: number, y: number, rot: number) {
  return (
    `<g transform="rotate(${rot} ${x} ${y})">` +
    `<path d="M${x} ${y} q10 1 15 9 q3 6 -2 8 q-6 1 -9 -6 q-3 -8 -4 -11 z" fill="#b3261e"/>` +
    `<path d="M${x} ${y} l-4 -4" stroke="${CORIANDER}" stroke-width="2.4" stroke-linecap="round"/>` +
    `</g>`
  );
}

/** Rising steam wisps for hot dishes. */
function steam() {
  return (
    `<g opacity="0.5" stroke="#e7ece5" stroke-width="2.4" fill="none" stroke-linecap="round">` +
    `<path d="M84 58 q-6 -9 0 -17 q6 -8 0 -16"/>` +
    `<path d="M108 54 q6 -9 0 -18 q-6 -8 0 -16"/>` +
    `</g>`
  );
}

/** Fluffy rice bed made of many seeded grains. */
function riceBed(rnd: () => number, saffron: boolean) {
  let s =
    `<ellipse cx="100" cy="100" rx="66" ry="47" fill="${RICE_BED}"/>` +
    `<ellipse cx="100" cy="98" rx="60" ry="42" fill="${RICE_LIGHT}" opacity="0.55"/>`;
  const grains = 68;
  for (let i = 0; i < grains; i++) {
    const a = rnd() * Math.PI * 2;
    const rr = Math.sqrt(rnd()) * 62;
    const x = r1(100 + Math.cos(a) * rr);
    const y = r1(100 + Math.sin(a) * rr * 0.7);
    const rot = r1(span(rnd, -60, 60));
    const t = rnd();
    const fill = saffron && t > 0.82 ? RICE_SAFFRON : t > 0.55 ? RICE_AMBER : RICE_LIGHT;
    s += `<g transform="rotate(${rot} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="2.5" ry="1" fill="${fill}"/></g>`;
  }
  return s;
}

/** Rounded protein pieces (chicken / paneer / kebab chunks). */
function pieces(rnd: () => number, c: ReturnType<typeof warm>, n: number, cx = 100, cy = 100, spread = 30) {
  let s = "";
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + rnd() * 0.9;
    const rr = span(rnd, spread * 0.25, spread);
    const x = r1(cx + Math.cos(a) * rr);
    const y = r1(cy + Math.sin(a) * rr * 0.6);
    const w = r1(span(rnd, 9, 13));
    const h = r1(span(rnd, 7, 9));
    const rot = r1(span(rnd, -25, 25));
    s +=
      `<g transform="rotate(${rot} ${x} ${y})">` +
      `<ellipse cx="${x}" cy="${r1(y + 1)}" rx="${w}" ry="${h}" fill="${c.deep}"/>` +
      `<ellipse cx="${x}" cy="${y}" rx="${w}" ry="${h}" fill="${c.mid}"/>` +
      `<ellipse cx="${r1(x - w * 0.28)}" cy="${r1(y - h * 0.32)}" rx="${r1(w * 0.4)}" ry="${r1(h * 0.34)}" fill="${c.lite}" opacity="0.7"/>` +
      `</g>`;
  }
  return s;
}

function motif(art: ArtKind, hue: number, rnd: () => number) {
  const c = warm(hue);
  switch (art) {
    case "biryani":
      return (
        riceBed(rnd, true) +
        pieces(rnd, c, 3, 100, 100, 30) +
        // fried-onion (birista) strands
        `<path d="M74 92 q10 -5 20 -1 M112 108 q10 -6 22 -2" stroke="#8a5321" stroke-width="2" fill="none" opacity="0.7" stroke-linecap="round"/>` +
        // boiled egg
        `<ellipse cx="132" cy="90" rx="10" ry="8" fill="#fbf6ea"/>` +
        `<ellipse cx="132" cy="90" rx="4.2" ry="3.4" fill="#f0c243"/>` +
        coriander(rnd, 100, 100, 52, 9) +
        chilli(70, 116, 18) +
        steam()
      );
    case "rice":
      return riceBed(rnd, false) + coriander(rnd, 100, 100, 50, 7) + steam();
    case "curry":
      return (
        `<ellipse cx="100" cy="102" rx="54" ry="38" fill="${c.deep}"/>` +
        `<ellipse cx="100" cy="99" rx="54" ry="38" fill="${c.mid}"/>` +
        // ghee/cream swirl
        `<path d="M62 96 q38 -20 76 2" stroke="${c.lite}" stroke-width="3" fill="none" opacity="0.55" stroke-linecap="round"/>` +
        `<ellipse cx="92" cy="92" rx="18" ry="8" fill="#f6ecd6" opacity="0.4"/>` +
        pieces(rnd, c, 4, 100, 100, 26) +
        // cream drizzle
        `<path d="M78 108 q22 10 44 -2" stroke="#f6ecd6" stroke-width="2.4" fill="none" opacity="0.6" stroke-linecap="round"/>` +
        coriander(rnd, 100, 100, 40, 6) +
        steam()
      );
    case "kebab": {
      let g = "";
      const rows = 3;
      for (let i = 0; i < rows; i++) {
        const y = 84 + i * 16;
        g += `<line x1="46" y1="${y + 3}" x2="154" y2="${y - 3}" stroke="#8a8f88" stroke-width="2"/>`;
        for (let j = 0; j < 4; j++) {
          const x = 62 + j * 26;
          const yy = r1(y + (j - 1.5) * -1.2);
          g +=
            `<ellipse cx="${x}" cy="${r1(yy + 1)}" rx="12" ry="9" fill="${j % 2 ? c.deep : c.mid}"/>` +
            `<ellipse cx="${x}" cy="${yy}" rx="12" ry="9" fill="${j % 2 ? c.mid : c.lite}"/>` +
            `<ellipse cx="${r1(x - 3)}" cy="${r1(yy - 3)}" rx="4.5" ry="3" fill="#ffffff" opacity="0.35"/>`;
        }
      }
      // onion rings + lime
      g += `<circle cx="60" cy="126" r="9" fill="none" stroke="#e9d7ea" stroke-width="3" opacity="0.7"/>`;
      g += `<path d="M132 122 a12 12 0 0 1 20 6 z" fill="#c7d84a"/>`;
      return g + coriander(rnd, 100, 108, 40, 5) + steam();
    }
    case "bread": {
      let spots = "";
      for (let i = 0; i < 11; i++)
        spots += `<circle cx="${r1(span(rnd, 60, 140))}" cy="${r1(span(rnd, 78, 120))}" r="${r1(span(rnd, 1.4, 3.4))}" fill="#8a5a22" opacity="0.45"/>`;
      return (
        `<path d="M54 104 q6 -34 46 -34 q40 0 46 34 q-4 30 -46 30 q-42 0 -46 -30 z" fill="#e6bd7a"/>` +
        `<path d="M54 100 q6 -34 46 -34 q40 0 46 34 q-4 30 -46 30 q-42 0 -46 -30 z" fill="url(#bread)"/>` +
        spots +
        // ghee brush highlight
        `<ellipse cx="86" cy="86" rx="16" ry="7" fill="#fff3d6" opacity="0.55"/>` +
        `<ellipse cx="118" cy="112" rx="10" ry="5" fill="#a9711f" opacity="0.35"/>`
      );
    }
    case "dosa":
      return (
        // crisp golden cone
        `<path d="M40 132 Q100 52 160 132 Q100 120 40 132 Z" fill="#e6be76"/>` +
        `<path d="M40 132 Q100 56 160 132" fill="none" stroke="url(#bread)" stroke-width="12" stroke-linecap="round"/>` +
        `<path d="M58 124 Q100 74 142 124" fill="none" stroke="#b9822f" stroke-width="2" opacity="0.5"/>` +
        // chutney + sambar katoris
        `<circle cx="56" cy="140" r="12" fill="#dfe6d0"/><circle cx="56" cy="140" r="8" fill="#8fae5a"/>` +
        `<circle cx="144" cy="140" r="12" fill="#e7d4b0"/><circle cx="144" cy="140" r="8" fill="${c.mid}"/>`
      );
    case "snack": {
      // samosa / pakora pile
      let s = "";
      const tri = 3;
      for (let i = 0; i < tri; i++) {
        const x = 74 + i * 26;
        const y = 118 - (i === 1 ? 8 : 0);
        const rot = r1(span(rnd, -10, 10)) + (i - 1) * 6;
        s +=
          `<g transform="rotate(${rot} ${x} ${y})">` +
          `<path d="M${x} ${y - 34} l-20 34 l40 0 z" fill="${i % 2 ? "#c98f45" : "#dcae63"}"/>` +
          `<path d="M${x} ${y - 34} l0 34" stroke="#a9711f" stroke-width="1.6" opacity="0.5"/>` +
          `</g>`;
      }
      // chutney dip
      s += `<circle cx="130" cy="122" r="12" fill="#dfe6d0"/><circle cx="130" cy="122" r="8" fill="#8fae5a"/>`;
      return s + coriander(rnd, 100, 116, 30, 4);
    }
    case "roll": {
      const rot = r1(span(rnd, 8, 22));
      return (
        `<g transform="rotate(${rot} 100 100)">` +
        `<rect x="80" y="66" width="26" height="70" rx="13" fill="#ecd39a"/>` +
        `<rect x="80" y="66" width="26" height="70" rx="13" fill="url(#bread)" opacity="0.85"/>` +
        // filling peeking out the top
        `<ellipse cx="93" cy="70" rx="12" ry="6" fill="${c.mid}"/>` +
        `<path d="M88 70 q5 3 10 0" stroke="#e9d7ea" stroke-width="2" fill="none" opacity="0.8"/>` +
        `<path d="M80 88 q13 6 26 0" stroke="#b9822f" stroke-width="1.6" fill="none" opacity="0.5"/>` +
        `</g>` +
        coriander(rnd, 100, 100, 20, 3)
      );
    }
    case "sweet": {
      // gulab jamun / laddoo trio in a katori
      let s = `<ellipse cx="100" cy="106" rx="46" ry="30" fill="hsl(${Math.max(8, Math.min(38, hue))} 40% 58%)" opacity="0.3"/>`;
      const cols = [`hsl(${Math.max(8, Math.min(38, hue))} 55% 46%)`, "#b5732e", "#c98a3a"];
      for (let i = 0; i < 3; i++) {
        const x = 80 + i * 20;
        const y = 100 + (i % 2) * 9;
        s +=
          `<circle cx="${x}" cy="${r1(y + 1)}" r="13" fill="#7a4a1c"/>` +
          `<circle cx="${x}" cy="${y}" r="13" fill="${cols[i]}"/>` +
          `<circle cx="${r1(x - 4)}" cy="${r1(y - 4)}" r="4.2" fill="#ffffff" opacity="0.45"/>`;
      }
      // pistachio flecks
      s += coriander(rnd, 100, 100, 26, 5);
      return s;
    }
    case "chai":
      return (
        steam() +
        `<path d="M66 90 h68 l-7 40 a27 13 0 0 1 -54 0 z" fill="#eef0ec"/>` +
        `<path d="M66 90 h68 l-1 6 a34 12 0 0 1 -66 0 z" fill="#e6e9e3"/>` +
        `<ellipse cx="100" cy="92" rx="33" ry="10" fill="${warm(hue).mid}"/>` +
        `<ellipse cx="100" cy="90" rx="26" ry="7" fill="#c8934f"/>` +
        `<ellipse cx="90" cy="89" rx="9" ry="3" fill="#e8c79a" opacity="0.7"/>` +
        // handle
        `<path d="M134 100 q20 3 15 21 q-4 11 -18 8" stroke="#d3d7cf" stroke-width="6" fill="none"/>`
      );
    case "thali": {
      let s = "";
      // central rice mound
      s += `<ellipse cx="100" cy="104" rx="18" ry="13" fill="${CREAM}"/>`;
      const pos: [number, number][] = [
        [68, 92],
        [100, 82],
        [132, 92],
        [78, 122],
        [122, 122],
      ];
      pos.forEach(([cx, cy], i) => {
        const col = `hsl(${(Math.max(8, Math.min(38, hue)) + i * 34) % 360} 55% 48%)`;
        s +=
          `<ellipse cx="${cx}" cy="${r1(cy + 1)}" rx="15" ry="10" fill="#c7ccc4"/>` +
          `<ellipse cx="${cx}" cy="${cy}" rx="13" ry="9" fill="#e9ece7"/>` +
          `<ellipse cx="${cx}" cy="${r1(cy - 0.5)}" rx="10" ry="6.5" fill="${col}"/>`;
      });
      return s + coriander(rnd, 100, 104, 12, 3);
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

/** Compact tile — same seeded motif, tighter crop, lighter element count. */
function thumbSvg(art: ArtKind, hue: number, seed: string) {
  const rnd = seeded(seed);
  const h = Math.max(8, Math.min(38, hue));
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="26 34 148 132" preserveAspectRatio="xMidYMid slice">` +
    defs(hue) +
    `<rect x="0" y="0" width="200" height="200" fill="hsl(${h} 30% 18%)"/>` +
    `<ellipse cx="100" cy="102" rx="88" ry="64" fill="url(#steel)"/>` +
    `<ellipse cx="100" cy="100" rx="70" ry="50" fill="url(#well)"/>` +
    motif(art, hue, rnd) +
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
  const svg = variant === "thumb" ? thumbSvg(art, hue, seed) : fullSvg(art, hue, seed);
  const src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  // Only explicitly-prioritised (above-the-fold LCP) images load eagerly;
  // everything else is lazy so off-screen art never competes for the main thread.
  const eager = priority;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- inline data-URI, no network fetch
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
