import puppeteer from "puppeteer-core"
import path from "node:path"

const out = path.resolve("scripts/shots")
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--window-size=1440,900"],
})
const page = await browser.newPage()
page.on("pageerror", (e) => console.log("pageerror", e.message))
await page.setViewport({ width: 1440, height: 900 })
await page.goto("http://localhost:5173/", { waitUntil: "networkidle0", timeout: 30000 })
await page.waitForSelector("h1")
await new Promise((r) => setTimeout(r, 2200))
await page.screenshot({ path: path.join(out, "01-desktop-hero.png") })

async function shot(id, file) {
  await page.evaluate((sid) => {
    document.getElementById(sid)?.scrollIntoView({ behavior: "instant", block: "start" })
  }, id)
  await new Promise((r) => setTimeout(r, 700))
  await page.screenshot({ path: path.join(out, file) })
}

await shot("practice", "04-practice.png")
await shot("instruments", "05-instruments.png")
await shot("tenure", "06-tenure.png")
await shot("school", "07-school.png")
await shot("plates", "08-plates.png")
await page.evaluate(() => window.scrollBy(0, 780))
await new Promise((r) => setTimeout(r, 400))
await page.screenshot({ path: path.join(out, "08b-plates-grid.png") })
await shot("post", "09-contact.png")
await page.evaluate(() => document.querySelector("#plates h3")?.closest("button")?.click())
await new Promise((r) => setTimeout(r, 600))
await page.screenshot({ path: path.join(out, "10-project-modal.png") })
await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Close")?.click())

await page.setViewport({ width: 390, height: 844 })
await page.goto("http://localhost:5173/", { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 2000))
await page.screenshot({ path: path.join(out, "11-mobile-hero.png") })
await page.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Map")?.click())
await new Promise((r) => setTimeout(r, 400))
await page.screenshot({ path: path.join(out, "12-mobile-menu.png") })
await page.evaluate(() => [...document.querySelectorAll("a")].filter((a) => a.textContent.includes("Missions")).at(-1)?.click())
await new Promise((r) => setTimeout(r, 900))
await page.screenshot({ path: path.join(out, "13-mobile-plates.png") })
console.log("ok")
await browser.close()
