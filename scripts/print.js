const puppeteer = require("puppeteer");
const path = require("path");
const languages = require("../languages");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const { htmlOutputFile, printOutputFile } of languages) {
    await page.goto(
      `file://${path.resolve(__dirname, `../docs/${htmlOutputFile}`)}`
    );
    await page.pdf({
      path: path.resolve(__dirname, `../docs/${printOutputFile}`),
      printBackground: true,
      format: "a4",
      preferCSSPageSize: true,
    });
  }

  await browser.close();
})();
