require("core-js/es");

const puppeteer = require("puppeteer-core");
const path = require("path");
const { OUTPUT_ROOT } = require("./common/constants");
const { languages } = require("../document.config");
const getMetadata = require("./common/getMetadata");

(async () => {
  console.log("Launching headless browser...");
  const browser = await puppeteer.launch({
    product: "chrome",
  });
  const page = await browser.newPage();

  for (const languageKey of Object.keys(languages)) {
    console.log(`Opening output for language "${languageKey}"`);
    const metadata = await getMetadata(languageKey);

    await page.goto(
      `file://${path.resolve(OUTPUT_ROOT, metadata.webOutputFile)}`
    );

    const pdfPath = path.resolve(OUTPUT_ROOT, metadata.printOutputFile);
    console.log(`Printing pdf to: ${pdfPath}`);
    await page.pdf({
      path: pdfPath,
      printBackground: true,
      format: "a4",
      preferCSSPageSize: true,
    });
  }

  await browser.close();
})();
