import puppeteer from "puppeteer-core"
import path from "node:path"

const out = path.resolve("scripts/shots")
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--window-size=1440,900"],
})
const page = await browser.newPage()
await page.setViewport({ width: 1440, height: 900 })
await page.goto("http://localhost:5173/", { waitUntil: "networkidle0", timeout: 30000 })
await page.waitForSelector("h1")
await new Promise((r) => setTimeout(r, 1800))
await page.evaluate((sid) => {
  document.getElementById(sid)?.scrollIntoView({ behavior: "instant", block: "start" })
}, "plates")
await new Promise((r) => setTimeout(r, 900))
await page.screenshot({ path: path.join(out, "08-plates.png") })
const lead = await page.$("#plates article")
if (lead) await lead.screenshot({ path: path.join(out, "08-lead-card.png") })
await page.evaluate(() => window.scrollBy(0, 820))
await new Promise((r) => setTimeout(r, 500))
await page.screenshot({ path: path.join(out, "08b-plates-grid.png") })
await page.evaluate(() => window.scrollBy(0, 720))
await new Promise((r) => setTimeout(r, 500))
await page.screenshot({ path: path.join(out, "08c-plates-more.png") })
await page.setViewport({ width: 390, height: 844 })
await page.goto("http://localhost:5173/", { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 1600))
await page.evaluate((sid) => {
  document.getElementById(sid)?.scrollIntoView({ behavior: "instant", block: "start" })
}, "plates")
await new Promise((r) => setTimeout(r, 800))
await page.screenshot({ path: path.join(out, "13-mobile-plates.png") })
await page.evaluate(() => window.scrollBy(0, 560))
await new Promise((r) => setTimeout(r, 400))
await page.screenshot({ path: path.join(out, "13b-mobile-plates.png") })
await browser.close()
console.log("ok")
