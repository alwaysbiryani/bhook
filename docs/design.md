# Dabba Never Comes — Design System ("Steel Thali")

A fake Indian food-delivery app where the food never comes. The craft target is a
Swiggy/Zomato redesign concept, not a joke site. The whole product exists to deliver the
*feeling of buying something* — the deal-hunt, the coupon stack, the "Pay" tap, the chime, the
rider on the map — with a bill of ₹0. Every token below is judged against that.

---

## Pass 1 — Proposed tokens

### Colour ("Steel Thali")
Modern Indian dining-room, not startup-deck India. Rooted in textile + mithai-box colour.

| Token         | Hex        | Role |
|---------------|------------|------|
| Ink           | `#0C1512`  | App background, deep chrome |
| Banana Leaf   | `#1B4D3E`  | Primary surfaces, nav, cards |
| Bandhani      | `#D6336C`  | Primary action, price, "Pay" |
| Turmeric      | `#F5B301`  | **Money-saved moments only** — discounts, savings, scratch card |
| Steel         | `#DCDFDA`  | Thali metal, dividers, card edges |
| Chalk         | `#FAF8F3`  | Light surfaces, bottom sheets |

Support colours (derived, not headline): veg green `#1F7A4D`, non-veg maroon `#9E2A2B`,
egg amber `#C98A00`. These are the FSSAI dietary marks and are used *only* on the veg/non-veg
dot, never as UI accents.

### Type
- **Display:** Kalnia (Latin) — a contemporary flare-serif with real character; variable.
- **Devanagari / regional script:** Tiro Devanagari Hindi — proper Indic shaping for dish
  names written in Devanagari.
- **Body:** Onest — a warm neo-grotesque. (Spec asked for Satoshi / General Sans; those live
  only on Fontshare, which this environment's egress policy blocks. Onest is the closest
  reachable match — same clean, slightly warm grotesque register. See "Constraints".)
- **Numerals:** Geist Mono, `font-variant-numeric: tabular-nums`. **Every** ₹ figure, countdown,
  and OTP is mono + tabular so numbers tick in place instead of reflowing. This single rule is
  what makes the money feel real.

### Scale
Type scale (rem): 0.75 / 0.875 / 1 / 1.125 / 1.375 / 1.75 / 2.25 / 3 / 4. Body 1rem/1.55.
Radii: sm 8, md 12, lg 18, xl 26, full 999. Space unit 4px (Tailwind default).
Shadows are soft and warm (Ink-tinted), never pure-black.

### Motion
Spring physics on sheets (Framer Motion), number tick-ups on price change, scroll-reveal on
rails, the UPI success draw-on tick. `prefers-reduced-motion` → instant state, never nothing.

---

## Pass 2 — Self-critique against the brief

**Contrast check (WCAG AA, ≥4.5:1 body / ≥3:1 large):**
- Chalk `#FAF8F3` on Ink `#0C1512` → ~17:1. ✓ body text.
- Bandhani `#D6336C` on Ink → ~4.0:1. ✗ for small body text, ✓ for large/bold (≥3:1). **Rule:**
  Bandhani is used for large price numerals, buttons (with Chalk text *on* Bandhani), and bold
  labels — never for small body copy on a dark ground. Bandhani text on Chalk → ~4.6:1 ✓.
- Turmeric `#F5B301` on Ink → ~11:1 ✓. On Banana Leaf → ~6.4:1 ✓. Reserved for savings, so its
  rarity trains the eye to want it — do not spend it on chrome.
- Steel `#DCDFDA` on Ink → ~13:1 ✓ (dividers/labels).

**Risk: green + hot pink can read Christmas / clownish.** Mitigations: (1) Banana Leaf is deep
and desaturated, not festive green; (2) Bandhani appears only on action + price, never as large
fills next to green; (3) Turmeric is rationed; (4) generous Ink negative space keeps it calm.
The palette should feel like a steel thali on a dark table, not a poster.

**Risk: Kalnia display over-styles the whole UI.** Fix: Kalnia only for the wordmark, hero, and
section headers. Everything structural (menus, bill, buttons) is Onest. Money is Geist Mono.

**Forbidden — actively avoided:** Swiggy orange `#FC8019`, Zomato red `#E23744`, Poppins/Inter
display, cream-terracotta AI palette, mandala/paisley/lotus clip art, purple gradient hero,
emoji-as-iconography. Icons are line SVG; the veg mark is the only "dot".

**Signature element:** the stainless-steel thali cart (CSS/SVG, gradient rim, katoris that fill
as dishes are added, a slight sag when heavy). Everything else stays quiet so this is what
people remember and screenshot.

---

## Constraints discovered at build time
- **Images:** Wikimedia Commons and Pexels are both blocked by this environment's egress policy
  (403 organisation denial — cannot be routed around). Real dish photos cannot be downloaded.
  Per spec, we ship a **consistent original illustrated food system** instead of mismatched
  stock plates: layered SVG "bowls & plates" generated per dish from cuisine + type, in the
  Steel Thali palette. Benefits: no external image deps (helps the <180KB / LCP budget), fully
  theme-aware, zero attribution/licensing risk. If a photo source becomes reachable later, the
  `DishImage` component is the single swap point.
- **Body font:** Satoshi / General Sans (Fontshare) are blocked by the same policy; Onest
  (Google Fonts) is the substitute. `--font-body` is the single swap point.

## Sound (built in Phase 4)
Four cues only, synthesized in-app (Web Audio, no asset files): add-to-cart pop, coupon apply,
UPI success chime (two-tone), doorbell. Default on, visible mute toggle, never before first
interaction.
