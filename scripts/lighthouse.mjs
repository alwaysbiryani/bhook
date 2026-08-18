/**
 * Reproducible Lighthouse audit for Dabba Never Comes.
 *
 *   1. npm run build && npm run start   (production server on :3000)
 *   2. npm run audit                    (this script)
 *
 * Runs Lighthouse (mobile preset, simulated 4G + 4x CPU throttle) N times per
 * route against the running production server, takes the MEDIAN of each category
 * to cancel run-to-run variance, and prints a Requirement -> Result -> Pass/Fail
 * table plus the key Core Web Vitals. Writes JSON + HTML reports to ./lighthouse.
 *
 * Env: BASE (default http://localhost:3000), RUNS (default 3),
 *      CHROME_PATH (default /opt/pw-browsers/chromium).
 */
import { execFileSync } from "node:child_process";
import { readFileSync, mkdirSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:3000";
const RUNS = Number(process.env.RUNS || 3);
const CHROME_PATH = process.env.CHROME_PATH || "/opt/pw-browsers/chromium";
const THRESHOLD = 95;

const ROUTES = [
  ["Home", "/"],
  ["City list", "/hyderabad"],
  ["Restaurant menu", "/hyderabad/paradise"],
  ["Dish (SEO)", "/dish/moti-mahal-butter-chicken"],
  ["Cart", "/cart"],
];
const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];
const median = (xs) => xs.slice().sort((a, b) => a - b)[Math.floor(xs.length / 2)];

mkdirSync("lighthouse", { recursive: true });

function audit(url, out) {
  execFileSync(
    "npx",
    [
      "lighthouse",
      url,
      "--only-categories=" + CATEGORIES.join(","),
      "--chrome-flags=--headless=new --no-sandbox --disable-gpu --disable-dev-shm-usage",
      "--output=json",
      "--output=html",
      "--output-path=" + out,
      "--quiet",
    ],
    { stdio: "ignore", env: { ...process.env, CHROME_PATH } },
  );
  return JSON.parse(readFileSync(out + ".report.json", "utf8"));
}

const results = [];
for (const [label, path] of ROUTES) {
  const slug = label.toLowerCase().replace(/[^a-z]+/g, "-");
  const runs = { performance: [], accessibility: [], "best-practices": [], seo: [] };
  let lcp = "",
    cls = "",
    tbt = "";
  for (let i = 0; i < RUNS; i++) {
    const r = audit(BASE + path, `lighthouse/${slug}-${i}`);
    for (const c of CATEGORIES) runs[c].push(Math.round(r.categories[c].score * 100));
    lcp = r.audits["largest-contentful-paint"].displayValue;
    cls = r.audits["cumulative-layout-shift"].displayValue;
    tbt = r.audits["total-blocking-time"].displayValue;
  }
  results.push({
    label,
    path,
    scores: Object.fromEntries(CATEGORIES.map((c) => [c, median(runs[c])])),
    lcp,
    cls,
    tbt,
  });
}

// ---- report ----
const H = ["Route", "Perf", "A11y", "BestPr", "SEO", "LCP", "CLS", "TBT", "Verdict"];
const pad = (s, n) => String(s).padEnd(n);
console.log(`\nLighthouse — mobile preset, median of ${RUNS} runs · ${BASE}\n`);
console.log(H.map((h, i) => pad(h, [18, 5, 5, 7, 5, 7, 7, 7, 8][i])).join(" "));
console.log("-".repeat(74));
let allPass = true;
for (const r of results) {
  const s = r.scores;
  const pass = CATEGORIES.every((c) => s[c] >= THRESHOLD);
  allPass = allPass && pass;
  console.log(
    [
      pad(r.label, 18),
      pad(s.performance, 5),
      pad(s.accessibility, 5),
      pad(s["best-practices"], 7),
      pad(s.seo, 5),
      pad(r.lcp, 7),
      pad(r.cls, 7),
      pad(r.tbt, 7),
      pad(pass ? "PASS" : "FAIL", 8),
    ].join(" "),
  );
}
console.log("-".repeat(74));
console.log(`\nRequirement: every category >= ${THRESHOLD}.  Overall: ${allPass ? "PASS ✅" : "FAIL ❌"}\n`);
process.exit(allPass ? 0 : 1);
