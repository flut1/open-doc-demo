const path = require("path");
const fs = require("fs-extra");
const Mustache = require("mustache");
const rollup = require("rollup");
const loadConfigFile = require("rollup/dist/loadConfigFile");
const { html: beautifyHtml } = require("js-beautify");
const React = require("react");

const renderWithReact = async (filepath) => {
  const { options, warnings } = await loadConfigFile(
    path.resolve(__dirname, "../rollup.config.js"),
  );
  if (warnings.count) {
    console.log(`We currently have ${warnings.count} warnings`);
  }
  warnings.flush();
  await Promise.all(
    options.map(async (opt) => {
      const bundle = await rollup.rollup(opt);
      await Promise.all(opt.output.map(bundle.write));
    })
  );

  const content = require('../tmp/bundle').render();
  await fs.remove(path.join(__dirname, '../tmp'));
  return content;
};

(async () => {
  const srcRoot = path.join(__dirname, "../src/");
  const outputRoot = path.join(__dirname, "../pages");
  const staticRoot = path.join(__dirname, "../static");

  const content = await renderWithReact(path.join(srcRoot, "main.mdx"));
  const template = await fs.readFile(
    path.join(srcRoot, "template.html.mustache"),
    { encoding: "utf8" }
  );
  const html = Mustache.render(template, { content });
  await fs.emptyDir(outputRoot);
  await fs.copy(staticRoot, outputRoot);
  await fs.writeFile(path.join(outputRoot, "index.html"), beautifyHtml(html), {
    encoding: "utf8",
  });
})();
