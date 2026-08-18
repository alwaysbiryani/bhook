import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 460, height: 900 }, deviceScaleFactor: 2 });
await p.goto("http://localhost:3000/hyderabad/paradise", { waitUntil: "load" });
await p.waitForTimeout(700);
for (let i = 0; i < 3; i++) {
  await p.getByRole("button", { name: "Add" }).nth(i).click();
  await p.waitForTimeout(400);
  await p.getByRole("button", { name: /Add to cart/ }).click();
  await p.waitForTimeout(400);
}
await p.screenshot({ path: "/tmp/cart-floating.png", fullPage: false });
console.log("floating");
await p.goto("http://localhost:3000/cart", { waitUntil: "load" });
await p.waitForTimeout(700);
await p.screenshot({ path: "/tmp/cart-page.png", fullPage: true });
console.log("cart");
await b.close();
