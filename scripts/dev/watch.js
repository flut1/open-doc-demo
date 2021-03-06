const path = require("path");
const EventEmitter = require("events");
const rollup = require("rollup");
const loadRollupConfig = require("rollup/dist/loadConfigFile");
const chokidar = require("chokidar");
const { invalidateConfig } = require("../common/getConfig");
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
    this.watchingPaths = [];
  }

  initialize() {
    this.busy = this.doInitialize();
  }

  async doInitialize() {
    const watchOptions = {
      persistent: true,
      usePolling: !!process.env.CODESANDBOX_SSE,
    };
    this.watcher = chokidar.watch(
      [
        path.join(TEMPLATE_ROOT, "document.html.mustache"),
        path.join(__dirname, "../../document.config.js"),
      ],
      watchOptions
    );
    console.log(
      `Created file watcher with options ${JSON.stringify(watchOptions)}`
    );

    this.watcher.on("change", () => {
      invalidateConfig();
      this.render();
    });

    return this.doRender();
  }

  render() {
    this.busy = this.doRender();
  }

  async doRender() {
    this.rollupConfig = await loadRollupConfig(
      path.resolve(__dirname, "../config/rollup.config.js")
    );
    const { options } = this.rollupConfig;

    const newWatchPaths = new Set();
    const newAssets = {};
    for (const optionSet of options) {
      const bundle = await rollup.rollup(optionSet);
      bundle.watchFiles.forEach((f) => newWatchPaths.add(f));

      const outputOptions = { ...optionSet.output[0] };
      outputOptions.plugins.forEach((plugin) => {
        if (plugin.setMetadata) {
          plugin.setMetadata({ devServer: true });
        }
      });
      const { output } = await bundle.generate(outputOptions);

      for (const { fileName, code } of output) {
        newAssets[fileName] = code;
      }
    }

    this.setWatchFiles(Array.from(newWatchPaths));
    this.updateAssets(newAssets);
    return newAssets;
  }

  updateAssets(newAssets) {
    const changes = [];
    const assetNamesRequiringFullUpdate = [
      ...Object.keys(newAssets).filter((key) => !this.assets[key]),
      ...Object.keys(this.assets).filter((key) => !newAssets[key]),
    ];

    Object.entries(newAssets)
      .filter(([key]) => !assetNamesRequiringFullUpdate.includes(key))
      .forEach(([key, asset]) => {
        const currentAsset = this.assets[key] || "";
        const [[currentContent, currentDoc], [content, doc]] = [
          currentAsset,
          asset,
        ].map((data) => {
          const contentMatch = /<!-- CONTENT -->(.+)<!-- \/CONTENT -->/ms.exec(
            data
          );
          if (!contentMatch) {
            return [null, data];
          }
          return [contentMatch[1], data.replace(contentMatch[1], "")];
        });

        if (currentDoc !== doc) {
          assetNamesRequiringFullUpdate.push(key);
        } else if (currentContent !== content) {
          changes.push({
            type: "content",
            filename: key,
            content,
          });
        }
      });

    this.assets = newAssets;

    if (changes.length || assetNamesRequiringFullUpdate.length) {
      this.emit("change", [
        ...changes,
        ...assetNamesRequiringFullUpdate.map((filename) => ({
          type: "full",
          filename,
        })),
      ]);
    }
  }

  setWatchFiles(newFiles) {
    const toRemove = this.watchingPaths.filter((p) => !newFiles.includes(p));
    const toAdd = newFiles.filter((p) => !this.watchingPaths.includes(p));

    if (toRemove.length || toAdd.length) {
      console.log(
        `Watching ${toAdd.length} new source files${
          toRemove.length ? ` and unwatching ${toRemove.length}` : ""
        }`
      );
    }
    this.watcher.unwatch(toRemove);
    this.watcher.add(toAdd);

    this.watchingPaths = newFiles;
  }
}

module.exports = { watch, MemoryWatcher };
