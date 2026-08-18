/**
 * Capture README showcase screenshots (hero + gallery) against a running
 * production server. Usage: BASE=http://localhost:3200 node scripts/readme-shots.mjs
 * Writes PNGs to docs/screens/.
 */
import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE || "http://localhost:3200";
const OUT = "docs/screens";
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const VP = { width: 440, height: 900 };

async function ctx(theme) {
  const c = await browser.newContext({ viewport: VP, deviceScaleFactor: 2 });
  await c.addInitScript((t) => localStorage.setItem("dnc-theme", t), theme);
  // silence sound so nothing autoplays during the flow
  await c.addInitScript(() => {
    try {
      const s = JSON.parse(localStorage.getItem("dnc-store-v1") || "{}");
      s.state = { ...(s.state || {}), soundOn: false };
      s.version = s.version ?? 0;
      localStorage.setItem("dnc-store-v1", JSON.stringify(s));
    } catch {}
  });
  return c;
}

// ---- 1. HERO: home, dark ----
{
  const c = await ctx("dark");
  const p = await c.newPage();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${OUT}/hero.png` });
  console.log("hero ok");
  await c.close();
}

// ---- 2. LIGHT: home, light ----
{
  const c = await ctx("light");
  const p = await c.newPage();
  await p.goto(BASE + "/", { waitUntil: "networkidle" });
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${OUT}/light.png` });
  console.log("light ok");
  await c.close();
}

// ---- 3 + 4. REWARD (scratch) and TRACK, dark, one flow ----
{
  const c = await ctx("dark");
  const p = await c.newPage();
  await p.goto(BASE + "/hyderabad/paradise", { waitUntil: "networkidle" });
  await p.waitForTimeout(700);
  // open first dish sheet and add
  await p.getByRole("button", { name: /^Add$/i }).first().click();
  await p.waitForTimeout(500);
  await p.getByRole("button", { name: /Add to (cart|thali)/i }).click();
  await p.waitForTimeout(500);
  // checkout -> pay
  await p.goto(BASE + "/checkout", { waitUntil: "networkidle" });
  await p.waitForTimeout(600);
  await p.getByRole("button", { name: /^Pay/ }).click();
  await p.waitForTimeout(2800); // pay sequence
  // now on reward screen — reveal the scratch card (fires confetti)
  await p.getByRole("button", { name: /^reveal$/i }).click();
  await p.waitForTimeout(1300); // let confetti settle over the revealed card
  await p.screenshot({ path: `${OUT}/reward.png` });
  console.log("reward ok");

  // grab the placed orderId from persisted store, go to track
  const orderId = await p.evaluate(() => {
    try {
      const s = JSON.parse(localStorage.getItem("dnc-store-v1") || "{}");
      const os = s.state?.orders || [];
      return os.length ? os[os.length - 1].id : null;
    } catch {
      return null;
    }
  });
  if (orderId) {
    await p.goto(`${BASE}/track/${orderId}`, { waitUntil: "networkidle" });
    await p.waitForTimeout(2600); // let the scooter/ETA settle into motion
    await p.screenshot({ path: `${OUT}/track.png` });
    console.log("track ok", orderId);
  } else {
    console.log("!! no orderId found, track skipped");
  }
  await c.close();
}

await browser.close();
console.log("done");
