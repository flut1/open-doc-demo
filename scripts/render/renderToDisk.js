const { initialize, outputFile } = require("../common/output");
const { renderIndexHtml } = require("../render/renderHtml");
const { bundle } = require("./bundleMdx");

async function renderToDisk() {
  await initialize();
  await outputFile('index.html', await renderIndexHtml());
  await bundle();
}

module.exports = renderToDisk;
