import { chromium } from "playwright";

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 460, height: 900 }, deviceScaleFactor: 2 });

await page.goto("http://localhost:3000/hyderabad/paradise", { waitUntil: "load" });
await page.waitForTimeout(700);
for (let i = 0; i < 3; i++) {
  await page.getByRole("button", { name: "Add" }).nth(i).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: /Add to thali/ }).click();
  await page.waitForTimeout(500);
}

await page.goto("http://localhost:3000/cart", { waitUntil: "load" });
await page.waitForTimeout(700);

// open coupon drawer
await page.getByRole("button", { name: /Apply coupons/ }).click();
await page.waitForTimeout(700);
await page.screenshot({ path: "/tmp/p3-drawer.png", fullPage: true });
console.log("drawer shot");

// apply three coupons — after each apply, its button becomes "Remove",
// so the next row-level Apply shifts into index 1 (index 0 is the manual submit).
for (let i = 0; i < 3; i++) {
  await page.getByRole("button", { name: /^Apply$/ }).nth(1).click();
  await page.waitForTimeout(500);
}
// also add the free-delivery freebie
await page.getByRole("button", { name: /^Add$/ }).first().click().catch(() => {});
await page.waitForTimeout(500);
await page.screenshot({ path: "/tmp/p3-applied.png", fullPage: true });
console.log("applied shot");

// close drawer, view cart bill
await page.getByRole("button", { name: /Done/ }).click();
await page.waitForTimeout(700);
await page.screenshot({ path: "/tmp/p3-cart.png", fullPage: true });
console.log("cart shot");

await browser.close();
