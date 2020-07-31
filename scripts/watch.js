require("core-js/es");
const watch = require('./dev/watch');

console.log("Starting watcher...");
void watch();

/*



const path = require("path");
const fs = require("fs-extra");
const util = require("util");
const Mustache = require("mustache");
const rollup = require("rollup");
const loadConfigFile = require("rollup/dist/loadConfigFile");
const { html: beautifyHtml } = require("js-beautify");
const hasFlag = require("has-flag");
const getLastCommit = util.promisify(require("git-last-commit").getLastCommit);
const { format: formatDate } = require("date-fns");
const languages = require("../languages");

const SRC_ROOT = path.join(__dirname, "../src/");
const OUTPUT_ROOT = path.join(__dirname, "../output");
const STATIC_ROOT = path.join(__dirname, "../static");

const createHtmlOutput = async (
  template,
  content,
  styles,
  { htmlOutputFile, htmlPageTitle }
) => {
  const html = Mustache.render(template, {
    content,
    artifact: hasFlag("artifacts"),
    styles,
    pageTitle: htmlPageTitle,
  });
  await fs.writeFile(
    path.join(OUTPUT_ROOT, htmlOutputFile),
    beautifyHtml(html),
    {
      encoding: "utf8",
    }
  );
};

const createIndexHtml = async (template) => {
  const html = Mustache.render(template, {
    languages,
  });
  await fs.writeFile(path.join(OUTPUT_ROOT, "index.html"), beautifyHtml(html), {
    encoding: "utf8",
  });
};

async function executeMdxBundles({ lastCommit, styles, template }) {
  for (const language of languages) {
    const buildDate = lastCommit
      ? formatDate(
          new Date(parseInt(lastCommit.committedOn, 10) * 1000),
          "PPPpp",
          { locale: require(`date-fns/locale/${language.dateFormatting}`) }
        )
      : "unknown";
    const moduleId = `../tmp/main.${language.extension}`;
    const modulePath = require.resolve(moduleId);
    if (require.cache[modulePath]) {
      delete require.cache[modulePath];
    }
    const content = require(moduleId).render({ buildDate });
    await createHtmlOutput(template, content, styles, language);
  }
}

async function watch() {
  let lastCommit = null;
  try {
    lastCommit = await getLastCommit();
  } catch (e) {
    console.log("Could not get last commit");
  }
  const [template, styles, indexTemplate] = await Promise.all(
    [
      [SRC_ROOT, "template.html.mustache"],
      [STATIC_ROOT, "styles.css"],
      [SRC_ROOT, "index.html.mustache"],
    ].map((segments) =>
      fs.readFile(path.resolve(...segments), { encoding: "utf8" })
    )
  );
  await fs.ensureDir(OUTPUT_ROOT);
  await createIndexHtml(indexTemplate);

  const { options } = await loadConfigFile(
    path.resolve(__dirname, "../rollup.config.js")
  );
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

if (hasFlag("run")) {
  console.log("Starting watcher...");
  void watch();
}

module.exports = watch;*/
