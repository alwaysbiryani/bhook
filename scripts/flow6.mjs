import { chromium } from "playwright";
const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 460, height: 900 }, deviceScaleFactor: 2 });

// a new-city menu
await page.goto("http://localhost:3000/kolkata/arsalan", { waitUntil: "load" });
await page.waitForTimeout(700);
await page.screenshot({ path: "/tmp/p6-menu.png", fullPage: true });
console.log("menu shot");

// city page with filters
await page.goto("http://localhost:3000/mumbai", { waitUntil: "load" });
await page.waitForTimeout(700);
await page.getByRole("button", { name: "Pure Veg" }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/p6-filters.png", fullPage: true });
console.log("filters shot");

// search overlay
await page.goto("http://localhost:3000/", { waitUntil: "load" });
await page.waitForTimeout(700);
await page.getByRole("button", { name: /Search/ }).first().click();
await page.waitForTimeout(500);
await page.locator('input[aria-label="Search"]').fill("biryani");
await page.waitForTimeout(700);
await page.screenshot({ path: "/tmp/p6-search.png", fullPage: true });
console.log("search shot");

await browser.close();
