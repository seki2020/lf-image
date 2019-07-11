//Puppeteer unit test
const URL = "https://logical-fabric.firebaseapp.com/"
const LOCALURL = "http://localhost:5000/logical-fabric/us-central1"

const thisUrl = URL

const puppeteer = require("puppeteer")

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(thisUrl, { waitUntil: "networkidle2" })
  await page.pdf({ path: "./pdf/hn.pdf", format: "A4" })

  await browser.close()
})()
