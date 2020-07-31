const path = require("path");
const rollup = require("rollup");
const loadMdxConfigFile = require("rollup/dist/loadConfigFile");

const getRollupConfig = () =>
  loadMdxConfigFile(path.resolve(__dirname, "../config/rollup.config.js"));

const bundle = async () => {
  const { options } = await getRollupConfig();

  for (let i=0; i<options.length; i++) {
    const optionSet = options[i];
    const bundle = await rollup.rollup(optionSet);
    // const { output } = await bundle.generate(optionSet.output[0]);
    await bundle.write(optionSet.output[0]);
  }
};

module.exports = { getRollupConfig, bundle };
