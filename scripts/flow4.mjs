import { chromium } from "playwright";

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 460, height: 900 }, deviceScaleFactor: 2 });

// build a cart
await page.goto("http://localhost:3000/hyderabad/paradise", { waitUntil: "load" });
await page.waitForTimeout(700);
for (let i = 0; i < 2; i++) {
  await page.getByRole("button", { name: "Add" }).nth(i).click();
  await page.waitForTimeout(450);
  await page.getByRole("button", { name: /Add to thali/ }).click();
  await page.waitForTimeout(450);
}

// cart -> coupons
await page.goto("http://localhost:3000/cart", { waitUntil: "load" });
await page.waitForTimeout(600);
await page.getByRole("button", { name: /Apply coupons/ }).click();
await page.waitForTimeout(500);
for (let i = 0; i < 2; i++) {
  await page.getByRole("button", { name: /^Apply$/ }).nth(1).click();
  await page.waitForTimeout(400);
}
await page.getByRole("button", { name: /Done/ }).click();
await page.waitForTimeout(500);

// checkout
await page.getByRole("button", { name: /Proceed to pay/ }).click();
await page.waitForURL("**/checkout", { timeout: 5000 });
await page.waitForTimeout(700);
await page.screenshot({ path: "/tmp/p4-checkout.png", fullPage: true });
console.log("checkout shot");

// pay
await page.getByRole("button", { name: /^Pay/ }).click();
await page.waitForTimeout(1200); // mid-sequence (tick)
await page.screenshot({ path: "/tmp/p4-paid.png", fullPage: false });
console.log("paid shot");

// wait for reward
await page.waitForTimeout(1600);
await page.screenshot({ path: "/tmp/p4-reward.png", fullPage: true });
console.log("reward shot (unscratched)");

// scratch: drag across the card
const card = page.locator("canvas").first();
const box = await card.boundingBox();
if (box) {
  for (let r = 0; r < 6; r++) {
    const y = box.y + 10 + r * (box.height - 20) / 6;
    await page.mouse.move(box.x + 8, y);
    await page.mouse.down();
    for (let x = 8; x < box.width - 8; x += 14) {
      await page.mouse.move(box.x + x, y + Math.sin(x / 20) * 6);
    }
    await page.mouse.up();
  }
}
await page.waitForTimeout(900);
await page.screenshot({ path: "/tmp/p4-scratched.png", fullPage: true });
console.log("scratched shot");

await browser.close();
