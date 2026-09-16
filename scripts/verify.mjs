import fs from "node:fs"
import path from "node:path"
import puppeteer from "puppeteer-core"

const out = path.resolve("scripts/shots")
fs.mkdirSync(out, { recursive: true })

function setReactInput(el, value) {
  const proto = el.type === "textarea" ? window.HTMLTextAreaElement.prototype : window.HTMLInputElement.prototype
  const desc = Object.getOwnPropertyDescriptor(proto, "value")
  desc.set.call(el, value)
  el.dispatchEvent(new Event("input", { bubbles: true }))
}

const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--window-size=1440,900"],
})

const issues = []
const page = await browser.newPage()
page.on("pageerror", (err) => issues.push(`pageerror: ${err.message}`))
page.on("console", (msg) => {
  if (msg.type() === "error") issues.push(`console: ${msg.text()}`)
})

await page.setViewport({ width: 1440, height: 900 })
await page.goto("http://localhost:5173/", { waitUntil: "networkidle0", timeout: 30000 })
await page.waitForSelector("h1", { timeout: 10000 })
await new Promise((r) => setTimeout(r, 3200))

const heroText = await page.evaluate(() => document.querySelector("h1")?.innerText.replace(/\s+/g, ""))
if (!heroText?.includes("Abhishek") || !heroText?.includes("Chauhan")) {
  issues.push(`hero name missing: ${heroText}`)
}
await page.screenshot({ path: path.join(out, "01-desktop-hero.png") })

await page.evaluate(() => {
  [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Connect GitHub"))?.click()
})
await page.waitForSelector("#github-username", { timeout: 5000 })
await page.screenshot({ path: path.join(out, "02-atelier-github.png") })

await page.evaluate((val) => {
  const el = document.querySelector("#github-username")
  const desc = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, "value")
  desc.set.call(el, val)
  el.dispatchEvent(new Event("input", { bubbles: true }))
}, "vercel")

await page.evaluate(() => {
  [...document.querySelectorAll("button")].find((b) => /Fetch repositories/i.test(b.textContent))?.click()
})
try {
  await page.waitForFunction(() => document.body.innerText.includes("Import as plates") || document.body.innerText.includes("GitHub"), { timeout: 8000 })
} catch { /* continue */ }
await new Promise((r) => setTimeout(r, 1500))
await page.screenshot({ path: path.join(out, "03-atelier-fetched.png") })
const fetched = await page.evaluate(() => document.body.textContent.includes("Import as plates"))
if (!fetched) {
  const err = await page.evaluate(() => document.querySelector("aside p.text-oxide")?.textContent || "")
  issues.push(`github fetch failed: ${err || "no import list"}`)
} else {
  await page.evaluate(() => {
    [...document.querySelectorAll("button")].find((b) => /Import as plates/i.test(b.textContent))?.click()
  })
  await new Promise((r) => setTimeout(r, 600))
  await page.screenshot({ path: path.join(out, "03b-plates-imported.png") })
}

await page.evaluate(() => {
  [...document.querySelectorAll("aside button")].find((b) => b.textContent.trim() === "Close")?.click()
})
await new Promise((r) => setTimeout(r, 500))

async function shotSection(id, file) {
  await page.evaluate((sid) => {
    document.getElementById(sid)?.scrollIntoView({ behavior: "instant", block: "start" })
  }, id)
  await new Promise((r) => setTimeout(r, 800))
  await page.screenshot({ path: path.join(out, file) })
}

await shotSection("practice", "04-practice.png")
await shotSection("instruments", "05-instruments.png")
await shotSection("tenure", "06-tenure.png")
await shotSection("school", "07-school.png")
await shotSection("plates", "08-plates.png")
await shotSection("post", "09-contact.png")

const schoolBlank = await page.evaluate(() =>
  document.getElementById("school")?.innerText.includes("ledger is still blank"),
)
if (!schoolBlank) issues.push("education empty state missing")

const practiceCopy = await page.evaluate(() => document.getElementById("practice")?.innerText || "")
if (!practiceCopy.includes("quiet kind")) issues.push("practice section copy missing")

const tenureCopy = await page.evaluate(() => document.getElementById("tenure")?.innerText || "")
if (!tenureCopy.includes("Tata Consultancy")) issues.push("TCS experience missing")

await page.evaluate((sid) => {
  document.getElementById(sid)?.scrollIntoView({ behavior: "instant", block: "start" })
}, "plates")
await new Promise((r) => setTimeout(r, 500))
await page.evaluate(() => {
  document.querySelector("#plates h3")?.closest("button")?.click()
})
await new Promise((r) => setTimeout(r, 700))
await page.screenshot({ path: path.join(out, "10-project-modal.png") })
const modal = await page.evaluate(() => document.body.innerText.includes("Enterprise tool surfaces"))
if (!modal) issues.push("project modal did not open")
await page.evaluate(() => {
  [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Close")?.click()
})

await page.setViewport({ width: 390, height: 844 })
await page.goto("http://localhost:5173/", { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 3200))
await page.screenshot({ path: path.join(out, "11-mobile-hero.png") })
await page.evaluate(() => {
  [...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Index")?.click()
})
await new Promise((r) => setTimeout(r, 700))
await page.screenshot({ path: path.join(out, "12-mobile-index.png") })
await page.evaluate(() => document.querySelector('a[href="#plates"]')?.click())
await new Promise((r) => setTimeout(r, 1200))
await page.screenshot({ path: path.join(out, "13-mobile-plates.png") })
await page.evaluate((sid) => {
  document.getElementById(sid)?.scrollIntoView({ behavior: "instant", block: "start" })
}, "post")
await new Promise((r) => setTimeout(r, 700))
await page.screenshot({ path: path.join(out, "14-mobile-contact.png") })

const mail = await page.evaluate(() => document.body.innerText.includes("abhicsng007@gmail.com"))
if (!mail) issues.push("email missing on mobile contact")

await browser.close()
fs.writeFileSync(path.join(out, "issues.json"), JSON.stringify(issues, null, 2))
console.log(JSON.stringify({ issues, shots: fs.readdirSync(out) }, null, 2))
if (issues.length) process.exitCode = 1
