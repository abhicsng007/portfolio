import fs from "node:fs"
import path from "node:path"
import puppeteer from "puppeteer-core"

const out = path.resolve("scripts/shots")
fs.mkdirSync(out, { recursive: true })

const issues = []
const browser = await puppeteer.launch({
  executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  headless: true,
  args: ["--no-sandbox", "--window-size=1440,900"],
})

const page = await browser.newPage()
page.on("pageerror", (err) => issues.push(`pageerror: ${err.message}`))
page.on("console", (msg) => {
  if (msg.type() === "error") issues.push(`console: ${msg.text()}`)
})

await page.setViewport({ width: 1440, height: 900 })
await page.goto("http://localhost:5173/", { waitUntil: "networkidle0", timeout: 30000 })
await page.waitForSelector("h1", { timeout: 10000 })
await new Promise((r) => setTimeout(r, 1800))

const heroText = await page.evaluate(() => document.querySelector("h1")?.innerText.replace(/\s+/g, " "))
if (!heroText?.includes("Abhishek") || !heroText?.includes("Chauhan")) {
  issues.push(`hero name missing: ${heroText}`)
}
await page.screenshot({ path: path.join(out, "01-desktop-hero.png") })

async function shotSection(id, file) {
  await page.evaluate((sid) => {
    document.getElementById(sid)?.scrollIntoView({ behavior: "instant", block: "start" })
  }, id)
  await new Promise((r) => setTimeout(r, 700))
  await page.screenshot({ path: path.join(out, file) })
}

await shotSection("practice", "04-practice.png")
await shotSection("instruments", "05-instruments.png")
await shotSection("tenure", "06-tenure.png")
await shotSection("school", "07-school.png")
await shotSection("feats", "07b-feats.png")
await shotSection("plates", "08-plates.png")
await shotSection("post", "09-contact.png")

const about = await page.evaluate(() => document.getElementById("practice")?.innerText || "")
if (!about.includes("Tata Consultancy")) issues.push("about copy missing TCS")

const tenure = await page.evaluate(() => document.getElementById("tenure")?.innerText || "")
if (!tenure.includes("Tata Consultancy")) issues.push("TCS experience missing")

const school = await page.evaluate(() => document.getElementById("school")?.innerText || "")
if (!school.includes("Netaji Subhas")) issues.push("education missing")
if (!school.includes("Future AWS Agent Engineer")) issues.push("nanodegree missing from education")

const feats = await page.evaluate(() => document.getElementById("feats")?.innerText || "")
if (!feats.includes("top 4,500") && !feats.includes("top 4500")) issues.push("scholarship achievement missing")
const certLink = await page.evaluate(() =>
  [...document.querySelectorAll("a")].some((a) => (a.href || "").includes("udacity.com/certificate")),
)
if (!certLink) issues.push("certificate link missing")

const plates = await page.evaluate(() => document.getElementById("plates")?.innerText || "")
for (const name of ["SafeJourney", "AIWEX", "xStoreAgent", "LetsSingAI", "AssetsCurator"]) {
  if (!plates.includes(name)) issues.push(`${name} project missing`)
}

const skills = await page.evaluate(() => document.getElementById("instruments")?.innerText || "")
if (!skills.includes("Amazon Bedrock")) issues.push("Amazon Bedrock skill missing")
if (!skills.includes("Agentic AI")) issues.push("Agentic AI skill group missing")

const contact = await page.evaluate(() => document.getElementById("post")?.innerText || "")
if (!contact.includes("abhicsng007@gmail.com")) issues.push("email missing")

await page.evaluate((sid) => {
  document.getElementById(sid)?.scrollIntoView({ behavior: "instant", block: "start" })
}, "plates")
await new Promise((r) => setTimeout(r, 400))
await page.evaluate(() => {
  document.querySelector("#plates h3")?.closest("button")?.click()
})
await new Promise((r) => setTimeout(r, 600))
await page.screenshot({ path: path.join(out, "10-project-modal.png") })
const modal = await page.evaluate(() => document.body.innerText.includes("SafeJourney"))
if (!modal) issues.push("project modal did not open")
await page.evaluate(() => {
  ;[...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Close")?.click()
})

await page.evaluate((sid) => {
  document.getElementById(sid)?.scrollIntoView({ behavior: "instant", block: "start" })
}, "post")
await page.type("input", "Hiring manager")
await page.type("textarea", "We have a frontend role.")
await page.screenshot({ path: path.join(out, "09b-contact-filled.png") })

await page.evaluate(() => {
  ;[...document.querySelectorAll("button")].find((b) => /Copy email/i.test(b.textContent))?.click()
})
await new Promise((r) => setTimeout(r, 300))

await page.evaluate(() => {
  ;[...document.querySelectorAll("a")].find((a) => a.textContent.trim() === "About")?.click()
})
await new Promise((r) => setTimeout(r, 900))
await page.screenshot({ path: path.join(out, "04b-nav-about.png") })

await page.setViewport({ width: 390, height: 844 })
await page.goto("http://localhost:5173/", { waitUntil: "networkidle0" })
await new Promise((r) => setTimeout(r, 1800))
await page.screenshot({ path: path.join(out, "11-mobile-hero.png") })

await page.evaluate(() => {
  ;[...document.querySelectorAll("button")].find((b) => b.textContent.trim() === "Menu")?.click()
})
await new Promise((r) => setTimeout(r, 500))
await page.screenshot({ path: path.join(out, "12-mobile-menu.png") })

await page.evaluate(() => {
  const links = [...document.querySelectorAll("a")].filter((a) => a.textContent.trim() === "Work")
  links.at(-1)?.click()
})
await new Promise((r) => setTimeout(r, 1000))
await page.screenshot({ path: path.join(out, "13-mobile-plates.png") })

await page.evaluate((sid) => {
  document.getElementById(sid)?.scrollIntoView({ behavior: "instant", block: "start" })
}, "post")
await new Promise((r) => setTimeout(r, 500))
await page.screenshot({ path: path.join(out, "14-mobile-contact.png") })

await page.evaluate((sid) => {
  document.getElementById(sid)?.scrollIntoView({ behavior: "instant", block: "start" })
}, "practice")
await new Promise((r) => setTimeout(r, 500))
await page.screenshot({ path: path.join(out, "15-mobile-about.png") })

await page.evaluate((sid) => {
  document.getElementById(sid)?.scrollIntoView({ behavior: "instant", block: "start" })
}, "instruments")
await new Promise((r) => setTimeout(r, 500))
await page.screenshot({ path: path.join(out, "16-mobile-skills.png") })

const mail = await page.evaluate(() => document.body.innerText.includes("abhicsng007@gmail.com"))
if (!mail) issues.push("email missing on mobile contact")

const publicChrome = await page.evaluate(() => document.body.innerText)
if (/\bConsole\b/.test(publicChrome) && publicChrome.includes("Get in touch")) {
  // console may still exist in the closed atelier? shouldn't be visible
}
const consoleVisible = await page.evaluate(() =>
  [...document.querySelectorAll("button, a")].some((el) => el.textContent.trim() === "Console" && el.offsetParent !== null),
)
if (consoleVisible) issues.push("public Console button still visible")

await browser.close()
fs.writeFileSync(path.join(out, "issues.json"), JSON.stringify(issues, null, 2))
console.log(JSON.stringify({ issues, shots: fs.readdirSync(out) }, null, 2))
if (issues.length) process.exitCode = 1
