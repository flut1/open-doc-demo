const path = require("path");
const EventEmitter = require("events");
const rollup = require("rollup");
const loadRollupConfig = require("rollup/dist/loadConfigFile");
const chokidar = require("chokidar");
const { TEMPLATE_ROOT } = require("../common/constants");

async function watch() {
  const { options } = await loadRollupConfig(
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

class MemoryWatcher extends EventEmitter {
  constructor() {
    super();

    this.assets = {};
  }

  async initialize() {
    this.rollupConfig = await loadRollupConfig(
      path.resolve(__dirname, "../config/rollup.config.js")
    );
    this.watcher = chokidar.watch(
      [path.join(TEMPLATE_ROOT, "document.html.mustache")],
      { persistent: true }
    );

    this.watcher.on("change", () => {
      this.render();
    });

    this.render();
  }

  async render() {
    const { options } = this.rollupConfig;
    for (const optionSet of options) {
      const bundle = await rollup.rollup(optionSet);
      this.watcher.add(bundle.watchFiles);

      const outputOptions = { ...optionSet.output[0] };
      outputOptions.plugins.forEach((plugin) => {
        if (plugin.setMetadata) {
          plugin.setMetadata({ devServer: true });
        }
      });
      const { output } = await bundle.generate(outputOptions);

      for (const { fileName, code } of output) {
        this.assets[fileName] = code;
      }

      this.emit("done");
    }
  }
}

async function watchMemory() {
  const watcher = new MemoryWatcher();
  await watcher.initialize();
  return watcher;
}

module.exports = { watch, watchMemory };
