const path = require("path");
const rollup = require("rollup");
const loadMdxConfigFile = require("rollup/dist/loadConfigFile");
// const { initialize, writeFile } = require("../common/output");
// const { renderIndexHtml } = require("../render/renderHtml");
// const { getMdxConfig } = require("../render/bundleMdx");

async function watch() {
  const { options } = await loadMdxConfigFile(
    path.resolve(__dirname, "../config/rollup.config.js")
  );

  const watcher = rollup.watch(options);

  watcher.on("event", (event) => {
    if (event.code === "END") {
      console.log("Compilation complete");
    }
    if (event.code === "ERROR") {
      console.error("Error during compilation:");
      console.error(event.error.message);
    }
  });

  return watcher;
}

module.exports = watch;
