@AGENTS.md

# Mobile-first, always

This app is **mobile-first**. Phones are the primary target; larger screens are
the enhancement, never the other way round.

- **Design for ~375px first.** Every screen must work and look intentional on a
  small phone before any `sm:`/`lg:` styles are added. Base (unprefixed) Tailwind
  classes are the mobile layout; `sm:`/`md:`/`lg:` only *widen* or *enrich* it.
- **No horizontal page scroll, ever.** Wide content (rails, tag rows, tables)
  lives in its own `overflow-x-auto` container — the page body never scrolls
  sideways.
- **Touch targets ≥ 44px.** Use the existing `min-h-11 min-w-11` idiom for any
  tappable control.
- **Stack, don't cram.** Prefer `flex-col` / single-column on mobile and switch to
  rows/grids at `sm:`+ (e.g. `grid-cols-1 sm:grid-cols-2`). Move secondary chrome
  onto its own row on mobile instead of squeezing one dense row.
- **Respect the safe area.** Keep using `safe-top` / `safe-bottom` / `safe-x` on
  sticky/fixed/full-bleed surfaces (`viewportFit: "cover"` is set).
- **Verify on a phone viewport.** When changing UI, check it at 375px (bottom
  sheets, sticky header, floating cart) — not just desktop width.
