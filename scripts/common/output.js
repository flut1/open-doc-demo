const fs = require("fs-extra");
const path = require("path");
const { OUTPUT_ROOT } = require("./constants");

module.exports = {};

let initialized = false;
module.exports.initialize = () => {
  if (initialized) {
    return Promise.resolve();
  }
  initialized = true;
  return fs.ensureDir(OUTPUT_ROOT);
};

module.exports.outputFile = (subpath, content) =>
  fs.writeFile(path.join(OUTPUT_ROOT, subpath), content, { encoding: "utf8" });
