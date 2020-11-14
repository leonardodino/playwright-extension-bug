const { join } = require('path')
const { chromium } = require('playwright')

const dataDir = join(__dirname, 'user-data')
const extension = join(__dirname, 'extension')
const launchOptions = {
  headless: false,
  args: [
    `--disable-extensions-except=${extension}`,
    `--load-extension=${extension}`,
  ],
}

const test = async (page) => {
  await page.goto('https://example.org/', { waitUntil: 'networkidle' })

  // this validates the extension is indeed running on the page
  console.log('DOM insertion:', !!(await page.$('#a-very-nice-clock')))

  // this verifies that message passing is working as expected
  const promise = page.waitForSelector('#a-very-nice-clock >> text=/^\\d+:/')
  console.log('clock updated:', !!(await promise.catch(() => {})))
}

const runInNewPage = async (browser, task) => {
  const page = await browser.newPage()
  page.setDefaultTimeout(1000)
  await task(page)
  await page.close()
}

const runPersistentTest = async () => {
  const browser = await chromium.launchPersistentContext(dataDir, launchOptions)
  await runInNewPage(browser, test)
  await browser.close()
}

const enableExtensionInInconito = async (page) => {
  await page.goto('chrome://extensions')
  await page.click('extensions-item >> #detailsButton')
  await page.click('#allow-incognito')
}

const runInconitoTest = async () => {
  const browser = await chromium.launch(launchOptions)
  await runInNewPage(browser, enableExtensionInInconito)
  await runInNewPage(browser, test)
  await browser.close()
}

!(async () => {
  for (const [name, runTest] of [
    ['persistent', runPersistentTest],
    ['inconigto', runInconitoTest],
  ]) {
    console.log(`==== ${name} ====`)
    await runTest()
  }
})()
