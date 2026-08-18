import { chromium } from "playwright";
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" });
const p = await b.newPage({ viewport: { width: 460, height: 1000 }, deviceScaleFactor: 2 });
await p.goto(process.argv[2], { waitUntil: "load" });
await p.waitForTimeout(700);
await p.screenshot({ path: process.argv[3], fullPage: false });
await b.close();
