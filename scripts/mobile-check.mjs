/**
 * Mobile functional smoke test — drives the real app at a phone viewport to
 * confirm the lazy-catalogue refactor and the touch/scroll/sheet fixes work
 * end to end. Fails loudly (non-zero exit) on any console error or missing
 * expectation. Not a Lighthouse run — that's scripts/lighthouse.mjs.
 */
import { chromium, devices } from "playwright";

const BASE = process.env.BASE || "http://localhost:3000";
const iPhone = devices["iPhone 13"];
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const ctx = await browser.newContext({ ...iPhone });
const page = await ctx.newPage();

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));

const checks = [];
const ok = (name, cond) => {
  checks.push({ name, pass: !!cond });
  console.log(`${cond ? "✓" : "✗"} ${name}`);
};

// 1. Home loads
await page.goto(BASE + "/", { waitUntil: "load" });
await page.waitForTimeout(400);
ok("home: hero heading visible", await page.getByRole("heading", { name: /Order the feeling/i }).isVisible());

// header tap-target sizes (>=44px)
const searchBtn = page.getByRole("button", { name: "Search", exact: true });
const box = await searchBtn.boundingBox();
ok(`header search target >=44px (${box ? Math.round(box.height) : "?"}px)`, box && box.height >= 44 && box.width >= 44);

// 2. Search overlay opens + lazy catalogue resolves results
await searchBtn.click();
await page.getByPlaceholder(/Search dishes/i).fill("biryani");
await page.waitForFunction(() => {
  const t = document.body.innerText;
  return /Restaurants|Dishes/.test(t) && !/Searching…/.test(t);
}, { timeout: 8000 }).catch(() => {});
const searchDialog = page.getByRole("dialog");
const dishBtns = searchDialog.locator("button").filter({ hasText: /₹/ });
await dishBtns.first().waitFor({ state: "visible", timeout: 8000 });
ok("search: dish results rendered (lazy catalogue loaded)", (await dishBtns.count()) > 0);
await page.keyboard.press("Escape");
await page.waitForTimeout(300);

// 3. Menu "Add" opens the dish sheet (lazy catalogue path)
await page.goto(BASE + "/hyderabad/paradise", { waitUntil: "load" });
await page.getByRole("button", { name: "Add", exact: true }).first().click();
const sheet = page.getByRole("dialog");
await sheet.waitFor({ state: "visible", timeout: 8000 });
const addBtn = sheet.getByRole("button", { name: /Add to cart/i });
await addBtn.waitFor({ state: "visible", timeout: 8000 });
ok("dish sheet: opened with Add button", await addBtn.isVisible());

// 4. Add to cart -> floating cart appears
await page.waitForTimeout(500); // let the sheet spring settle
await addBtn.click({ force: true });
await page.waitForTimeout(700);
const floating = page.getByRole("link", { name: /in your cart/i });
ok("floating cart appears after add", await floating.isVisible().catch(() => false));

// 5. Cart page hydrates the item via lazy catalogue
await page.goto(BASE + "/cart", { waitUntil: "load" });
await page.waitForTimeout(600);
const proceed = page.getByRole("button", { name: /Proceed to pay/i });
ok("cart: item present, proceed button visible", await proceed.isVisible().catch(() => false));
ok("cart: restaurant name resolved (not blank)", /Your order from/i.test(await page.locator("body").innerText()));

// cart stepper target size
const inc = page.getByRole("button", { name: "Increase quantity" }).first();
const incBox = await inc.boundingBox();
ok(`cart stepper target >=44px (${incBox ? Math.round(incBox.height) : "?"}px)`, incBox && incBox.height >= 44);

// 6. No horizontal page overflow at phone width
await page.goto(BASE + "/hyderabad", { waitUntil: "load" });
await page.waitForTimeout(400);
const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
ok(`city list: no horizontal overflow (${overflow}px)`, overflow <= 1);

// 7. Theme toggle works
await page.goto(BASE + "/", { waitUntil: "load" });
await page.getByRole("button", { name: /Switch to (light|dark) mode/i }).click();
await page.waitForTimeout(200);
const theme = await page.evaluate(() => document.documentElement.getAttribute("data-theme"));
ok(`theme toggle sets data-theme (${theme})`, theme === "light" || theme === "dark");

ok("no console/page errors", errors.length === 0);
if (errors.length) console.log("  errors:", errors.slice(0, 5));

await page.screenshot({ path: "/tmp/claude-0/-home-user-dabbanevercomes/7596160e-1782-5c73-8789-faaff9a220a3/scratchpad/mobile-home.png" });
await browser.close();

const failed = checks.filter((c) => !c.pass);
console.log(`\n${checks.length - failed.length}/${checks.length} checks passed`);
process.exit(failed.length ? 1 : 0);
