const path = require('path');

let configIter = 0;
let lastConfigIter = 0;

const invalidateConfig = () => {
  configIter++;
};

const getConfig = () => {
  if (lastConfigIter !== configIter) {
    console.log('ITER');
    const modulePath = require.resolve("../../document.config");
    console.log(modulePath);
    if (require.cache[modulePath]) {
      console.log('DEL CACHE');
      delete require.cache[modulePath];
    }
  }
  lastConfigIter = configIter;

  return require("../../document.config");
};

module.exports = { getConfig, invalidateConfig };
