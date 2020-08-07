const path = require("path");

const fs = require("fs-extra");
const Mustache = require("mustache");
const nodeEval = require("node-eval");
const { html: beautifyHtml } = require("js-beautify");
const { TEMPLATE_ROOT, MDX_ROOT } = require("../common/constants");
const getMetadata = require("../common/getMetadata");

async function renderHtmlTemplate(templateName, data) {
  const template = await fs.readFile(
    path.join(TEMPLATE_ROOT, `${templateName}.mustache`),
    { encoding: "utf8" }
  );
  return beautifyHtml(Mustache.render(template, data));
}

function staticallyRenderMdxBundle(code, props) {
  const renderFn = nodeEval(code, path.join(MDX_ROOT, "main.mdx"));

  return renderFn(props);
}

async function renderIndexHtml() {

}

module.exports = {
  renderHtmlTemplate,
  staticallyRenderMdxBundle,
  renderIndexHtml,
};
