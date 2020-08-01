let configIter = 0;
let lastConfigIter = 0;

const invalidateConfig = () => {
  configIter++;
};

const getConfig = () => {
  if (lastConfigIter !== configIter) {
    const modulePath = require.resolve("../../document.config");
    if (require.cache[modulePath]) {
      delete require.cache[modulePath];
    }
  }
  lastConfigIter = configIter;

  return require("../../document.config");
};

module.exports = { getConfig, invalidateConfig };
