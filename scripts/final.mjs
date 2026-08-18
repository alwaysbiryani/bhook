import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 460, height: 900 }, deviceScaleFactor: 2 });
await p.goto("http://localhost:3000/", { waitUntil: "load" });
await p.waitForTimeout(700);
// open city picker to show 14 cities
await p.getByRole("button", { name: /Change city/ }).click();
await p.waitForTimeout(600);
await p.screenshot({ path: "/tmp/final-cities.png", fullPage: false });
console.log("cities shot");
await b.close();
