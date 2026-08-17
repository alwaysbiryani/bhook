import { chromium } from "playwright";

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const page = await browser.newPage({ viewport: { width: 460, height: 900 }, deviceScaleFactor: 2 });

await page.goto("http://localhost:3000/hyderabad/paradise", { waitUntil: "load" });
await page.waitForTimeout(800);

// open dish sheet
await page.getByRole("button", { name: "Add" }).first().click();
await page.waitForTimeout(900);
await page.screenshot({ path: "/tmp/p2-sheet.png", fullPage: true });
console.log("sheet shot");

// add to thali
await page.getByRole("button", { name: /Add to thali/ }).click();
await page.waitForTimeout(900);

// add a second dish for a fuller thali
await page.getByRole("button", { name: "Add" }).nth(1).click();
await page.waitForTimeout(700);
await page.getByRole("button", { name: /Add to thali/ }).click();
await page.waitForTimeout(700);
await page.getByRole("button", { name: "Add" }).nth(2).click();
await page.waitForTimeout(600);
await page.getByRole("button", { name: /Add to thali/ }).click();
await page.waitForTimeout(900);
await page.screenshot({ path: "/tmp/p2-floating.png", fullPage: false });
console.log("floating shot");

// go to cart
await page.goto("http://localhost:3000/cart", { waitUntil: "load" });
await page.waitForTimeout(900);
await page.screenshot({ path: "/tmp/p2-cart.png", fullPage: true });
console.log("cart shot");

await browser.close();
