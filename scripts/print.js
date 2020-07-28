const puppeteer = require("puppeteer");
const path = require("path");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`file://${path.resolve(__dirname, "../docs/index.html")}`);
  await page.pdf({
      path: path.resolve(__dirname, "../docs/print.pdf"),
      printBackground: true,
      format: 'a4',
      preferCSSPageSize: true
  });

  await browser.close();
})();
