import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "scripts/**",
  ]),
  {
    rules: {
      // Deliberate, idiomatic uses: SSR hydration mount-guards, resetting local
      // form state when a sheet's target changes, and DOM-measured layout
      // (getPointAtLength) that must run in an effect. Keep as signal, not error.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
]);

export default eslintConfig;
