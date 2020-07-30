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

async function executeMdxBundles({ lastCommit, styles, template }) {
    for (const language of languages) {
        const buildDate = formatDate(
            new Date(parseInt(lastCommit.committedOn, 10) * 1000),
            "PPPpp",
            { locale: require(`date-fns/locale/${language.dateFormatting}`) }
        );
        const moduleId = `../tmp/main.${language.extension}`;
        const modulePath = require.resolve(moduleId);
        if (require.cache[modulePath]) {
            delete require.cache[modulePath];
        }
        const content = require(moduleId).render({ buildDate });
        await createHtml(template, content, styles, language);
    }
}

(async () => {
    const lastCommit = await getLastCommit();
    await fs.emptyDir(OUTPUT_ROOT);
    await fs.copy(STATIC_ROOT, OUTPUT_ROOT);
    const template = await fs.readFile(
        path.join(SRC_ROOT, "template.html.mustache"),
        { encoding: "utf8" }
    );
    const styles = await fs.readFile(
        path.join(STATIC_ROOT, "styles.css"),
        { encoding: "utf8" }
    );

    const { options } = await loadConfigFile(
        path.resolve(__dirname, "../rollup.config.js")
    );
    const watcher = rollup.watch(options);
    let bundling = Promise.resolve();

    watcher.on('event', event => {
        if (event.code === 'END') {
            bundling.then(() => {
                bundling = executeMdxBundles({ lastCommit, styles, template });
            });
        }
        if (event.code === 'ERROR') {
            console.error('Error during compilation:');
            console.error(event.error.message);
        }
    });

})();
