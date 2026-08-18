import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 460, height: 900 }, deviceScaleFactor: 3 });
await p.goto("http://localhost:3000/", { waitUntil: "load" });
await p.waitForTimeout(600);
const el = await p.$("header");
await el.screenshot({ path: "/tmp/logo-header.png" });
console.log("header cropped");
await b.close();
