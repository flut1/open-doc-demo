const path = require("path");
const rollup = require("rollup");
const { initialize } = require("../common/output");
const loadMdxConfigFile = require("rollup/dist/loadConfigFile");

async function renderToDisk() {
  await initialize();

  const { options } = await loadMdxConfigFile(
    path.resolve(__dirname, "../config/rollup.config.js")
  );

  for (let i = 0; i < options.length; i++) {
    const optionSet = options[i];
    const bundle = await rollup.rollup(optionSet);
    await bundle.write(optionSet.output[0]);
  }
}

module.exports = renderToDisk;
