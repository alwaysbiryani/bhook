import { chromium } from "playwright";

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 460, height: 900 }, deviceScaleFactor: 2 });

// full flow: build cart, checkout, pay
await page.goto("http://localhost:3000/hyderabad/paradise", { waitUntil: "load" });
await page.waitForTimeout(700);
for (let i = 0; i < 2; i++) {
  await page.getByRole("button", { name: "Add" }).nth(i).click();
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: /Add to thali/ }).click();
  await page.waitForTimeout(400);
}
await page.goto("http://localhost:3000/checkout", { waitUntil: "load" });
await page.waitForTimeout(600);
await page.getByRole("button", { name: /^Pay/ }).click();
await page.waitForTimeout(2600); // through pay sequence to reward
// go straight to track via the button
await page.getByRole("button", { name: /Track your rider/ }).click();
await page.waitForURL("**/track/**", { timeout: 5000 });
const trackUrl = page.url();
await page.waitForTimeout(9000); // let a couple of pings arrive + scooter move
await page.screenshot({ path: "/tmp/p5-track.png", fullPage: true });
console.log("track shot", trackUrl);

// fast-forward: rewind placedAt by 60s in localStorage, reload -> delivered
await page.evaluate(() => {
  const raw = localStorage.getItem("dnc-store-v1");
  if (!raw) return;
  const obj = JSON.parse(raw);
  const orders = obj.state.orders;
  if (orders && orders[0]) orders[0].placedAt = Date.now() - 60000;
  localStorage.setItem("dnc-store-v1", JSON.stringify(obj));
});
await page.goto(trackUrl, { waitUntil: "load" });
await page.waitForTimeout(1500);
await page.screenshot({ path: "/tmp/p5-delivered.png", fullPage: true });
console.log("delivered shot");

// orders page
await page.goto("http://localhost:3000/orders", { waitUntil: "load" });
await page.waitForTimeout(800);
await page.screenshot({ path: "/tmp/p5-orders.png", fullPage: true });
console.log("orders shot");

await browser.close();
