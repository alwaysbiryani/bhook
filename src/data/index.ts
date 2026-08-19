/**
 * Server-facing data entry. Re-exports the full catalogue and lookups from
 * `./core`, and keeps the zod safety net that validates the whole dataset.
 *
 * Server components import from `@/data`; the validation below therefore runs
 * at build time (SSG) and in dev, catching a bad reference or an MRP below base
 * price. It is deliberately kept OUT of the client path: global chrome imports
 * `@/data/client` (tiny) and the search / dish overlays lazily import
 * `@/data/core` (zod-free), so no browser ever downloads zod.
 */
import { cities, restaurants, dishes } from "./core";

export * from "./core";

// Build-time / dev validation only — never on a production request's hot path,
// and never in a client bundle (no client module imports `@/data`).
if (
  process.env.NODE_ENV !== "production" ||
  process.env.NEXT_PHASE === "phase-production-build"
) {
  // Dynamic import so zod is dead-code-eliminated from production runtime.
  import("./schema")
    .then(({ validateAll }) => validateAll({ cities, restaurants, dishes }))
    .catch((e) => {
      console.error("[data] dataset validation failed:", e);
    });
}
