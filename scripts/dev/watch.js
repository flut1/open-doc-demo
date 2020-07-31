const rollup = require("rollup");
const { initialize, writeFile } = require("../common/output");
const { renderIndexHtml } = require("../render/renderHtml");
const { getMdxConfig } = require("../render/bundleMdx");

async function watch() {
  await initialize();
  await writeFile(await renderIndexHtml());
  const { options } = await getMdxConfig();

  const watcher = rollup.watch(options);
  let bundling = Promise.resolve();

  watcher.on("event", (event) => {
    if (event.code === "END") {
      bundling.then(() => {
        bundling = executeMdxBundles({ lastCommit, styles, template });
      });
    }
    if (event.code === "ERROR") {
      console.error("Error during compilation:");
      console.error(event.error.message);
    }
  });

  return watcher;
}

module.exports = watch;
