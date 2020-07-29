const path = require("path");
const fs = require("fs-extra");
const util = require('util');
const Mustache = require("mustache");
const rollup = require("rollup");
const loadConfigFile = require("rollup/dist/loadConfigFile");
const { html: beautifyHtml } = require("js-beautify");
const React = require("react");
const hasFlag = require('has-flag');
const getLastCommit = util.promisify(require("git-last-commit").getLastCommit);
const { format: formatDate } = require("date-fns");
const languages = require("../languages");

const SRC_ROOT = path.join(__dirname, "../src/");
const OUTPUT_ROOT = path.join(__dirname, "../output");
const STATIC_ROOT = path.join(__dirname, "../static");
const TMP_OUTPUT_ROOT = path.join(__dirname, "../tmp");

const bundleMdxRender = async () => {
  const { options, warnings } = await loadConfigFile(
    path.resolve(__dirname, "../rollup.config.js")
  );
  if (warnings.count) {
    console.log(`We currently have ${warnings.count} warnings`);
  }
  warnings.flush();
  return Promise.all(
    options.map(async (opt) => {
      const bundle = await rollup.rollup(opt);
      await Promise.all(opt.output.map(bundle.write));
    })
  );
};

const clearBundles = () => fs.remove(TMP_OUTPUT_ROOT);

const createHtml = async (template, content, styles, { htmlOutputFile }) => {
  const html = Mustache.render(template, {
    content,
    artifact: hasFlag('artifacts'),
    styles
  });
  await fs.writeFile(
    path.join(OUTPUT_ROOT, htmlOutputFile),
    beautifyHtml(html),
    {
      encoding: "utf8",
    }
  );
};

(async () => {
  await bundleMdxRender();

  const template = await fs.readFile(
      path.join(SRC_ROOT, "template.html.mustache"),
      { encoding: "utf8" }
  );
  const styles = await fs.readFile(
      path.join(STATIC_ROOT, "styles.css"),
      { encoding: "utf8" }
  );

  await fs.emptyDir(OUTPUT_ROOT);
  await fs.copy(STATIC_ROOT, OUTPUT_ROOT);
  for (const language of languages) {
    const lastCommit = await getLastCommit();
    const buildDate = formatDate(
      new Date(parseInt(lastCommit.committedOn, 10) * 1000),
      "PPPpp",
      { locale: require(`date-fns/locale/${language.dateFormatting}`) }
    );
    const content = require(`../tmp/bundle.${language.extension}`).render({ buildDate });
    await createHtml(template, content, styles, language);
  }

  await clearBundles();
})();
