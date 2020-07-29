const puppeteer = require("puppeteer");
const path = require("path");
const languages = require('../languages');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  for (const language of languages) {
      await page.goto(`file://${path.resolve(__dirname, `../docs/${language}.html`)}`);
      await page.pdf({
          path: path.resolve(__dirname, `../docs/print.${language}.pdf`),
          printBackground: true,
          format: 'a4',
          preferCSSPageSize: true
      });
  }

  await browser.close();
})();
